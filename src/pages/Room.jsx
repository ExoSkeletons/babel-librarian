import { useNavigate, useParams } from 'react-router-dom'
import { coerceLocation, parseLocationParams } from '../app/library'

export function Room() {
    const navigate = useNavigate()
    const { room } = coerceLocation(parseLocationParams(useParams()))

    return (
        <main className="room">
            <h1>Room {room.toString()}</h1>
            <button type="button" onClick={() => navigate(-1)}>Back</button>
        </main>
    )
}