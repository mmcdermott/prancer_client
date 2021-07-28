import * as fileActionCreators from './files.js';
import * as labelActionCreators from './labels.js';
import * as colormapActionCreators from './colormap.js';
import * as umlsActionCreators from './umls.js';
import * as tutorialActionCreators from './tutorial.js';
import * as logActionCreators from './log.js';
import * as loginActionCreators from './login.js';

const actionCreators = {
  ...fileActionCreators,
  ...labelActionCreators,
  ...colormapActionCreators,
  ...umlsActionCreators,
  ...tutorialActionCreators,
  ...logActionCreators,
  ...loginActionCreators
};

export default actionCreators
