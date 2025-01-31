import { Status } from "../constant"
import actionTypes from "./actions/actionTypes"

export const reducer = (state, action)=>{
    switch(action.type){
        case actionTypes.NEW_MOVE: {
            let {turn, position} = state
            turn = turn==='white'? 'black': 'white'
            position = [...position, action.payload.newPosition]
            return {
                ...state,
                turn,
                position
            }
        }
        case actionTypes.GENERATE_CANDIDATE_MOVES: {
            return {
                ...state,
                candidateMoves: action.payload.candidateMoves
            }
        }
        case actionTypes.CLEAR_CANDIDATE_MOVES: {
            return {
                ...state,
                candidateMoves: []
            }
        }
        case actionTypes.PROMOTION_OPEN: {
            return {
                ...state,
                status: Status.promoting,
                promotionSquare: {...action.payload} 
            }
        }
        case actionTypes.PROMOTION_CLOSE: {
            return {
                ...state,
                status: Status.ongoing,
                promotionSquare: null
            }
        }
        case actionTypes.CAN_CASTLE: {
            let {turn, castleDirection} = state
            castleDirection[turn] = action.payload
            return {
                ...state,
                castleDirection
            }
        }
        case actionTypes.STALEMATE: {
            return {
                ...state,
                status: Status.stalemate
            }
        }
        case actionTypes.NEW_GAME: {
            return {
                ...action.payload
            }
        }
        case actionTypes.INSUFFICIENT: {
            return {
                ...state,
                status: Status.insufficient
            }
        }
        case actionTypes.WIN: {
            return {
                ...state,
                status: action.payload === 'white'? Status.white: Status.black
            }
        }
        case actionTypes.TAKE_BACK: {
            let {position, turn} = state

            if(position.length > 1){
                position = position.slice(0, position.length-1)
                turn = turn === 'white'? 'black': 'white'
            }
            return {
                ...state,
                position,
                turn
            }
        }
        default:
            return state
        }
    }
