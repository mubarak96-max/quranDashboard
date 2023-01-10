import { Box, Button } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  let navigate = useNavigate();
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginY: 20
      }}
    >
      <Box>
        {' '}
        <Button onClick={() => navigate('/surah')}>Surahs</Button>
      </Box>
      <Box>
        {' '}
        <Button onClick={() => navigate('/quotes')}>Quotes</Button>
      </Box>
    </Box>
  );
};

export default Home;
