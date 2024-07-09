import { getCharachter } from '../../../helper'
import './Files.css'

// letters at the bottom
const Files = ({files}) => {
  return(
    <div className='files'>
        {files.map((file)=> <span key={file}>{getCharachter(file)}</span>)}
    </div>
  )
}

export default Files
