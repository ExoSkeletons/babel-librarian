import { useNavigate, useParams } from 'react-router-dom'

export function Room() {
    const navigate = useNavigate()
    const { room: roomParam = '0' } = useParams()

    const room = BigInt(roomParam)

    return (
        <main className="room">
            <h1>Room {room.toString()}</h1>
            <button type="button" onClick={() => navigate(-1)}>Back</button>
        </main>
    )
}