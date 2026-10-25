import { config } from '../config/library'

import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getText } from '../library'

function generateFullPage(text) {
    return text + "#".repeat(config.dim.charsPerPage - text.length)
}

function BookPage({ text }) {
    return (
        <main className="book">
            <h1>{text}</h1>
        </main>
    )
}

export function Book() {
    const {
        room = '0',
        wall = 0,
        shelf = 0,
        book = 0,
        page = 0
    } = useParams()

    const [text, setText] = useState('')
    const [error, setError] = useState(null)

    useEffect(() => {
        let cancelled = false

        setText(null)
        setError(null)

        getText({ room, wall, shelf, book, page })
        .then((result) => {
            if (!cancelled) setText(result)
        })
        .catch((err) => {
            if (!cancelled) setError(err)
        })

        return () => { cancelled = true }
    }, [room, wall, shelf, book, page])

    if (error) {
        console.error(error)
        return <p role="alert">Error loading page.</p>
    }
    if (text === null) return <p aria-live="polite">...</p>

    return (
        <main className="book">
            <h1>Book {book}</h1>
            <p>Room: {room}</p>
            <p>Wall: {wall}</p>
            <p>Shelf: {shelf}</p>
            <p>Page: {page}</p>
            <BookPage text={generateFullPage(text)} />
        </main>
    )
}