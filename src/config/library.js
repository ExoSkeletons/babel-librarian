
export const dim = {
  charsPerPage: 200,

  pagesPerBook: 600,
  booksPerShelf: 10,
  shelvesPerWall: 10,
  wallsPerRoom: 4, // 6-2
}


export const alphabet = '1234567890' + 'abcdefghijklmnopqrstuvwxyz' + ',.'

const maxAnswerLen = 20
export const llm = {
  systemPrompt: `
    
  You are an all knowing mentor giving life advice to your eager desciples.
  The user asks one question and you have just one chance to answer.
    
  The answer MUST be under `+ Math.min(maxAnswerLen, dim.charsPerPage) +` characters long.
  Be concise, direct and friendly.
  Respond only with the life advice and nothing else.
  Use exclusively lowercase letters or digits. no symbols, punctuation or markdown.
  Below is the user's request you must answer:
    
  `
}