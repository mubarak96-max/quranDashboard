import React, { useEffect, useState } from 'react';
import { CircularProgress, Modal, TextField } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
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
import { X, Upload, Save, Book, User, FileText, Image as ImageIcon } from 'lucide-react';
import Swal from 'sweetalert2';

const CustomTextField = ({ ...props }) => (
  <TextField
    fullWidth
    variant="outlined"
    size="small"
    {...props}
    sx={{
      "& .MuiOutlinedInput-root": {
        color: "white",
        backgroundColor: "rgba(255,255,255,0.03)",
        borderRadius: "12px",
        "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
        "&:hover fieldset": { borderColor: "rgba(168, 85, 247, 0.5)" },
        "&.Mui-focused fieldset": { borderColor: "#a855f7" },
      },
      "& .MuiInputLabel-root": { color: "#71717a" },
      "& .MuiInputLabel-root.Mui-focused": { color: "#a855f7" },
      ...props.sx
    }}
  />
);

const BooksModal = ({ openModal, closeModal, isEdit, editId, setLoading }) => {
  const [author, setAuthor] = useState('');
  const [title, setTitle] = useState('');
  const [bookUrl, setBookUrl] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [bookName, setBookName] = useState('');

  const [bookThumbnail, setBookThumbnail] = useState('');
  const [imageUploadProgress, setImageUploadProgress] = useState(0);
  const [imageUploading, setImageUploading] = useState(false);
  const [imageName, setImageName] = useState('');

  useEffect(() => {
    if (isEdit && editId) {
      const promDoc = doc(db, 'Books', editId);
      getDoc(promDoc).then((doc) => {
        if (doc.exists()) {
          const data = doc.data();
          setTitle(data?.title || '');
          setAuthor(data?.author || '');
          setBookThumbnail(data?.bookThumbnail || '');
          setBookUrl(data?.bookUrl || '');
        }
      }).catch(err => console.error(err));
    } else {
      setTitle('');
      setAuthor('');
      setBookThumbnail('');
      setBookName('');
      setBookUrl('');
      setImageName('');
      setImageUploadProgress(0);
      setUploadProgress(0);
    }
  }, [editId, isEdit, openModal]);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const isImage = e.target.name === 'thumbnail';
    const storageRef = ref(storage, `files/${isImage ? 'thumbnails' : 'books'}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    if (isImage) {
      setImageName(file.name);
      setImageUploading(true);
    } else {
      setBookName(file.name);
      setUploading(true);
    }

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        if (isImage) setImageUploadProgress(progress);
        else setUploadProgress(progress);
      },
      (error) => {
        Swal.fire({ icon: 'error', title: 'Upload Failed', text: error.message, background: '#171717', color: '#fff' });
        if (isImage) setImageUploading(false);
        else setUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          if (isImage) {
            setBookThumbnail(downloadURL);
            setImageUploading(false);
          } else {
            setBookUrl(downloadURL);
            setUploading(false);
          }
        });
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!bookUrl || !title || !author) {
      Swal.fire({ icon: 'error', title: 'Required Fields', text: 'All fields are strictly required', background: '#171717', color: '#fff' });
      return;
    }

    const data = {
      bookUrl,
      bookThumbnail,
      title,
      author,
      createdAt: serverTimestamp()
    };

    try {
      if (isEdit) {
        await updateDoc(doc(db, 'Books', editId), data);
      } else {
        await addDoc(collection(db, 'Books'), data);
      }

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: `Book resource ${isEdit ? 'updated' : 'added'} successfully.`,
        background: '#171717',
        color: '#fff',
        confirmButtonColor: '#a855f7'
      });

      if (setLoading) setLoading(false);
      closeModal();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Modal open={openModal} onClose={closeModal} className="flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] shadow-2xl relative overflow-y-auto max-h-[95vh]"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/5 blur-[80px] rounded-full -mr-32 -mt-32 pointer-events-none" />

        {/* Header */}
        <div className="relative z-10 px-8 py-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02] backdrop-blur-xl sticky top-0">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-500 border border-purple-500/20">
              <Book className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white leading-none mb-1">
                {isEdit ? "Update Book" : "New Resource"}
              </h2>
              <p className="text-[10px] text-white/40 uppercase font-black tracking-widest">Library Management</p>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="p-2.5 hover:bg-white/5 rounded-xl transition-all text-white/40 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="relative z-10 p-8 space-y-8">
          <div className="space-y-6">
            <CustomTextField
              label="Author Name"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Sheikh Abdurazak Matovu"
              InputProps={{
                startAdornment: <User className="w-4 h-4 mr-3 text-purple-500/50" />
              }}
            />
            <CustomTextField
              label="Book Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Quran Translation (Luganda)"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Book File Upload */}
            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 space-y-4">
              <div className="flex items-center gap-2 px-1">
                <FileText className="w-3.5 h-3.5 text-purple-500" />
                <span className="text-[10px] font-black uppercase text-white/40 tracking-widest">Document (PDF)</span>
              </div>

              <input
                type="file"
                id="book-upload"
                name="book"
                className="hidden"
                accept=".pdf"
                onChange={handleUpload}
              />

              {!bookUrl && !uploading && (
                <label
                  htmlFor="book-upload"
                  className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-white/10 rounded-2xl hover:border-purple-500/40 hover:bg-purple-500/5 transition-all cursor-pointer group h-[120px]"
                >
                  <Upload className="w-6 h-6 text-white/40 group-hover:text-purple-500 mb-2 transition-colors" />
                  <span className="text-[10px] font-bold text-white/60 group-hover:text-white transition-colors">Select PDF</span>
                </label>
              )}

              {uploading && (
                <div className="h-[120px] flex flex-col items-center justify-center space-y-3">
                  <CircularProgress variant="determinate" value={uploadProgress} size={40} sx={{ color: '#a855f7' }} />
                  <p className="text-[10px] text-white/40 font-black uppercase">{uploadProgress}%</p>
                </div>
              )}

              {bookUrl && (
                <div className="p-4 bg-purple-500/5 rounded-2xl border border-purple-500/20 h-[120px] flex flex-col justify-between">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <FileText className="w-5 h-5 text-purple-500 shrink-0" />
                    <span className="text-[10px] text-white/80 font-bold truncate leading-tight">{bookName || 'PDF Ready'}</span>
                  </div>
                  <label htmlFor="book-upload" className="text-[10px] text-center p-2 rounded-xl bg-purple-500/10 text-purple-500 font-black uppercase tracking-widest hover:bg-purple-500/20 cursor-pointer transition-colors mt-2">Replace File</label>
                </div>
              )}
            </div>

            {/* Thumbnail Upload */}
            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 space-y-4">
              <div className="flex items-center gap-2 px-1">
                <ImageIcon className="w-3.5 h-3.5 text-purple-500" />
                <span className="text-[10px] font-black uppercase text-white/40 tracking-widest">Cover Image</span>
              </div>

              <input
                type="file"
                id="thumb-upload"
                name="thumbnail"
                className="hidden"
                accept="image/*"
                onChange={handleUpload}
              />

              {!bookThumbnail && !imageUploading && (
                <label
                  htmlFor="thumb-upload"
                  className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-white/10 rounded-2xl hover:border-purple-500/40 hover:bg-purple-500/5 transition-all cursor-pointer group h-[120px]"
                >
                  <Upload className="w-6 h-6 text-white/40 group-hover:text-purple-500 mb-2 transition-colors" />
                  <span className="text-[10px] font-bold text-white/60 group-hover:text-white transition-colors">Select Cover</span>
                </label>
              )}

              {imageUploading && (
                <div className="h-[120px] flex flex-col items-center justify-center space-y-3">
                  <CircularProgress variant="determinate" value={imageUploadProgress} size={40} sx={{ color: '#a855f7' }} />
                  <p className="text-[10px] text-white/40 font-black uppercase">{imageUploadProgress}%</p>
                </div>
              )}

              {bookThumbnail && (
                <div className="flex gap-3 h-[120px]">
                  <img
                    src={bookThumbnail}
                    alt="cover"
                    className="w-16 h-full object-cover rounded-xl border border-white/10 shrink-0 shadow-lg shadow-black/50"
                  />
                  <div className="flex flex-col justify-end gap-2 flex-1">
                    <span className="text-[10px] text-white/40 truncate font-medium">{imageName || 'Cover Ready'}</span>
                    <label htmlFor="thumb-upload" className="text-[10px] text-center p-2 rounded-xl bg-purple-500/10 text-purple-500 font-black uppercase tracking-widest hover:bg-purple-500/20 cursor-pointer transition-colors">Replace</label>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4 pt-4 sticky bottom-0 bg-[#0a0a0a]/80 backdrop-blur-md -m-8 p-8">
            <button
              type="button"
              onClick={closeModal}
              className="flex-1 px-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold text-sm transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-[1.5] px-6 py-4 rounded-2xl bg-purple-600 text-white font-black text-sm hover:bg-purple-700 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all flex items-center justify-center gap-2 uppercase tracking-widest"
            >
              <Save className="w-4 h-4" /> {isEdit ? "Update Library" : "Save Resource"}
            </button>
          </div>
        </form>
      </motion.div>
    </Modal>
  );
};

export default BooksModal;

