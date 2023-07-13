import { Box, Button, styled } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const QuotesButton = styled(Button)(({ theme }) => ({
  color: 'white',
  background: 'blue',
  marginBottom: 3,
  marginTop: 2,
  display: 'block',
  textAlign: 'center'
}));

const SurahsButton = styled(Button)(({ theme }) => ({
  color: 'white',
  background: 'darkred',
  marginBottom: 3,
  marginTop: 2,
  marginLeft: 8,
  display: 'block',
  textAlign: 'center'
}));

const Home = () => {
  let navigate = useNavigate();
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginY: 15
      }}
    >
      <Box>
        <Button size='large' onClick={() => navigate('/quotes')}>
          <div className='flex items-center px-3 py-2 space-x-1 text-white bg-blue-500 border border-green-500 rounded-md w-fit hover:text-blue-500 hover:bg-white hover:cursor-pointer'>
            Qoutes
          </div>
        </Button>
      </Box>
      <Box>
        <Button size='large' onClick={() => navigate('/surahs')}>
          <div className='flex items-center px-3 py-2 space-x-1 text-white bg-red-500 border border-green-500 rounded-md w-fit hover:text-red-500 hover:bg-white hover:cursor-pointer'>
            Surahs
          </div>
        </Button>
      </Box>

      <Box>
        <Button size='large' onClick={() => navigate('/audios')}>
          <div className='flex items-center px-3 py-2 space-x-1 text-white bg-orange-500 border border-green-500 rounded-md w-fit hover:text-orange-500 hover:bg-white hover:cursor-pointer'>
            Audios
          </div>
        </Button>
      </Box>
    </Box>
  );
};

export default Home;
