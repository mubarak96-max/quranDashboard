import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Home as HomeIcon,
  Trash2,
  Edit3,
  Search,
  ChevronUp,
  Quote as QuoteIcon,
  MessageSquareQuote
} from "lucide-react";
import Swal from "sweetalert2";
import { db } from "../firebase";
import AddQuoteModal from "./addQuoteModal";
import ConfirmDeleteModal from "./confirmDelete";
import { cn } from "../utils/cn";

const QuoteCard = ({ quote, index, onEdit, onDelete, className }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.95 }}
    className={cn(
      "glass rounded-[2rem] p-10 relative overflow-hidden group border border-white/5 hover:border-blue-500/30 transition-all duration-500 flex flex-col justify-between min-h-[300px]",
      className
    )}
  >
    <div className="absolute -top-10 -right-10 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-700 pointer-events-none">
      <QuoteIcon className="w-40 h-40 text-blue-500" />
    </div>

    <div className="relative z-10">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 font-black border border-blue-500/20">
          {index + 1}
        </div>
        <div className="h-[1px] flex-1 bg-white/5" />
        <div className="flex gap-2 transition-all duration-300">
          <button
            onClick={() => onEdit(quote)}
            className="p-3 rounded-xl bg-white/5 hover:bg-blue-500/20 text-white hover:text-blue-500 transition-all"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(quote.id)}
            className="p-3 rounded-xl bg-red-500/5 hover:bg-red-500/20 text-red-500 transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <p className="text-2xl font-bold text-white leading-relaxed italic mb-10 group-hover:text-blue-100 transition-colors duration-300">
        "{quote.data.quote}"
      </p>
    </div>

    <div className="relative z-10 mt-auto pt-8 border-t border-white/5 flex items-center justify-between">
      <div>
        <p className="text-[10px] text-white/40 uppercase font-black tracking-widest mb-1">Speaker / Author</p>
        <p className="text-lg font-bold text-blue-500">{quote.data.author}</p>
      </div>
      <div className="w-10 h-10 rounded-full bg-blue-500/5 flex items-center justify-center border border-blue-500/10">
        <MessageSquareQuote className="w-5 h-5 text-blue-500/50" />
      </div>
    </div>
  </motion.div>
);

const Quotes = () => {
  const [quotes, setQuotes] = useState([]);
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
      const quotesRef = collection(db, "quotes");
      const querySnapshot = await getDocs(quotesRef);
      const quotesArr = querySnapshot.docs.map(doc => ({ id: doc.id, data: doc.data() }));
      setQuotes(quotesArr);
    } catch (error) {
      console.error("Error fetching quotes:", error);
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
      await deleteDoc(doc(db, "quotes", deleteId));
      setOpenConfirmDeleteModal(false);
      getData();
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "The quote has been removed.",
        background: "#171717",
        color: "#fff",
        confirmButtonColor: "#3b82f6"
      });
    } catch (error) {
      console.error("Error deleting quote:", error);
    }
  };

  const filteredQuotes = quotes.filter(q =>
    q.data.quote.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.data.author.toLowerCase().includes(searchTerm.toLowerCase())
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
            <h1 className="text-xl font-bold text-white hidden sm:block">Quotes Management</h1>
          </div>

          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search quotes or authors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
            />
          </div>

          <button
            onClick={() => {
              setIsEdit(false);
              setOpenModal(true);
            }}
            className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" /> Add New Quote
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 auto-rows-fr">
            <AnimatePresence>
              {filteredQuotes.map((quote, index) => {
                const isLarge = index % 3 === 0;
                return (
                  <QuoteCard
                    key={quote.id}
                    quote={quote}
                    index={index}
                    onEdit={(q) => {
                      setEditId(q.id);
                      setIsEdit(true);
                      setOpenModal(true);
                    }}
                    onDelete={handleDelete}
                    className={cn(
                      isLarge ? "md:col-span-8" : "md:col-span-4"
                    )}
                  />
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {!loading && filteredQuotes.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquareQuote className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold text-white">No quotes found</h3>
            <p className="text-muted-foreground">Try a different search term or add a new quote.</p>
          </div>
        )}
      </div>

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 p-4 rounded-2xl bg-blue-600 text-white shadow-2xl hover:scale-110 transition-transform z-50"
      >
        <ChevronUp className="w-6 h-6" />
      </button>

      <AddQuoteModal
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

export default Quotes;

