import { BookSpine } from './BookPreview'


export function Shelf({ shelf, n, onClick }) {
    const books = Array.from({ length: n }, (_, i) => (
        <li key={i}>
            <BookSpine title={i}/>
        </li>
    ))

    return (
        <ul className="shelf" onClick={() => onClick({ shelf })}>
            {books}
        </ul>
    )
}