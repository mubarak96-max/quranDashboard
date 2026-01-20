import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query
} from 'firebase/firestore';
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Home as HomeIcon,
  Trash2,
  Edit3,
  Search,
  ChevronUp,
  Music,
  User as UserIcon,
  PlayCircle,
  Clock
} from "lucide-react";
import Swal from 'sweetalert2';
import { db } from '../firebase';
import AudioModal from './AudioModal';
import { cn } from "../utils/cn";

const AudioCard = ({ audio, onEdit, onDelete, className }) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    className={cn(
      "glass rounded-[2rem] p-8 border border-white/5 hover:border-orange-500/30 transition-all duration-500 group relative overflow-hidden flex flex-col justify-between min-h-[280px]",
      className
    )}
  >
    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 blur-[50px] rounded-full -mr-16 -mt-16 group-hover:bg-orange-500/10 transition-colors duration-500" />

    <div>
      <div className="flex items-start justify-between mb-8">
        <div className="p-4 rounded-2xl bg-orange-500/10 text-orange-500 group-hover:scale-110 transition-transform duration-500">
          <Music className="w-6 h-6" />
        </div>
        <div className="flex gap-2 transition-all duration-300">
          <button
            onClick={() => onEdit(audio.id)}
            className="p-3 rounded-xl bg-white/5 hover:bg-orange-500/20 text-white hover:text-orange-500 transition-all"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(audio.id)}
            className="p-3 rounded-xl bg-red-500/5 hover:bg-red-500/20 text-red-500 transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-white group-hover:text-orange-500 transition-colors duration-300 line-clamp-2 leading-tight">
          {audio.data.title}
        </h3>
        <div className="flex items-center gap-3 text-white/60">
          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
            <UserIcon className="w-4 h-4" />
          </div>
          <span className="font-medium">{audio.data.teacher}</span>
        </div>
      </div>
    </div>

    <div className="mt-8 pt-6 border-t border-white/5">
      <div className="flex items-center gap-4 mb-4 text-xs font-semibold uppercase tracking-wider text-white/40">
        <PlayCircle className="w-4 h-4" />
        <span>Quick Play</span>
      </div>
      <audio controls className="w-full h-10 accent-orange-500 custom-audio-player">
        <source src={audio.data.audioUrl} type="audio/mpeg" />
      </audio>
    </div>
  </motion.div>
);

const Audios = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState('');
  const [promotions, setPromotions] = useState([]);
  const [showLoader, setShowLoader] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const getPromotions = async () => {
    try {
      setShowLoader(true);
      const promsRef = collection(db, 'Audios');
      const q = query(promsRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const arr = querySnapshot.docs.map(doc => ({ id: doc.id, data: doc.data() }));
      setPromotions(arr);
    } catch (error) {
      console.error('Error fetching audios:', error);
    } finally {
      setShowLoader(false);
    }
  };

  useEffect(() => {
    getPromotions();
  }, [loading]);

  const editVideo = (id) => {
    setOpenModal(true);
    setEditId(id);
    setIsEdit(true);
  };

  const deleteVideo = async (iDToDelete) => {
    Swal.fire({
      title: 'Delete Audio?',
      text: "This action cannot be undone.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f97316',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Yes, delete it!',
      background: '#171717',
      color: '#fff'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteDoc(doc(db, 'Audios', iDToDelete));
        setLoading(!loading);
        Swal.fire({
          title: 'Deleted!',
          text: 'Audio has been removed.',
          icon: 'success',
          background: '#171717',
          color: '#fff'
        });
      }
    });
  };

  const filteredAudios = promotions.filter(a =>
    a.data.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.data.teacher?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <div className="sticky top-0 z-40 glass border-x-0 border-t-0 border-white/5 px-6 py-4 mb-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <button
              onClick={() => navigate('/')}
              className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors"
            >
              <HomeIcon className="w-5 h-5 text-white" />
            </button>
            <h1 className="text-xl font-bold text-white hidden sm:block">Audio Recitations</h1>
          </div>

          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by title or sheikh..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-orange-500/50 transition-colors"
            />
          </div>

          <button
            onClick={() => {
              setOpenModal(true);
              setIsEdit(false);
              setEditId('');
            }}
            className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-orange-600 text-white font-bold rounded-2xl hover:bg-orange-700 transition-colors"
          >
            <Plus className="w-5 h-5" /> Add Audio
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {showLoader ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-fr">
            <AnimatePresence>
              {filteredAudios.map((audio, index) => {
                const isLarge = index % 5 === 0;
                return (
                  <AudioCard
                    key={audio.id}
                    audio={audio}
                    onEdit={editVideo}
                    onDelete={deleteVideo}
                    className={cn(
                      isLarge ? "md:col-span-8" : "md:col-span-4"
                    )}
                  />
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {!showLoader && filteredAudios.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <PlayCircle className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold text-white">No audios found</h3>
            <p className="text-muted-foreground">Try a different search term or add a new recitation.</p>
          </div>
        )}
      </div>

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 p-4 rounded-2xl bg-orange-600 text-white shadow-2xl hover:scale-110 transition-transform z-50"
      >
        <ChevronUp className="w-6 h-6" />
      </button>

      <AudioModal
        openModal={openModal}
        closeModal={() => setOpenModal(false)}
        isEdit={isEdit}
        editId={editId}
        setLoading={(val) => setLoading(val)}
      />
    </div>
  );
};

export default Audios;

