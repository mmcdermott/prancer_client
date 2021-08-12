import React from 'react'
import Tooltip  from '@material-ui/core/Tooltip'
import { Clear, CheckCircle, Help, RemoveCircle, Face, SupervisedUserCircle, History } from '@material-ui/icons'
import InfoModal from './InfoModal'
import { Filtermap, Label, UMLSDefinition, TARGET_TYPE, PATIENT_NOW, PATIENT_HISTORY, FAMILY } from './types'
import { hex2rgba, createNegatedBackground, createUncertainBackground, createBackground } from './utils'

interface LabelListItemButtonProps {
  className: string
  onClick: () => void
  active: boolean
  title: string
  Icon: any
}

const LabelListItemButton = (props: LabelListItemButtonProps) => {
  const { className, onClick, active, title, Icon } = props

  const style_inactive = {
    fontSize: 20, color: '#fc6f03', background: 'rgba(256, 256, 256, 0.5)', border: '1px solid black',
    borderRadius: 5,
  }
  const style_active = {
    fontSize: 20, color: '#fc6f03', background: 'rgba(256, 256, 256, 0.8)', border: '2px solid black',
    borderRadius: 5,
  }

  return (
    <div
      className={`label-list-item-button ${className}`}
      onClick={(e) => {e.stopPropagation()}}
    >
      <Tooltip title={title}>
        <Icon style={active ? style_active : style_inactive} onClick={onClick} />
      </Tooltip>
    </div>
  )
}

interface LabelListItemProps {
  label: Label
  colormap: Filtermap<string>
  selected?: boolean
  onClick?: () => void
  onDeleteClick?: () => void
  onUMLSClick: () => void
  UMLSInfo: UMLSDefinition[]
  onMouseEnter: () => void
  onMouseLeave: () => void
}

class LabelListItem extends React.Component<LabelListItemProps, {}> {
  constructor(props: LabelListItemProps) {
    super(props)
  }

  render() {
    const { labelId, title, categories, confidence, negated, uncertain, target } = this.props.label

    const categoryText = categories ? categories.map(c => c.title).join(' | ') : 'None'

    const tooltipText = <div>
      <div>{title}</div>
      <div>CUI: {labelId}</div>
      <div>Categories: {categoryText}</div>
    </div>

    // @ts-ignore
    const colorOpacity = .5
    const categoryColors = categories && categories.map(
      c => hex2rgba(this.props.colormap[c.type], colorOpacity)
    )
    const background         = createBackground(categoryColors)
    const negated_background = createNegatedBackground(categoryColors)
    const uncertain_background = createUncertainBackground(categoryColors)

    return (
      <Tooltip title={tooltipText}>
        <div
          className={`label-item hover-state ${confidence ? 'label-item-suggestion' : ''}`}
          onClick={this.props.onClick}
          onMouseEnter={this.props.onMouseEnter}
          onMouseLeave={this.props.onMouseLeave}

        >
          <div className="label-title" style={{
              background: negated ? negated_background : uncertain ? uncertain_background : background,
              border: this.props.selected && '2px solid black'
            }}
          >
            <div className="label-delete-button">
              {this.props.onDeleteClick && this.props.selected &&
                <Tooltip title="Remove">
                  <Clear
                    className='hover-state'
                    style={{fontSize: 20}}
                    color="error"
                    onClick={(e) => {
                      e.stopPropagation();
                      this.props.onDeleteClick();
                    }}
                  />
                </Tooltip>
              }
            </div>
            <div className="label-title-text">{title}</div>
            <div className="label-link" onClick={e => e.stopPropagation()}>
              <InfoModal
                title={title}
                cui={labelId}
                onClick={this.props.onUMLSClick}
                UMLSInfo={this.props.UMLSInfo}
              />
            </div>
            <div className="label-buttons">
              <LabelListItemButton
                className="label-accept-button"
                title="Flag (positive assertion)"
                Icon={CheckCircle}
                active={!negated && !uncertain}
                onClick={() => {this.props.onAssertClick()}}
              />
              <LabelListItemButton
                className="label-negate-button"
                title="Flag (negative assertion)"
                Icon={RemoveCircle}
                active={negated}
                onClick={() => {this.props.onNegateClick()}}
              />
              <LabelListItemButton
                className="label-uncertain-button"
                title="Flag (uncertain assertion)"
                Icon={Help}
                active={uncertain}
                onClick={() => {this.props.onUncertainClick()}}
              />
            </div>
            <div className="label-buttons">
              <LabelListItemButton
                className="label-patient-button"
                title="About the Patient Now"
                Icon={Face}
                active={target == PATIENT_NOW}
                onClick={() => {this.props.onTargetClick(PATIENT_NOW)}}
              />
              <LabelListItemButton
                className="label-patient-history-button"
                title="About the Patient Historically"
                Icon={History}
                active={target == PATIENT_HISTORY}
                onClick={() => {this.props.onTargetClick(PATIENT_HISTORY)}}
              />
              <LabelListItemButton
                className="label-family-button"
                title="About the Patient's Family"
                Icon={SupervisedUserCircle}
                active={target == FAMILY}
                onClick={() => {this.props.onTargetClick(FAMILY)}}
              />
            </div>
          </div>
        </div>
      </Tooltip>
    )
  }
}

export default LabelListItem
