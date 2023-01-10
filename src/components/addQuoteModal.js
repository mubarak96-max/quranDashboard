import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import {
  Alert,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  styled,
  TextField
} from '@mui/material';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

const SubmitButton = styled(Button)(({ theme }) => ({
  color: 'white',
  background: 'blue',
  marginBottom: 3,
  marginTop: 2,
  display: 'block',
  textAlign: 'center'
}));

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

const categories = [
  {
    id: '12s',
    category: 'mental strength'
  },
  {
    id: '1bs',
    category: 'spirituality'
  },
  {
    id: '1cs',
    category: 'morality'
  },
  {
    id: '1ls',
    category: 'love and relationships'
  },
  {
    id: '1s',
    category: 'finance'
  },
  {
    id: '9qs',
    category: 'self control'
  }
];

export default function AddQuoteModal({ openModal, handleClose }) {
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');
  const [commentary, setCommentary] = useState('');
  const [quote, setQuote] = useState('');

  const [showError, setShowError] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async () => {
    if (author === '') {
      console.log(showError);
      setError('author is required');
      setShowError(true);
    } else if (category === '') {
      console.log('fill in the luganda name');
      setError('fill in the category');
      setShowError(true);
    } else if (commentary === '') {
      console.log('fill in the name');
      setError('fill in the commentary');
      setShowError(true);
    } else if (quote === '') {
      console.log('provide the audio url');
      setError('provide the quote');
      setShowError(true);
    } else {
      try {
        const data = {
          author: author,
          category: category,
          quote: quote,
          commentary: commentary,

          timestamp: serverTimestamp()
        };

        await addDoc(collection(db, 'quotes'), data);

        setSuccess('Success', 'quote uploaded successfully');

        window.location.reload();
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
            <Box sx={{ marginY: 2 }}>
              {' '}
              <TextField
                id='outlined-basic'
                label='Author'
                variant='outlined'
                value={author}
                onChange={(e) => {
                  setAuthor(e.target.value);
                }}
              />
            </Box>
            <Box sx={{ width: 180 }}>
              <FormControl fullWidth>
                <InputLabel id='demo-simple-select-label'>Category</InputLabel>
                <Select
                  labelId='demo-simple-select-label'
                  id='demo-simple-select'
                  sx={{
                    height: 30,
                    width: 150,
                    display: 'flex',
                    alignItems: 'center',
                    paddingX: 4,
                    paddingY: 2,
                    marginY: 2
                  }}
                >
                  {categories?.map((item) => (
                    <MenuItem
                      key={item.id}
                      value={item.category}
                      onClick={() => {
                        // console.log();
                        setCategory(item.category);
                      }}
                    >
                      {item.category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ marginY: 2 }}>
              <TextField
                id='outlined-basic'
                label='Quote'
                multiline
                rows={5}
                variant='outlined'
                value={quote}
                onChange={(e) => {
                  setQuote(e.target.value);
                }}
              />
            </Box>
            <Box sx={{ marginY: 2 }}>
              <TextField
                id='outlined-basic'
                label='commentary'
                multiline
                rows={5}
                variant='outlined'
                value={commentary}
                onChange={(e) => {
                  setCommentary(e.target.value);
                }}
              />
            </Box>
          </Box>
          <Button
            variant='outline'
            sx={{ display: 'block', textAlign: 'center' }}
            onClick={handleSubmit}
          >
            Submit
          </Button>
          <SubmitButton onClick={handleClose}>Cancel</SubmitButton>
          {success && <Alert severity='success'>{success}</Alert>}
          {error && <Alert severity='warning'>{error}</Alert>}
        </Box>
      </Modal>
    </div>
  );
}
