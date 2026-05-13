import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

export const MySwal = withReactContent(Swal);

// Configuración base para Toasts
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  }
});

/**
 * Muestra una notificación rápida tipo Toast
 */
export const mostrarToast = (titulo: string, icon: 'success' | 'error' | 'warning' | 'info' = 'success') => {
  Toast.fire({
    icon,
    title: `<span class="font-black uppercase italic text-xs tracking-tighter">${titulo}</span>`,
    background: '#ffffff',
    color: '#1e293b',
    customClass: {
      popup: 'rounded-2xl shadow-2xl border border-gray-100'
    }
  });
};

/**
 * Alerta de pago finalizado para el cliente
 */
export const mostrarAlertaPago = (metodo: 'sinpe' | 'efectivo', nombre: string) => {
  if (metodo === 'efectivo') {
    return MySwal.fire({
      title: (
        <span className="font-black italic uppercase text-lingote-dark">
          ¡Oído Cocina, {nombre}!
        </span>
      ),
      html: (
        <p className="text-gray-500 font-medium italic">
          Tu pedido ha sido enviado. Recordá que empezaremos la preparación <br/> 
          <span className="text-lingote-red font-black uppercase">una vez que pagués en caja.</span>
        </p>
      ),
      icon: 'info',
      confirmButtonText: '¡ENTENDIDO, OLÉ!',
      confirmButtonColor: '#2b3674',
      customClass: {
        popup: 'rounded-[3rem]',
        confirmButton: 'rounded-2xl font-black italic px-8 py-4 shadow-xl'
      }
    });
  }

  return MySwal.fire({
    title: (
      <span className="font-black italic uppercase text-lingote-dark">
        ¡Excelente, {nombre}!
      </span>
    ),
    html: (
      <div className="space-y-4">
        <p className="text-gray-500 font-medium italic leading-tight">
          Tu pago por SINPE ha sido registrado en el sistema.
        </p>
        <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
          <p className="text-lingote-blue font-black uppercase text-[10px] tracking-widest mb-1 italic">⚠️ REQUISITO DE ENTREGA:</p>
          <p className="text-lingote-dark font-bold text-xs italic">
            Debés mostrar el comprobante de tu banco al retirar el pedido.
          </p>
        </div>
        <p className="text-lingote-blue font-black uppercase text-lg">
          ¡En 15 minutos retirá tu pedido <br/> en nuestro local! 🚀
        </p>
      </div>
    ),
    icon: 'success',
    confirmButtonText: '¡LISTO, VOY PARA ALLÁ!',
    confirmButtonColor: '#2b3674',
    customClass: {
      popup: 'rounded-[3rem]',
      confirmButton: 'rounded-2xl font-black italic px-8 py-4 shadow-xl'
    }
  });
};
