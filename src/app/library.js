import { generate } from '../services/gemini'
import { llm, dim, alphabet } from '../config/library'

export const itoc = Array.from(alphabet)
export const ctoi = Object.fromEntries(itoc.map((char, index) => [char, index]))


export async function generateAnswer(question) {
  const llmResponse = await generate(question, llm.systemPrompt)
  const sanitised = llmResponse // todo: remove chars not in alphabet
  return sanitised
}


function randomise(n) {
  return n // todo: find some reversable randomiser
}

function invRadomise(r) {
  return r // todo: find some reversable randomiser
}



function isValidId(id) {
  return typeof id === 'bigint' && id >= 0n
}

export function isValidRoom(room) {
  if (typeof room === 'bigint') return room >= 0n
  if (typeof room === 'string') return /^\d+$/.test(room)
  return false
}

async function encode(text) {
  if (typeof text !== 'string') {
    throw new TypeError('Text to encode must be a string')
  }

  const base = BigInt(alphabet.length)
  let value = 0n
  let length = 0

  for (const char of text) {
    const digit = ctoi[char]
    if (digit === undefined) {
      throw new Error(`Unsupported character in text: ${char}`)
    }
    value = value * base + BigInt(digit)
    length += 1
  }

  let offset = 0n
  let lengthRange = 1n
  for (let index = 0; index < length; index += 1) {
    offset += lengthRange
    lengthRange *= base
  }

  return offset + value
}

async function decode(id) {
  if (!isValidId(id)) {
    throw new TypeError('ID must be a non-negative BigInt')
  }

  const base = BigInt(alphabet.length)
  let value = id
  let offset = 0n
  let lengthRange = 1n
  let length = 0

  while (value >= offset + lengthRange) {
    offset += lengthRange
    lengthRange *= base
    length += 1
  }

  value -= offset
  const chars = new Array(length)
  for (let index = length - 1; index >= 0; index -= 1) {
    const digit = Number(value % base)
    const char = itoc[digit]
    if (char === undefined) {
      throw new Error('Invalid digit in page ID')
    }
    chars[index] = char
    value /= base
  }

  return chars.join('')
}

async function pack({room, wall, shelf, book, page}) {
  if (typeof room !== 'bigint' || room < 0n)
    throw new TypeError('room must be a non-negative BigInt')
  if (!Number.isInteger(wall) || wall < 0 || wall >= dim.wallsPerRoom)
    throw new RangeError(`wall must be an integer from 0 to ${dim.wallsPerRoom - 1}`)
  if (!Number.isInteger(shelf) || shelf < 0 || shelf >= dim.shelvesPerWall)
    throw new RangeError(`shelf must be an integer from 0 to ${dim.shelvesPerWall - 1}`)
  if (!Number.isInteger(book) || book < 0 || book >= dim.booksPerShelf)
    throw new RangeError(`book must be an integer from 0 to ${dim.booksPerShelf - 1}`)
  if (!Number.isInteger(page) || page < 0 || page >= dim.pagesPerBook)
    throw new RangeError(`page must be an integer from 0 to ${dim.pagesPerBook - 1}`)

  return (
    BigInt(room) * BigInt(dim.pagesPerRoom) +
    BigInt(wall * dim.pagesPerWall) +
    BigInt(shelf * dim.pagesPerShelf) +
    BigInt(book * dim.pagesPerBook) +
    BigInt(page)
  )
}

async function unpack(id) {
  if (!isValidId(id)) return null

  // We treat the uuid as the exact unique identifier for a page.
  //    we can derive the room, wall, shelf, book, and (relative) page from it.
  // To get the room number, we divide the uuid by the amount of pages in a room.
  //    (i.e pagesPerBook * booksPerShelf * shelvesPerWall * wallsPerRoom). this gives us effectivly how many 'rooms' worth of pages we passed.
  // To get our wall number, we divide the uuid by the amount of pages in a wall
  //    (i.e pagesPerBook * booksPerShelf * shelvesPerWall). this gives us how many 'walls' worth of pages we passed,
  //    so then to get the wall relative to the room, we simply % by wallsPerRoom.
  // To get our shelf number, we divide the uuid by the pages in a shelf
  //    (i.e pagesPerBook * booksPerShelf).
  // To get our book number, we divide the uuid by the pages in a book
  //    (i.e pagesPerBook). this gives us how many 'books' worth of pages we passed, so then to get the book relative to the shelf, we simply % by booksPerShelf.
  // Thus finally to get our page number, we simply % by pagesPerBook.

  let remaining = id
  const page = Number(remaining % BigInt(dim.pagesPerBook))
  remaining /= BigInt(dim.pagesPerBook)
  const book = Number(remaining % BigInt(dim.booksPerShelf))
  remaining /= BigInt(dim.booksPerShelf)
  const shelf = Number(remaining % BigInt(dim.shelvesPerWall))
  remaining /= BigInt(dim.shelvesPerWall)
  const wall = Number(remaining % BigInt(dim.wallsPerRoom))
  remaining /= BigInt(dim.wallsPerRoom)

  return { room: remaining, wall, shelf, book, page }
}

export async function getText(location) {
  console.log(`location=${JSON.stringify(location, (_, value) => typeof value === 'bigint' ? value.toString() : value)}`)
  const id = await pack(location)
  console.log(`location -pack-> id=${id}`)
  const iid = await randomise(id)
  console.log(`rid -inverted rand-> iid=${iid}`)
  const text = await decode(iid)
  console.log(`id -decode-> text=${text}`)
  return text
}

export async function getLocation(text) {
  console.log(`text=${text}`)
  const id = await encode(text)
  console.log(`text -encoded-> id=${id}`)
  const rid = await randomise(id)
  console.log(`id -r-> rid=${rid}`)
  const location = await unpack(rid)
  console.log(`id -unpacked-> location=${JSON.stringify(location, (_, value) => typeof value === 'bigint' ? value.toString() : value)}`)
  return location
}