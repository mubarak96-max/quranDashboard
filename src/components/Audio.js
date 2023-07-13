import { Button } from '@mui/material';
import React from 'react';

const SingleAudio = ({ editVideo, deleteVideo, video }) => {
  return (
    <div className='p-3 my-5 border border-blue-500'>
      <div>
        <audio controls>
          <source src={video?.data?.audioUrl} type='audio/mpeg' />
          <source src={video?.data?.audioUrl} type='audio/mp4' />
          <source src={video?.data?.audioUrl} type='audio/m4a' />
          Your browser does not support the audio element.
        </audio>
      </div>

      <div>
        <h3 className='text-base font-semibold'>Sheikh/Teacher</h3>
        <p className='pl-2 text-sm'>{video?.data?.teacher}</p>
      </div>

      <div>
        <h3 className='text-base font-semibold'>Title</h3>
        <p className='pl-2 text-sm'>{video?.data?.title}</p>
      </div>

      <button
        onClick={() => {
          window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        }}
        style={{
          position: 'fixed',
          padding: '1rem 2rem',
          fontSize: '20px',
          bottom: '40px',
          right: '40px',
          backgroundColor: '#0C9',
          color: '#fff',
          textAlign: 'center'
        }}
      >
        Scroll to top
      </button>

      <div className='flex flex-row mt-3'>
        <Button size='small' onClick={() => editVideo(video?.id)}>
          <div className='flex items-center px-3 py-2 space-x-1 text-blue-500 border border-blue-500 rounded-md w-fit hover:text-white hover:bg-blue-700 hover:cursor-pointer'>
            Edit
          </div>
        </Button>
        <Button size='small' onClick={() => deleteVideo(video?.id)}>
          <div className='flex items-center px-3 py-2 space-x-1 text-red-500 border border-red-500 rounded-md w-fit hover:text-white hover:bg-red-700 hover:cursor-pointer'>
            Delete
          </div>
        </Button>
      </div>
    </div>
  );
};

export default SingleAudio;
