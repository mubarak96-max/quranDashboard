import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query
} from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Home as HomeIcon,
  Trash2,
  Edit3,
  Search,
  ChevronUp,
  BookOpen,
  Music as MusicIcon,
  Layers,
  FileText
} from "lucide-react";
import Swal from "sweetalert2";
import { db } from "../firebase";
import AddSurahModal from "./AddSurahModal";
import ConfirmDeleteModal from "./confirmDelete";
import { cn } from "../utils/cn";

const SurahCard = ({ surah, onEdit, onDelete }) => {
  const [showMore, setShowMore] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="glass rounded-3xl p-6 relative overflow-hidden group border border-white/5 hover:border-primary/30 transition-all duration-300"
    >
      <div className="absolute top-0 right-0 p-4">
        <span className="text-4xl font-black text-white/5 italic">#{surah.data.surahIndex}</span>
      </div>

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold text-white leading-tight mb-1">{surah.data.surahName}</h3>
            <p className="text-primary font-medium text-sm">{surah.data.lugandaName}</p>
          </div>
          <div className="flex gap-2 transition-all duration-300">
            <button
              onClick={() => onEdit(surah)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(surah.id)}
              className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">English Name</p>
            <p className="text-sm font-medium text-white">{surah.data.englishName}</p>
          </div>
          <div className="space-y-1 text-right">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Location</p>
            <p className="text-sm font-medium text-white">{surah.data.location}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Verses</p>
            <div className="flex items-center gap-1.5 text-sm font-medium text-white">
              <Layers className="w-3.5 h-3.5 text-primary" />
              {surah.data.verses}
            </div>
          </div>
          <div className="space-y-1 text-right">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Size</p>
            <p className="text-sm font-medium text-white">{surah.data.fileSize} MB</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider mb-2">
            <FileText className="w-3.5 h-3.5" /> Description
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {showMore ? surah.data.description : `${surah.data.description?.slice(0, 100)}...`}
          </p>
          {surah.data.description?.length > 100 && (
            <button
              onClick={() => setShowMore(!showMore)}
              className="text-primary text-xs font-bold hover:underline"
            >
              {showMore ? "Show Less" : "Read More"}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const Surah = () => {
  const [surahs, setSurahs] = useState([]);
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
      const surahsRef = collection(db, "surah");
      const q = query(surahsRef, orderBy("surahIndex", "asc"));
      const querySnapshot = await getDocs(q);
      const surahsArr = querySnapshot.docs.map(doc => ({ id: doc.id, data: doc.data() }));
      setSurahs(surahsArr);
    } catch (error) {
      console.error("Error fetching surahs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleDelete = (id) => {
    setDeleteId(id);
    setOpenConfirmDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteDoc(doc(db, "surah", deleteId));
      setOpenConfirmDeleteModal(false);
      getData();
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "The surah has been removed successfully.",
        background: "#171717",
        color: "#fff",
        confirmButtonColor: "#10b981"
      });
    } catch (error) {
      console.error("Error deleting surah:", error);
    }
  };

  const filteredSurahs = surahs.filter(s =>
    s.data.surahName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.data.englishName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Search & Actions Header */}
      <div className="sticky top-0 z-40 glass border-x-0 border-t-0 border-white/5 px-6 py-4 mb-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <button
              onClick={() => navigate('/')}
              className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors"
            >
              <HomeIcon className="w-5 h-5 text-white" />
            </button>
            <h1 className="text-xl font-bold text-white hidden sm:block">Surah Directory</h1>
          </div>

          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          <button
            onClick={() => {
              setIsEdit(false);
              setOpenModal(true);
            }}
            className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-primary text-black font-bold rounded-2xl hover:opacity-90 transition-opacity"
          >
            <Plus className="w-5 h-5" /> Add New Surah
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredSurahs.map((surah) => (
                <SurahCard
                  key={surah.id}
                  surah={surah}
                  onEdit={(s) => {
                    setEditId(s.id);
                    setIsEdit(true);
                    setOpenModal(true);
                  }}
                  onDelete={handleDelete}
                />
              ))}
            </AnimatePresence>
          </div>
        )}

        {!loading && filteredSurahs.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold text-white">No surahs found</h3>
            <p className="text-muted-foreground">Try adjusting your search or add a new surah.</p>
          </div>
        )}
      </div>

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 p-4 rounded-2xl bg-primary text-black shadow-2xl hover:scale-110 transition-transform z-50"
      >
        <ChevronUp className="w-6 h-6" />
      </button>

      <AddSurahModal
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

export default Surah;

