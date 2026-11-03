import { useNavigate, Link } from 'react-router-dom'

export function PathHeader({ room, wall, shelf, book }) {
    const navigate = useNavigate()

    const route = `/browse`
    const navs = [
        room != null ? { text: `Room ${room}`, path: `${route}/${room}` } : null,
        wall != null ? { text: `Wall ${wall}`, path: `${route}/${room}/${wall}` } : null,
        shelf != null ? { text: `Shelf ${shelf}`, path: `${route}/${room}/${wall}/${shelf}` } : null,
        book != null ? `Book ${book}` : null,
    ].filter((it) => it !== null)

    return (
        <section className="location">
            <header>
                <div>
                    {navs.map(({ text, path }, i) => (
                        <span key={i}>
                            {i > 0 && <> / </>}
                            <Link to={path}>{text}</Link>
                        </span>
                    ))}
                </div>
                <button type="button" onClick={() => navigate('/')}>
                    Exit
                </button>
                <button type="button" onClick={() => navigate(-1)}>
                    {book != null ? 'Close' : 'Back'}
                </button>
            </header>
        </section>
    )
}