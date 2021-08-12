import React from 'react'
import Tooltip  from '@material-ui/core/Tooltip'
import {
  Delete, HighlightOff, Check, RemoveCircle, Help, SupervisedUserCircle, History, Face
} from '@material-ui/icons';
import LabelListItem from './LabelListItem'
import {
  CUI_TYPE,
  Label,
  Filtermap,
  UMLSDefinition,
  LOG_TYPE,
  LOG_LABEL_REMOVE,
  LOG_LABEL_NEGATE,
  LOG_LABEL_MARK_UNCERTAIN,
  LOG_LABEL_ASSERT,
  LOG_LABEL_MOUSE_ON,
  LOG_LABEL_MOUSE_OFF,
  CUI_NORMAL, CUI_AMBIGUOUS, CUI_CODELESS,
  TARGET_TYPE,
  ASSERTION_TYPE,
  Annotation,
  ASSERTION_OF_PRESENCE, ASSERTION_OF_ABSENCE, ASSERTION_OF_UNCERTAINTY,
  PATIENT_NOW, PATIENT_HISTORY, FAMILY,
} from './types'

interface AnnotationOptionMenuItemProps {
  selected: boolean
  onClick: () => void
  title: string
  color: string
  Icon: any
}

const AnnotationOptionMenuItem = (props: AnnotationOptionMenuItemProps) => {
  const { selected, onClick, title, color, Icon } = props
  return (
    <div
      className={`selection-annotation-menu-item hover-state ${selected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <Tooltip title={title}>
        <Icon className="selection-annotation-menu-icon" style={{ color: color }}/>
      </Tooltip>
    </div>
  )
}

interface SelectionProps {
  selectedText: string
  selectedLabels: Label[]
  colormap: Filtermap<string>
  CUIMode: CUI_TYPE
  onCUIModeChange: (mode: CUI_TYPE) => void
  setSelectedLabels: (labels: Label[]) => void
  deleteAnnotation: () => void
  onTextSelection: (selection: Selection) => void
  onUMLSClick: (cui: string) => void
  UMLSInfo: UMLSDefinition[]
  addLogEntryBound: (action: LOG_TYPE, metadata: string[]) => boolean
  annotation: Annotation
  onModifyAnnotation: (target: TARGET_TYPE, assertion: ASSERTION_TYPE) => void
}

interface SelectionState {
  searchText: string
  selectedFilter: string
}

class Selection extends React.Component<SelectionProps, SelectionState> {
  constructor(props: SelectionProps) {
    super(props)

    this.state = {
      searchText: '',
      selectedFilter: null
    }
  }

  removeLabel = (id: string) => {
    const { selectedLabels, setSelectedLabels } = this.props
    const i = selectedLabels.findIndex(l => l.labelId == id)
    if (i >= 0 && i < selectedLabels.length) {
      selectedLabels.splice(i, 1)
      setSelectedLabels(selectedLabels)
    }

    this.props.addLogEntryBound(LOG_LABEL_REMOVE, [id])
  }

  handleAssertionClick = (assertion: ASSERTION_TYPE) => {
    this.props.onModifyAnnotation(null, assertion)
  }

  handleTargetClick = (target: TARGET_TYPE) => {
    this.props.onModifyAnnotation(target, null)
  }

  render() {
    const {
      selectedText,
      selectedLabels,
      colormap,
      CUIMode,
      onTextSelection,
      deleteAnnotation,
      addLogEntryBound,
      onCUIModeChange,
      onUMLSClick,
      UMLSInfo,
      annotation
    } = this.props

    return (
      <div>
        <div className="selection-section">
          <Tooltip title="Clear highlighted text">
              <HighlightOff
                className='hover-state selection-clear'
                onClick={() => onTextSelection(null)}
              />
          </Tooltip>

          <div className="selection-main">
            <div className="selection-text">
              <h4>Selection:</h4>
              <h4><b>{selectedText}</b></h4>
            </div>

            {annotation && 
              <div className="selection-annotation-menu">
                <div className="target-options">
                  <AnnotationOptionMenuItem
                    selected={annotation && annotation.target == PATIENT_NOW}
                    onClick={() => this.handleTargetClick(PATIENT_NOW)}
                    title="About Patient Now"
                    Icon={Face}
                    color="#ffffff"
                  />
                  <AnnotationOptionMenuItem
                    selected={annotation && annotation.target == PATIENT_HISTORY}
                    onClick={() => this.handleTargetClick(PATIENT_HISTORY)}
                    title="About Patient's History"
                    Icon={History}
                    color='#ffffff'
                  />
                  <AnnotationOptionMenuItem
                    selected={annotation && annotation.target == FAMILY}
                    onClick={() => this.handleTargetClick(FAMILY)}
                    title="About Patient's Family"
                    Icon={SupervisedUserCircle}
                    color='#ffffff'
                  />
                </div>
                <div className="assertion-options">
                  <AnnotationOptionMenuItem
                    selected={annotation && annotation.assertion == ASSERTION_OF_PRESENCE}
                    onClick={() => this.handleAssertionClick(ASSERTION_OF_PRESENCE)}
                    title="Accept"
                    Icon={Check}
                    color="#4CAF50"
                  />
                  <AnnotationOptionMenuItem
                    selected={annotation && annotation.assertion == ASSERTION_OF_ABSENCE}
                    onClick={() => this.handleAssertionClick(ASSERTION_OF_ABSENCE)}
                    title="Accept with Negation"
                    Icon={RemoveCircle}
                    color='#fc6f03'
                  />
                  <AnnotationOptionMenuItem
                    selected={annotation && annotation.assertion == ASSERTION_OF_UNCERTAINTY}
                    onClick={() => this.handleAssertionClick(ASSERTION_OF_UNCERTAINTY)}
                    title="Accept with Uncertainty"
                    Icon={Help}
                    color='#5c5c5c'
                  />
                </div>
              </div>
            }

            <div className="selection-arrow">
              {selectedLabels.length > 0 && <h4>{"CUIs:"}</h4>}
            </div>

            <div className="selection-labels">
              {selectedLabels.map((label, _i) =>
                <LabelListItem
                  key={label.labelId}
                  selected={true}
                  label={label}
                  colormap={colormap}
                  onDeleteClick={() => this.removeLabel(label.labelId)}
                  onUMLSClick={() => onUMLSClick(label.labelId)}
                  UMLSInfo={UMLSInfo}
                  onMouseEnter={() => addLogEntryBound(LOG_LABEL_MOUSE_ON, [label.labelId, "selected"])}
                  onMouseLeave={() => addLogEntryBound(LOG_LABEL_MOUSE_OFF, [label.labelId, "selected"])}
                />
              )}
            </div>
          </div>

          <Tooltip title={"Delete annotation"}>
            <Delete
              className='hover-state selection-delete'
              color="error"
              onClick={(_event) => deleteAnnotation()}
            />
          </Tooltip>
        </div>

        <div className="cui-menu">
          <div
            className={`hover-state cui-menu-option ${CUIMode === CUI_NORMAL && "selected"}`}
            onClick={() => onCUIModeChange(CUI_NORMAL)}
          >
            Normal CUI Match
          </div>

          <div
            className={`hover-state cui-menu-option ${CUIMode === CUI_AMBIGUOUS && "selected"}`}
            onClick={() => onCUIModeChange(CUI_AMBIGUOUS)}
          >
            Ambiguous CUI Match
          </div>

          <div
            className={`hover-state cui-menu-option ${CUIMode === CUI_CODELESS && "selected"}`}
            onClick={() => onCUIModeChange(CUI_CODELESS)}
          >
            No CUI Match
          </div>
        </div>
      </div>
    )
  }
}

export default Selection
