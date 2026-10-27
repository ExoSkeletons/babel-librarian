import { useState } from 'react'
import './Desk.css'

import { states } from '../config/librarian'
import { generateAnswer, getLocation } from '../library'
import { dialogFor } from '../dialog'

import { NavLink } from 'react-router-dom'


export function Desk() {
  const [phase, setPhase] = useState(states.idle)
  const [dialog, setDialog] = useState(() => dialogFor(states.idle))
  const [question, setQuestion] = useState('')

  async function onSubmitQuestion(event) {
    event.preventDefault()

    if (!question.trim()) return;

    setPhase(states.thinking)
    setDialog(dialogFor(states.thinking))

    const answer = await generateAnswer(question)
    console.log(answer);
    const location = await getLocation(answer)

    setPhase(states.answering)
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
                    <button type="submit">{phase.askText}</button>
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