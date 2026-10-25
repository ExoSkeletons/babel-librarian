import { generate } from './gemini'
import { config } from './config/library'

export async function generateAnswer(question) {
  return generate(question, config.llm.systemPrompt)
}

async function encode(text) {
  return text // todo: encode text as id using babel hash function
}

async function decode(id) {
  return id // todo: decode id as text using reverse babel hash function
}

async function pack({room, wall, shelf, book, page}) {
  // todo: pack room, wall, shelf, book, page into a large number
  return Number(`${room}${wall}${shelf}${book}${page}`)
}

async function unpack(id) {
  // todo: unpack large number into room, wall, shelf, book, page
  // for now, return a hardcoded location
  return {
    room: '456ghj573g2yfry37g',
    wall: 3,
    shelf: 2,
    book: 6,
    page: 76,
  }
}

export async function getText(location) {
  const id = await pack(location)
  const text = await decode(id)
  return text
}

export async function getLocation(text) {
  const id = await encode(text)
  const location = await unpack(id)
  return location
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
