import React from 'react'

function Blogs({data}) {
    // console.log('dataaa',data)
  return (
   <div className=' flex items-center justify-around text-xs md:text-sm lg:text-base'>
     <div>{data.owner}</div>
     <div>
        <a href={`https://notion-cms-jade.vercel.app/${data.blog}`} className='cursor-pointer'>{data.blog}</a>
     </div>
   </div>
  )
}

export default Blogs