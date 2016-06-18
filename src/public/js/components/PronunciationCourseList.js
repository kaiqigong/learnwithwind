import React, {Component, PropTypes} from 'react';
import reactInfiniteScroll from 'react-infinite-scroll';
import PronunciationCourse from './PronunciationCourse';

const InfiniteScroll = reactInfiniteScroll(React);

class PronunciationCourseList extends Component {
  static propTypes = {
    courses: PropTypes.object,
    loadMore: PropTypes.func,
    type: PropTypes.string,
  };

  render() {
    const {docs, total} = this.props.courses;
    const hasMore = docs.length < total;
    return (
      <div className="pronunciation-course-list">
        <InfiniteScroll
          pageStart={1}
          loadMore={this.props.loadMore}
          hasMore={hasMore}
          loader={<div className="loader">
            <i className="icon-loadingdots spin" />
          </div>}>
          {docs.map((course) => {
            return (
              <PronunciationCourse key={course._id} course={course} type={this.props.type} />
            );
          })}
        </InfiniteScroll>
      </div>
    );
  }

}

export default PronunciationCourseList;
