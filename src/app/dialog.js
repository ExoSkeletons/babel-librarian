const welcomes = [
  'Welcome, friend.',
  'Welcome to the Library.',
  'Greetings, seeker of knowledge.',
  'Ah, a visitor! Welcome.',
  'Greetings, traveler. Welcome to the Library.',
  'Welcome, curious mind.',
]

const offers = [
  'What knowledge do you seek?',
  'What brings you to us?',
  'What are you looking for?',
  'What\'s on your mind?',
  'Seeking answers, are you?',
  'What can I assist you with today?',
  'What wisdom do you seek?',
  'Is it knowledge you seek, or perhaps a story?',
  'Is there something you wish to discover?',
  'Are you in search of answers?',
  'Could I help you find something?',
  'Seek thou knowledge, or perhaps a tale?',
  'What are thou looking for in the vast halls?',
  'Come to search these vast halls?',
  'What knowledge dost thou seek?',
  'What doth thyne heart desire?',
]

const wonders = [
  "Let me think...",
  "Hmmm...",
  'Hm...',
  'Oh, Interesting.',
  'Hm... Let\'s see...',
  'Intruiging...',
  'Hmmm... yes...',
  'Now that one\'s quite popular.',
  'Havn\'t seen that in a while.... I wonder...',
  'Well, if I recall...',
]

const recalls = [
  'Let me recall...',
  'Let\'s see...',
  'Let me see now...',
  'Quite certain I\'ve seen that one...',
  'I believe I know that one...',
  'I think I can remember...',
  'It\'s on the tip of my tounge...',
]

const affirmations = [
  'Ah yes.',
  'Indeed.',
  'Ah...',
  'Yes...',
]

function rFrom(a) {
    return a[Math.floor(Math.random() * a.length)]
}


function formatLocation(location) {
  const {room, wall, shelf, book, page} = location
  return (
    "room "        + room + "," +
    " on wall "   + (wall + 1) +
    " shelf "      + (shelf + 1) + "," +
    " in book "    + (book + 1) +
    " at page "    + (page + 1) + "."
  )
}


export function dialogFor(state, data = {}) {
  const lines = state.lines
  const line = lines[Math.floor(Math.random() * lines.length)]

  return line
    .replace('{{location}}', formatLocation(data.location ?? {}))
    .replace('{{wonder}}', rFrom(wonders))
    .replace('{{recall}}', rFrom(recalls))
    .replace('{{affirmation}}', rFrom(affirmations))
    .replace('{{welcome}}', rFrom(welcomes))
    .replace('{{offer}}', rFrom(offers))
}
