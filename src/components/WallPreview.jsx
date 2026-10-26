import './components.css'

import { config } from "../config/library"

export function Wall({ room, wall, onClick }) {
    const shleves = Array.from({ length: config.dim.shelvesPerWall }, (_, i) => Shelf({ shelf:i, n:config.dim.booksPerShelf }))

    return (
        <main>
            {shleves}
        </main>
    )
}