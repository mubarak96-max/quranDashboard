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

const AudioModal = ({ openModal, closeModal, isEdit, editId, setLoading }) => {
  const [teacher, setTeacher] = useState(null);
  const [title, setTitle] = useState(null);

  const [audioUrl, setAudioUrl] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [audioName, setAudioName] = useState(null);

  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      const promDoc = doc(db, 'Audios', editId);
      getDoc(promDoc)
        .then((doc) => {
          const data = doc.data();
          // console.log("edit data", data);

          setTitle(data?.title);
          setTeacher(data?.teacher);
          setAudioUrl(data?.audioUrl);
        })
        // eslint-disable-next-line no-shadow
        .catch((error) => {
          console.log('Error getting document:', error);
        });
    } else {
      setTitle('');
      setTeacher('');
      setAudioName('');
      setAudioUrl(null);
      setUploadProgress(null);
    }
  }, [editId]);

  const handleUpload = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (!file) return;
    const storageRef = ref(storage, `files/audios/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    setAudioName(file.name);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setUploadProgress(progress);
      },
      (error) => {
        alert(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setAudioUrl(downloadURL);
        });
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!audioUrl) {
      setError('Please upload audio');
      return '';
    }

    if (!title) {
      setError('Please provide the audio title');
      return '';
    }

    if (!teacher) {
      setError('Please provide the Sheikh or teacher name');
      return '';
    }

    const data = {
      audioUrl,
      title,
      teacher,
      createdAt: serverTimestamp()
    };

    try {
      if (isEdit) {
        const audiosRef = doc(db, 'Audios', editId);
        await updateDoc(audiosRef, data);
      } else {
        const audiosCol = collection(db, 'Audios');
        await addDoc(audiosCol, data);
      }

      setLoading(true);

      closeModal();

      Swal.fire({
        icon: 'success',
        title: 'Operation successful',
        text: `Audio has been successfully ${isEdit ? 'edited' : 'added'}`,
        confirmButtonColor: '#16a34a',
        confirmButtonText: 'Ok'
      });

      setTitle('');
      setTeacher('');
      setAudioName('');
      setAudioUrl(null);
      setUploadProgress(null);
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
                Audio File
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
                    accept='audio/*'
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

                {audioUrl && (
                  <div className='space-y-3'>
                    <div className='flex items-center justify-between'>
                      <span className=''>{audioName}</span>
                    </div>

                    <audio controls>
                      <source src={audioUrl} type='audio/mpeg' />
                      <source src={audioUrl} type='audio/mp4' />
                      <source src={audioUrl} type='audio/m4a' />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                )}
              </div>
            </Box>

            <Box sx={{ marginY: 2 }}>
              <InputLabel sx={{ marginBottom: 1, fontWeight: '600' }}>
                Teacher/Sheikh
              </InputLabel>
              <TextField
                id='outlined-basic'
                label='Teacher/Sheikh'
                variant='outlined'
                value={teacher}
                onChange={(e) => {
                  setTeacher(e.target.value);
                }}
              />
            </Box>

            <Box sx={{ marginY: 2 }}>
              <InputLabel sx={{ marginBottom: 1, fontWeight: '600' }}>
                Title
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

export default AudioModal;
