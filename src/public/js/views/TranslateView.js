import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import {actions as translateActions} from '../redux/translate';
import {actions as sentencesActions} from '../redux/sentences';
import {actions as shiftingActions} from '../redux/shifting';
import {Link} from 'react-router';
import ErrorTip from '../components/ErrorTip';
import AudioPlayer from '../components/AudioPlayer';
import Instruction from '../components/Instruction';
import Header from '../components/Header';
import setTitle from '../common/setTitle';
import CollectionModal from '../components/CollectionModal';
import MethodModal from '../components/MethodModal';
import FeedbackModal from '../components/FeedbackModal';
import ReviewModal from '../components/ReviewModal';
import {RATES} from '../redux/shifting';

const mapStateToProps = ({translate, sentences, shifting}) => ({
  translate, sentences, shifting,
});

class TranslateView extends Component {
  static propTypes = {
    params: PropTypes.object,
    fetchSentencesAsync: PropTypes.func,
    toggleCollectionModal: PropTypes.func,
    toggleSpeeds: PropTypes.func,
    toggleMethodModal: PropTypes.func,
    toggleFeedbackModal: PropTypes.func,
    toggleReviewModal: PropTypes.func,
    shiftSpeed: PropTypes.func,
    showTranslateAnswer: PropTypes.func,
    translateInit: PropTypes.func,
    sentences: PropTypes.object,
    translate: PropTypes.object,
    shifting: PropTypes.object,
  };

  constructor(props) {
    super();
    props.translateInit();
    props.fetchSentencesAsync(props.params.courseNo, props.params.lessonNo);
  }

  componentWillUpdate(nextProps) {
    if (nextProps.params.lessonNo !== this.props.params.lessonNo || nextProps.params.courseNo !== this.props.params.courseNo) {
      this.props.fetchSentencesAsync(nextProps.params.courseNo, nextProps.params.lessonNo);
      this.props.translateInit();
    }
    if (nextProps.params.sentenceNo !== this.props.params.sentenceNo) {
      this.props.translateInit();
    }
  }

  render() {
    const course = this.props.sentences.course;
    const lesson = this.props.sentences.lesson;
    const {translate, sentences, shifting} = this.props;
    const {errors, viewAnswer, showCollectionModal, showMethodModal, showReviewModal, showFeedbackModal} = translate;
    const {courseNo, lessonNo, sentenceNo} = this.props.params;

    const sentence = sentences.docs.filter((x) => {
      return +x.sentenceNo === +sentenceNo && +x.lessonNo === +lessonNo && +x.courseNo === +courseNo;
    })[0];
    if (this.props.sentences.errors && this.props.sentences.errors.list) {
      return <div className="text-danger text-xs-center">加载失败<i className="icon-cuowutishi text-bottom" /> <a onClick={()=>{location.reload()}}>重试</a></div>;
    }
    if (!sentence) {
      return <div className="text-muted text-xs-center">加载中，请稍候<i className="icon-loadingdots spin text-bottom"/></div>;
    }
    if (course && lesson && sentence) {
      setTitle(`${sentence.sentenceNo}/${sentences.docs.length} ${lesson.englishTitle}`);
    }

    // audios
    let audios;
    /**
     * Get the rated audio source according to original src and rate.
     * @param {String} src: original src
     * @param {String} rate: the rate, '0.8', '1.0'
     */
    const getRatedAudioSrc = (src, rate) => {
      const suffix = '.mp3';
      const rateSrc = rate.toString().replace('.', '_');
      let result = src;
      result = result.substr(0, result.length - suffix.length) + '@' + rateSrc + suffix;
      const suffixes = ['.mp3', '.ogg', '.wav'];
      return suffixes.map((x) => {
        return result.substr(0, result.length - suffix.length) + x;
      });
    };
    if (sentence && sentence.audio) {
      audios = getRatedAudioSrc(sentence.audio, shifting.speed);
    }

    // get prev next pointer
    const prevSentence = sentences.docs.filter((x) => {
      return x.sentenceNo < +sentenceNo && x.chinese;
    }).reverse()[0];
    const nextSentence = sentences.docs.filter((x) => {
      return x.sentenceNo > +sentenceNo && x.chinese;
    })[0];
    const prevId = prevSentence ? prevSentence.sentenceNo : 0;
    const nextId = nextSentence ? nextSentence.sentenceNo : 0;
    const currentProgress = (sentence.sentenceNo - 0.999) / sentences.docs.length * 100
    return (
      <div className="translate">
        <Header back={`/home/courses/${courseNo}?type=translate`} currentProgress={currentProgress}>
          <a className="nav-link" onClick={() => this.props.toggleMethodModal(true)} >方法</a>
          <a className="nav-link" onClick={e => {
            e.stopPropagation();
            this.props.toggleSpeeds();
          }}>难度</a>
          {
            shifting.showSpeeds ?
            <div>
              {
                RATES.map((rate) => {
                  return (
                    <a className={'nav-link col-xs-12' + (shifting.speed === rate ? ' selected' : '')} key={rate} onClick={() => {
                      this.props.shiftSpeed(rate);
                    }}>
                      {rate}
                      {
                        shifting.speed === rate ?
                        <i className="icon-tick pull-xs-right" />
                        :
                        ''
                      }
                    </a>
                  );
                })
              }
            </div>
            :
            ''
          }
          <a className="nav-link" onClick={() => this.props.toggleCollectionModal(true)} >存档</a>
          <a className="nav-link" onClick={() => this.props.toggleReviewModal(true)} >复习</a>
          <a className="nav-link" onClick={() => this.props.toggleFeedbackModal(true)} >纠错</a>
          <a className="nav-link" onClick={() => location.reload()}>刷新</a>
          <Link className="nav-link"
            to={`/home/courses/${courseNo}/lessons/${lessonNo}/boss/?type=translate`}>
            打Boss
          </Link>
        </Header>
        <CollectionModal
          isOpen={showCollectionModal}
          onRequestClose={() => this.props.toggleCollectionModal(false)} />
        <MethodModal
          isOpen={showMethodModal}
          onRequestClose={() => this.props.toggleMethodModal(false)} />
        <ReviewModal
          isOpen={showReviewModal}
          onRequestClose={() => this.props.toggleReviewModal(false)} />
        <FeedbackModal
          isOpen={showFeedbackModal}
          onRequestClose={() => this.props.toggleFeedbackModal(false)} />
        <div className="container">
          <Instruction text="请翻译" />
          <div className="col-xs-12 answer-block">
            <div className="col-xs-12 sentence-chinese">
              {sentence.chinese}
            </div>
            {
              viewAnswer ?
              <div className="col-xs-12 translate-answer">
                {
                  !!audios ?
                  <AudioPlayer audios={audios} key={audios[0]}>
                    <div>{sentence.english} <i className="icon-voice" /></div>
                    <div>{sentence.english} <i className="icon-voice-mute" /></div>
                    <div>{sentence.english} </div>
                  </AudioPlayer>
                  : sentence.english
                }
              </div>
              :
              ''
            }
          </div>
          <ErrorTip error={errors.server} />
        </div>
        <div className="course-buttons">
          <div className="col-xs-4">
            {
              prevId ?
              <Link className="icon-left side-btn" to={`/home/courses/${courseNo}/lessons/${lessonNo}/translate/${prevId}`} />
              :
              <Link className="icon-left side-btn" to={`/home/courses/${courseNo}/lessons/${lessonNo}/warm/?type=translate`} />
            }
          </div>
          <div className="col-xs-4">
            <div className="slick-next">
            {
              viewAnswer ?
              (
                nextId?
                <Link className='main-btn' onClick={() => this.props.translateInit()} to={`/home/courses/${courseNo}/lessons/${lessonNo}/translate/${nextId}`} >
                  下一步
                </Link>
                :
                <Link className='main-btn' to={`/home/courses/${courseNo}/lessons/${lessonNo}/boss/?type=translate`} >
                  打Boss
                </Link>
              )
              :
              <a className='main-btn' onClick={this.props.showTranslateAnswer}>
                查看答案
              </a>
            }
            </div>
          </div>
          { nextId==0 && nextSentence &&
            <div className="col-xs-4 text-xs-center">
              <Link className="icon-boss side-btn pull-xs-right"
                to={`/home/courses/${courseNo}/lessons/${lessonNo}/newhomework/?type=translate`} />
            </div>
          }
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, Object.assign(translateActions, sentencesActions, shiftingActions))(TranslateView);
