import * as React from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionCreators from '../../actions/index.js';
import FileListItem from './FileListItem.tsx';

import { useHistory } from "react-router-dom"

function mapStateToProps(state) {
    return {
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators.default, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
class FilesViewer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      files: [],
    };
  }

  componentDidMount() {
    this.fetchData()
  }

  async fetchData() {
    const filenames = this.props.getFilenames();
    const data = await filenames.then((response) => response.data);

    this.setState({
      files: data.filenames,
    })
  }

  render() {
    return (
      <div className="files-view">
        <h1>Available Files</h1>

        <div className="files-list">
          {this.state.files.map(file => <FileListItem key={file} file={file} useHistory={ useHistory }/>)}
        </div>
      </div>
    );
  }
}

export default FilesViewer;
