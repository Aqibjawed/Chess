import { initGame } from "../../constant"
import actionTypes from "./actionTypes"

export const updateCastling = (direction)=> {
    return{
        type: actionTypes.CAN_CASTLE,
        payload: direction
    }
}

export const detectStalemate = ()=> {
    return {
        type: actionTypes.STALEMATE
    }
}

export const detectInsufficient = ()=> {
    return {
        type: actionTypes.INSUFFICIENT
    }
}

export const detectCheckMate = (winner)=> {
    return {
        type: actionTypes.WIN,
        payload: winner
    }
}

export const takeBack = ()=> {
    return {
        type: actionTypes.TAKE_BACK,
    }
}

export const setUpNewGame = ()=> {
    return {
        type: actionTypes.NEW_GAME,
        payload: initGame
    }
}