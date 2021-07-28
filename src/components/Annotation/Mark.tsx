import React from 'react'
import Tooltip  from '@material-ui/core/Tooltip'
import { CharacterSpan } from './types'
import { INLINE_LABELS } from './config'
import { hex2rgba } from './utils'

export interface MarkProps {
  key: string
  text: string
  span: CharacterSpan
  tag: string
  color?: string
  opacity?: number
  border?: boolean
  fill?: boolean
  fillStripe?: boolean
  fillHalfStripe?: boolean
  stripeColor?: string
  onClick: Function
}

    /*
     *background: repeating-linear-gradient(
     *  45deg,
     *    #606dbc,
     *    #606dbc 10px,
     *    #465298 10px,
     *    #465298 20px
     *);
     */

//background: 'repeating-linear-gradient(-55deg, #222, #222 10px,#333 10px, #333 20px)',



const Mark: React.SFC<MarkProps> = props => {
  const main_color = (props.color ? hex2rgba(props.color, props.opacity || 1) : '#dddddd')
  const stripe_color = (props.stripeColor ? hex2rgba(props.stripeColor, props.opacity || 1) : '#dddddd')

  const background = (
    props.fillStripe ? (
      `repeating-linear-gradient(-45deg, ${main_color}, ${main_color} 10px, ${stripe_color} 20px, ${stripe_color} 30px)`
    ) : (
      props.fillHalfStripe ? (
        `repeating-linear-gradient(45deg, ${main_color}, ${main_color} 20px, ${stripe_color} 30px, ${stripe_color} 40px)`
      ) : (
        props.fill && main_color
      )
    )
  )

  return (
    <Tooltip title={props.tag}>
      <div
        className='token hover-state'
        style={{
          display: 'inline-block',
          background: background,
          padding: '0 8px 0',
          border: props.border && `2px solid ${props.color || '#dddddd'}`,
          // borderTop: props.border && `2px solid ${props.color || '#dddddd'}`
        }}
        data-i={props.span.start}
        onClick={(event) => props.onClick(event)}
      >
        {INLINE_LABELS && props.tag && (
          <div data-i={props.span.start} style={{fontSize: '0.7em', fontWeight: 500, display: 'block', textAlign: 'center'}}>{props.tag}</div>
        )}
        <div data-i={props.span.start} style={{display: 'block'}}>{props.text}</div>
      </div>
    </Tooltip>
  )
}

export default Mark
