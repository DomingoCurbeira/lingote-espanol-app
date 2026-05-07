# Notas de Desarrollo - El Lingote Español

Este documento resume las mejoras críticas y la arquitectura actual de la aplicación para asegurar la continuidad del proyecto.

## 📋 Resumen del Proyecto
- **Concepto:** Restaurante gourmet de tortillas españolas con fusión costarricense.
- **Tecnología:** React + TypeScript + Vite + Tailwind CSS + Zustand (Estado).

## 🚀 Mejoras de Alto Impacto (Mayo 2026)

### 1. Reestructuración del Menú y Personalización
- **Lingotes de Autor:** Los 4 lingotes originales (Clásico, Tico, Patrón, Supremo) son ahora de receta fija. Al hacer clic se añaden directamente al carrito, protegiendo la calidad de la receta y agilizando la cocina.
- **"Armá tu Lingote":** Nuevo flujo paso a paso (Base -> Proteína -> Vegetales -> Salsa -> Cantidad) con barra de progreso. Permite libertad total al cliente bajo una estructura de precios base + extras.

### 2. Optimización del Flujo de Venta (Conversión)
- **Registro al Final:** Se eliminó el formulario de entrada. El cliente entra directo al menú ("¡Tengo Hambre!").
- **Captura de Datos:** Los datos del usuario (Nombre/Teléfono) solo se solicitan en el carrito cuando se intenta finalizar el pedido por primera vez. Se persisten en `localStorage`.

### 3. Gestión de Horarios y Seguridad Financiera
- **Horario:** Configurado de **8:00 AM a 4:00 PM**.
- **Bloqueo de Pagos:** Por seguridad, la recepción de pedidos y la pasarela de pagos (Sinpe/Efectivo) se bloquean automáticamente a las **15:45** (15 min antes del cierre).
- **Indicador de Estado:** Header dinámico con luz de estado (🟢 Abierto, 🟡 Última llamada, 🔴 Cerrado).

### 4. Fidelización y Experiencia de Usuario
- **Historial de Pedidos:** Almacena los últimos 10 pedidos en el dispositivo.
- **Repetir Pedido:** Botón en el perfil para cargar exactamente la misma configuración de un pedido anterior al carrito con un solo clic.
- **Imagen de Respaldo (Fallback):** Sistema automático que muestra el logo oficial si un producto no tiene imagen o si el archivo falla al cargar.

## 📍 Ubicación y Logística
- **Sección Próximamente:** Diseñada una sección elegante para Cartago, Costa Rica, informando la modalidad *Take Away* actual y el tiempo de preparación estimado (20 min).

## 🔑 Datos Técnicos para el Futuro
- **Configuración Horarios:** `src/config/horarios.ts`
- **Base de Datos Menú:** `src/data/menu.ts`
- **Estado Global:** `src/store/` (Carrito y Usuario).
- **Comando de Producción:** `npm run build` (genera carpeta `dist/`).

---
*Documentación generada por Gemini CLI para el Lingote Español.*
