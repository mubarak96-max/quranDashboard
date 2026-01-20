import React, { useEffect, useState } from "react";
import Modal from "@mui/material/Modal";
import { TextField } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  updateDoc
} from "firebase/firestore";
import { db } from "../firebase";
import { X, Save, Quote, User } from 'lucide-react';
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

export default function AddQuoteModal({
  openModal,
  handleClose,
  isEdit,
  editId,
  setLoading
}) {
  const [author, setAuthor] = useState("");
  const [quote, setQuote] = useState("");

  useEffect(() => {
    if (isEdit && editId) {
      const quotesDocRef = doc(db, "quotes", editId);
      getDoc(quotesDocRef)
        .then((doc) => {
          if (doc.exists()) {
            const data = doc.data();
            setAuthor(data?.author || "");
            setQuote(data?.quote || "");
          }
        })
        .catch((error) => console.log(error));
    } else {
      setAuthor("");
      setQuote("");
    }
  }, [editId, isEdit, openModal]);

  const handleSubmit = async () => {
    if (!author || !quote) {
      Swal.fire({
        icon: "error",
        title: "Required Fields",
        text: "Both author and quote content are required.",
        background: "#171717",
        color: "#fff"
      });
      return;
    }

    try {
      const data = { author, quote };

      if (isEdit) {
        await updateDoc(doc(db, "quotes", editId), data);
      } else {
        await addDoc(collection(db, "quotes"), data);
      }

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: `Quote ${isEdit ? "updated" : "added"} successfully.`,
        background: "#171717",
        color: "#fff",
        confirmButtonColor: "#10b981"
      });

      if (setLoading) setLoading(false);
      handleClose();
    } catch (error) {
      console.error(error);
      Swal.fire({ icon: "error", title: "Error", text: error.message, background: "#171717", color: "#fff" });
    }
  };

  return (
    <Modal open={openModal} onClose={handleClose} className="flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl relative"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/5 blur-[80px] rounded-full -mr-32 -mt-32 pointer-events-none" />

        {/* Header */}
        <div className="relative z-10 px-8 py-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02] backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              <Quote className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white leading-none mb-1">
                {isEdit ? "Edit Quote" : "Add Wisdom"}
              </h2>
              <p className="text-[10px] text-white/40 uppercase font-black tracking-widest">Inspirations Registry</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2.5 hover:bg-white/5 rounded-xl transition-all text-white/40 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <div className="relative z-10 p-8 space-y-8">
          <div className="space-y-6">
            <CustomTextField
              label="Author / Prophet / Scholar"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="e.g. Imam Shafi'i"
              InputProps={{
                startAdornment: <User className="w-4 h-4 mr-3 text-emerald-500/50" />
              }}
            />

            <CustomTextField
              label="Verse or Quote Content"
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              multiline
              rows={5}
              placeholder="Enter the inspirational words..."
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              onClick={handleClose}
              className="flex-1 px-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold text-sm transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-[1.5] px-6 py-4 rounded-2xl bg-emerald-600 text-white font-black text-sm hover:bg-emerald-700 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-2 uppercase tracking-widest"
            >
              <Save className="w-4 h-4" /> {isEdit ? "Update Changes" : "Save Inspiration"}
            </button>
          </div>
        </div>
      </motion.div>
    </Modal>
  );
}

