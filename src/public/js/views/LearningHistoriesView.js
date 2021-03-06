import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import {actions} from '../redux/learningHistories';
import {actions as authActions} from '../redux/auth';
import {Link} from 'react-router';
import setTitle from '../common/setTitle';
import reactInfiniteScroll from 'react-infinite-scroll';
import Avatar from '../components/Avatar2';
import ajax from '../common/ajax';

const InfiniteScroll = reactInfiniteScroll(React);

const mapStateToProps = ({learningHistories, auth}) => ({
  learningHistories, auth,
});

class LearningHistoriesView extends Component {
  static propTypes = {
    learningHistories: PropTypes.object.isRequired,
    fetchLearningHistoriesAsync: PropTypes.func.isRequired,
    fetchMoreLearningHistoriesAsync: PropTypes.func.isRequired,
    learningHistoriesInit: PropTypes.func.isRequired,
    params: PropTypes.object,
    location: PropTypes.object,
  };

  constructor(props) {
    super();
    props.learningHistoriesInit();
    props.fetchLearningHistoriesAsync();
    props.fetchMeAsync();
    ajax.post('/api/behaviors/', {
      scope: 'pageView',
      action: 'LearningHistoriesView'});
    _hmt.push(['_trackEvent', 'pageView', 'LearningHistoriesView']);
  }


  render() {
    const {docs, todayLearningTime, totalLearningTime, total, loading} = this.props.learningHistories;
    const auth = this.props.auth;
    const hasMore = docs.length < total;

    setTitle('我的主页');
    if (loading) {
      return <div className="text-muted text-xs-center">加载中，请稍候<i className="icon-loadingdots spin text-bottom"/></div>;
    }

    return (
      <div>
        <nav className="navbar">
          <ul className="nav navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to='/home/'>
                <i className="icon-left" />
              </Link>
            </li>
          </ul>
        </nav>
        <div className="container">
          <div className="col-xs-12 clearfix">
            {
              auth && auth.nickname ?
              <div className="media">
                <span className="media-left" href="#">
                  <Avatar className="avatar-img" image={auth.avatar || '/img/default_avatar.png'} />
                </span>
                <div className="media-body">
                  <h2 className="media-heading">{auth.nickname}</h2>
                </div>
              </div>
              :''
            }
            <br />
            <h4>
              我今天学习了
            </h4>
            <h1 className="text-xs-center text-danger today-learning-time">
              {Math.round(todayLearningTime)}分钟
            </h1>
            <h5>
              我累积学习了{Math.round(totalLearningTime)}分钟
            </h5>
            <InfiniteScroll
              pageStart={1}
              loadMore={(page) => this.props.fetchMoreLearningHistoriesAsync(page)}
              hasMore={hasMore}
              loader={<div className="loader">
                <i className="icon-loadingdots spin" />
              </div>}>
              {docs.map((learningHistory) => {
                return (
                  <div className="col-xs-12 clearfix learning-history" key={learningHistory._id}>{new Date(learningHistory.date).toLocaleDateString()} <span className="pull-xs-right">{learningHistory.learningTime < 1 ? 1 : Math.round(learningHistory.learningTime)}分钟</span></div>
                );
              })}
            </InfiniteScroll>
            <h5>
            <small className="text-muted">
              每日学习数据统计从当日凌晨5点到第二日凌晨5点之间的数据, 和我们打卡要求一致
            </small>
            </h5>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, Object.assign(actions, authActions))(LearningHistoriesView);
