import { generate } from '../services/gemini'
import { llm, dim } from '../config/library'

export async function generateAnswer(question) {
  return generate(question, llm.systemPrompt)
}


function randomise(n) {
  return n // todo: find some reversable randomiser
}

function invRadomise(r) {
  return r // todo: find some reversable randomiser
}



function isValidId(id) {
  const number = Number(id)
  return Number.isFinite(number) && number >= 0
}

export function isValidRoom(room) {
  const number = Number(room)
  return Number.isFinite(number) && number >= 0
}

async function encode(text) {
  return 42 // todo: encode text as id using babel hash function
}

async function decode(id) {
  return `${id}` // todo: decode id as text using reverse babel hash function
}

async function pack({room, wall, shelf, book, page}) {
  // todo: pack room, wall, shelf, book, page into a large number
  return Number(`${room}${wall}${shelf}${book}${page}`)
}

async function unpack(id) {
  if (!isValidId(id)) return null
  // todo: unpack large number into room, wall, shelf, book, page
  // for now, return a hardcoded location

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
  return {
    room: '45605',
    wall: 3,
    shelf: 2,
    book: 6,
    page: 76,
  }
}

export async function getText(location) {
  console.log(`location=${JSON.stringify(location)}`)
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
  console.log(`id -unpacked-> location=${JSON.stringify(location)}`)
  return location
}