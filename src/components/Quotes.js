import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  styled,
  Typography
} from '@mui/material';
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { db } from '../firebase';
import AddQuoteModal from './addQuoteModal';
import ConfirmDeleteModal from './confirmDelete';
// import { FaArrowCircleUp } from 'react-icons/fa';

const AddButton = styled(Button)(({ theme }) => ({
  color: 'white',
  background: 'blue',
  marginBottom: 3,
  marginTop: 2,
  display: 'block',
  textAlign: 'center'
}));

const HomeButton = styled(Button)(({ theme }) => ({
  color: 'white',
  background: 'darkred',
  marginBottom: 3,
  marginTop: 2,
  marginLeft: 8,
  display: 'block',
  textAlign: 'center'
}));

const Quotes = () => {
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [quotes, setQuotes] = useState([]);
  const [deleteId, setDeleteId] = useState('');
  const [openConfirmDeleteModal, setOpenConfirmDeleteModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState('');

  const [visible, setVisible] = useState(false);

  const toggleVisible = () => {
    const scrolled = document.documentElement.scrollTop;
    if (scrolled > 300) {
      setVisible(true);
    } else if (scrolled <= 300) {
      setVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
      /* you can also use 'auto' behaviour
         in place of 'smooth' */
    });
  };

  window.addEventListener('scroll', toggleVisible);

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
  }, [loading]);

  let navigate = useNavigate();

  const deleteQuote = (deleteId) => {
    deleteDoc(doc(db, 'quotes', deleteId))
      .then(() => {
        setLoading(true);
        setOpenConfirmDeleteModal(false);
        setTimeout(() => {
          setLoading(false);
          setDeleteId('');
        }, 1000);
        Swal.fire({
          icon: 'success',
          title: 'Operation successful',
          text: 'The service has been successfully deleted',
          confirmButtonColor: '#16a34a',
          confirmButtonText: 'Ok'
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          marginY: 2,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <AddButton
          onClick={() => {
            setOpenModal(true);
            setIsEdit(false);
          }}
        >
          Add Quotes
        </AddButton>
        <HomeButton onClick={() => navigate('/')}>Back Home</HomeButton>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'row'
        }}
      >
        <Box>
          {/* <Button>
            <FaArrowCircleUp
              onClick={scrollToTop}
              style={{ display: visible ? 'inline' : 'none' }}
            />
          </Button> */}
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
          {quotes?.map((quote, index) => (
            <Card
              sx={{
                width: 320,
                height: 380,
                marginRight: 5,
                marginBottom: 5,
                marginX: 2,
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
                <Typography gutterBottom variant='h6' component='div'>
                  {/* <span
                  style={{
                    fontWeight: 'bold',
                    color: 'black'
                  }}
                ></span> */}
                  Number: {index + 1}
                </Typography>
                <Typography gutterBottom variant='h6' component='div'>
                  {/* <span
                  style={{
                    fontWeight: 'bold',
                    color: 'black'
                  }}
                ></span> */}
                  {quote?.data?.quote}
                </Typography>

                <Typography variant='p'>
                  <span style={{ color: 'darkblue' }}>
                    {quote?.data?.author}
                  </span>
                </Typography>
                <Typography
                  gutterBottom
                  variant='p'
                  component='div'
                  sx={{ marginTop: 1 }}
                >
                  #{quote?.data?.category}
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
                  <Button
                    size='small'
                    onClick={() => {
                      setIsEdit(true);
                      setEditId(quote?.id);
                      setOpenModal(true);
                    }}
                  >
                    <div className='flex  space-x-1 w-fit items-center px-3 rounded-md py-2 hover:text-white hover:bg-green-700 hover:cursor-pointer  text-green-500 border border-green-500'>
                      Edit
                    </div>
                  </Button>
                  <Button
                    size='small'
                    onClick={() => {
                      setOpenConfirmDeleteModal(true);
                      setDeleteId(quote?.id);
                    }}
                  >
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
          isEdit={isEdit}
          editId={editId}
          setLoading={(props) => setLoading(props)}
        />
        <ConfirmDeleteModal
          openConfirmDeleteModal={openConfirmDeleteModal}
          closeConfirmDeleteModal={() => setOpenConfirmDeleteModal(false)}
          confirmDelete={() => deleteQuote(deleteId)}
        />
      </Box>
    </>
  );
};

export default Quotes;
