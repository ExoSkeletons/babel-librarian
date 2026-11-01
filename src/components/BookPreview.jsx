import './components.css'

import bookIc from '../assets/book-spine.png'

export function BookSpine({ title, onClick }) {
    return (
        <section className="book-spine">
            <img
                src={bookIc}
                onClick={onClick}
                alt={`Book ${title}`}
            />
            <p>{title}</p>
        </section>
    )
}