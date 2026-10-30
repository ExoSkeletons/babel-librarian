import { dim } from '../config/library'

import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getText } from '../app/library'

import './Book.css'

function generateFullPage(text) {
    return text + "#".repeat(dim.charsPerPage - text.length)
}

function BookBody({ text, book, page }) {
    return (
        <article className="reader-book" aria-label="Book page">
            <div className="reader-book-body">
                <p>{text}</p>
            </div>
            <hr className="reader-book-divider" />
            <footer className="reader-book-footer">
                <span>Book {book}</span>
                <em className="reader-book-page-count" aria-live="polite">
                    - {page} -
                </em>
                <span aria-hidden="true" />
            </footer>
        </article>
    )
}

function Nav({ to, disabled, label, children }) {
    return disabled
        ? <button type="button" className="reader-nav" aria-label={label} disabled>
                {children}
        </button>
        : <Link className="reader-nav" to={to} replace aria-label={label}>
            {children}
        </Link>
}

function BookNavigation({ i, n, route }) {
    const pageIndex = Math.max(0, Math.min(Number(i), n - 1))
    const hasPrev = pageIndex > 0
    const hasNext = pageIndex < n - 1
    return (
        <nav className="reader-navigation" aria-label="Book page navigation">
            <div>
                <Nav
                    disabled={!hasPrev} label="First page"
                    to={`${route}/0`}
                >
                    «
                </Nav>
                <Nav
                    disabled={!hasPrev} label="Previous page"
                    to={`${route}/${pageIndex - 1}`}
                >
                    ‹
                </Nav>
            </div>
            <div className="reader-navigation-group">
                <Nav
                    disabled={!hasNext} label="Next page"
                    to={`${route}/${pageIndex + 1}`}
                >
                    ›
                </Nav>
                <Nav
                    disabled={!hasNext} label="Last page"
                    to={`${route}/${n - 1}`}
                >
                    »
                </Nav>
            </div>
        </nav>
    )
}

export function Book() {
    let {
        room = '0',
        wall = 0,
        shelf = 0,
        book = 0,
        page = 0
    } = useParams()
    wall = Number(wall)
    shelf = Number(shelf)
    book = Number(book)
    page = Number(page)

    const [text, setText] = useState('')
    const [error, setError] = useState(null)
    const navigate = useNavigate()

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
        <main className="reader">
            <header className="reader-heading">
                <p className="reader-location">
                    Room {room}
                <span aria-hidden="true"> / </span>
                    Wall {wall + 1}
                <span aria-hidden="true"> / </span>
                    Shelf {shelf + 1}
                </p>
                <button
                    className="reader-nav"
                    type="button"
                    onClick={() => navigate(-1)}
                >
                    Close
                </button>
            </header>
            <h2>Book {book}</h2>

            <BookBody text={generateFullPage(text)} book={book} page={page + 1} />

            <BookNavigation
                i={page}
                n={dim.pagesPerBook}
                route={`/browse/${room}/${wall}/${shelf}/${book}`}
            />
        </main>
    )
}