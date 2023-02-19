import React from 'react'

function Footer() {
  return (
    <div className='flex justify-around absolute bottom-0 w-full '> 
      <div className=' text-base'>
        <div className=' text-sm font-medium lg:text-base lg:font-semibold'>Company</div>
        <div className=' h-48'></div>
      </div>
      <div className=' text-base '>
        <div className='text-sm font-medium lg:text-base lg:font-semibold'>Resources</div>
        <div className=' h-48'></div>
      </div>
      <div className=' text-base '>
        <div className='text-sm font-medium lg:text-base lg:font-semibold'>Notion templates</div>
        <div className=' h-48'></div>
      </div>
    </div>
  )
}

export default Footer