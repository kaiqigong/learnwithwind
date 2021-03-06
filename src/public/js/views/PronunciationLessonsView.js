import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import {actions} from '../redux/pronunciationLessons';
import {Link} from 'react-router';
import reactInfiniteScroll from 'react-infinite-scroll';
import setTitle from '../common/setTitle';

const InfiniteScroll = reactInfiniteScroll(React);

const mapStateToProps = ({pronunciationLessons}) => ({
  pronunciationLessons,
});

class PronunciationLessonsView extends Component {

  static propTypes = {
    pronunciationLessons: PropTypes.object.isRequired,
    fetchPronunciationLessonsAsync: PropTypes.func.isRequired,
    fetchMorePronunciationLessonsAsync: PropTypes.func.isRequired,
    lessonsInit: PropTypes.func.isRequired,
    params: PropTypes.object,
  };

  constructor(props) {
    super(props);
    props.lessonsInit();
    props.fetchPronunciationLessonsAsync(props.params.courseNo);
  }

  componentWillUpdate(nextProps) {
    if (+nextProps.params.courseNo !== +this.props.params.courseNo) {
      this.props.fetchPronunciationLessonsAsync(nextProps.params.courseNo);
    }
  }

  render() {
    const {docs, total, course, errors} = this.props.pronunciationLessons;
    const {courseNo} = this.props.params;
    const hasMore = docs.length < total;
    if (course) {
      setTitle(course.chineseTitle + ' 发音训练');
    }
    return (
      <div className="pronunciation-lessons-view">
        <nav className="navbar">
          <ul className="nav navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to={`/home/pronunciation_courses/`}>
                <i className="icon-left" />
              </Link>
            </li>
          </ul>
        </nav>
        {
          course && course._id ?
          <div>
            <h2 className="text-xs-center">{course.chineseTitle}</h2>
            <p className="text-xs-center subtitle">{course.englishTitle}</p>
            <ul className="pronunciation-lesson-list">
              <InfiniteScroll
                pageStart={1}
                loadMore={(page) => this.props.fetchMorePronunciationLessonsAsync(page, courseNo)}
                hasMore={hasMore}
                loader={<li className="loader">
                  <i className="icon-loadingdots spin" />
                  </li>}>
                {docs.map((lesson) => {
                  return (
                    <li className="pronunciation-lesson-name" key={lesson.lessonNo}>
                      <Link to={`/home/pronunciation_courses/${courseNo}/lessons/${lesson.lessonNo}` }>{lesson.chineseTitle}</Link>
                    </li>
                  );
                })}
              </InfiniteScroll>
            </ul>
          </div>
          :
          errors ?
          <div className="text-danger text-xs-center">加载失败<i className="icon-cuowutishi text-bottom" /> <a onClick={()=>{location.reload()}}>重试</a></div>
          :
          <div className="text-muted text-xs-center">加载中，请稍候<i className="icon-loadingdots spin text-bottom" /></div>
        }
      </div>
    );
  }
}

export default connect(mapStateToProps, actions)(PronunciationLessonsView);
