import React from 'react'
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Tooltip  from '@material-ui/core/Tooltip'
import { Check, Clear, Edit, RemoveCircle, Help } from '@material-ui/icons';
import {
  ACCEPTED, ACCEPTED_WITH_NEGATION, ACCEPTED_WITH_UNCERTAINTY, AUTO, DECISION_TYPE, Filtermap, Label,
  MODIFIED, REJECTED, Token, DYNAMIC, MANUAL, UNDECIDED 
} from './types'

interface SuggestionMenuProps {
  suggestionAnchorEl: any
  optionsAnchorEl: any
  onCUIChange: (id: number) => void
  onAnnotationUpdate: (decision: DECISION_TYPE) => void
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
          <div
            className={`suggestion-menu-item hover-state ${primaryAnnotation.decision == ACCEPTED ? 'suggestion-menu-selected' : ''}`}
            onClick={() => this.handleDecisionClick(ACCEPTED)}
          >
            <Tooltip title={"Accept"}>
              <Check className="suggestion-menu-icon" style={{ color: '#4CAF50' }}/>
            </Tooltip>
          </div>
          <div
            className={`suggestion-menu-item hover-state ${primaryAnnotation.decision == ACCEPTED_WITH_NEGATION ? 'suggestion-menu-selected' : ''}`}
            onClick={() => this.handleDecisionClick(ACCEPTED_WITH_NEGATION)}
          >
            <Tooltip title={"Accept with Negation"}>
              <RemoveCircle className="suggestion-menu-icon" style={{ color: '#fc6f03' }}/>
            </Tooltip>
          </div>
          <div
            className={`suggestion-menu-item hover-state ${primaryAnnotation.decision == ACCEPTED_WITH_UNCERTAINTY ? 'suggestion-menu-selected' : ''}`}
            onClick={() => this.handleDecisionClick(ACCEPTED_WITH_UNCERTAINTY)}
          >
            <Tooltip title={"Accept with Uncertainty"}>
              <Help className="suggestion-menu-icon" style={{ color: '#5c5c5c' }}/>
            </Tooltip>
          </div>
          <div
            className={`suggestion-menu-item hover-state ${primaryAnnotation.decision == MODIFIED ? 'suggestion-menu-selected' : ''}`}
            onClick={() => this.handleDecisionClick(MODIFIED)}
          >
            <Tooltip title={"Modify"}>
              <Edit className="suggestion-menu-icon" style={{ color: '#FFFF00' }}/>
            </Tooltip>
          </div>
          <div
            className={`suggestion-menu-item hover-state ${primaryAnnotation.decision == REJECTED ? 'suggestion-menu-selected' : ''}`}
            onClick={() => this.handleDecisionClick(REJECTED)}
          >
            <Tooltip title={"Reject"}>
              <Clear className="suggestion-menu-icon" style={{ color: '#FF0000' }}/>
            </Tooltip>
          </div>
        </Menu>
      </div>
    );
  }
}

export default SuggestionMenu
