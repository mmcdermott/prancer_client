import React from 'react'
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Tooltip  from '@material-ui/core/Tooltip'
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
  CUIsOpen: boolean
}

class SuggestionMenu extends React.Component<SuggestionMenuProps, SuggestionMenuState> {
  constructor(props: SuggestionMenuProps) {
    super(props)

    this.state = {
      suggestionOpen: Boolean(props.suggestionAnchorEl),
      CUIsOpen:       Boolean(props.optionsAnchorEl)
    }
  }

  static getDerivedStateFromProps(props: SuggestionMenuProps, state: SuggestionMenuState) {
    return {
      suggestionOpen: Boolean(props.suggestionAnchorEl),
      CUIsOpen:       Boolean(props.optionsAnchorEl)
    }
  }

  handleClose = (event: any, reason: string) => {
    this.props.onClose(event, reason)
  }

  handleOptionsClose = (event: any, reason: string) => {
    this.props.onOptionsClose(event, reason)
  }

  handleCUIChange = (event: any, child: any) => {
    console.log(event)
    console.log(child)
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

    return (
      <div>
        <Menu
          className="suggestion-menu"
          anchorEl={suggestionAnchorEl}
          getContentAnchorEl={null}
          elevation={0}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          transformOrigin={{ vertical: -5, horizontal: 'center' }}
          keepMounted
          open={this.state.suggestionOpen}
          onClose={this.handleClose}
          style={{"padding": 0}}
        >
          {
            hasOptions && (
              <Select
                value={annotationIndex}
                onChange={this.handleCUIChange}
                label={"CUI"}
                variant="standard"
                className="suggestion-menu-cui-select"
                MenuProps={{className: 'suggestion-menu-cui-select-dropdown'}}
              >
                {
                  annotations.map((a: any, i: number) => (
                    <MenuItem
                      value={i}
                      key={i}
                    >
                      <div className="suggestion-menu-cui-select-item">
                        {a.labels.length > 0 ? a.labels[0].title : 'empty'}
                      </div>
                    </MenuItem>
                  ))
                }
              </Select>
            )
          }
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
            <SuggestionMenuItem
              selected={primaryAnnotation.decision == MODIFIED}
              onClick={() => this.handleDecisionClick(MODIFIED)}
              title="Modify"
              Icon={Edit}
              color='#FFFF00'
            />
            <SuggestionMenuItem
              selected={primaryAnnotation.decision == REJECTED}
              onClick={() => this.handleDecisionClick(REJECTED)}
              title="Reject"
              Icon={Clear}
              color='#FF0000'
            />
          </div>
        </Menu>
      </div>
    );
  }
}

export default SuggestionMenu
