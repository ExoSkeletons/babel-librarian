import './components.css'

import { Link } from 'react-router-dom'
import { isValidRoomId } from '../library'

export function Doorway({ room, wall }) {
    const isValid = isValidRoomId(room)

    if (!isValid) {
        return (
            <Link className="doorway" to="/desk">
                Exit
            </Link>
        )
    }

    return (
        <Link className="doorway" to={`/browse/${room}/${wall ?? ''}`}>
            Room {room}
        </Link>
    )
}