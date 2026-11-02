import { useNavigate } from 'react-router-dom'

export function PathHeader({ room, wall, shelf, book }) {
    const navigate = useNavigate()

    const labels = [
        room != null ? `Room ${room}` : null,
        wall != null ? `Wall ${wall + 1}` : null,
        shelf != null ? `Shelf ${shelf + 1}` : null,
        book != null ? `Book ${book + 1}` : null,
    ].filter((it) => it !== null)

    return (
        <section className="location">
            <header>
                <p>
                    {labels.map((l, i) => (
                        <span key={i}>
                            {i > 0 && <> / </>}
                            {l}
                        </span>
                    ))}
                </p>
                <button type="button" onClick={() => navigate(-1)}>
                    {book != null ? 'Close' : 'Back'}
                </button>
            </header>
        </section>
    )
}