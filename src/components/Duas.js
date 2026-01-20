import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, deleteDoc, doc, getDocs, orderBy, query } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus,
    Home as HomeIcon,
    Trash2,
    Edit3,
    Search,
    ChevronUp,
    Heart
} from "lucide-react";
import Swal from "sweetalert2";
import { db } from "../firebase";
import DuaModal from "./DuaModal";
import ConfirmDeleteModal from "./confirmDelete";
import { cn } from "../utils/cn";

const DuaCard = ({ dua, index, onEdit, onDelete, className }) => (
    <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={cn(
            "glass rounded-[2rem] p-10 relative overflow-hidden group border border-white/5 hover:border-red-500/30 transition-all duration-500 flex flex-col justify-between min-h-[300px]",
            className
        )}
    >
        <div className="absolute -top-10 -right-10 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-700 pointer-events-none">
            <Heart className="w-40 h-40 text-red-500" />
        </div>

        <div className="relative z-10">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 font-black border border-red-500/20">
                    {index + 1}
                </div>
                <div className="h-[1px] flex-1 bg-white/5" />
                <div className="flex gap-2 transition-all duration-300">
                    <button
                        onClick={() => onEdit(dua)}
                        className="p-3 rounded-xl bg-white/5 hover:bg-red-500/20 text-white hover:text-red-500 transition-all"
                    >
                        <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onDelete(dua.id)}
                        className="p-3 rounded-xl bg-red-500/5 hover:bg-red-500/20 text-red-500 transition-all"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <h3 className="text-2xl font-black text-white mb-4 group-hover:text-red-500 transition-colors">
                {dua.data.title}
            </h3>

            <p className="text-xl font-medium text-white/90 leading-relaxed mb-6 line-clamp-3 text-right" dir="rtl">
                {dua.data.content}
            </p>
        </div>

        <div className="relative z-10 mt-auto pt-8 border-t border-white/5">
            <p className="text-[10px] text-white/40 uppercase font-black tracking-widest mb-2">Translation</p>
            <p className="text-sm text-white/60 line-clamp-2 leading-relaxed italic">
                "{dua.data.translation}"
            </p>
        </div>
    </motion.div>
);

const Duas = () => {
    const [duas, setDuas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState("");
    const [deleteId, setDeleteId] = useState("");
    const [openConfirmDeleteModal, setOpenConfirmDeleteModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    const getData = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, "duas"), orderBy("updatedAt", "desc"));
            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map(doc => ({ id: doc.id, data: doc.data() }));
            setDuas(data);
        } catch (error) {
            console.error("Error fetching duas:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    const confirmDelete = async () => {
        try {
            await deleteDoc(doc(db, "duas", deleteId));
            setOpenConfirmDeleteModal(false);
            Swal.fire({
                icon: "success",
                title: "Deleted",
                text: "Supplication has been removed.",
                background: "#171717",
                color: "#fff"
            });
            getData();
        } catch (error) {
            console.error(error);
        }
    };

    const filteredDuas = duas.filter(d =>
        d.data.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.data.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#050505] p-6 lg:p-12">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16 px-4">
                    <div className="space-y-3">
                        <div className="flex items-center gap-4 text-red-500">
                            <button onClick={() => navigate('/')} className="p-2.5 hover:bg-red-500/10 rounded-2xl transition-all border border-transparent hover:border-red-500/20">
                                <HomeIcon size={20} />
                            </button>
                            <div className="w-[1px] h-4 bg-white/10" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Supplications</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none">
                            Explore <span className="text-red-500 italic">Duas</span>
                        </h1>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative group">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-red-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search duas..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full sm:w-80 bg-white/[0.03] border border-white/5 rounded-3xl py-5 pl-14 pr-8 text-white placeholder:text-white/20 focus:outline-none focus:border-red-500/50 focus:bg-white/[0.05] transition-all backdrop-blur-3xl"
                            />
                        </div>
                        <button
                            onClick={() => {
                                setIsEdit(false);
                                setOpenModal(true);
                            }}
                            className="px-8 py-5 bg-red-600 text-white font-black rounded-3xl transition-all flex items-center justify-center gap-3 shadow-[0_20px_40px_-15px_rgba(239,68,68,0.3)] uppercase tracking-widest text-[10px] hover:scale-105"
                        >
                            <Plus size={20} strokeWidth={3} /> Add Dua
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40 space-y-6">
                        <div className="w-16 h-16 border-[6px] border-red-500/10 border-t-red-500 rounded-full animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 auto-rows-fr">
                        <AnimatePresence mode="popLayout">
                            {filteredDuas.map((dua, index) => {
                                const isLarge = index % 3 === 0;
                                return (
                                    <DuaCard
                                        key={dua.id}
                                        dua={dua}
                                        index={index}
                                        onEdit={(d) => {
                                            setEditId(d.id);
                                            setIsEdit(true);
                                            setOpenModal(true);
                                        }}
                                        onDelete={(id) => {
                                            setDeleteId(id);
                                            setOpenConfirmDeleteModal(true);
                                        }}
                                        className={cn(
                                            isLarge ? "md:col-span-8" : "md:col-span-4"
                                        )}
                                    />
                                );
                            })}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="fixed bottom-12 right-12 p-5 bg-red-600 text-white rounded-[2rem] shadow-2xl hover:scale-110 active:scale-90 transition-all z-50 shadow-red-500/30"
            >
                <ChevronUp size={28} strokeWidth={3} />
            </button>

            <DuaModal
                openModal={openModal}
                handleClose={() => setOpenModal(false)}
                isEdit={isEdit}
                editId={editId}
                setLoading={(val) => {
                    if (!val) getData();
                }}
            />

            <ConfirmDeleteModal
                openConfirmDeleteModal={openConfirmDeleteModal}
                closeConfirmDeleteModal={() => setOpenConfirmDeleteModal(false)}
                confirmDelete={confirmDelete}
            />
        </div>
    );
};

export default Duas;
