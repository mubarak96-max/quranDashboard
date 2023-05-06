import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { Alert, styled, TextField } from '@mui/material';
import { addDoc, collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Swal from 'sweetalert2';

const SubmitButton = styled(Button)(({ theme }) => ({
  color: 'white',
  background: 'blue',
  marginBottom: 3,
  marginTop: 2,
  display: 'block',
  textAlign: 'center'
}));

const CancelButton = styled(Button)(({ theme }) => ({
  color: 'white',
  background: 'red',
  marginBottom: 3,
  marginTop: 2,
  marginLeft: 8,
  display: 'block',
  textAlign: 'center'
}));

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 380,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  scrollY: 'scroll'
};

export default function AddSurahModal({
  openModal,
  handleClose,
  isEdit,
  editId,
  setLoading
}) {
  const [audioURL, setAudioURL] = useState('');
  const [description, setDescription] = useState('');
  const [englishName, setEnglishName] = useState('');
  const [lugandaName, setLugandaName] = useState('');
  const [surahName, setSurahName] = useState('');
  const [fileSize, setFileSize] = useState(null);
  const [surahIndex, setSurahIndex] = useState(null);

  const [location, setLocation] = useState('');
  const [verses, setVerses] = useState(null);

  const [showError, setShowError] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (isEdit) {
      const surahDocRef = doc(db, 'surah', editId);
      getDoc(surahDocRef)
        .then((doc) => {
          const data = doc.data();
          setAudioURL(data?.audioURL);
          setDescription(data?.description);
          setEnglishName(data?.englishName);
          setLugandaName(data?.lugandaName);
          setSurahName(data?.surahName);
          setSurahIndex(data?.surahIndex);
          setFileSize(data?.fileSize);
          setLocation(data?.location);
          setVerses(data?.verses);
        })
        .catch((error) => console.log(error));
    } else {
      setAudioURL('');
      setDescription('');
      setEnglishName('');
      setLugandaName('');
      setSurahName('');
      setSurahIndex(null);
      setFileSize(null);
      setLocation('');
      setVerses(null);
    }
  }, [editId]);

  const handleSubmit = async () => {
    if (audioURL === '') {
      console.log(showError);
      setError('audio url is required');
      setShowError(true);
    } else if (surahIndex === null) {
      console.log(showError);
      setError('surah index is required');
      setShowError(true);
    } else if (isNaN(surahIndex)) {
      console.log(showError);
      setError('surah index should be number');
      setShowError(true);
    } else if (isNaN(verses)) {
      setError('verses should be number');
      setShowError(true);
    } else if (fileSize === null) {
      console.log(showError);
      setError('file size is required');
      setShowError(true);
    } else if (isNaN(fileSize)) {
      console.log(showError);
      setError('file size should be number');
      setShowError(true);
    } else if (surahName === '') {
      console.log(showError);
      setError('surah name is required');
      setShowError(true);
    } else if (description === '') {
      setError('fill in the description');
      setShowError(true);
    } else if (englishName === '') {
      setError('fill in the english name');
      setShowError(true);
    } else if (lugandaName === '') {
      setError('provide the luganda name');
      setShowError(true);
    } else {
      try {
        const data = {
          audioURL,
          description,
          surahIndex: Number(surahIndex),
          surahName,
          englishName,
          lugandaName,
          fileSize: Number(fileSize),
          verses: Number(verses),
          location
        };

        if (isEdit) {
          const surahRef = doc(db, 'surah', editId);

          updateDoc(surahRef, data).then(() => {
            setLoading(true);
            handleClose();
          });

          setSuccess('Successfully edited');
        } else {
          await addDoc(collection(db, 'surah'), data);

          handleClose();

          setSuccess('Successfully added');
        }

        Swal.fire({
          icon: 'success',
          title: 'Operation successful',
          text: `Surah has been successfully ${isEdit ? 'edited' : 'created'}`,
          confirmButtonColor: '#16a34a',
          confirmButtonText: 'Ok'
        });

        setLoading(true);

        setSuccess('Success', 'surah uploaded successfully');

        setTimeout(() => {
          setSuccess('');
          setLoading(false);
          setAudioURL('');
          setDescription('');
          setEnglishName('');
          setLugandaName('');
          setSurahName('');
          setSurahIndex(null);
          setFileSize(null);
          setLocation('');
          setVerses(null);
        }, 300);
      } catch (error) {
        console.log('Error', `Failed to upload due to ${error}`);

        // setLoading(false);
      }
    }
  };
  return (
    <div>
      <Modal
        open={openModal}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box sx={style}>
          <Box>
            <Box sx={{ marginY: 2, display: 'flex', flexDirection: 'row' }}>
              {' '}
              <TextField
                id='outlined-basic'
                label='Surah Index'
                variant='outlined'
                value={surahIndex}
                onChange={(e) => {
                  setSurahIndex(e.target.value);
                }}
              />
              <TextField
                id='outlined-basic'
                label='File Size'
                variant='outlined'
                value={fileSize}
                onChange={(e) => {
                  setFileSize(e.target.value);
                }}
              />
            </Box>

            <Box sx={{ marginY: 2 }}>
              {' '}
              <TextField
                fullWidth
                id='outlined-basic'
                label='Surah Name'
                variant='outlined'
                value={surahName}
                onChange={(e) => {
                  setSurahName(e.target.value);
                }}
              />
            </Box>

            <Box sx={{ marginY: 2, display: 'flex', flexDirection: 'row' }}>
              <TextField
                fullWidth
                id='outlined-basic'
                label='Luganda Name'
                variant='outlined'
                value={lugandaName}
                onChange={(e) => {
                  setLugandaName(e.target.value);
                }}
              />
              <TextField
                fullWidth
                id='outlined-basic'
                label='English Name'
                variant='outlined'
                value={englishName}
                onChange={(e) => {
                  setEnglishName(e.target.value);
                }}
              />
            </Box>

            <Box sx={{ marginY: 2, display: 'flex', flexDirection: 'row' }}>
              {' '}
              <TextField
                fullWidth
                id='outlined-basic'
                label='Number of verses'
                variant='outlined'
                value={verses}
                onChange={(e) => {
                  setVerses(e.target.value);
                }}
              />
              <TextField
                fullWidth
                id='outlined-basic'
                label='Location'
                variant='outlined'
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                }}
              />
            </Box>

            <Box sx={{ marginY: 2 }}>
              {' '}
              <TextField
                fullWidth
                id='outlined-basic'
                label='Audio URL'
                variant='outlined'
                value={audioURL}
                onChange={(e) => {
                  setAudioURL(e.target.value);
                }}
              />
            </Box>

            <Box sx={{ marginY: 2 }}></Box>

            <Box sx={{ marginY: 2 }}>
              {' '}
              <TextField
                fullWidth
                id='outlined-basic'
                label='Description'
                variant='outlined'
                value={description}
                multiline
                rows={7}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              />
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'row' }}>
            <SubmitButton
              variant='outline'
              sx={{ display: 'block', textAlign: 'center' }}
              onClick={handleSubmit}
            >
              Submit
            </SubmitButton>
            <CancelButton onClick={handleClose}>Cancel</CancelButton>
          </Box>

          {success && <Alert severity='success'>{success}</Alert>}
          {error && <Alert severity='warning'>{error}</Alert>}
        </Box>
      </Modal>
    </div>
  );
}
