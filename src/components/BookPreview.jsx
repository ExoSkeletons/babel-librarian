import './components.css'

import bookIc from '../assets/book-spine.png'

export function BookSpine({ title, onClick }) {
    return (
        <section>
            <img className='book-spine' src={bookIc} onClick={onClick}
            />
        </section>
    )
}