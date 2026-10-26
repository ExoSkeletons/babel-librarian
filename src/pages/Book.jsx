import { config } from '../config/library'

import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getText } from '../library'

function generateFullPage(text) {
    return text + "#".repeat(config.dim.charsPerPage - text.length)
}

function BookBody({ text }) {
    return (
        <main className="book">
            <h1>{text}</h1>
        </main>
    )
}

function BookNavigation({ i, n0 = 0, n, route }) {
    const navigate = useNavigate()
    i = Number(i)
    i = Math.max(0, Math.min(i, n - 1))
    const hasPrev = i > n0
    const hasNext = i < n - 1

    return (
        <nav aria-label="Book page navigation">
                {(hasPrev 
                    ? (
                    <Link to={`${route}/0`} replace>
                        {'<<'}
                    </Link>
                    )
                    : <span/>
                )}
                <span> </span>
                {(hasPrev 
                    ? (
                    <Link to={`${route}/${i - 1}`} replace>
                        {'<'}
                    </Link>
                    )
                    : <span/>
                )}

                <span> {i + 1}/{n} </span>

                {(hasNext 
                    ? <Link  to={`${route}/${i + 1}`} replace>
                        {'>'}
                    </Link> 
                    : <span/>
                )}
                <span> </span>
                {(hasNext 
                    ? <Link to={`${route}/${n - 1}`} replace>
                        {'>>'}
                    </Link>
                    : <span/>
                )}
                
                <span> </span>
                
                <button type="button" onClick={() => navigate(-1)}>Back</button>
            </nav>
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
            <p>Book {book} Room: {room} Wall: {wall} Shelf: {shelf} Page: {page}</p>
            
            <BookBody text={generateFullPage(text)} />
            
            <BookNavigation 
                i={page} n={config.dim.pagesPerBook}
                route={`/browse/${room}/${wall}/${shelf}/${book}`}
            />
        </main>
    )
}