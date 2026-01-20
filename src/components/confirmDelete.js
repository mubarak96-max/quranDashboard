import * as React from 'react';
import Modal from '@mui/material/Modal';
import { motion, AnimatePresence } from 'framer-motion';
import { OctagonAlert, Trash2, X } from 'lucide-react';

export default function ConfirmDeleteModal({
  openConfirmDeleteModal,
  closeConfirmDeleteModal,
  confirmDelete
}) {
  return (
    <Modal
      open={openConfirmDeleteModal}
      onClose={closeConfirmDeleteModal}
      className="flex items-center justify-center p-4 outline-none"
    >
      <AnimatePresence>
        {openConfirmDeleteModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-sm bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 blur-[50px] rounded-full -mr-16 -mt-16 pointer-events-none" />

            <div className="flex justify-center mb-8 relative z-10">
              <div className="p-5 rounded-3xl bg-red-500/10 text-red-500 border border-red-500/20 shadow-lg shadow-red-500/5">
                <OctagonAlert className="w-10 h-10" />
              </div>
            </div>

            <div className="text-center relative z-10 mb-10">
              <h2 className="text-2xl font-black text-white mb-3">Dangerous Action</h2>
              <p className="text-sm text-white/40 leading-relaxed font-medium">
                This record will be permanently purged from the database. This operation is <span className="text-red-500 font-bold">irreversible</span>.
              </p>
            </div>

            <div className="flex flex-col gap-3 relative z-10">
              <button
                onClick={confirmDelete}
                className="w-full py-4 rounded-2xl bg-red-600 text-white font-black text-sm hover:bg-red-700 hover:shadow-[0_0_20px_rgba(220,38,38,0.3)] transition-all flex items-center justify-center gap-2 uppercase tracking-widest"
              >
                <Trash2 className="w-4 h-4" /> Purge Permanently
              </button>
              <button
                onClick={closeConfirmDeleteModal}
                className="w-full py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold text-sm transition-all"
              >
                Abort & Keep
              </button>
            </div>

            <button
              onClick={closeConfirmDeleteModal}
              className="absolute top-6 right-6 p-2 text-white/20 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  );
}

