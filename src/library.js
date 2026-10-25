import { generate } from './gemini'
import { config } from './config/library'

export async function generateAnswer(question) {
  return generate(question, config.llm.systemPrompt)
}

export async function getLocation(text) {
  return {
    room: '456ghj573g2yfry37g',
    wall: 3,
    shelf: 2,
    book: 6,
    page: 76,
  }
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
    // .replace('{{wonder}}', random wonder)
    // .replace('{{affermation}}', random affirmation)
}
