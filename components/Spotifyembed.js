import React, { useEffect, useState } from 'react';

export const Spotifyembed = ({ trackUrl }) => {
  const [trackId, setTrackId] = useState('');
  useEffect(() => {
    // Get the track id from the track url
    const trackId = trackUrl[4].split('?')[0];
    setTrackId(trackId);
  }, [trackUrl]);
  
  return (
    <div className=' flex items-center  m-6'>
        <iframe
      src={`https://open.spotify.com/embed/track/${trackId}`}
      width="600"
      height="160"
      frameborder="0"
      allowtransparency="true"
      allow="encrypted-media"
    />
    </div>
  );
}
