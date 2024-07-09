import { copyPosition } from "../helper"

export const movePiece = ({position, piece, rank, file, x, y})=>{
    const newPosition = copyPosition(position)
    
    if(piece.endsWith('king') && Math.abs(y-file) > 1){
        if(y == 2){
            newPosition[rank][0] = ''
            newPosition[rank][3] = piece.startsWith('white')? 'white_rook': 'black_rook'
        }
        if(y == 6){
            newPosition[rank][7] = ''
            newPosition[rank][5] = piece.startsWith('white')? 'white_rook': 'black_rook'
        }
    }
    newPosition[rank][file] = ''
    newPosition[x][y] = piece
    return newPosition
}

export const movePawn = ({position, piece, rank, file, x, y})=>{
    const newPosition = copyPosition(position)
    
    // En Passant condition
    if(!newPosition[x][y] && x !== rank && y !== file){
        newPosition[rank][y] = ''
    }
    newPosition[rank][file] = ''
    newPosition[x][y] = piece

    return newPosition
}