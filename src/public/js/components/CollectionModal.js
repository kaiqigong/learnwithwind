import React, {Component, PropTypes} from 'react';
import Modal from 'react-modal';

const customStyles = {
  overlay: {
    zIndex: '1031',
    background: 'rgba(0, 0, 0, 0.6)',
  },
  content: {
    top: '8rem',
    left: '2rem',
    right: '2rem',
    bottom: 'auto',
    padding: '0',
  },
};
class CollectionModal extends Component {
  static propTypes = {
    isOpen: PropTypes.bool,
    onRequestClose: PropTypes.func,
  };
  render() {
    return (
      <Modal
        {...this.props}
        style={customStyles}
        >
        <div className="modal-body">
          <a className="close" onClick={() => this.props.onRequestClose()}>
            <i className="icon-times" />
          </a>
          <p>Hi there~</p>
          <br />
          <p>这个功能还没弄好╮(╯▽╰)╭</p>
          <p>如果某课你学到一半想下次再学, 你可以点击页面右上角的按钮, 选择"发送给朋友", 发送给你自己~</p>
          <p>存档这个功能日后会有滴!</p>
          <br/>
          cheers,
          <br />
          Wind
        </div>
      </Modal>
    );
  }

}

export default CollectionModal;
