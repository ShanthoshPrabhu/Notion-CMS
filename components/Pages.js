import React from 'react'

function Pages({data}) {
  return (
    <div className=' flex items-center justify-around text-xs md:text-sm lg:text-base'>
     <div>{data.owner}</div>
     <div>
        <a href={`https://notion-cms-jade.vercel.app/${data.page}`} className='cursor-pointer'>{data.page}</a>
     </div>
   </div>
  )
}

export default Pages