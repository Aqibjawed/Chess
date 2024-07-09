import { useAppContext } from '../../../contexts/Context'
import { copyPosition } from '../../../helper'
import { makeNewMove, clearCandidates } from '../../../reducer/actions/move'
import './PromotionBox.css'

const PromotionBox = ({onClosePopup})=>{

    const {appState, dispatch} = useAppContext()
    const {promotionSquare} = appState
    if(!promotionSquare){
        return null
    }
    
    const options = ['queen', 'rook', 'bishop', 'knight']
    const color = promotionSquare.x === 7? 'white': 'black'

    const getPromotionPosition = ()=>{
        const style = {}

        if(promotionSquare.x === 7){
            style.top = `14%`
        }
        else{
            style.top = `73%`
        }

        if(promotionSquare.y <= 1){
            style.left = `0%`
        }
        else if(promotionSquare.y >= 6){
            style.right = `0%`
        }
        else{
            style.left = `${12.5*promotionSquare.y - 20}%`
        }

        return style
    }

    const handleClick = (option)=> {
        onClosePopup()
        const newPosition = copyPosition(appState.position[appState.position.length-1])

        newPosition[promotionSquare.rank][promotionSquare.file] = ''
        newPosition[promotionSquare.x][promotionSquare.y] = `${color}_${option}`

        dispatch(clearCandidates())
        dispatch(makeNewMove({newPosition}))
    }

    return (
        <div className='popup-inner promotion-choices' style={getPromotionPosition()}>
            {options.map((option)=>(
                <div key={option} className={`piece ${color}_${option}`} onClick={()=> handleClick(option)}></div>
            ))}
        </div>
    )
}

export default PromotionBox