import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { styled } from '@mui/material';

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

const ConfirmButton = styled(Button)(() => ({
  color: 'white',
  marginTop: 5,
  background: 'darkgreen',
  marginRight: 3
}));

const CancelButton = styled(Button)(() => ({
  color: 'white',
  marginTop: 5,
  background: 'darkred'
}));

export default function ConfirmDeleteModal({
  openConfirmDeleteModal,
  closeConfirmDeleteModal,
  confirmDelete
}) {
  return (
    <div>
      <Modal
        open={openConfirmDeleteModal}
        onClose={closeConfirmDeleteModal}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box sx={style}>
          <Typography id='modal-modal-title' variant='h4' component='h2'>
            Confirm delete
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <ConfirmButton onClick={confirmDelete}>Delete</ConfirmButton>
            <CancelButton onClick={closeConfirmDeleteModal}>
              Cancel
            </CancelButton>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
