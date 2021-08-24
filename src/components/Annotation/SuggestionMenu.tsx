import React from 'react'
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Tooltip  from '@material-ui/core/Tooltip'
import Chip from '@material-ui/core/Chip';
import { Check, Clear, Edit, RemoveCircle, Help, SupervisedUserCircle, History, Face } from '@material-ui/icons';
import {
  ACCEPTED, ACCEPTED_WITH_NEGATION, ACCEPTED_WITH_UNCERTAINTY, AUTO, DECISION_TYPE, Filtermap, Label,
  MODIFIED, REJECTED, Token, DYNAMIC, MANUAL, UNDECIDED, PATIENT_NOW, PATIENT_HISTORY, FAMILY, TARGET_TYPE
} from './types'

interface SuggestionMenuItemProps {
  selected: boolean
  onClick: () => void
  title: string
  color: string
  Icon: any
}

const SuggestionMenuItem = (props: SuggestionMenuItemProps) => {
  const { selected, onClick, title, color, Icon } = props
  return (
    <div
      className={`suggestion-menu-item hover-state ${selected ? 'suggestion-menu-selected' : ''}`}
      onClick={onClick}
    >
      <Tooltip title={title}>
        <Icon className="suggestion-menu-icon" style={{ color: color }}/>
      </Tooltip>
    </div>
  )
}

interface SuggestionMenuProps {
  suggestionAnchorEl: any
  optionsAnchorEl: any
  onCUIDelete: (annotationId: number, labelIndex: number) => void
  onAnnotationUpdate: (decision: DECISION_TYPE) => void
  onAnnotationTargetUpdate: (target: TARGET_TYPE) => void
  onClose: (event: any, reason: string) => void
  annotationIndex: number
  annotations: any // TODO: list of objects
  alignmentMode: string
}

interface SuggestionMenuState {
  suggestionOpen: boolean
}

class SuggestionMenu extends React.Component<SuggestionMenuProps, SuggestionMenuState> {
  constructor(props: SuggestionMenuProps) {
    super(props)

    this.state = {
      suggestionOpen: Boolean(props.suggestionAnchorEl),
    }
  }

  static getDerivedStateFromProps(props: SuggestionMenuProps, state: SuggestionMenuState) {
    return {
      suggestionOpen: Boolean(props.suggestionAnchorEl),
    }
  }

  handleClose = (event: any, reason: string) => {
    this.props.onClose(event, reason)
  }

  handleCUIDelete = (index: number) => {
    const { annotations, annotationIndex, onCUIDelete } = this.props;
    const primaryAnnotation = annotationIndex < annotations.length
      ? annotations[annotationIndex]
      : annotations[0];

    onCUIDelete(primaryAnnotation.annotationId, index)
  }

  handleCUIChange = (event: any, child: any) => {
    console.log("THIS ISN'T USED CURRENTLY", event, child)
  }

  handleDecisionClick = (result: DECISION_TYPE) => {
    this.props.onAnnotationUpdate(result)
  }

  handleTargetClick = (result: TARGET_TYPE) => {
    this.props.onAnnotationTargetUpdate(result)
  }

  render() {
    const { annotations, suggestionAnchorEl, optionsAnchorEl, annotationIndex, alignmentMode } = this.props;

    const primaryAnnotation = annotationIndex < annotations.length
      ? annotations[annotationIndex]
      : annotations[0];

    if (annotations.length > 1) {
      console.log("OH NO! Have more than 1 annotation on this token.", annotations)
    }

    const anchorOrigin    = alignmentMode == 'center' ? 'center' : 'left'
    const transformOrigin = alignmentMode == 'center' ? 'center' : 'right'

    // TODO(mmd): Decouple `decision` and `assertion` paths.
    return (
      <Menu
        className="suggestion-menu-overlay"
        anchorEl={suggestionAnchorEl}
        getContentAnchorEl={null}
        elevation={0}
        anchorOrigin={{ vertical: 'bottom', horizontal: anchorOrigin }}
        transformOrigin={{ vertical: -5, horizontal: transformOrigin }}
        keepMounted
        open={this.state.suggestionOpen}
        onClose={this.handleClose}
        style={{"padding": 0}}
        disableAutoFocus={true}
        disableEnforceFocus={true}
      >
        <div className="suggestion-menu">
          <div className="annotation-options">
            <div className="target-options">
              <SuggestionMenuItem
                selected={primaryAnnotation.target == PATIENT_NOW}
                onClick={() => this.handleTargetClick(PATIENT_NOW)}
                title="About Patient Now"
                Icon={Face}
                color="#FFFFFF"
              />
              <SuggestionMenuItem
                selected={primaryAnnotation.target == PATIENT_HISTORY}
                onClick={() => this.handleTargetClick(PATIENT_HISTORY)}
                title="About Patient's History"
                Icon={History}
                color='#FFFFFF'
              />
              <SuggestionMenuItem
                selected={primaryAnnotation.target == FAMILY}
                onClick={() => this.handleTargetClick(FAMILY)}
                title="About Patient's Family"
                Icon={SupervisedUserCircle}
                color='#FFFFFF'
              />
            </div>
            <div className="cui-options">
              <SuggestionMenuItem
                selected={primaryAnnotation.decision == ACCEPTED}
                onClick={() => this.handleDecisionClick(ACCEPTED)}
                title="Accept"
                Icon={Check}
                color="#4CAF50"
              />
              <SuggestionMenuItem
                selected={primaryAnnotation.decision == ACCEPTED_WITH_NEGATION}
                onClick={() => this.handleDecisionClick(ACCEPTED_WITH_NEGATION)}
                title="Accept with Negation"
                Icon={RemoveCircle}
                color='#fc6f03'
              />
              <SuggestionMenuItem
                selected={primaryAnnotation.decision == ACCEPTED_WITH_UNCERTAINTY}
                onClick={() => this.handleDecisionClick(ACCEPTED_WITH_UNCERTAINTY)}
                title="Accept with Uncertainty"
                Icon={Help}
                color='#5c5c5c'
              />
            </div>
          </div>
          <div className="annotation-labels-tagbar">
            {
              primaryAnnotation.labels.map((l: Label, i: number) => {
                return (
                  <li key={i}>
                    <Chip
                      label     = {l.title || 'empty'}
                      size      = "small"
                      onDelete  = {() => this.handleCUIDelete(i)}
                      className = 'suggestion-menu-cui-chip'
                      variant   = 'outlined'
                    />
                  </li>
                )
              })
            }
          </div>
        </div>
      </Menu>
    );
  }
}

export default SuggestionMenu
