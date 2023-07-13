import { Box, Button, CircularProgress } from '@mui/material';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { db } from '../firebase';
import Book from './Book';
import BooksModal from './BooksModal';

const Books = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState('');
  const [promotions, setPromotions] = useState([]);
  const [showLoader, setShowLoader] = useState(false);

  const getPromotions = async () => {
    try {
      setShowLoader(true);
      let arr = [];

      const promsRef = collection(db, 'Books');

      const q = query(promsRef, orderBy('createdAt', 'desc'));

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        // console.log(doc.id, " => ", doc.data());
        arr.push({ id: doc.id, data: doc.data() });
      });
      setPromotions(arr);
      setShowLoader(false);
    } catch (error) {
      console.log('error', error.message);
    }
  };

  useEffect(() => {
    getPromotions();
  }, [loading]);

  const editVideo = (id) => {
    setOpenModal(true);
    setEditId(id);
    setIsEdit(true);
  };

  const deleteVideo = async (iDToDelete) => {
    console.log('id', iDToDelete);
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteDoc(doc(db, 'Books', iDToDelete)).then(() => {
          setLoading(true);
          Swal.fire('Deleted!', 'Book has been deleted.', 'success');
        });
      }

      setTimeout(() => setLoading(false), 300);
    });
  };

  return (
    <div className='flex flex-col items-center justify-center'>
      <Button
        size='large'
        onClick={() => {
          navigate('/');
        }}
      >
        <div className='flex items-center px-3 py-2 space-x-1 text-blue-500 border border-blue-500 rounded-md w-fit hover:text-black hover:bg-white hover:cursor-pointer'>
          Back
        </div>
      </Button>

      <Button
        size='large'
        onClick={() => {
          setOpenModal(true);
          setIsEdit(false);
          setEditId('');
        }}
      >
        <div className='flex items-center px-3 py-2 space-x-1 text-white bg-blue-500 border border-green-500 rounded-md w-fit hover:text-blue-500 hover:bg-white hover:cursor-pointer'>
          Add Book
        </div>
      </Button>

      <div className='grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-2 lg:grid-cols-3 lg:gap-2 mt-8'>
        {promotions?.map((video) => (
          <div className='h-[320px] flex items-center' key={video?.id}>
            <Book
              video={video}
              editVideo={editVideo}
              deleteVideo={deleteVideo}
              setLoading={(props) => setLoading(props)}
            />
          </div>
        ))}
      </div>

      {showLoader && (
        <Box
          sx={{
            display: 'flex',
            position: 'absolute',
            bottom: 100,
            top: '50%',
            left: '50%'
          }}
        >
          <CircularProgress />
        </Box>
      )}

      <BooksModal
        openModal={openModal}
        closeModal={() => setOpenModal(false)}
        isEdit={isEdit}
        editId={editId}
        setLoading={(props) => setLoading(props)}
      />
    </div>
  );
};

export default Books;
