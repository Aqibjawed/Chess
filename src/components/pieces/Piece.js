import arbiter from '../../arbiter/arbiter'
import { useAppContext } from '../../contexts/Context'
import { generateCnadidateMoves } from '../../reducer/actions/move'
import './Pieces.css'

const Piece = ({rank, file, piece})=>{
    const {appState, dispatch} = useAppContext()
    const {turn, castleDirection, position} = appState
    const currPosition = position[position.length-1]
    const prevPosition = position[position.length-2]

    const onDragStart = (e)=>{
        e.dataTransfer.effectAllowed = 'move'
        e.dataTransfer.setData('text/plain', `${piece},${rank},${file}`)
        setTimeout(()=>{
            e.target.style.display = 'none'
        }, 0)
        if(turn === piece.slice(0,5)){
            const candidateMoves = 
                arbiter.getValidMoves({
                    position: currPosition, 
                    prevPosition: prevPosition,
                    castleDirection: castleDirection[turn], 
                    piece, 
                    rank, 
                    file 
                })
            dispatch(generateCnadidateMoves({candidateMoves}))
        }
    }
    const onDragEnd = (e)=>{
        e.target.style.display = 'block'
    }
    return (
        <div 
            className={`piece ${piece} p-${file}${rank}`} 
            draggable={true}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            > 
        </div>
    )
}

export default Piece