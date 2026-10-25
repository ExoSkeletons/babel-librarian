import librarianImg from '../assets/lib-actor.png'


export const states = {
  idle: {
    img: librarianImg,
    lines: [
      'Welcome to the Library.',
      'What knowledge do you seek?',
    ],
    canAsk: true,
    askText: 'Ask',
  },

  thinking: {
    img: librarianImg,
    lines: [
      "Let me think...",
      "Hmmm...",
      "I believe I've seen that one somewhere...",
      'Let me recall...',
      'Let\'s see...',
      'Let me see now...',
      'Hm...',
      'The library knows all...',
      'If memory serves me right...',
      'Oh, Interesting. I wonder...',
      'Hm... Let\'s see...',
      'Intruiging...',
      'Hmmm... yes...',
      'Now that one\'s quite popular. I think I remeber',
      'Have\'nt seen that in a while.... I wonder...',
      'Quite certain I\'ve seen that one... Let me see...',
      'Well, if I recall...',
    ],
    askText: '...',
  },

  answering: {
    img: librarianImg,
    lines: [
      'Your answer awaits at {{location}}.',
      'You\'ll find your answer at {{location}}.',
      'I believe at {{location}} you\'ll find your answer...',
      'Yes... Perhapes {{location}} will help you out...',
      'Indeed, it is at {{location}} that you may find what you seek...',
    ],
    canAsk: true,
    askText: 'Ask Again',
  },
}