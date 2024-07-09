import { areSameColorTiles, findPieceCoords } from "../helper"
import { getBishopMoves, getCastlingMoves, getKingMoves, getKingPosition, getKnightMoves, getPawnCaptures, getPawnMoves, getPieces, getQueenMoves, getRookMoves } from "./getMoves"
import { movePawn, movePiece } from "./move"

const arbiter = {
    getRegularMoves: function({position, piece, rank, file}){
        if(piece.endsWith('king')){
            return getKingMoves({position, piece, rank, file})
        }
        if(piece.endsWith('queen')){
            return getQueenMoves({position, piece, rank, file})
        }
        if(piece.endsWith('bishop')){
            return getBishopMoves({position, piece, rank, file})
        }
        if(piece.endsWith('knight')){
            return getKnightMoves({position, rank, file})
        }
        if(piece.endsWith('rook')){
            return getRookMoves({position, piece, rank, file})
        }
        if(piece.endsWith('pawn')){
            return getPawnMoves({position, piece, rank, file})
        }
    },

    getValidMoves: function({position, castleDirection, prevPosition, piece, rank, file}){
        let moves = this.getRegularMoves({position, piece, rank, file})
        const notInCheckMoves = []

        if(piece.endsWith('pawn')){
            moves = [
                ...moves,
                ...getPawnCaptures({position, prevPosition, piece, rank, file})
            ]
        } 
        if(piece.endsWith('king')){
            moves = [
                ...moves,
                ...getCastlingMoves({position, castleDirection, piece, rank, file})
            ]
        }

        moves.forEach(([x, y]) => {
            const positionAfterMove = this.performMove({position, piece, rank, file, x, y})
            if(!this.isPlayerInCheck({positionAfterMove, position, player: piece.slice(0, 5)})){
                notInCheckMoves.push([x, y])
            }
        })
        return notInCheckMoves
    },

    performMove: function({position, piece, rank, file, x, y}){
        if(piece.endsWith('pawn')){
            return movePawn({position, piece, rank, file, x, y})
        }
        else{
            return movePiece({position, piece, rank, file, x, y})
        }
    },

    isPlayerInCheck: function({positionAfterMove, position, player}) {
        const enemy = player === 'white'? 'black': 'white'
        let kingPos = getKingPosition(positionAfterMove, player)
        const enemyPieces = getPieces(positionAfterMove, enemy)

        // acc is the accumulator that accumulates results over each iteration. p represents each element (piece object) in enemyPieces.
        const enemyMoves = enemyPieces.reduce((acc, p) => acc = [
            ...acc,
            ...(p.piece.endsWith('pawn'))
            ?   getPawnCaptures({
                position: positionAfterMove,
                prevPosition: position,
                ...p
            })
            :   this.getRegularMoves({
                position: positionAfterMove,
                ...p
            })
        ], [])
        if (enemyMoves.some(([x, y])=> kingPos[0]===x && kingPos[1]===y))
            return true
        
        return false
    },

    isStalemate: function(position, player, castleDirection){
        const isInCheck = this.isPlayerInCheck({positionAfterMove: position, player})
        if(isInCheck){
            return false
        }
        const pieces = getPieces(position, player)
        const moves = pieces.reduce((acc, p)=> acc= [
            ...acc,
            ...(this.getValidMoves({
                    position, 
                    castleDirection,
                    ...p
            }))
        ], [])

        if(!isInCheck, moves.length === 0){
            return true
        }
        return false
    },

    insufficientMaterial: function(position){
        const pieces = position.reduce((acc, rank)=> acc= [
            ...acc,
            ...rank.filter(x=> x)
        ], [])
        if(pieces.length === 2){
            return true
        }
        if(pieces.length === 3 && (pieces.some((p)=> p.endsWith('bishop') || p.endsWith('knight')))){
            return true
        }
        if(pieces.length === 4 && 
           pieces.every(p=> p.endsWith('king') || p.endsWith('bishop')) &&
           new Set(pieces).size === 4 &&
           areSameColorTiles(
            findPieceCoords(position, 'white_bishop')[0],
            findPieceCoords(position, 'black_bishop')[0],
           )
        ){
            return true
        }
        return false
    },

    isCheckMate:  function(position, player, castleDirection){
        const isInCheck = this.isPlayerInCheck({positionAfterMove: position, player})
        if(!isInCheck){
            return false
        }
        const pieces = getPieces(position, player)
        const moves = pieces.reduce((acc, p)=> acc= [
            ...acc,
            ...(this.getValidMoves({
                    position, 
                    castleDirection,
                    ...p
            }))
        ], [])

        if(isInCheck, moves.length === 0){
            return true
        }
        return false
    }
}
 
export default arbiter