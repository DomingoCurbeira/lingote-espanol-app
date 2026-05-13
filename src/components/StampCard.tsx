import { motion } from 'framer-motion';
import { Sparkles, Check } from 'lucide-react';

interface Props {
  sellos: number;
}

export const StampCard = ({ sellos }: Props) => {
  const totalSellos = 10;
  
  return (
    <div className="bg-gradient-to-br from-lingote-dark to-gray-900 p-6 rounded-[2.5rem] shadow-2xl relative overflow-hidden border-2 border-lingote-gold/30">
      {/* Brillos decorativos */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-lingote-gold/10 blur-3xl rounded-full -mr-16 -mt-16" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-lingote-blue/10 blur-3xl rounded-full -ml-16 -mb-16" />

      <div className="relative z-10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h4 className="text-lingote-gold font-black uppercase italic tracking-tighter text-lg leading-none">Lingote Tarjeta</h4>
            <p className="text-[8px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-1">Fidelidad El Lingote Español</p>
          </div>
          <div className="bg-white/10 p-2 rounded-xl backdrop-blur-md border border-white/10">
            <Sparkles size={16} className="text-lingote-gold" />
          </div>
        </div>

        <div className="grid grid-cols-5 gap-3">
          {Array.from({ length: totalSellos }).map((_, i) => {
            const isStamped = i < sellos;
            const isLast = i === totalSellos - 1;

            return (
              <div 
                key={i} 
                className={`aspect-square rounded-2xl flex items-center justify-center relative transition-all duration-500 ${
                  isStamped 
                    ? 'bg-lingote-gold shadow-lg shadow-lingote-gold/20 rotate-3 scale-105' 
                    : 'bg-white/5 border-2 border-dashed border-white/10'
                }`}
              >
                {isStamped ? (
                  <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="text-lingote-dark font-black"
                  >
                    {isLast ? <Sparkles size={18} /> : <Check size={18} strokeWidth={4} />}
                  </motion.div>
                ) : (
                  <span className="text-[10px] font-black text-white/10 italic">{i + 1}</span>
                )}

                {isLast && !isStamped && (
                  <div className="absolute -top-1 -right-1">
                    <div className="bg-lingote-red text-white text-[6px] font-black px-1.5 py-0.5 rounded-full uppercase animate-bounce">
                      Free
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-6 border-t border-white/5">
          <p className="text-[9px] text-gray-400 font-medium italic text-center leading-relaxed">
            {sellos === 9 
              ? "¡TU PRÓXIMO LINGOTE ES GRATIS! 🎉" 
              : `Completá 10 sellos y llevate un Lingote Clásico de regalía. Te faltan ${10 - sellos} sellos.`}
          </p>
        </div>
      </div>
    </div>
  );
};
