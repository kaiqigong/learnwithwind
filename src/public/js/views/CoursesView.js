import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import CourseList from '../components/CourseList';
import {actions} from '../redux/courses';
import setTitle from '../common/setTitle';
import {Link} from 'react-router';

const mapStateToProps = ({courses}) => ({
  courses,
});

class CoursesView extends Component {
  static propTypes = {
    courses: PropTypes.object.isRequired,
    fetchCoursesAsync: PropTypes.func.isRequired,
    fetchMoreCoursesAsync: PropTypes.func.isRequired,
    location: PropTypes.object,
  };

  constructor(props) {
    super();
    props.fetchCoursesAsync();
  }

  render() {
    const {query} = this.props.location;
    const type = query.type || 'listen';
    setTitle( (type === 'listen' ? '听力训练' : '口语训练') + '-Wind教口语');
    return (
      <div>
        <nav className="navbar">
          <ul className="nav navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to={`/`}>
                <i className="icon-left" />
              </Link>
            </li>
          </ul>
        </nav>
        <h2 className="text-xs-center">{type === 'listen' ? '听力训练' : '口语训练'}</h2>
        <p className="text-xs-center subtitle">{type === 'listen' ? 'Listening' : 'Speaking'}</p>
        {
          this.props.courses.total ?
          <CourseList courses={this.props.courses} loadMore={this.props.fetchMoreCoursesAsync} type={type} />
          :
          <div className="text-muted text-xs-center">加载中，请稍候<i className="icon-loadingdots spin text-bottom"/></div>
        }
      </div>
    );
  }
}

export default connect(mapStateToProps, actions)(CoursesView);
