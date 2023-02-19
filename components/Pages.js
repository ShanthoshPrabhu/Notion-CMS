import React from 'react'

function Pages({data}) {
  return (
    <div className=' flex items-center justify-around text-xs md:text-sm lg:text-base'>
     <div>{data.owner}</div>
     <div>
        <a href={`http://localhost:3000/${data.page}`} className='cursor-pointer'>{data.page}</a>
     </div>
   </div>
  )
}

export default Pages