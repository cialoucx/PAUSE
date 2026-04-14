// CBT-based intervention messages
// Grounded in Cognitive Behavioral Therapy, urge surfing, and addiction research
// Tone: direct, non-judgmental, factual — designed for impulse moments

export const CBT_MESSAGES = [
  // Urge Surfing — the core principle
  {
    text: "This urge will peak and pass.\nIt always does.",
    category: 'urge_surfing',
  },
  {
    text: "Urges last 10–20 minutes.\nYou are more than halfway there.",
    category: 'urge_surfing',
  },
  {
    text: "Ride the wave.\nDon't fight it — just watch it.",
    category: 'urge_surfing',
  },
  {
    text: "You've survived this feeling before.\nYou will again.",
    category: 'urge_surfing',
  },

  // Cognitive Restructuring — breaking distorted thinking
  {
    text: "There is no 'winning it back.'\nThat thought is a trap.",
    category: 'cognitive',
  },
  {
    text: "Gambling is mathematically designed\nfor you to lose long-term.",
    category: 'cognitive',
  },
  {
    text: "The next bet will not fix\nthe last one.",
    category: 'cognitive',
  },
  {
    text: "A 'sure thing' doesn't exist.\nThat feeling is your brain lying to you.",
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

  // Self-efficacy — building belief
  {
    text: "You are in control right now.\nThis moment is yours.",
    category: 'self_efficacy',
  },
  {
    text: "Every minute you wait\nis a victory.",
    category: 'self_efficacy',
  },
  {
    text: "You chose to open this app.\nThat was courage.",
    category: 'self_efficacy',
  },
  {
    text: "The urge wants you to act fast.\nSlow is strength.",
    category: 'self_efficacy',
  },

  // Consequences — grounding in reality
  {
    text: "What would that money mean\nspent on something real?",
    category: 'consequences',
  },
  {
    text: "Think of someone who needs you\nto be okay.",
    category: 'consequences',
  },
  {
    text: "This urge will cost you sleep.\nIs it worth it?",
    category: 'consequences',
  },

  // Mindfulness — present moment
  {
    text: "Breathe in slowly.\nYou are safe right now.",
    category: 'mindfulness',
  },
  {
    text: "Name three things you can see.\nStay here.",
    category: 'mindfulness',
  },
  {
    text: "Your body is tense.\nRelax your shoulders. Breathe.",
    category: 'mindfulness',
  },
];

// Triggers for the log screen
export const TRIGGER_OPTIONS = [
  { id: 'boredom',  label: '😑 Boredom',    icon: '😑' },
  { id: 'stress',   label: '😤 Stress',     icon: '😤' },
  { id: 'money',    label: '💸 Money Pressure', icon: '💸' },
  { id: 'habit',    label: '🔁 Pure Habit', icon: '🔁' },
  { id: 'social',   label: '👥 Social Pressure', icon: '👥' },
  { id: 'loneliness', label: '😔 Loneliness', icon: '😔' },
  { id: 'excitement', label: '⚡ Thrill-seeking', icon: '⚡' },
  { id: 'other',    label: '❓ Other',      icon: '❓' },
];