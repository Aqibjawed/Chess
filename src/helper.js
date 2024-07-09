export const getCharachter = (file)=> String.fromCharCode(file + 96)

export const createPosition = ()=>{
    const position = new Array(8).fill('').map(x=> new Array(8).fill(''))

    for(let i=0 ; i<8 ; i++){
        position[1][i] = 'white_pawn'
        position[6][i] = 'black_pawn'
    }

    position[0][0] = 'white_rook'
    position[0][1] = 'white_knight'
    position[0][2] = 'white_bishop'
    position[0][3] = 'white_queen'
    position[0][4] = 'white_king'
    position[0][5] = 'white_bishop'
    position[0][6] = 'white_knight'
    position[0][7] = 'white_rook'

    position[7][0] = 'black_rook'
    position[7][1] = 'black_knight'
    position[7][2] = 'black_bishop'
    position[7][3] = 'black_queen'
    position[7][4] = 'black_king'
    position[7][5] = 'black_bishop'
    position[7][6] = 'black_knight'
    position[7][7] = 'black_rook'

    return position
}

export const copyPosition = (position)=>{
    const newPosition = new Array(8).fill('').map(x=> new Array(8).fill(''))
    
    for(let rank=0; rank<8 ; rank++){
        for(let file=0; file<8; file++){
            newPosition[rank][file] = position[rank][file]
        }
    }

    return newPosition
}

export const areSameColorTiles = (coords1, coords2)=>{
    return (coords1.x + coords1.y) %2 === (coords2.x + coords2.y) %2
}
export const findPieceCoords = (position, piece)=>{
    let result = []
    position.forEach((rank, i)=> {
        rank.forEach((pos, j)=> {
            if(pos === piece){
                result.push({x:i, y:j})
            }
        })
    })

    return result
}