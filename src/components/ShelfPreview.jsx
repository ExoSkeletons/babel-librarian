import './components.css'

import { BookSpine } from './BookPreview'


export function Shelf({ shelf, n, onClick, onBookClick }) {
    const books = Array.from({ length: n }, (_, i) => (
        <li
            key={i}
            style={{
                    zIndex: n - i,
                    cursor: 'pointer' 
                }}
        >
            <BookSpine
                title={i}
                onClick={() => onBookClick(i)}
            />
        </li>
    ))

    return (
        <ul className="shelf" onClick={() => onClick({ shelf })}>
            {books}
        </ul>
    )
}