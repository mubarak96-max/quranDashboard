import {
  Alert,
  Box,
  Button,
  CircularProgress,
  InputLabel,
  Modal,
  TextField
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { db, storage } from '../firebase';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc
} from 'firebase/firestore';
import Swal from 'sweetalert2';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
};

const BooksModal = ({ openModal, closeModal, isEdit, editId, setLoading }) => {
  const [author, setAuthor] = useState(null);
  const [title, setTitle] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [audioName, setAudioName] = useState(null);

  const [bookThumbnail, setBookThumbnail] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(0);
  const [imageName, setImageName] = useState(null);

  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      const promDoc = doc(db, 'Books', editId);
      getDoc(promDoc)
        .then((doc) => {
          const data = doc.data();
          // console.log("edit data", data);

          setTitle(data?.title);
          setAuthor(data?.author);
          setBookThumbnail(data?.bookThumbnail);
          setAudioUrl(data?.bookUrl);
        })
        // eslint-disable-next-line no-shadow
        .catch((error) => {
          console.log('Error getting document:', error);
        });
    } else {
      setTitle('');
      setAuthor('');
      setBookThumbnail(null);
      setAudioName('');
      setAudioUrl(null);
      setImageName('');
      setImageUploadProgress('');
      setUploadProgress(null);
    }
  }, [editId]);

  const handleUpload = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (!file) return;
    const storageRef = ref(storage, `files/books/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    setAudioName(file.name);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );

        if (e.target.name === 'thumbnail')
          return setImageUploadProgress(progress);

        setUploadProgress(progress);
      },
      (error) => {
        alert(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          if (e.target.name === 'audio') return setAudioUrl(downloadURL);

          if (e.target.name === 'thumbnail')
            return setBookThumbnail(downloadURL);
        });
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!audioUrl) {
      setError('Please upload book');
      return '';
    }

    if (!title) {
      setError('Please provide the book title');
      return '';
    }

    const data = {
      bookUrl: audioUrl,
      bookThumbnail,
      title,
      author,
      createdAt: serverTimestamp()
    };

    try {
      if (isEdit) {
        const audiosRef = doc(db, 'Books', editId);
        await updateDoc(audiosRef, data);
      } else {
        const audiosCol = collection(db, 'Books');
        await addDoc(audiosCol, data);
      }

      setLoading(true);

      closeModal();

      Swal.fire({
        icon: 'success',
        title: 'Operation successful',
        text: `Book has been successfully ${isEdit ? 'edited' : 'added'}`,
        confirmButtonColor: '#16a34a',
        confirmButtonText: 'Ok'
      });

      setTitle('');
      setAuthor('');
      setAudioName('');
      setAudioUrl(null);
      setBookThumbnail(null);
      setUploadProgress(null);
      setImageUploadProgress(null);
      setImageName(null);
      setError('');

      setTimeout(() => setLoading(false), 200);
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <Box>
      <Modal
        open={openModal}
        onClose={closeModal}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box sx={style}>
          <Box>
            <Box sx={{ marginY: 2 }}>
              <InputLabel sx={{ marginBottom: 1, fontWeight: '600' }}>
                Book File
              </InputLabel>
              <div>
                <div className='grid gap-5'>
                  {/* <label htmlFor='name'>Add Banner Image</label> */}

                  <input
                    onChange={(e) => handleUpload(e)}
                    className='px-4 py-2 focus:border focus:border-blue-500'
                    type='file'
                    id='audioFile'
                    name='audio'
                    accept='.pdf'
                  />
                </div>

                {!audioUrl && (
                  <div className='outerbar'>
                    <CircularProgress
                      variant='determinate'
                      value={uploadProgress}
                    />
                  </div>
                )}

                {uploadProgress === 100 && <span>Book Uploaded</span>}

                {audioUrl && (
                  <div className='space-y-3'>
                    <div className='flex items-center justify-between'>
                      <span className=''>{audioName}</span>
                    </div>
                  </div>
                )}
              </div>
            </Box>

            <Box sx={{ marginY: 2 }}>
              <InputLabel sx={{ marginBottom: 1, fontWeight: '600' }}>
                Book Thumbnail
              </InputLabel>
              <div>
                <div className='grid gap-5'>
                  {/* <label htmlFor='name'>Add Banner Image</label> */}

                  <input
                    onChange={(e) => handleUpload(e)}
                    className='px-4 py-2 focus:border focus:border-blue-500'
                    type='file'
                    id='audioFile'
                    name='thumbnail'
                    accept='image/*'
                  />
                </div>

                {!bookThumbnail && (
                  <div className='outerbar'>
                    <CircularProgress
                      variant='determinate'
                      value={imageUploadProgress}
                    />
                  </div>
                )}

                {bookThumbnail && (
                  <div className='space-y-3'>
                    <div className='flex items-center justify-between'>
                      <span className=''>{imageName}</span>
                    </div>

                    <img
                      src={bookThumbnail}
                      alt='uploaded file'
                      className='h-[100px] w-[100px] border border-gray-500 p-2 border-dotted'
                    />
                  </div>
                )}
              </div>
            </Box>

            <Box sx={{ marginY: 2 }}>
              <InputLabel sx={{ marginBottom: 1, fontWeight: '600' }}>
                Author
              </InputLabel>
              <TextField
                id='outlined-basic'
                label='Book Author'
                variant='outlined'
                value={author}
                onChange={(e) => {
                  setAuthor(e.target.value);
                }}
              />
            </Box>

            <Box sx={{ marginY: 2 }}>
              <InputLabel sx={{ marginBottom: 1, fontWeight: '600' }}>
                Book Title
              </InputLabel>
              <TextField
                id='outlined-basic'
                label='Audio Title'
                variant='outlined'
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
              />
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'row' }}>
            <Button size='small' onClick={handleSubmit}>
              <div className='flex items-center px-1 py-1 space-x-1 text-sm text-white bg-green-500 border border-white rounded-md w-fit hover:text-green-500 hover:bg-white hover:cursor-pointer'>
                Submit
              </div>
            </Button>
            <Button size='small' onClick={closeModal}>
              <div className='flex items-center px-1 py-1 space-x-1 text-sm text-white bg-red-500 border border-green-500 rounded-md w-fit hover:text-red-500 hover:bg-white hover:cursor-pointer'>
                Cancel
              </div>
            </Button>
          </Box>

          {error && <Alert severity='warning'>{error}</Alert>}
        </Box>
      </Modal>
    </Box>
  );
};

export default BooksModal;
