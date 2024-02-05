import React from 'react';

const YoutubeCard = () => {
  return (
    <iframe
      className='w-[90%] mt-[150px] h-[15rem] sm:h-[30rem] sm:w-[50%]'
      src='https://www.youtube.com/embed/QVvsU0jwNdI?si=O6ook9XvF86MAyOm'
      title='YouTube video player'
      frameBorder='0'
      allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
      allowFullScreen
    ></iframe>
  );
};

export default YoutubeCard;
