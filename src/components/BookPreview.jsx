import bookIc from '../assets/book-spine.png'

export function BookSpine({ title, onClick }) {
    return (
        <section>
            <h2>{title}</h2>
            <img src={bookIc} onClick={onClick}
            />
        </section>
    )
}