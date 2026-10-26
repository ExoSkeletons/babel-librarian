import { config } from '../config/library'

import { isValidRoomId } from '../library'

import { Shelf } from '../components/ShelfPreview'

import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'

function Shelves({ room, wall, shelf}) {
    
}


export function Doorway({ room, wall, replace = false }) {
    const isValid = isValidRoomId(room)

    if (!isValid) {
        return (
            <Link className="doorway" to="/desk">
                Leave
            </Link>
        )
    }

    return (
        <Link className="doorway"
            to={`/browse/${room}/${wall ?? ''}`}
            replace={replace}
        >
            Room {room}
        </Link>
    )
}

function WallNavigation({room, wall, n}) {
    const navigate = useNavigate()

    const prev = (wall - 1 + n) % n
    const next = (wall + 1) % n

    return (
        <nav aria-label="Wall navigation">
                <Link to={`/browse/${room}/${prev}`} replace>{'<'}</Link>
                <Link to={`/browse/${room}/${next}`} replace>{'>'}</Link>
                <span> </span>
                <button onClick={() => navigate(-1)}>Back</button>
                <span> </span>
                <Link to="/browse">{'Back to Map'}</Link>
                <span> </span>
                <Link to="/desk">{'Back to Desk'}</Link>
            </nav>
    )
}

export function Wall() {
    let { 
        room = '0',
        wall = 0, shelf,
    } = useParams()
    const navigate = useNavigate()

    room = Number(room)
    room = Number.isFinite(room) ? room : 0

    const [selectedShelf, selectShelf] = useState(shelf)

    const wn = config.dim.wallsPerRoom
    const n = wn + 2

    const walls = Array.from({ length: wn }, (_, wi) => {
        return (
            <section className="wall" route={wi} key={wi}>
                {Array.from({ length: config.dim.shelvesPerWall }, (_, si) => (
                    <Shelf
                        key={si}
                        n={config.dim.booksPerShelf}
                        onClick={() => selectShelf(si)}
                        onBookClick={(book) => {
                            if (selectedShelf === si)
                                navigate(`/browse/${room}/${wi}/${si}/${book}`)
                        }}
                    />
                ))}
            </section>
        )
    })

    let wi
    if (Number.isFinite(Number(wall))) {
        wall = Number(wall)
        wall = (wall + wn) % wn
        wi = walls[wall].key
    } else {
        const doorways = {
            [0]: <Doorway route={'prev'} room={room - 1} wall={'prev'} />,
            [Math.floor(n / 2)]: <Doorway route={'next'} room={room + 1} wall={'next'} />
        }
        for (const [key, value] of Object.entries(doorways)) {
            walls.splice(Number(key), 0, value)
        };
    }
    
    const pi = (wi - 1 + n) % n
    const ni = (wi + 1) % n
    
    return (
        <main>
            {walls[wi]}   
            <nav aria-label="Wall navigation">
                <Link to={`/browse/${room}/${walls[pi].route}`} replace>{'<'}</Link>
                <Link to={`/browse/${room}/${walls[ni].route}`} replace>{'>'}</Link>
                <span> </span>
                <Link to={`/browse/${room}/`}>{'Back'}</Link>
                <span> </span>
                <Link to="/browse">{'Back to Map'}</Link>
                <span> </span>
                <Link to="/desk">{'Back to Desk'}</Link>
            </nav>
        </main>
    )
}