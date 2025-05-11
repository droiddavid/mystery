// src/app/shared/constants/bot-prompts.ts
export const BOT_PROMPTS = {
  default: [
    'What kind of mystery would you like to unravel today?',
    'Choose your path: dark secrets or dusty relics?',
    'Shall we begin the tale of a vanishing truth?'
  ],
  detective: [
    'Ready your magnifying glass. A case awaits.',
    'Another file on the desk. Shall we open it?',
    'Detective, are you prepared for your next investigation?'
  ],
  mysterious: [
    'The fog is thick tonight. Something stirs within...',
    'Whispers echo through the void. Will you listen?',
    'Unseen forces twist the tale—dare to follow?'
  ],
  friendly: [
    'Hey there, sleuth! Ready for a new puzzle?',
    'Let’s crack a case together!',
    'Need a hand picking your next thrilling mystery?'
  ]
};

export const DEFAULT_PROMPT = BOT_PROMPTS.default[0];
