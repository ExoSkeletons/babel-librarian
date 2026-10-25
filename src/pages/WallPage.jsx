import { config } from '../config/library'
import { Shelf } from '../components/ShelfPreview'

import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

export function WallPage() {
    const { room = '0', wall = 0, shelf = 0 } = useParams()
    const navigate = useNavigate()

    const [selectedShelf, selectShelf] = useState(shelf)

    const shleves = Array.from({ length: config.dim.shelvesPerWall }, (_, i) => (
        <Shelf
            key={i}
            n={config.dim.booksPerShelf}
            onClick={() => selectShelf(i)}
            onBookClick={(book) => {
                if (selectedShelf === i) {
                    navigate(`/browse/${room}/${wall}/${i}/${book}`)
                }
            }}
        />
    ))
    

    return (
        <section className="wall">
            {shleves}
        </section>
    )
}