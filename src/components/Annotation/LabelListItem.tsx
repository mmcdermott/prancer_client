import React from 'react'
import Tooltip  from '@material-ui/core/Tooltip'
import { Clear, CheckCircle, Help, RemoveCircle } from '@material-ui/icons'
import InfoModal from './InfoModal'
import { Filtermap, Label, UMLSDefinition } from './types'
import { hex2rgba, createNegatedBackground, createUncertainBackground, createBackground } from './utils'

interface LabelListItemProps {
  label: Label
  colormap: Filtermap<string>
  selected?: boolean
  onClick?: () => void
  onDeleteClick?: () => void
  onNegateClick?: () => void
  onUncertainClick?: () => void
  onAssertClick?: () => void
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
    const { labelId, title, categories, confidence, negated, uncertain } = this.props.label
    const categoryText = categories
      ? categories.map(c => c.title).join(' | ')
      : 'None'
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

    const negate_accept_style_inactive = {
      fontSize: 20, color: '#fc6f03', background: 'rgba(256, 256, 256, 0.5)', border: '1px solid black',
      borderRadius: 5
    }
    const negate_accept_style_active = {
      fontSize: 20, color: '#fc6f03', background: 'rgba(256, 256, 256, 0.8)', border: '2px solid black',
      borderRadius: 5
    }

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
            <div className="label-title-text">{title}</div>
            <div className="label-link" onClick={e => e.stopPropagation()}>
              <InfoModal
                title={title}
                cui={labelId}
                onClick={this.props.onUMLSClick}
                UMLSInfo={this.props.UMLSInfo}
              />
            </div>
            <div className="label-accept-button" onClick={e => e.stopPropagation()}>
              <Tooltip title="Flag (positive assertion)">
                <CheckCircle
                  style={negated ? negate_accept_style_inactive : negate_accept_style_active}
                  onClick={(e) => {this.props.onAssertClick()}}
                />
              </Tooltip>
            </div>
            <div className="label-negate-button" onClick={e => e.stopPropagation()}>
              <Tooltip title="Flag (negative assertion)">
                <RemoveCircle
                  style={negated ? negate_accept_style_active : negate_accept_style_inactive}
                  onClick={(e) => {this.props.onNegateClick()}}
                />
              </Tooltip>
            </div>
            <div className="label-uncertain-button" onClick={e => e.stopPropagation()}>
              <Tooltip title="Flag (uncertain assertion)">
                <Help
                  style={uncertain ? negate_accept_style_active : negate_accept_style_inactive}
                  onClick={(e) => {this.props.onUncertainClick()}}
                />
              </Tooltip>
            </div>
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
          </div>
        </div>
      </Tooltip>
    )
  }
}

export default LabelListItem
