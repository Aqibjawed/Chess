import arbiter from "./arbiter"

export const getRookMoves = ({position, piece, rank, file})=> {
    const moves = []
    const us = piece.slice(0,5)
    const enemy = us === 'white'? 'black': 'white'

    const direction = [
        [-1,0],
        [1,0],
        [0,-1],
        [0,1]
    ]
    direction.forEach((dir)=>{
        for(let i=1 ; i<8 ; i++){
            const x = rank + (i*dir[0])
            const y = file + (i*dir[1])
            if(position?.[x]?.[y] === undefined){
                break
            }
            if(position[x][y].startsWith(enemy)){
                moves.push([x,y])
                break
            }
            if(position[x][y].startsWith(us)){
                break
            }
            moves.push([x,y])
        }
    })
    
    return moves
}

export const getKnightMoves = ({position, rank, file})=> {
    const moves = []
    const enemy = position[rank][file].startsWith('white')? 'black': 'white'
    const candidates = [
        [-2, -1],
        [-2, 1],
        [2, -1],
        [2, 1],
        [-1, -2],
        [-1, 2],
        [1, -2],
        [1, 2]
    ]

    candidates.forEach((c)=>{
        const cell = position?.[rank+c[0]]?.[file+c[1]]
        if(cell !== undefined && (cell.startsWith(enemy) || cell === '')){
            moves.push([rank+c[0], file+c[1]])
        }
    })
    return moves
}

export const getBishopMoves = ({position, piece, rank, file})=> {
    const moves = []
    const us = piece.slice(0,5)
    const enemy = (us === 'white')? 'black': 'white'

    const direction = [
        [1, 1],
        [1, -1],
        [-1, 1],
        [-1, -1]
    ]
     
    direction.forEach((dir)=>{
        for(let i=1 ; i<8 ; i++){
            const x = rank + (i*dir[0])
            const y = file + (i*dir[1])

            if(position?.[x]?.[y] === undefined){
                break
            }
            if(position[x][y].startsWith(enemy)){
                moves.push([x, y])
                break
            }
            if(position[x][y].startsWith(us)){
                break
            }
            moves.push([x, y])
        }
    })
    return moves
}

export const getQueenMoves = ({position, piece, rank, file})=> {
    const moves = [...getRookMoves({position, piece, rank, file}), ...getBishopMoves({position, piece, rank, file})]
    return moves
}

export const getKingMoves = ({position, piece, rank, file})=>{
    const moves = []
    const us = piece.slice(0,5)
    const enemy = (us === 'white')? 'black': 'white'

    const candidates = [
        [0, 1],
        [0, -1],
        [-1, 0],
        [1, 0],
        [1, 1],
        [1, -1],
        [-1, -1],
        [-1, 1]
    ]
    
    candidates.forEach((c)=>{
        const x = rank + c[0]
        const y = file + c[1]

        if(position?.[x]?.[y] !== undefined && (position[x][y].startsWith(enemy) || position[x][y] === '')){
            moves.push([x, y])
        }
    })
    return moves
}

export const getPawnMoves = ({position, piece, rank, file})=> {
    const moves = []
    const dir = piece === 'white_pawn'? 1: -1
    if(!position?.[rank+dir][file]){
        moves.push([rank+dir, file])
    }
    if(rank%5 === 1){
        if(position?.[rank+dir]?.[file] === '' && position?.[rank+dir+dir]?.[file] === ''){
            moves.push([rank+dir+dir, file])
        }
    }
    return moves
}

export const getPawnCaptures = ({position, prevPosition,  piece, rank, file})=> {
    const captures = []
    const dir = piece[0] === 'w'? 1: -1
    const enemy = dir === 1? 'black': 'white'

    if(position?.[rank+dir]?.[file-1] && position?.[rank+dir]?.[file-1].startsWith(enemy)){
        captures.push([rank+dir, file-1])
    }
    if(position?.[rank+dir]?.[file+1] && position?.[rank+dir]?.[file+1].startsWith(enemy)){
        captures.push([rank+dir, file+1])
    }

    // En Passant looks like we are capturing an empty square
    const enemyPawn = (enemy === 'black')? 'black_pawn': 'white_pawn'
    const adjacentFiles = [file-1, file+1]
    if(prevPosition){
        if((dir === 1 && rank === 4) || (dir === -1 && rank === 3)){
            adjacentFiles.forEach((f)=>{
                if(position?.[rank]?.[f] === enemyPawn && position?.[rank+dir+dir]?.[f] === '' && prevPosition?.[rank]?.[f] === '' && prevPosition?.[rank+dir+dir]?.[f] === enemyPawn){
                    captures.push([rank+dir, f])
                }
            })
        }
    }
    return captures
}

export const getCastlingMoves = ({position, castleDirection, piece, rank, file})=> {
    const moves = []
    if(file !== 4 || rank%7 !== 0 || castleDirection === 'none'){
        return moves
    }
    if(piece.startsWith('white')){
        // cannot do castling if in check
        if(arbiter.isPlayerInCheck({positionAfterMove: position, player: 'white'}))
            return moves

        if(['left', 'both'].includes(castleDirection) &&
            !position[0][1] && !position[0][2] && !position[0][3] && position[0][0] === 'white_rook' &&
            !arbiter.isPlayerInCheck({
                    positionAfterMove: arbiter.performMove({position, piece, rank, file, x:0, y:3}),
                    player: 'white'
                }) &&
            !arbiter.isPlayerInCheck({
                    positionAfterMove: arbiter.performMove({position, piece, rank, file, x:0, y:2}),
                    player: 'white'
                })){
                moves.push([0, 2])
        }

        if(['right', 'both'].includes(castleDirection) &&
            !position[0][5] && !position[0][6] && position[0][7] === 'white_rook' &&
            !arbiter.isPlayerInCheck({
                positionAfterMove: arbiter.performMove({position, piece, rank, file, x:0, y:5}),
                player: 'white'
            }) &&
            !arbiter.isPlayerInCheck({
                positionAfterMove: arbiter.performMove({position, piece, rank, file, x:0, y:6}),
                player: 'white'
            })){
                moves.push([0, 6])
        }
    }
    else{
        if(arbiter.isPlayerInCheck({positionAfterMove: position, player: 'black'}))
            return moves

        if(['left', 'both'].includes(castleDirection) &&
            !position[7][1] && !position[7][2] && !position[7][3] && position[7][0] === 'black_rook' &&
            !arbiter.isPlayerInCheck({
                positionAfterMove: arbiter.performMove({position, piece, rank, file, x:7, y:3}),
                player: 'black'
            }) &&
            !arbiter.isPlayerInCheck({
                positionAfterMove: arbiter.performMove({position, piece, rank, file, x:7, y:2}),
                player: 'black'
            })){
                moves.push([7, 2])
        }

        if(['right', 'both'].includes(castleDirection) &&
            !position[7][5] && !position[7][6] && position[7][7] === 'black_rook' &&
            !arbiter.isPlayerInCheck({
                positionAfterMove: arbiter.performMove({position, piece, rank, file, x:7, y:5}),
                player: 'black'
            }) &&
            !arbiter.isPlayerInCheck({
                positionAfterMove: arbiter.performMove({position, piece, rank, file, x:7, y:6}),
                player: 'black'
            })){
                moves.push([7, 6])
        }
    }
    return moves
}

export const getcastleDirection = ({castleDirection, piece, rank, file})=> {
    rank = Number(rank)
    file = Number(file)
    const direction = castleDirection[piece.slice(0,5)]
    if(piece.endsWith('king')){
        return 'none'
    }
    if(file===0 && rank===0){
        if(direction === 'both'){
            return 'right'
        }
        if(direction === 'left'){
            return 'none'
        }
    }
    if(file===7 && rank===0){
        if(direction === 'both'){
            return 'left'
        }
        if(direction === 'right'){
            return 'none'
        }
    }
    if(file===0 && rank===7){
        if(direction === 'both'){
            return 'right'
        }
        if(direction === 'left'){
            return 'none'
        }
    }
    if(file===7 && rank===7){
        if(direction === 'both'){
            return 'left'
        }
        if(direction === 'right'){
            return 'none'
        }
    }
}

export const getKingPosition = (position, player)=> {
    let kingPos
    position.forEach((rank, x)=>{
        rank.forEach((file, y)=>{
            if(position[x][y].startsWith(player) && position[x][y].endsWith('king')){
                kingPos = [x, y]
            }
        })
    })

    return kingPos
}

export const getPieces = (position, enemy)=> {
    const enemyPieces = []
    position.forEach((rank, x)=>{
        rank.forEach((file, y)=>{
            if(position[x][y].startsWith(enemy)){
                enemyPieces.push({
                    piece: position[x][y],
                    rank: x,
                    file: y
                })
            }
        })
    })

    return enemyPieces
}