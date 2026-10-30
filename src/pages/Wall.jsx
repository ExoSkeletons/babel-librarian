import { dim } from '../config/library'
import { isValidRoom } from '../app/library'
import { Shelf } from '../components/ShelfPreview'

import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

export function Doorway({ room, wall, replace = true }) {
    const isValid = isValidRoom(room)

    if (!isValid) {
        return (
            <Link className="doorway" to="/desk">
                Exit
            </Link>
        )
    }

    return (
        <Link className="doorway"
            to={`/browse/${room}/${wall ?? ''}`}
            replace={replace}
        >
            Door to: Room {room.toString()}
        </Link>
    )
}

function BookWall({ room, wall }) {
    const { shelf = 0 } = useParams()
    const navigate = useNavigate()
    const [selectedShelf, selectShelf] = useState(Number(shelf))

    return (
        <section className="wall">
            <h2>Wall {wall}</h2>
            {Array.from({ length: dim.shelvesPerWall }, (_, si) => (
                <Shelf
                    key={si}
                    n={dim.booksPerShelf}
                    onClick={() => selectShelf(si)}
                    onBookClick={(book) => {
                        if (selectedShelf === si)
                            navigate(`/browse/${room}/${wall}/${si}/${book}`)
                    }}
                />
            ))}
        </section>
    )
}

function WallNavigation({ room, walls, wi }) {
    const navigate = useNavigate()

    const n = walls.length
    const pi = (wi - 1 + n) % n
    const ni = (wi + 1) % n

    return (
        <nav aria-label="Wall navigation">
            <Link to={`/browse/${room}/${walls[pi].path}`} replace>{'<'}</Link>
            <Link to={`/browse/${room}/${walls[ni].path}`} replace>{'>'}</Link>
            <span> </span>
            <button type="button" onClick={() => navigate(-1)}>Back</button>
            <span> </span>
            <Link to={`/browse/${room}`}>Back to Room</Link>
            <span> </span>
            <Link to="/browse">Back to Map</Link>
            <span> </span>
            <Link to="/desk">Back to Desk</Link>
        </nav>
    )
}

export function Wall() {
    const { room: roomParam = '0', wall: wallParam = '0', dir: dirParam } = useParams()
    if (!isValidRoom(roomParam)) return <p role="alert">Invalid room number.</p>

    const room = BigInt(roomParam)
    const wn = dim.wallsPerRoom
    const mid = Math.floor(wn / 2)
    let wall = Number(wallParam)
    wall = Number.isInteger(wall) ? wall : 0

    const dir = dirParam === 'prev' || dirParam === 'next' ? dirParam : null

    const walls = [
        // entrance door
        { type: 'doorway', dir: 'prev', path: `door/prev` },
        // books
        ...Array.from({ length: mid }, (_, wi) => (
            { type: 'wall', wi: wi, path: `${wi}` }
        )),
        // exit door
        { type: 'doorway', dir: 'next', path: `door/next` },
        // books
        ...Array.from({ length: wn - mid }, (_, wi) => (
            { type: 'wall', wi: (mid + wi), path: `${mid + wi}` }
        )),
    ]

    const wi = dir
        ? walls.findIndex((w) => w.dir === dir)
        : walls.findIndex((w) => w.wi === Number(wall))
    const w = walls[wi]

    return (
        <main>
            <h1>Room {room.toString()}</h1>
            {w.type === 'doorway'
                ? <Doorway room={room + (w.dir === 'next' ? 1n : -1n)} wall={w.path} />
                : <BookWall room={room} wall={w.wi} />
            }
            <WallNavigation room={room} walls={walls} wi={wi} />
        </main>
    )
}