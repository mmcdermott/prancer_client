import {
  Annotation, CUI_TYPE, EXPERIMENT_TYPE, Label, MANUAL, Token, PATIENT_NOW, ASSERTION_OF_PRESENCE
} from '../types'
import { getSelectedText, getSelectionSpans } from './selectionUtils'

export const createAnnotation = (
  selection: Selection,
  text: string,
  labels: Label[],
  CUIMode: CUI_TYPE,
  experimentMode: EXPERIMENT_TYPE,
): Annotation => {
  const currentTime = Date.now();

  const annotation: Annotation = {
    annotationId: currentTime,
    createdAt: currentTime,
    text: getSelectedText(selection, text),
    spans: getSelectionSpans(selection),
    labels,
    CUIMode,
    experimentMode,
    creationType: MANUAL,
    decision: null,
    target: PATIENT_NOW,
    assertion: ASSERTION_OF_PRESENCE
  }

  return annotation
}

export const createAnnotationFromToken = (
  token: Token,
  labels: Label[],
  CUIMode: CUI_TYPE,
  experimentMode: EXPERIMENT_TYPE,
): Annotation => {
  const currentTime = Date.now();

  const annotation: Annotation = {
    annotationId: currentTime,
    createdAt: currentTime,
    text: token.text,
    spans: [token.span],
    labels,
    CUIMode,
    experimentMode,
    creationType: MANUAL,
    decision: null,
    target: PATIENT_NOW,
    assertion: ASSERTION_OF_PRESENCE
  }

  return annotation
}

export const getAnnotationTag = (annotation: Annotation): string => {
  return annotation.labels.map(l => l.title).join(' | ')
}

export const isAnnotationSelected = (
  annotation: Annotation,
  selectedAnnotationId: number
): boolean => {
  return selectedAnnotationId === annotation.annotationId
}

export const getAnnotationText = (annotation: Annotation, text: string): string => {
  if (annotation.text)
    return annotation.text

  const text_arr = annotation.spans.map(({ start, end }) => (text.slice(start, end)))
  return text_arr.join('... ')
}
