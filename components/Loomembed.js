import React from 'react'


function Loomembed({loomUrl}) {
    
    const Id = loomUrl[4]
    const url = `https://www.loom.com/embed/${Id}`
  return (
    <div>
        <iframe class="notion-asset-object-fit"  src="https://www.loom.com/embed/b1d717b7ba86481a82c3b2f72c210d0d" title="iframe video" frameborder="0" allowfullscreen="" loading="lazy"></iframe>
    </div>
  )
}

export default Loomembed