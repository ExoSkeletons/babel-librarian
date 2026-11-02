import './Wall.css'

import { dim } from '../config/library'
import { coerceLocation, isValidRoom, parseLocationParams } from '../app/library'
import { Shelf } from '../components/ShelfPreview'

import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { PathHeader } from '../components/Location'

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

function BookWall({ room, wall, shelf }) {
    const navigate = useNavigate()
    const [selectedShelf, selectShelf] = useState(shelf)

    return (
        <section className="shelves">
            {Array.from({ length: dim.shelvesPerWall }, (_, si) => (
                <Shelf
                    key={si}
                    n={dim.booksPerShelf}
                    onClick={() => selectShelf(si)}
                    onBookClick={(book) => {
                        //if (selectedShelf === si)
                            navigate(`/browse/${room}/${wall}/${si}/${book}`)
                    }}
                />
            ))}
        </section>
    )
}

function WallFooter() {
    return (
        <nav>
            <Link to="/browse">Back to Map</Link>
            <span> </span>
            <Link to="/desk">Back to Desk</Link>
        </nav>
    )
}

export function Wall() {
    const params = useParams()
    const { room, wall, shelf } = coerceLocation(parseLocationParams(params))
    
    const wn = dim.wallsPerRoom
    const mid = Math.floor(wn / 2)
    const dir = params.dir === 'prev' || params.dir === 'next' ? params.dir : null

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

    const n = walls.length
    const pi = (wi - 1 + n) % n
    const ni = (wi + 1) % n

    return (
        <main>
            <PathHeader room={room} wall={w.type == 'wall' ? w.wi : null} />
            <div>
                <Link to={`/browse/${room}/${walls[pi].path}`} replace>{'<'}</Link>
                <section>
                    {w.type === 'doorway'
                        ? <Doorway room={room + (w.dir === 'next' ? 1n : -1n)} wall={w.path} />
                        : <BookWall
                            key={`${room}:${w.wi}:${shelf}`}
                            room={room}
                            wall={w.wi}
                            shelf={shelf}
                        />
                    }
                </section>
                <Link to={`/browse/${room}/${walls[ni].path}`} replace>{'>'}</Link>
            </div>
            <WallFooter room={room} />
        </main>
    )
}