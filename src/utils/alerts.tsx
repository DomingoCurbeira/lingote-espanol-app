import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

// src/utils/alerts.tsx

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
        confirmButton: 'rounded-2xl font-black italic px-8 py-4'
      }
    });
  }

  // NUEVO: Alerta para SINPE personalizada
  return MySwal.fire({
    title: (
      <span className="font-black italic uppercase text-lingote-dark">
        ¡Excelente, {nombre}!
      </span>
    ),
    html: (
      <p className="text-gray-500 font-medium italic">
        Tu pago por SINPE ha sido registrado. <br/> 
        <span className="text-lingote-blue font-black uppercase text-lg">
          ¡En 15 minutos retirá tu pedido <br/> en nuestro local! 🚀
        </span>
      </p>
    ),
    icon: 'success',
    confirmButtonText: '¡LISTO, VOY PARA ALLÁ!',
    confirmButtonColor: '#2b3674',
    customClass: {
      popup: 'rounded-[3rem]',
      confirmButton: 'rounded-2xl font-black italic px-8 py-4'
    }
  });
};