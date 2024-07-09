import { createPosition } from "./helper";

export const Status = {
    'ongoing': 'Ongoing',
    'promoting': 'Promoting',
    'white': 'White wins',
    'black': 'Black wins',
    'stalemate': 'Game draws due to stalemate',
    'insufficient': 'Game draws due to insufficient material'
}

export const initGame = {
    position : [createPosition()],
    turn: 'white',
    candidateMoves: [],
    status: Status.ongoing,
    promotionSquare: null,
    castleDirection: {
        white: 'both',
        black: 'both'
    }
}