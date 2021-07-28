import { Label } from './types'

const SAMPLE_LABELS: Label[] = [
  {
    labelId: 'C000',
    title: 'Label0',
    categories: [{ title: 'category', type: 'general' }],
    negated: false,
    uncertain: false,
  },
  {
    labelId: 'C001',
    title: 'Label1',
    categories: [{ title: 'category', type: 'general' }],
    negated: false,
    uncertain: false,
  },
  {
    labelId: 'C002',
    title: 'Label2',
    categories: [{ title: 'category', type: 'general' }],
    negated: false,
    uncertain: false,
  }
]

const LABELS = SAMPLE_LABELS

export default LABELS

export const INLINE_LABELS = false
