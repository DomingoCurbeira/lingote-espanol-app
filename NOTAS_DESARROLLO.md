# Bitácora de Desarrollo - El Lingote Español 🧠🥔

Este documento detalla las funcionalidades implementadas y la arquitectura técnica del ecosistema digital de "El Lingote Español", actualizado al **12 de mayo de 2026**.

## 📋 Resumen del Ecosistema
- **Core:** Aplicación PWA (Progressive Web App) para pedidos rápidos y gestión de marca.
- **Admin:** Panel de Control "Cerebro Real" para el operador único.
- **Tecnología:** React 19, TypeScript, Tailwind CSS 4, Zustand (Persistencia), Lucide Icons, Framer Motion.

---

## 🚀 Funcionalidades para el Cliente

### 1. Menú de Autor Simplificado
- **Enfoque Operativo:** Se eliminó la personalización compleja ("Armá tu Lingote") para garantizar despachos en <1 min.
- **Productos Estrella:** 4 Lingotes fijos (Clásico, Tico, Patrón, Supremo) y el **Bocata Real** (Tortilla en pan artesanal de El Molino).
- **Venta Sugerida:** Flujo de carrito optimizado para incentivar la compra de salsas artesanales adicionales.

### 2. Fidelización Digital (Tarjeta de Sellos)
- **Sistema Real:** Tarjeta virtual de 10 sellos integrada.
- **Mecánica:** 1 Lingote = 1 Sello. El 10º Lingote Clásico es gratis.
- **Persistencia:** Los sellos se guardan localmente en el dispositivo del cliente.

### 3. UX Móvil Premium
- **Header Inteligente:** Indicador de estado (Abierto/Cerrado) basado en horarios de San Rafael de Oreamuno.
- **Navegación Ultra-Slim:** Selector de categorías minimalista optimizado para uso con una sola mano.
- **Feedback Visual:** Notificaciones tipo Toast (SweetAlert2) y sellos de "Agotado" en rojo vibrante con bloqueo de interacción.

---

## ⚙️ Panel "Cerebro Real" (Administración)

Acceso privado protegido por PIN de 6 dígitos.

### 1. Caja Registradora y Verificación (Actualizado)
- **POS Rápido:** Interfaz optimizada para ventas de mostrador.
- **Verificación SINPE Móvil:** Sistema de auditoría que permite marcar pagos como "Verificados" tras comprobar los últimos 4 dígitos del comprobante, separando el "Dinero Real" del "Dinero en Proceso".
- **Alertas de Acción:** Indicadores visuales para ventas pendientes de confirmación.

### 2. Reportes y Seguridad (Actualizado)
- **Cierre de Jornada:** Exportación de reporte profesional en PNG.
- **Gestión de PIN:** Posibilidad de actualizar el PIN de seguridad de 6 dígitos directamente desde el panel.
- **Cierre de Sesión:** Botón de LogOut manual para asegurar el acceso en dispositivos compartidos.

### 3. Resiliencia de Datos (Nuevo)
- **Copia de Seguridad:** Sistema de Exportación/Importación de base de datos en formato JSON, permitiendo la migración de datos entre dispositivos y protección contra pérdida de memoria local.

### 3. Ingeniería de Costos y Stock
- **Control de Inventario:** Interruptores ON/OFF que desactivan productos en la App del cliente instantáneamente.
- **Calculadora de Rentabilidad:** Dashboard que calcula el margen de ganancia real basado en el precio actual de los insumos (papa, huevo, carnes).
- **Lista de Compras Automática:** Basada en las recetas (escandallos), genera una orden de compra descargable con las cantidades exactas necesarias por ingrediente.

---

## 🛠️ Especificaciones Técnicas

### Estructura de Datos
- **Menú:** `src/data/menu.ts` (Precios y descripciones).
- **Recetas:** `src/data/admin/recetas.json` (Fórmulas de costos).
- **Insumos:** `src/data/admin/insumos.json` (Precios de proveedor).

### Comandos Clave
- **Desarrollo:** `npm run dev`
- **Construcción:** `npm run build` (Paquete optimizado para Netlify/Vercel).
- **Limpieza:** El proyecto cuenta con un sistema de "Reset de Caja" para limpiar las ventas diarias sin afectar los costos base.

---
*Documento mantenido y actualizado por Gemini CLI.*
