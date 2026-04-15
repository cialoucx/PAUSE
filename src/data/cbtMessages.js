// CBT-based intervention messages.
// Grounded in Cognitive Behavioral Therapy, urge surfing, and addiction research.
// Tone: direct, factual, and non-judgmental for high-impulse moments.

export const CBT_MESSAGES = [
  {
    text: "This urge will peak and pass.\nIt always does.",
    category: 'urge_surfing',
  },
  {
    text: "Urges usually fade in 10 to 20 minutes.\nStay with the wave.",
    category: 'urge_surfing',
  },
  {
    text: "Ride the wave.\nDo not fight it. Watch it change.",
    category: 'urge_surfing',
  },
  {
    text: "You've survived this feeling before.\nYou will again.",
    category: 'urge_surfing',
  },
  {
    text: "There is no 'winning it back.'\nThat thought is a trap.",
    category: 'cognitive',
  },
  {
    text: "Gambling is built for long-term loss.\nThat is the system, not you.",
    category: 'cognitive',
  },
  {
    text: "The next bet will not fix\nthe last one.",
    category: 'cognitive',
  },
  {
    text: "A sure thing does not exist.\nThat feeling is distortion.",
    category: 'cognitive',
  },
  {
    text: "Past losses cannot be undone\nby future bets.",
    category: 'cognitive',
  },
  {
    text: "The house edge never sleeps.\nEvery game is designed against you.",
    category: 'cognitive',
  },
  {
    text: "You are in control right now.\nThis moment is yours.",
    category: 'self_efficacy',
  },
  {
    text: "Every minute you wait\nis a real win.",
    category: 'self_efficacy',
  },
  {
    text: "You opened this app.\nThat was a strong move.",
    category: 'self_efficacy',
  },
  {
    text: "The urge wants speed.\nSlow is strength.",
    category: 'self_efficacy',
  },
  {
    text: "What would that money mean\nspent on something real?",
    category: 'consequences',
  },
  {
    text: "Think of someone who needs you\nto be okay tomorrow.",
    category: 'consequences',
  },
  {
    text: "This urge can cost you sleep,\npeace, and trust. Is it worth it?",
    category: 'consequences',
  },
  {
    text: "Breathe in slowly.\nYou are safe right now.",
    category: 'mindfulness',
  },
  {
    text: "Name three things you can see.\nStay in this room.",
    category: 'mindfulness',
  },
  {
    text: "Your body is tense.\nRelax your shoulders and jaw.",
    category: 'mindfulness',
  },
];

export const TRIGGER_OPTIONS = [
  { id: 'boredom', label: 'Boredom', shortLabel: 'Boredom' },
  { id: 'stress', label: 'Stress', shortLabel: 'Stress' },
  { id: 'money', label: 'Money pressure', shortLabel: 'Money' },
  { id: 'habit', label: 'Habit', shortLabel: 'Habit' },
  { id: 'social', label: 'Social pressure', shortLabel: 'Social' },
  { id: 'loneliness', label: 'Loneliness', shortLabel: 'Lonely' },
  { id: 'excitement', label: 'Thrill-seeking', shortLabel: 'Thrill' },
  { id: 'other', label: 'Other', shortLabel: 'Other' },
];
