

const wonders = [
  "Let me think...",
  "Hmmm...",
  'Hm...',
  'Oh, Interesting.',
  'Hm... Let\'s see...',
  'Intruiging...',
  'Hmmm... yes...',
  'Now that one\'s quite popular.',
  'Have\'nt seen that in a while.... I wonder...',
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
    " on wall "   + wall +
    " shelf "      + shelf + "," +
    " in book "    + book +
    " at page "    + page + "."
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
}
