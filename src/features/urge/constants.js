import { CBT_MESSAGES, TRIGGER_OPTIONS } from '../../data/cbtMessages';

export const URGE_DURATION_SECONDS = 10 * 60;

export const CATEGORY_LABELS = {
  urge_surfing: 'Urge surfing',
  cognitive: 'Reality check',
  self_efficacy: 'Stay in control',
  consequences: 'Think ahead',
  mindfulness: 'Ground yourself',
};

export const COPING_ACTIONS = [
  {
    id: 'water',
    title: 'Drink water',
    subtitle: 'A physical reset helps slow the spike.',
  },
  {
    id: 'walk',
    title: 'Walk for two minutes',
    subtitle: 'Break the loop and move your body.',
  },
  {
    id: 'breathe',
    title: 'Take six slow breaths',
    subtitle: 'Long exhales lower intensity fast.',
  },
  {
    id: 'delay',
    title: 'Delay the next move',
    subtitle: 'Buy one more minute, then another.',
  },
];

export const URGE_MESSAGES = CBT_MESSAGES;
export const URGE_TRIGGERS = TRIGGER_OPTIONS;
