import './components.css'

import { Shelf } from './ShelfPreview'

import { dim } from "../config/library"

export function Wall({ room, wall, onClick }) {
    const shleves = Array.from({ length: dim.shelvesPerWall }, (_, si) =>
        <Shelf key={si} n={dim.wallsPerRoom} />
    )

    return (
        <main onClick={onClick}>
            {shleves}
        </main>
    )
}