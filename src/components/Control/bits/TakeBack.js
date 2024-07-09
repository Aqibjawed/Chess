import { useAppContext } from "../../../contexts/Context"
import { takeBack } from "../../../reducer/actions/game"

const TakeBack = ()=> {
    const {dispatch} = useAppContext()
    return (
        <div className="takeBack">
            <button onClick={()=> dispatch(takeBack())}>MoveBack</button>
        </div>
    )
}

export default TakeBack