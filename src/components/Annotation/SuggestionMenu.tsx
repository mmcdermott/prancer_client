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
  onCUIChange: (id: number) => void
  onAnnotationUpdate: (decision: DECISION_TYPE) => void
  onAnnotationTargetUpdate: (target: TARGET_TYPE) => void
  onClose: (event: any, reason: string) => void
  onOptionsClose: (event: any, reason: string) => void
  annotationIndex: number
  annotations: any // TODO: list of objects
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

  handleOptionsClose = (event: any, reason: string) => {
    this.props.onOptionsClose(event, reason)
  }

  handleCUIDelete = (index: number) => {
    console.log("Delete!")
  }

  handleCUIChange = (event: any, child: any) => {
    this.props.onCUIChange(event.target.value)
  }

  handleDecisionClick = (result: DECISION_TYPE) => {
    this.props.onAnnotationUpdate(result)
  }

  handleTargetClick = (result: TARGET_TYPE) => {
    this.props.onAnnotationTargetUpdate(result)
  }

  render() {
    const { annotations, suggestionAnchorEl, optionsAnchorEl, annotationIndex } = this.props;

    const primaryAnnotation = annotationIndex < annotations.length
      ? annotations[annotationIndex]
      : annotations[0];
    const hasOptions = annotations.length > 1;

    // TODO(mmd): Decouple `decision` and `assertion` paths.
    return (
      <Menu
        className="suggestion-menu-overlay"
        anchorEl={suggestionAnchorEl}
        getContentAnchorEl={null}
        elevation={0}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: -5, horizontal: 'center' }}
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
              hasOptions && (
                annotations.map((a: any, i: number) => {
                  return (
                    <li key={i}>
                      <Chip
                        label     = {a.labels.length > 0 ? a.labels[0].title : 'empty'}
                        size      = "small"
                        onDelete  = {() => this.handleCUIDelete(i)}
                        className = 'suggestion-menu-cui-chip'
                        variant   = 'outlined'
                      />
                    </li>
                  )
                })
              )
            }
          </div>
        </div>
      </Menu>
    );
  }
}

export default SuggestionMenu
