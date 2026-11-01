export const alphabet = 'abcdefghijklmnopqrstuvwxyz' + '1234567890' + ',.'


const pagesPerBook =  600
const booksPerShelf = 10
const shelvesPerWall = 10
const wallsPerRoom = 4 // 6-2

const pagesPerShelf = pagesPerBook * booksPerShelf
const pagesPerWall = pagesPerShelf * shelvesPerWall
const pagesPerRoom = pagesPerWall * wallsPerRoom

export const dim = {
  pagesPerBook,
  booksPerShelf,
  shelvesPerWall,
  wallsPerRoom,

  pagesPerShelf,
  pagesPerWall,
  pagesPerRoom,
}

const linesPerPage = 10
const charsPerLine = 20
export const pageDim = {
  linesPerPage,
  charsPerLine,
  charsPerPage: linesPerPage * charsPerLine,
}

const maxAnswerLen = 20
export const llm = {
  maxAnswerLen,

  systemPrompt: `
    
  You are an all knowing mentor giving life advice to your eager desciples.
  The user asks one question and you have just one chance to answer.
    
  The answer MUST be under `+ Math.min(maxAnswerLen, pageDim.charsPerPage) +` characters long.
  Be concise, direct and friendly.
  Respond only with the life advice and nothing else.
  Use exclusively these ${alphabet.length} following chars in your response: ${alphabet} use no other symbols, punctuation or markdown.
  Below is the user's request you must answer:
    
  `
}