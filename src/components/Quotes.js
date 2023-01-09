import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  Typography
} from '@mui/material';
import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import AddQuoteModal from './addQuoteModal';

const Quotes = () => {
  const [openModal, setOpenModal] = useState(false);
  const [quotes, setQuotes] = useState([]);

  const getData = async () => {
    try {
      let quotesArr = [];
      const quotesRef = collection(db, 'quotes');

      const querySnapshot = await getDocs(quotesRef);
      querySnapshot.forEach((doc) => {
        // console.log(doc.id, " => ", doc.data());
        quotesArr.push({ id: doc.id, data: doc.data() });
      });
      setQuotes([...quotesArr]);
      //   console.log('quotesArr', quotesArr);
      console.log('quotes', quotes);
      console.log('quotes', quotes);
    } catch (error) {
      console.log('error', error.message);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <Box>
      <Button onClick={() => setOpenModal(true)}>Add Quotes</Button>
      <Box>
        {quotes?.map((quote) => (
          <Card
            sx={{
              width: 200,
              height: 250,
              marginRight: 5,
              marginBottom: 5,
              border: '2px solid lightblue',
              overflowY: 'scroll'
            }}
          >
            <CardContent
              sx={{
                overflow: 'hidden',
                overflowY: 'scroll',
                overflowX: 'hidden'
              }}
            >
              {/* title, description, date, time, location, imageURL, */}
              <Typography gutterBottom variant='h6' component='div'>
                {/* <span
                  style={{
                    fontWeight: 'bold',
                    color: 'black'
                  }}
                ></span> */}
                {quote?.data?.quote}
              </Typography>

              <Typography variant='p' color='text.secondary'>
                {quote?.data?.author}
              </Typography>
              <Typography
                gutterBottom
                variant='p'
                component='div'
                sx={{ marginTop: 1 }}
              >
                {quote?.data?.category}
              </Typography>
              <Typography
                gutterBottom
                variant='p'
                component='div'
                sx={{ marginTop: 1 }}
              >
                {quote?.data?.commentary}
              </Typography>
            </CardContent>
            <CardActionArea>
              <CardActions>
                <Button size='small'>
                  <div className='flex  space-x-1 w-fit items-center px-3 rounded-md py-2 hover:text-white hover:bg-green-700 hover:cursor-pointer  text-green-500 border border-green-500'>
                    Edit
                  </div>
                </Button>
                <Button size='small'>
                  <div className='flex  space-x-1 w-fit items-center px-3 rounded-md py-2 hover:text-white hover:bg-red-700 hover:cursor-pointer  text-red-500 border border-red-500'>
                    Delete
                  </div>
                </Button>
              </CardActions>
            </CardActionArea>
          </Card>
        ))}
      </Box>
      <AddQuoteModal
        openModal={openModal}
        handleClose={() => setOpenModal(false)}
      />
    </Box>
  );
};

export default Quotes;
