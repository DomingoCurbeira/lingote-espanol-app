import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface Props {
  src: string;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ImageViewer = ({ src, alt, isOpen, onClose }: Props) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose} // Cierra al tocar el fondo
          className="fixed inset-0 z-[200] bg-lingote-dark/90 backdrop-blur-xl flex items-center justify-center p-4 cursor-zoom-out"
        >
          {/* Botón Cerrar */}
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 p-3 rounded-full backdrop-blur-sm transition-colors"
          >
            <X size={24} />
          </button>

          {/* Imagen con animación de escala */}
          <motion.img
            initial={{ scale: 0.8, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 50, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            src={src}
            alt={alt}
            className="max-w-full max-h-[85vh] object-contain drop-shadow-2xl rounded-3xl"
            onClick={(e) => e.stopPropagation()} // Evita cerrar al tocar la imagen
          />
          
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
            className="absolute bottom-10 text-center text-white/80 font-black uppercase italic tracking-tighter text-2xl bg-black/30 px-6 py-2 rounded-xl backdrop-blur-sm"
          >
            {alt}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};