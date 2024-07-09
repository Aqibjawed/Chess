import './Ranks.css'

// Numbering on lwft side
const Ranks = ({ranks})=>{
    return(
        <div className='ranks'>
            {ranks.map((rank)=> <span key={rank}>{rank}</span>)}
        </div>
    )
}

export default Ranks