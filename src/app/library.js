import { generate } from '../services/gemini'
import { llm, dim, alphabet } from '../config/library'

export const itoc = Array.from(alphabet)
export const ctoi = Object.fromEntries(itoc.map((char, index) => [char, index]))
const ALPHABET_BASE = BigInt(alphabet.length)

function sanitiseText(text) {
  const sanitised = Array.from(text).filter(c => ctoi[c] !== undefined).join('')
  return sanitised
}

export async function generateAnswer(question) {
  const llmResponse = await generate(question, llm.systemPrompt)
  const sanitised = sanitiseText(llmResponse)
  return sanitised
}

export function parseLocationParams(params) {
  const location = { room: 0n, wall: 0, shelf: 0, book: 0, page: 0 }

  if (typeof params.room === 'string' && /^\d+$/.test(params.room))
    location.room = BigInt(params.room)

  for (const c of ['wall', 'shelf', 'book', 'page']) {
    const n = Number(params[c])
    if (Number.isSafeInteger(n)) location[c] = n
  }

  return location
}

export function coerceLocation(location) {
  return unpack(pack(location))
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

function encode(text) {
  if (typeof text !== 'string') throw new TypeError('Text to encode must be a string')

  /* 

  Encoding scheme:

    Treat the text as a base-B number (B is the length of the alphabet).
    To avoid confusion with leading 0s, we map the values to id ranges based on the length of the string:
    
      Text length	  Offset	             IDs for that length

        0             0	                   0
        1             1	                   1 -- B^1                1_B -- 10_B
        2             1 + B^1	             1 + B^1 –- B^2          11_B -- 100_B
        3             1 + B^1 + B^2	       1 + B^1 + B^2 –- B^3    111_B -- 1000_B

        ...           ...                  ...                     ...   

        n             S i[0..n-1] B^i      offset –- B^n           111...1_B -- 1000...0_B

    Thus the final id = `decoded string value` + `offset for that length`.

    Ex:
      both `a` and `aa` have a base-B value of 0 (0, 0 + 0 * B),
      but `a` lands in length = 1 range (offset 1), while `aa` lands in length=2 range (offset B + 1).

    So generally the alphabet ordering is:
      a b c ... z,                                          (total of B ids for length=1)
      aa ab ac ... az ba bb bc ... bz ... ... zz            (toal of B^2 ids for length=2)
      aaa aab aac ... aaz aba abb abc ... abz ... ... zzz   (total of B^3 ids for length=3)
      ...
    and so on.

  */

  // calc base-B value
  let value = 0n
  for (const c of text) {
    const d = ctoi[c]
    if (d === undefined) throw new Error(`Unsupported character in text: ${c}`)
    
    value *= ALPHABET_BASE
    value += BigInt(d)
  }

  // calc offset
  let offset = 0n
  for (let i = 0, bi = 1n; i < text.length; i += 1, bi *= ALPHABET_BASE)
    offset += bi

  const id = offset + value
  return id
}

function decode(id) {
  if (!isValidId(id)) throw new TypeError('ID must be a non-negative BigInt')

  // calc length of string, by finding the largest power of B that is <= id
  let offset = 0n
  let bi = 1n
  let length = 0
  while (id >= offset + bi) {
    offset += bi
    bi *= ALPHABET_BASE
    length += 1
  }

  // extract encoded value
  let value = id - offset

  // decode chars from value base B digits.
  // since we now know the string length must be `length`,
  // iterating over length ensures we recover leading zeros.
  const chars = new Array(length)
  for (let i = length - 1; i >= 0; i -= 1) {
    const d = Number(value % ALPHABET_BASE)

    const c = itoc[d]
    if (c === undefined) throw new Error('Invalid digit in page ID')
    
    chars[i] = c
    value /= ALPHABET_BASE
  }

  return chars.join('')
}

function pack({ room, wall, shelf, book, page }) {
  if (typeof room !== 'bigint' || room < 0n)
    throw new TypeError('room must be a non-negative BigInt')
  if (![wall, shelf, book, page].every(value => Number.isSafeInteger(value) && value >= 0))
    throw new TypeError('wall, shelf, book, and page must be non-negative safe integers')

  return (
    BigInt(room) * BigInt(dim.pagesPerRoom) +
    BigInt(wall * dim.pagesPerWall) +
    BigInt(shelf * dim.pagesPerShelf) +
    BigInt(book * dim.pagesPerBook) +
    BigInt(page)
  )
}

function unpack(id) {
  /*
  
  We treat the uuid as the exact unique identifier for a page.
    we can derive the room, wall, shelf, book, and (relative) page from it.
  To get the room number, we divide the uuid by the amount of pages in a room.
    (i.e pagesPerBook * booksPerShelf * shelvesPerWall * wallsPerRoom). this gives us effectivly how many 'rooms' worth of pages we passed.
  To get our wall number, we divide the uuid by the amount of pages in a wall
    (i.e pagesPerBook * booksPerShelf * shelvesPerWall). this gives us how many 'walls' worth of pages we passed,
    so then to get the wall relative to the room, we simply % by wallsPerRoom.
  To get our shelf number, we divide the uuid by the pages in a shelf
    (i.e pagesPerBook * booksPerShelf).
  To get our book number, we divide the uuid by the pages in a book
    (i.e pagesPerBook). this gives us how many 'books' worth of pages we passed, so then to get the book relative to the shelf, we simply % by booksPerShelf.
  Thus finally to get our page number, we simply % by pagesPerBook.

  */

  let remaining = BigInt(id)
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

export async function getId(text) {
  return encode(text)
}

export async function getText(location) {
  console.log(`location=${JSON.stringify(location, (_, value) => typeof value === 'bigint' ? value.toString() : value)}`)
  const id = pack(location)
  console.log(`location -pack-> id=${id}`)
  const iid = randomise(id)
  console.log(`rid -inverted rand-> iid=${iid}`)
  const text = decode(iid)
  console.log(`id -decode-> text=${text}`)
  return text
}

export async function getLocation(text) {
  console.log(`text=${text}`)
  const id = encode(text)
  console.log(`text -encoded-> id=${id}`)
  const rid = randomise(id)
  console.log(`id -r-> rid=${rid}`)
  const location = unpack(rid)
  console.log(`id -unpacked-> location=${JSON.stringify(location, (_, value) => typeof value === 'bigint' ? value.toString() : value)}`)
  return location
}