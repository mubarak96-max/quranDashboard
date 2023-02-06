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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginY: 15
      }}
    >
      <Box>
        {' '}
        <SurahsButton onClick={() => navigate('/surah')}>Surahs</SurahsButton>
      </Box>
      <Box>
        {' '}
        <QuotesButton onClick={() => navigate('/quotes')}>Quotes</QuotesButton>
      </Box>
    </Box>
  );
};

export default Home;
