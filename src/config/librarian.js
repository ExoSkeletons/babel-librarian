import librarianImg from '../assets/lib-actor.png'

export const states = {
  idle: {
    img: librarianImg,
    lines: [
      '{{welcome}}',
      '{{welcome}} {{offer}}',
      'The library knows all, Traveller.\n{{offer}}',
      '{{offer}}\nThe library knows all.',
    ],
    canAsk: true,
    askText: 'Ask',
  },

  thinking: {
    img: librarianImg,
    lines: [
      "{{recall}}",
      "{{wonder}} {{recall}}",
      "{{recall}} {{wonder}}",
      "{{affirmation}} {{wonder}}",
    ],
    askText: '...',
  },

  answering: {
    img: librarianImg,
    lines: [
      '{{affirmation}} Your answer awaits at {{location}}.',
      '{{affirmation}} You\'ll find your answer at {{location}}.',
      '{{affirmation}} I believe at {{location}} you\'ll find your answer...',
      '{{wonder}} Perhapes {{location}} will help you out...',
      '{{affirmation}} it is at {{location}} that you may find what you seek...',
    ],
    canAsk: true,
    askText: 'Ask Again',
  },
}