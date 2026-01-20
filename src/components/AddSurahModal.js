import React, { useEffect, useState } from "react";
import Modal from "@mui/material/Modal";
import { CircularProgress, TextField } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { db, storage } from "../firebase";
import { X, Upload, Save, FileAudio, Layout, Hash, Type, MapPin, List } from 'lucide-react';
import Swal from "sweetalert2";

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
        "&:hover fieldset": { borderColor: "rgba(16, 185, 129, 0.5)" },
        "&.Mui-focused fieldset": { borderColor: "#10b981" },
      },
      "& .MuiInputLabel-root": { color: "#71717a" },
      "& .MuiInputLabel-root.Mui-focused": { color: "#10b981" },
      ...props.sx
    }}
  />
);

export default function AddSurahModal({
  openModal,
  handleClose,
  isEdit,
  editId,
  setLoading
}) {
  const [audioURL, setAudioURL] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [audioName, setAudioName] = useState(null);

  const [description, setDescription] = useState("");
  const [englishName, setEnglishName] = useState("");
  const [lugandaName, setLugandaName] = useState("");
  const [surahName, setSurahName] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [surahIndex, setSurahIndex] = useState("");

  const [location, setLocation] = useState("");
  const [verses, setVerses] = useState("");

  const [error, setError] = useState("");

  useEffect(() => {
    if (isEdit && editId) {
      const surahDocRef = doc(db, "surah", editId);
      getDoc(surahDocRef)
        .then((doc) => {
          const data = doc.data();
          setAudioURL(data?.audioURL || "");
          setDescription(data?.description || "");
          setEnglishName(data?.englishName || "");
          setLugandaName(data?.lugandaName || "");
          setSurahName(data?.surahName || "");
          setSurahIndex(data?.surahIndex || "");
          setFileSize(data?.fileSize || "");
          setLocation(data?.location || "");
          setVerses(data?.verses || "");
          setAudioName(data?.audioName || "");
        })
        .catch((error) => console.log(error));
    } else {
      setAudioURL("");
      setDescription("");
      setEnglishName("");
      setLugandaName("");
      setSurahName("");
      setSurahIndex("");
      setFileSize("");
      setLocation("");
      setVerses("");
      setAudioName("");
      setUploadProgress(0);
    }
  }, [editId, isEdit, openModal]);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const storageRef = ref(storage, `files/Quran/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    setAudioName(file.name);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setUploadProgress(progress);
        setUploading(true);
      },
      (error) => {
        setError(error.message);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setAudioURL(downloadURL);
          setUploading(false);
        });
      }
    );
  };

  const handleSubmit = async () => {
    if (!audioURL || !surahIndex || !surahName || !description || !englishName || !lugandaName) {
      Swal.fire({
        icon: "error",
        title: "Missing Fields",
        text: "Please fill in all required fields",
        background: "#171717",
        color: "#fff"
      });
      return;
    }

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
        location,
        audioName
      };

      if (isEdit) {
        await updateDoc(doc(db, "surah", editId), data);
      } else {
        await addDoc(collection(db, "surah"), data);
      }

      Swal.fire({
        icon: "success",
        title: "Success",
        text: `Surah ${isEdit ? "updated" : "added"} successfully!`,
        background: "#171717",
        color: "#fff",
        confirmButtonColor: "#10b981"
      });

      if (setLoading) setLoading(false);
      handleClose();
    } catch (error) {
      console.error("Error saving surah:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
        background: "#171717",
        color: "#fff"
      });
    }
  };

  return (
    <Modal open={openModal} onClose={handleClose} className="flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-[3rem] shadow-2xl relative overflow-y-auto max-h-[95vh]"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[100px] rounded-full -mr-48 -mt-48 pointer-events-none" />

        {/* Header */}
        <div className="relative z-10 px-10 py-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02] backdrop-blur-xl sticky top-0">
          <div className="flex items-center gap-5">
            <div className="p-4 rounded-2xl bg-primary/10 text-primary border border-primary/20">
              <Layout className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white leading-none mb-1">
                {isEdit ? "Update Surah" : "New Surah"}
              </h2>
              <p className="text-[10px] text-white/40 uppercase font-black tracking-widest">Digital Quran Registry</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-3 hover:bg-white/5 rounded-2xl transition-all text-white/40 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        <div className="relative z-10 p-10 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <CustomTextField
                label="Surah Index"
                value={surahIndex}
                onChange={(e) => setSurahIndex(e.target.value)}
                placeholder="e.g. 1"
                InputProps={{
                  startAdornment: <Hash className="w-4 h-4 mr-3 text-primary/50" />
                }}
              />
              <CustomTextField
                label="Arabic Name"
                value={surahName}
                onChange={(e) => setSurahName(e.target.value)}
                placeholder="Al-Fatihah"
                InputProps={{
                  startAdornment: <Type className="w-4 h-4 mr-3 text-primary/50" />
                }}
              />
            </div>
            <div className="space-y-6">
              <CustomTextField
                label="File Size (MB)"
                value={fileSize}
                onChange={(e) => setFileSize(e.target.value)}
                placeholder="e.g. 5.2"
                InputProps={{
                  startAdornment: <Hash className="w-4 h-4 mr-3 text-primary/50" />
                }}
              />
              <CustomTextField
                label="Verses Count"
                value={verses}
                onChange={(e) => setVerses(e.target.value)}
                placeholder="e.g. 7"
                InputProps={{
                  startAdornment: <List className="w-4 h-4 mr-3 text-primary/50" />
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <CustomTextField
              label="Luganda Name"
              value={lugandaName}
              onChange={(e) => setLugandaName(e.target.value)}
              placeholder="Fatiha"
            />
            <CustomTextField
              label="English Meaning"
              value={englishName}
              onChange={(e) => setEnglishName(e.target.value)}
              placeholder="The Opening"
            />
          </div>

          <CustomTextField
            label="Revelation City"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Makka / Madina"
            InputProps={{
              startAdornment: <MapPin className="w-4 h-4 mr-3 text-primary/50" />
            }}
          />

          {/* Audio Section */}
          <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 space-y-6">
            <div className="flex items-center gap-3 px-1">
              <FileAudio className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-black uppercase text-white/40 tracking-widest">Recitation Audio</span>
            </div>

            <input
              type="file"
              id="audio-upload"
              className="hidden"
              accept="audio/*"
              onChange={handleUpload}
            />

            {!audioURL && !uploading && (
              <label
                htmlFor="audio-upload"
                className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-white/10 rounded-[2rem] hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer group"
              >
                <div className="p-5 rounded-2xl bg-white/5 group-hover:bg-primary/10 transition-colors mb-4 border border-white/5 group-hover:border-primary/20">
                  <Upload className="w-8 h-8 text-white/40 group-hover:text-primary transition-colors" />
                </div>
                <span className="text-sm font-bold text-white/60 group-hover:text-white">Cloud Upload Recitation</span>
                <span className="text-[10px] text-white/20 mt-1 uppercase font-black">MP3 / WAV Files</span>
              </label>
            )}

            {uploading && (
              <div className="py-12 text-center space-y-6">
                <div className="relative inline-flex items-center justify-center">
                  <CircularProgress variant="determinate" value={uploadProgress} size={80} thickness={4} sx={{ color: '#10b981' }} />
                  <span className="absolute text-sm font-bold text-white">{uploadProgress}%</span>
                </div>
                <p className="text-[10px] text-white/40 font-black uppercase tracking-widest animate-pulse">Uploading to Storage...</p>
              </div>
            )}

            {audioURL && (
              <div className="p-6 bg-primary/5 rounded-[2rem] border border-primary/20 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="p-2 rounded-lg bg-primary/20 text-primary">
                      <FileAudio className="w-4 h-4" />
                    </div>
                    <span className="text-xs text-white/80 font-bold truncate leading-tight">{audioName || 'Recitation Ready'}</span>
                  </div>
                  <label htmlFor="audio-upload" className="text-[10px] text-primary font-black uppercase tracking-widest hover:underline cursor-pointer">Replace</label>
                </div>
                <audio controls className="w-full h-12 accent-primary custom-audio-player">
                  <source src={audioURL} type="audio/mpeg" />
                </audio>
              </div>
            )}

            <CustomTextField
              label="Manual URL Override (Optional)"
              value={audioURL}
              onChange={(e) => setAudioURL(e.target.value)}
              placeholder="https://..."
            />
          </div>

          <CustomTextField
            label="Context & Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={4}
            placeholder="Enter surah significance or history..."
          />

          <div className="flex gap-6 pt-6 sticky bottom-0 bg-[#0a0a0a]/80 backdrop-blur-md -m-10 p-10">
            <button
              onClick={handleClose}
              className="flex-1 px-8 py-5 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold text-sm transition-all"
            >
              Discard
            </button>
            <button
              onClick={handleSubmit}
              className="flex-[2] px-8 py-5 rounded-2xl bg-primary text-black font-black text-sm hover:opacity-90 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-2 uppercase tracking-widest"
            >
              <Save className="w-5 h-5" /> {isEdit ? "Update Registry" : "Commit to Library"}
            </button>
          </div>
        </div>
      </motion.div>
    </Modal>
  );
}

