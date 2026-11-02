import './Room.css'

import { dim } from '../config/library'

import { coerceLocation, parseLocationParams } from '../app/library'
import { PathHeader } from '../components/Location'
import { Wall } from '../components/WallPreview'

import { useNavigate, useParams } from 'react-router-dom'

export function Room() {
    const navigate = useNavigate()
    const { room } = coerceLocation(parseLocationParams(useParams()))

    return (
        <main>
            <PathHeader room={room} />
            <h1>Room {room.toString()}</h1>
            <button type="button" onClick={() => navigate(-1)}>Back</button>
            <section className='walls'>
                {Array.from({ length: dim.wallsPerRoom }, (_, wi) => (
                    <Wall
                        key={wi}
                        room={room}
                        onClick={() => navigate(`/browse/${room}/${wi}`)}
                    />
                ))}
            </section>
        </main>
    )
}