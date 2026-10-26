import { useNavigate, useParams } from 'react-router-dom'

export function Room() {
    const navigate = useNavigate()
    const {
        room = '0',
    } = useParams()

    return (
        <main className="room">
            <h1>Room {room}</h1>
            <button type="button" onClick={() => navigate(-1)}>Back</button>
        </main>
    )
}