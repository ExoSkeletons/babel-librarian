import { config } from '../config/library'
import { Shelf } from '../components/ShelfPreview'
import { Doorway } from '../components/Doorway'

import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'

export function WallPage() {
    const navigate = useNavigate()
    let { room = '0', wall = 0, shelf = 0 } = useParams()

    room = Number(room)
    room = Number.isFinite(room) ? room : 0

    const solidWallCount = config.dim.wallsPerRoom
    const n = solidWallCount + 2 // +2 for prev & next doorways
    wall = Number(wall)
    wall = Number.isFinite(wall)? ((wall % n) + n) % n : 0
    const prev = (wall - 1 + n) % n
    const next = (wall + 1) % n

    const [selectedShelf, selectShelf] = useState(Number(shelf))

    // Book walls are added first to keep their indexes consistent regardless of the number of non-book walls.
    const walls = Array.from({ length: solidWallCount }, (_, wi) => {
        const shelves = Array.from({ length: config.dim.shelvesPerWall }, (_, si) => (
            <Shelf
                key={si}
                n={config.dim.booksPerShelf}
                onClick={() => selectShelf(si)}
                onBookClick={(book) => {
                    if (selectedShelf === si) {
                        navigate(`/browse/${room}/${wi}/${si}/${book}`)
                    }
                }}
            />
        ))

        return (
            <section className="wall" key={wi}>
                {shelves}
            </section>
        )
    })
    
    // Add doorways to the walls array.
    walls.splice(0, 0, <Doorway key="prev" room={room - 1} wall={0} />)
    walls.splice(Math.floor(n / 2), 0, <Doorway key="next" room={room + 1} wall={n / 2} />)

    return (
        <main>
            {walls[wall]}   
            <nav aria-label="Wall navigation">
                <Link to={`/browse/${room}/${prev}`}>{'<'}</Link>
                <Link to={`/browse/${room}/${next}`}>{'>'}</Link>
                <span> </span>
                <Link to={`/browse/${room}/`}>{'Browse Room'}</Link>
                <span> </span>
                <Link to="/browse">{'Back to Map'}</Link>
                <span> </span>
                <Link to="/desk">{'Back to Desk'}</Link>
            </nav>
        </main>
    )
}