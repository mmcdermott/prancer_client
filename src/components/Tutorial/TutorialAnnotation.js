import * as React from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { NavigateNext } from '@material-ui/icons/index.js';
import * as actionCreators from '../../actions/index.js';
import AnnotationView from '../Annotation/AnnotationView.js';
import NextButton from './NextButton.js'


function mapStateToProps(state) {
    return {
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators.default, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
class TutorialAnnotation extends React.Component {
  render() {
    const { match: { params } } = this.props;
    const fileId = params.fileId;
    const userId = params.userId;

    return (
      <div className="tutorial-annotation">
        <h1>Tutorial {fileId}</h1>

        <div style={{
          height: 'calc(100% - 200px)',
          padding: 0
        }}>
          <AnnotationView match={{params: params}} tutorial={true} />
        </div>

        <NextButton onSubmit={() => ({success: true, route: `/tutorial/explanation/${userId}/${fileId}`})} />
      </div>
    );
  }
}

export default TutorialAnnotation;
