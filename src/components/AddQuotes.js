// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// import {
//   setDoc,
//   doc,
//   FieldValue,
//   serverTimestamp,
//   addDoc
// } from 'firebase/firestore';
// import { db } from '../firebase';
// import { uuidv4 } from '@firebase/util';
// import {
//   Box,
//   FormControl,
//   InputLabel,
//   MenuItem,
//   Select,
//   TextField
// } from '@mui/material';

// function AddQuote() {
//   let navigate = useNavigate();

//   return (
//     <Box>
//       <Box>
//         {' '}
//         <TextField id='outlined-basic' label='Author' variant='outlined' />
//       </Box>
//       <Box sx={{ width: 180 }}>
//         <FormControl fullWidth>
//           <InputLabel id='demo-simple-select-label'>Category</InputLabel>
//           <Select
//             labelId='demo-simple-select-label'
//             id='demo-simple-select'
//             sx={{
//               height: 30,
//               width: 150,
//               display: 'flex',
//               alignItems: 'center',
//               paddingX: 4,
//               paddingY: 2,
//               marginY: 2
//             }}
//           >
//             {categories?.map((item) => (
//               <MenuItem
//                 key={item.id}
//                 value={item.category}
//                 onClick={() => {
//                   // console.log();
//                   setCategory(item.category);
//                 }}
//               >
//                 {item.category}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>
//       </Box>
//       <Box>
//         <TextField
//           id='outlined-basic'
//           label='Quote'
//           multiline
//           rows={5}
//           variant='outlined'
//         />
//       </Box>
//       <Box>
//         <TextField
//           id='outlined-basic'
//           label='commentary'
//           multiline
//           rows={5}
//           variant='outlined'
//         />
//       </Box>
//     </Box>
//   );
// }

// export default AddQuote;
