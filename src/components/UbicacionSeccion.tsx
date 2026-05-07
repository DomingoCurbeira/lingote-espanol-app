import { motion } from 'framer-motion';
import { MapPin, Clock, Navigation, Info } from 'lucide-react';

export const UbicacionSeccion = () => {
  return (
    <section className="py-12 px-6 space-y-8 bg-white/50 backdrop-blur-sm rounded-[3rem] border border-white shadow-xl max-w-4xl mx-auto my-12">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 bg-lingote-gold/10 px-4 py-1 rounded-full text-lingote-dark border border-lingote-gold/20 mb-2">
          <MapPin size={14} className="text-lingote-red" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Donde encontrarnos</span>
        </div>
        <h2 className="text-4xl font-black text-lingote-dark uppercase italic tracking-tighter leading-none">
          Próximamente en <br/>
          <span className="text-lingote-blue">Cartago, Costa Rica</span>
        </h2>
        <p className="text-gray-500 text-sm italic font-medium max-w-md mx-auto">
          Estamos afinando los detalles para traerte el sabor auténtico de España al corazón de la vieja metrópoli.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Placeholder de Mapa Elegante */}
        <div className="relative aspect-square rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white group">
          <div className="absolute inset-0 bg-gray-100 flex flex-col items-center justify-center p-8 text-center space-y-4">
             {/* Un diseño de mapa estilizado con CSS */}
             <div className="w-full h-full absolute inset-0 opacity-10 grayscale">
                <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d="M0,20 L100,20 M0,50 L100,50 M0,80 L100,80 M20,0 L20,100 M50,0 L50,100 M80,0 L80,100" stroke="black" strokeWidth="0.5" fill="none" />
                </svg>
             </div>
             <motion.div 
               animate={{ y: [0, -10, 0] }}
               transition={{ repeat: Infinity, duration: 2 }}
               className="bg-lingote-red p-4 rounded-full shadow-xl shadow-lingote-red/40 z-10"
             >
                <MapPin size={48} className="text-white" />
             </motion.div>
             <div className="z-10">
                <h4 className="font-black italic uppercase text-lingote-dark tracking-tighter">Buscando el local ideal</h4>
                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-1">🚧 Obra en progreso</p>
             </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-lingote-dark/20 to-transparent pointer-events-none" />
        </div>

        {/* Info de Recogida */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-start gap-4">
             <div className="bg-lingote-blue/10 p-3 rounded-2xl text-lingote-blue">
                <Navigation size={24} />
             </div>
             <div>
                <h4 className="font-black uppercase italic text-sm text-lingote-dark tracking-tight">Punto de Recogida</h4>
                <p className="text-xs text-gray-500 font-medium italic mt-1">
                  Por ahora, trabajamos bajo la modalidad de **Take Away**. Una vez realices tu pedido por WhatsApp, te indicaremos el punto exacto de entrega en Cartago centro.
                </p>
             </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-start gap-4">
             <div className="bg-lingote-gold/10 p-3 rounded-2xl text-lingote-gold">
                <Clock size={24} />
             </div>
             <div>
                <h4 className="font-black uppercase italic text-sm text-lingote-dark tracking-tight">Horario de Entrega</h4>
                <p className="text-xs text-gray-500 font-medium italic mt-1">
                  Lunes a Sábado <br/>
                  <span className="text-lingote-blue font-bold">8:00 AM — 4:00 PM</span>
                </p>
             </div>
          </div>

          <div className="bg-lingote-dark p-6 rounded-3xl shadow-xl flex items-start gap-4 text-white">
             <div className="bg-white/10 p-3 rounded-2xl">
                <Info size={24} />
             </div>
             <div>
                <h4 className="font-black uppercase italic text-sm tracking-tight">Dato Importante</h4>
                <p className="text-[11px] text-white/70 font-medium italic mt-1">
                  Todos nuestros lingotes se preparan al momento para garantizar la jugosidad de la tortilla. Te recomendamos pedir con al menos 20 minutos de antelación.
                </p>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};
