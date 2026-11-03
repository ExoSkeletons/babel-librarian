import { pageDim, dim, radnomPagePadders as pagePadders, randomiseTextPosition } from '../config/library'
import { coerceLocation, getId, getText, parseLocationParams } from '../app/library'

import { PathHeader } from '../components/Location'

import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import seedrandom from 'seedrandom'

import './Book.css'

function generateFullPageString(text) {
    let pageText = text

    const r = seedrandom(text)

    const sub = Math.max(0, pageDim.charsPerPage - text.length)
    const position = randomiseTextPosition ? Math.floor(r() * (sub + 1)) : 0

    const padding = pagePadders
    const prefix = Array.from({ length: position }, () =>
        padding[Math.floor(r() * padding.length)]
    ).join('')
    const suffix = Array.from({ length: sub - position }, () =>
        padding[Math.floor(r() * padding.length)]
    ).join('')
    pageText = prefix + pageText + suffix

    const lines = []
    for (let i = 0; i < pageText.length; i += pageDim.charsPerLine)
        lines.push(pageText.slice(i, i + pageDim.charsPerLine))
    pageText = lines.join('\n')

    return pageText
}

function BookBody({ title, subtitle, body, page }) {
    return (
        <article className="reader-book" aria-label="Book page">
            <header>
                <h2>{title}</h2>
                {subtitle && <em>{subtitle}</em>}
            </header>
            <hr />
            <div className="reader-book-body">
                <p
                    style={{
                        '--page-width': `${pageDim.charsPerLine + 1}ch`,
                        '--page-height': `${pageDim.linesPerPage}lh`,
                    }}
                >
                    {body}
                </p>
            </div>
            <hr />
            <footer>
                <span aria-hidden="true" />
                <em className="reader-book-page-count" aria-live="polite">
                    - {page} -
                </em>
                <span aria-hidden="true" />
            </footer>
        </article>
    )
}

function Nav({ to, disabled = false, label, children }) {
    return disabled
        ? <button type="button" className="reader-nav" aria-label={label} disabled>
                {children}
        </button>
        : <Link className="reader-nav" to={to} replace aria-label={label}>
            {children}
        </Link>
}

function BookPageNavigation({ i, n, route }) {
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

function BookNavigation({ book, route }) {
    return (
        <nav className="reader-navigation" aria-label="Book navigation">
            <div>
                <Nav
                    label="Previous book"
                    to={`${route}/${book - 1}/0`}
                >
                    Previous book
                </Nav>
            </div>
            <div className="reader-navigation-group">
                <Nav
                    label="Next book"
                    to={`${route}/${book + 1}/0`}
                >
                    Next book
                </Nav>
            </div>
        </nav>
    )
}

export function Book() {
    const params = useParams()
    const { room, wall, shelf, book, page } = coerceLocation(parseLocationParams(params))

    const [text, setText] = useState('')
    const [id, setId] = useState(null)

    useEffect(() => {
        let cancelled = false

        setText(null)

        getText({ room, wall, shelf, book, page })
        .then((result) => {
            if (!cancelled) setText(result)
        })
        .catch((err) => {
            console.error(err)
        })

        return () => { cancelled = true }
    }, [room, wall, shelf, book, page])

    if (text === null) return <p aria-live="polite">...</p>

    useEffect(() => {
        let cancelled = false

        setId(null)

        getId(text)
        .then((result) => {
            if (!cancelled) setId(result)
        })
        .catch((err) => {
            console.error(err)
        })

        return () => { cancelled = true }
    }, [text])

    return (
        <main>
            <PathHeader room={room} wall={wall} shelf={shelf} />
            {/*<h2>Book {book}</h2> */}

            <BookBody
                title={`Book ${book + 1}`}
                subtitle={id}
                body={generateFullPageString(text)}
                page={page + 1}
            />

            <BookPageNavigation
                i={page}
                n={dim.pagesPerBook}
                route={`/browse/${room.toString()}/${wall}/${shelf}/${book}`}
            />
            <BookNavigation
                book={book}
                route={`/browse/${room.toString()}/${wall}/${shelf}`}
            />
        </main>
    )
}