import React from 'react'
import Menu from '@material-ui/core/Menu';
import Tooltip  from '@material-ui/core/Tooltip'
import { Check, Clear, Edit, RemoveCircle, Help } from '@material-ui/icons';
import {
  ACCEPTED, ACCEPTED_WITH_NEGATION, ACCEPTED_WITH_UNCERTAINTY, AUTO, DECISION_TYPE, Filtermap, Label,
  MODIFIED, REJECTED, Token, DYNAMIC, MANUAL, UNDECIDED, PATIENT_NOW, PATIENT_HISTORY, FAMILY, TARGET_TYPE,
  ASSERTION_TYPE, ASSERTION_OF_ABSENCE, ASSERTION_OF_UNCERTAINTY, ASSERTION_OF_PRESENCE,
} from './types'
import Mark from './Mark'
import { getAnnotationTag, isTokenSelected } from './utils'
import SuggestionMenu from './SuggestionMenu'

interface AnnotatedTokenProps {
  token: Token
  colormap: Filtermap<string>
  selectedAnnotationId: number
  onDeleteLabel: (annotationId: number, labelIndex: number) => void
  onAnnotationSelection: (id: number) => void
  onSuggestionUpdate: (id: number, decision: DECISION_TYPE) => void
  onSuggestionTargetUpdate: (id: number, target: TARGET_TYPE) => void
  onTextSelection: (selection: Selection) => void
  onMouseEnter: () => void
  onMouseLeave: () => void
  containerRect: any
}

interface AnnotatedTokenState {
  suggestionAnchorEl: any
  optionsAnchorEl: any
  annotationIndex: number
}

class AnnotatedToken extends React.Component<AnnotatedTokenProps, AnnotatedTokenState> {
  constructor(props: AnnotatedTokenProps) {
    super(props)

    this.state = {
      suggestionAnchorEl: null,
      optionsAnchorEl: null,
      annotationIndex: 0
    }
  }

  handleSuggestionClick = (event: any) => {
    this.setState({
      suggestionAnchorEl: event.currentTarget
    });
  };

  handleSuggestionClose = (event: any, reason: string) => {
    console.log('handleSuggestionClose', reason, event)
    this.setState({
      suggestionAnchorEl: null
    });
  };

  handleSuggestionTargetUpdate = (target: TARGET_TYPE) => {
    const { token, onSuggestionTargetUpdate, onTextSelection } = this.props
    const { annotationIndex } = this.state

    const primaryAnnotation = token.annotations[annotationIndex]
    onSuggestionTargetUpdate(primaryAnnotation.annotationId, target)
  }

  handleSuggestionUpdate = (result: DECISION_TYPE) => {
    const { token, onSuggestionUpdate, onTextSelection } = this.props
    const { annotationIndex } = this.state

    const primaryAnnotation = token.annotations[annotationIndex]
    onSuggestionUpdate(primaryAnnotation.annotationId, result)

    const hasOptions = token.annotations.length > 1;
    const hasUndecidedSuggestion = token.annotations.find(a =>
      a.creationType != MANUAL && a.decision == UNDECIDED
    );

    if (hasOptions && hasUndecidedSuggestion) {
      const greater_than_index = token.annotations.findIndex((a, i) =>
          a.creationType != MANUAL && a.decision == UNDECIDED && i > annotationIndex
      );
      const general_index = token.annotations.findIndex((a, i) =>
          a.creationType != MANUAL && a.decision == UNDECIDED && i != annotationIndex
      );

      //this.handleOptionsUpdate(greater_than_index >= 0 ? greater_than_index : general_index)
    } else {
      if ( result == REJECTED && hasOptions ) {
        const nonRejectedSuggestionIdx = token.annotations.findIndex(a =>
          a.creationType != MANUAL && a.decision != REJECTED
        );
        if (nonRejectedSuggestionIdx >= 0) {
          //this.handleOptionsUpdate(nonRejectedSuggestionIdx)
        }
      }
      this.handleSuggestionClose(null, "handleSuggestionUpdate")

      if ( result == ACCEPTED
        || result == ACCEPTED_WITH_NEGATION
        || result == ACCEPTED_WITH_UNCERTAINTY
        || result == REJECTED
      ) {
        onTextSelection(null)
      }
    }
  }

  handleOptionsClick = (event: any) => {
    this.setState({
      optionsAnchorEl: event.currentTarget
    })
  }

  handleOptionsUpdate = (option: number) => {
    const annotations = this.props.token.annotations;
    this.props.onAnnotationSelection(annotations[option].annotationId);

    const primaryAnnotation = annotations[option];
    const isAnnotationSuggestion = (
      primaryAnnotation.creationType == AUTO || primaryAnnotation.creationType == DYNAMIC
    );

    if (isAnnotationSuggestion) {
      this.setState({
        suggestionAnchorEl: this.state.optionsAnchorEl
      })
    }

    this.setState({
      annotationIndex: option
    });

    // this.handleOptionsClose()
  }

  render() {
    const { token, colormap, onAnnotationSelection, selectedAnnotationId } = this.props;
    const { annotations, span } = token;

    const tokenSelected = isTokenSelected(token, selectedAnnotationId);
    const hasSuggestion = annotations.find(a =>
      a.creationType == AUTO || a.creationType == DYNAMIC
    ) || false;
    const hasUndecidedSuggestion = hasSuggestion && annotations.find(a =>
      a.creationType != MANUAL && a.decision == UNDECIDED
    );

    const primaryAnnotation = this.state.annotationIndex < annotations.length
      ? annotations[this.state.annotationIndex]
      : annotations[0];
    const isAnnotationSuggestion = primaryAnnotation
      && (primaryAnnotation.creationType == AUTO || primaryAnnotation.creationType == DYNAMIC);
    const hasOptions = annotations.length > 1;

    const annotationClick = (event: any) => {
      onAnnotationSelection(primaryAnnotation.annotationId)
      if (isAnnotationSuggestion)
        this.handleSuggestionClick(event)
      if (hasOptions) {
        this.handleOptionsClick(event)
      }
    }

    const labels = primaryAnnotation ? primaryAnnotation.labels : [];

    const color = labels.length > 0
      ? (
        isAnnotationSuggestion && primaryAnnotation.decision == REJECTED
        ? '#ffffff' : (labels[0].categories.length > 0 ? colormap[labels[0].categories[0].type] : '9e9e9e')
      ) : '#fffacd';

    const border = hasSuggestion ? true : false;

    const fill = !hasUndecidedSuggestion;

    const isNegated = primaryAnnotation && primaryAnnotation.assertion == ASSERTION_OF_ABSENCE;
    const isUncertain = primaryAnnotation && primaryAnnotation.assertion == ASSERTION_OF_UNCERTAINTY;
    const stripeColor = (isNegated || isUncertain) ? '#ffffff': '';

    let alignmentMode;
    if (this.state.suggestionAnchorEl) {
      const rect = this.state.suggestionAnchorEl.getBoundingClientRect()
      alignmentMode = rect.right > this.props.containerRect.right - 150 ? 'edge' : 'center'
    }

    return (
      <div
        key={`${span.start}-${span.end}`}
        style={{ display: 'inline-block' }}
        onMouseEnter={this.props.onMouseEnter}
        onMouseLeave={this.props.onMouseLeave}
      >
        <Mark
          {...token}
          key={`${span.start}-${span.end}`}
          tag={annotations.map(a => getAnnotationTag(a)).join(' | ')}
          onClick={annotationClick}
          color={color}
          opacity={tokenSelected ? 0.75 : 0.25}
          border={border}
          fill={fill}
          fillStripe={isNegated}
          fillHalfStripe={isUncertain}
          stripeColor={stripeColor}
        />
        {
          isAnnotationSuggestion && (
            <SuggestionMenu
              alignmentMode={alignmentMode}
              suggestionAnchorEl={this.state.suggestionAnchorEl}
              optionsAnchorEl={this.state.optionsAnchorEl}
              onCUIDelete={this.props.onDeleteLabel}
              onAnnotationUpdate={this.handleSuggestionUpdate}
              onAnnotationTargetUpdate={this.handleSuggestionTargetUpdate}
              onClose={this.handleSuggestionClose}
              annotationIndex={this.state.annotationIndex}
              annotations={annotations}
            />
          )
        }
      </div>
    );
  }
}

export default AnnotatedToken
