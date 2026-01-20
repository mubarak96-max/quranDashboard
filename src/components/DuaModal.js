import React, { useEffect, useState } from "react";
import Modal from "@mui/material/Modal";
import { TextField } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import {
    addDoc,
    collection,
    doc,
    getDoc,
    updateDoc,
    serverTimestamp
} from "firebase/firestore";
import { db } from "../firebase";
import { X, Save, Heart, Bookmark } from 'lucide-react';
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
                "&:hover fieldset": { borderColor: "rgba(239, 68, 68, 0.5)" },
                "&.Mui-focused fieldset": { borderColor: "#ef4444" },
            },
            "& .MuiInputLabel-root": { color: "#71717a" },
            "& .MuiInputLabel-root.Mui-focused": { color: "#ef4444" },
            ...props.sx
        }}
    />
);

export default function DuaModal({
    openModal,
    handleClose,
    isEdit,
    editId,
    setLoading
}) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [translation, setTranslation] = useState("");

    useEffect(() => {
        if (isEdit && editId) {
            const duaDocRef = doc(db, "duas", editId);
            getDoc(duaDocRef)
                .then((doc) => {
                    if (doc.exists()) {
                        const data = doc.data();
                        setTitle(data?.title || "");
                        setContent(data?.content || "");
                        setTranslation(data?.translation || "");
                    }
                })
                .catch((error) => console.log(error));
        } else {
            setTitle("");
            setContent("");
            setTranslation("");
        }
    }, [editId, isEdit, openModal]);

    const handleSubmit = async () => {
        if (!title || !content) {
            Swal.fire({
                icon: "error",
                title: "Required Fields",
                text: "Title and Dua content are required.",
                background: "#171717",
                color: "#fff"
            });
            return;
        }

        try {
            const data = {
                title,
                content,
                translation,
                updatedAt: serverTimestamp()
            };

            if (!isEdit) {
                data.createdAt = serverTimestamp();
                await addDoc(collection(db, "duas"), data);
            } else {
                await updateDoc(doc(db, "duas", editId), data);
            }

            Swal.fire({
                icon: "success",
                title: "Success!",
                text: `Dua ${isEdit ? "updated" : "added"} successfully.`,
                background: "#171717",
                color: "#fff",
                confirmButtonColor: "#ef4444"
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
                className="w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl relative"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 blur-[80px] rounded-full -mr-32 -mt-32 pointer-events-none" />

                {/* Header */}
                <div className="relative z-10 px-8 py-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02] backdrop-blur-xl">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-red-500/10 text-red-500 border border-red-500/20">
                            <Heart className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white leading-none mb-1">
                                {isEdit ? "Edit Dua" : "New Supplication"}
                            </h2>
                            <p className="text-[10px] text-white/40 uppercase font-black tracking-widest">Dua Registry</p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2.5 hover:bg-white/5 rounded-xl transition-all text-white/40 hover:text-white"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="relative z-10 p-8 space-y-6">
                    <CustomTextField
                        label="Dua Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Dua for Protection"
                        InputProps={{
                            startAdornment: <Bookmark className="w-4 h-4 mr-3 text-red-500/50" />
                        }}
                    />

                    <CustomTextField
                        label="Arabic Content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        multiline
                        rows={4}
                        placeholder="Enter the Arabic text..."
                        sx={{ "& .MuiInputBase-input": { direction: 'rtl', fontFamily: 'initial' } }}
                    />

                    <CustomTextField
                        label="Translation / Meaning"
                        value={translation}
                        onChange={(e) => setTranslation(e.target.value)}
                        multiline
                        rows={3}
                        placeholder="Enter the translation..."
                    />

                    <div className="flex gap-4 pt-4">
                        <button
                            onClick={handleClose}
                            className="flex-1 px-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold text-sm transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="flex-[1.5] px-6 py-4 rounded-2xl bg-red-600 text-white font-black text-sm hover:bg-red-700 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)] transition-all flex items-center justify-center gap-2 uppercase tracking-widest"
                        >
                            <Save className="w-4 h-4" /> {isEdit ? "Update Dua" : "Save Dua"}
                        </button>
                    </div>
                </div>
            </motion.div>
        </Modal>
    );
}
