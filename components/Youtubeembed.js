import React from 'react'
import YouTube from 'react-youtube';

function Youtubeembed({vidUrl}) {

    "https://www.youtube.com/watch?v=8oX3eCMPpPM"

    const videoId = vidUrl[3]?.split('?')[1].split('=')[1]
    const opts = {
        height: '390',
        width: '640',
        playerVars: { // https://developers.google.com/youtube/player_parameters
          autoplay: 1
        }
      };
      //html: `<iframe src="${embedUrl}" sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts" width="${width}" height="${height}" frameborder="0"></iframe>`
      
      // <iframe class="notion-asset-object-fit" style="object-fit:contain" src="https://www.youtube.com/embed/8oX3eCMPpPM?feature=oembed" title="iframe video" frameborder="0" allowfullscreen="" loading="lazy"></iframe>
  return (
  
        <iframe
          width="560"
          height="315"
          src={`https://www.youtube.com/embed/${videoId}?feature=oembed`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          
        ></iframe>
     
  )
}

export default Youtubeembed