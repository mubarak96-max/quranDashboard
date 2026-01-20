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
import { X, Upload, Save, Music, User } from 'lucide-react';
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
        "&:hover fieldset": { borderColor: "rgba(249, 115, 22, 0.5)" },
        "&.Mui-focused fieldset": { borderColor: "#f97316" },
      },
      "& .MuiInputLabel-root": { color: "#71717a" },
      "& .MuiInputLabel-root.Mui-focused": { color: "#f97316" },
      ...props.sx
    }}
  />
);

const AudioModal = ({ openModal, closeModal, isEdit, editId, setLoading }) => {
  const [teacher, setTeacher] = useState('');
  const [title, setTitle] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [audioName, setAudioName] = useState('');

  useEffect(() => {
    if (isEdit && editId) {
      const promDoc = doc(db, 'Audios', editId);
      getDoc(promDoc).then((doc) => {
        if (doc.exists()) {
          const data = doc.data();
          setTitle(data?.title || '');
          setTeacher(data?.teacher || '');
          setAudioUrl(data?.audioUrl || '');
        }
      }).catch(err => console.error(err));
    } else {
      setTitle('');
      setTeacher('');
      setAudioName('');
      setAudioUrl('');
      setUploadProgress(0);
    }
  }, [editId, isEdit, openModal]);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const storageRef = ref(storage, `files/audios/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    setAudioName(file.name);
    setUploading(true);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setUploadProgress(progress);
      },
      (error) => {
        Swal.fire({ icon: 'error', title: 'Upload Failed', text: error.message, background: '#171717', color: '#fff' });
        setUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setAudioUrl(downloadURL);
          setUploading(false);
        });
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!audioUrl || !title || !teacher) {
      Swal.fire({ icon: 'error', title: 'Required Fields', text: 'All fields are strictly required', background: '#171717', color: '#fff' });
      return;
    }

    const data = {
      audioUrl,
      title,
      teacher,
      createdAt: serverTimestamp()
    };

    try {
      if (isEdit) {
        await updateDoc(doc(db, 'Audios', editId), data);
      } else {
        await addDoc(collection(db, 'Audios'), data);
      }

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: `Audio recitation ${isEdit ? 'updated' : 'added'} successfully.`,
        background: '#171717',
        color: '#fff',
        confirmButtonColor: '#f97316'
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
        className="w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl relative"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/5 blur-[80px] rounded-full -mr-32 -mt-32 pointer-events-none" />

        {/* Header */}
        <div className="relative z-10 px-8 py-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02] backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-orange-500/10 text-orange-500 border border-orange-500/20">
              <Music className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white leading-none mb-1">
                {isEdit ? "Update File" : "New Audio"}
              </h2>
              <p className="text-[10px] text-white/40 uppercase font-black tracking-widest">Recitation Management</p>
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
              label="Teacher / Sheikh"
              value={teacher}
              onChange={(e) => setTeacher(e.target.value)}
              placeholder="Sheikh Sulaiman Nkata"
              InputProps={{
                startAdornment: <User className="w-4 h-4 mr-3 text-orange-500/50" />
              }}
            />
            <CustomTextField
              label="Audio Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Surah Al-Baqarah (Part 1)"
            />
          </div>

          <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 space-y-4">
            <input
              type="file"
              id="audio-upload-modal"
              className="hidden"
              accept="audio/*"
              onChange={handleUpload}
            />

            {!audioUrl && !uploading && (
              <label
                htmlFor="audio-upload-modal"
                className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-white/10 rounded-[2rem] hover:border-orange-500/40 hover:bg-orange-500/5 transition-all cursor-pointer group"
              >
                <div className="p-4 rounded-2xl bg-white/5 group-hover:bg-orange-500/10 transition-colors mb-4 border border-white/5 group-hover:border-orange-500/20">
                  <Upload className="w-6 h-6 text-white/40 group-hover:text-orange-500 transition-colors" />
                </div>
                <span className="text-sm font-bold text-white/60 group-hover:text-white transition-colors">Select Audio File</span>
                <span className="text-[10px] text-white/20 mt-1 uppercase font-black">MP3 / WAV Supported</span>
              </label>
            )}

            {uploading && (
              <div className="py-10 text-center space-y-6">
                <div className="relative inline-flex items-center justify-center">
                  <CircularProgress
                    variant="determinate"
                    value={uploadProgress}
                    size={64}
                    thickness={4}
                    sx={{ color: '#f97316' }}
                  />
                  <span className="absolute text-xs font-bold text-white">{uploadProgress}%</span>
                </div>
                <p className="text-[10px] text-white/40 uppercase font-black tracking-widest animate-pulse">Uploading to Cloud...</p>
              </div>
            )}

            {audioUrl && (
              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <Music className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                    <span className="text-xs text-white/60 truncate font-medium">{audioName || 'Recitation File Ready'}</span>
                  </div>
                  <label htmlFor="audio-upload-modal" className="text-[10px] text-orange-500 font-black uppercase tracking-widest hover:underline cursor-pointer">Replace</label>
                </div>
                <audio controls className="w-full h-10 accent-orange-500 custom-audio-player rounded-xl">
                  <source src={audioUrl} type="audio/mpeg" />
                </audio>
              </div>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={closeModal}
              className="flex-1 px-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold text-sm transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-[1.5] px-6 py-4 rounded-2xl bg-orange-600 text-white font-black text-sm hover:bg-orange-700 hover:shadow-[0_0_20px_rgba(234,88,12,0.3)] transition-all flex items-center justify-center gap-2 uppercase tracking-widest"
            >
              <Save className="w-4 h-4" /> {isEdit ? "Update File" : "Save Record"}
            </button>
          </div>
        </form>
      </motion.div>
    </Modal>
  );
};

export default AudioModal;

