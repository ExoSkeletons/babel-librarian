import { useState } from 'react'
import './Desk.css'

import { states } from '../config/librarian'
import { generateAnswer, getLocation } from '../app/library'
import { dialogFor } from '../app/dialog'

import { NavLink, useNavigate } from 'react-router-dom'


export function Desk() {
  const navigate = useNavigate()
  const [phase, setPhase] = useState(states.idle)
  const [dialog, setDialog] = useState(() => dialogFor(states.idle))
  const [question, setQuestion] = useState('')
  const [answerLocation, setAnswerLocation] = useState(null)

  async function onSubmitQuestion(event) {
    event.preventDefault()

    if (!question.trim()) return;

    setPhase(states.thinking)
    setDialog(dialogFor(states.thinking))
    setAnswerLocation(null)

    const answer = await generateAnswer(question)
    setQuestion('')
    console.log(answer);
    const location = await getLocation(answer)

    setPhase(states.answering)
    setAnswerLocation(location)
    setDialog(dialogFor(states.answering, { location }) + "\r\n" + "Anything else I can do for you?")
  }

  return (
    <main className="bg">
        <nav>
            <NavLink to="/browse">Browse</NavLink>
            <NavLink to="/browse/0">Room</NavLink>
            <NavLink to="/browse/0/0">Wall</NavLink>
            <NavLink to="/browse/0/0/0/0">Book</NavLink>
        </nav>
        <section className="desk">
            <div className="dialog">
                <p>{dialog}</p>

                <form onSubmit={onSubmitQuestion}>
                    <input
                        disabled={!phase.canAsk}
                        type="text"
                        value={question}
                        onChange={(event) => setQuestion(event.target.value)}
                        placeholder="Ask a question..."
                    />
                    <div>
                        {phase.canAsk && <button type="submit">{phase.askText}</button>}
                        {answerLocation && (
                            <button
                                type="button"
                                onClick={() => {
                                    const { room, wall, shelf, book, page } = answerLocation
                                    navigate(`/browse/${room}/${wall}/${shelf}/${book}/${page}`)
                                }}
                            >
                                Visit
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <img
            className="librarian"
            src={phase.img}
            alt="Librarian"
            />
        </section>
    </main>
  )
}