import './Pieces.css'
import Piece from './Piece'
import { useState, useRef } from 'react'
import { copyPosition, createPosition } from '../../helper'
import { useAppContext } from '../../contexts/Context'
import { clearCandidates, makeNewMove } from '../../reducer/actions/move'
import arbiter from '../../arbiter/arbiter'
import { openPromotion } from '../../reducer/actions/actionPopup'
import { getcastleDirection } from '../../arbiter/getMoves'
import { detectCheckMate, detectInsufficient, detectStalemate, updateCastling } from '../../reducer/actions/game'

const Pieces = ()=>{
    const {appState, dispatch} = useAppContext()
    const position = appState.position[appState.position.length-1]
    const ref = useRef()

    const calculateCoordinates = (e)=>{
        // ref.current.getBoundingClientRect()-> this will give position where drop happened and left margin of chess board and top margin and other data as well which we ca use to calculate the rank and feild of the tile drop happened on
        const {width, left, top} = ref.current.getBoundingClientRect()
        const size = width/8
        const y = Math.floor((e.clientX - left)/size)
        const x = 7-Math.floor((e.clientY - top)/size)
        // console.log(x, y)
        return {x, y}
    }

    const openPromotionBox = ({rank, file, x, y})=> {
        dispatch(openPromotion({rank: Number(rank), file: Number(file), x, y}))
    }
    const updateCastlingState = ({piece, rank, file})=> {
        const direction = getcastleDirection({
            castleDirection: appState.castleDirection,
            piece, rank, file
        })
        if(direction){
            dispatch(updateCastling(direction))
        }
    }

    const move = (e)=>{
        const {x, y} = calculateCoordinates(e)
        
        const [piece, rank, file] = e.dataTransfer.getData('text').split(',')

        if(appState.candidateMoves?.find((m)=> m[0]===x && m[1]===y)){
            const opponent = piece.startsWith('w')? 'black': 'white'
            const castleDirection = appState.castleDirection[`${piece.startsWith('w')? 'black': 'white'}`]

            if((piece==='white_pawn' && x===7) || (piece==='black_pawn' && x===0)){
                openPromotionBox({rank, file, x, y})
                return
            }
            if(piece.endsWith('king') || piece.endsWith('rook')){
                updateCastlingState({piece, rank, file})
            }
            const  newPosition = arbiter.performMove({
                position: position,
                piece, rank, file, x, y
            })
            dispatch(makeNewMove({newPosition}))

            if(arbiter.isStalemate(newPosition, opponent, castleDirection)){
                dispatch(detectStalemate())
            }
            else if(arbiter.insufficientMaterial(newPosition)){
                dispatch(detectInsufficient())
            }
            else if(arbiter.isCheckMate(newPosition, opponent, castleDirection)){
                dispatch(detectCheckMate(piece.slice(0,5)))
            }

        }
        dispatch(clearCandidates())
    }

    const onDrop = (e)=>{
        e.preventDefault()
        // Perform move
        move(e)
    }
    const onDragOver = (e)=>{
        e.preventDefault();
    }
    
    return(
        // Rendering all the Pieces
        <div className='pieces' onDrop={onDrop} onDragOver={onDragOver} ref={ref}>
            {position.map((r, rank)=>
                r.map((f, file)=>
                    position[rank][file]
                    ?   <Piece key={rank+'-'+file} rank={rank} file={file} piece={position[rank][file]} />
                    :   null
            ))}
        </div>
    )
}

export default Pieces