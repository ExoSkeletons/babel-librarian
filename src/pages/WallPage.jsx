import { config } from '../config/library'
import { Shelf } from '../components/Shelf'

export function WallPage({ room, wall }) {
    function clickShelf({ shelf }) {
        // nav to shelf page with shelf, room, wall
    }

    const shleves = Array.from({ length: config.dim.shelvesPerWall }, (_, i) => (
        <Shelf
            key={i}
            n={config.dim.booksPerShelf}
            onClick={() => clickShelf(i)} 
        />
    ))
    

    return (
        <section className="wall">
            {shleves}
        </section>
    )
}