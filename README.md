# Control de Pagos de Inquilino 🏠⚡💧

Dashboard moderno, limpio y responsive para la gestión mensual de pagos de alquiler, prorrateo de servicios públicos (Luz 50% / Agua) y seguimiento de cobranza, desarrollado con **Next.js (App Router)**, **React**, **Tailwind CSS**, **Lucide React** y **Persistencia en la Nube (Vercel KV / Upstash)**.

---

## 🚀 Características Principales

### 1. Persistencia Multi-Usuario en la Nube y Local
- **Persistencia en Vercel (Cloud KV):** Funciona de forma nativa con **Vercel KV / Upstash Redis** (100% gratuito). Cuando tú o tu inquilino guardan un cambio, queda registrado en la nube inmediatamente para cualquier usuario o dispositivo.
- **Persistencia Local (`data/payments.json`):** Si estás ejecutando la aplicación en tu computadora local, los cambios se escriben directamente en el archivo `data/payments.json`.
- **Botón Explícito de "Guardar Cambios":** Barra de guardado en la cabecera y barra flotante inferior que te avisa cuando hay modificaciones pendientes de guardar en el servidor.
- **Botón de Sincronización (🔄):** Permite recargar al instante los datos más recientes del servidor sin recargar toda la página.
- **Exportar e Importar JSON:** Desde el menú puedes descargar una copia de seguridad o subir un archivo JSON para restaurar todos los registros.

### 2. Dos Modos de Vista (Admin vs. Vista Inquilino)
- **Modo Administrador (Completo):** Vista editable con métricas KPI, inputs para modificar alquiler y recibos, y opciones de configuración.
- **Vista Compacta (Inquilino):** Vista limpia y profesional pensada para mostrar o compartir con el arrendatario:
  - **Cards tipo calendario para el alquiler:** 12 tarjetas compactas de calendario mensual (Ene - Dic) enfocadas **exclusivamente en el alquiler**, mostrando el monto pactado y su estado (**PAGADO** / **PENDIENTE**).
  - **Tabla comprimida de servicios (abajo):** Tabla condensada y legible con el desglose exacto de Luz (100%), Cuota Luz Inquilino (50%), Recibo de Agua, Subtotal de Servicios y Total a Pagar.
  - **Botón Copiar para WhatsApp:** Genera automáticamente un resumen listo para enviar por mensajería al inquilino con el detalle de saldo pendiente o confirmación de pago, separando alquiler de servicios.

### 3. Panel Superior y Tarjetas KPI
- **Selector de Años:** Alterna fácilmente entre **2025**, **2026** y **2027** con almacenamiento independiente por periodo.
- **Total Recaudado:** Suma dinámica de todos los conceptos pagados con indicador de avance porcentual.
- **Pendiente de Cobro:** Suma de montos por regularizar y conteo de meses pendientes.
- **Alquiler Base:** Valor de referencia editable en soles (`S/`), con opción de aplicar a todos los meses con un solo clic.
- **Cuota Luz Inquilino:** Regla fija de prorrateo del **50%** sobre el total de la factura eléctrica.

### 4. Vista Calendario Visual (12 Meses)
- Cuadrícula de 12 tarjetas interactivas (Enero a Diciembre).
- **Mes Pagado:** Fondo verde esmeralda suave (`emerald-50`, borde `emerald-500`), insignia destacada **"PAGADO"** y monto mensual formateado en PEN (`S/ 0.00`).
- **Mes Pendiente:** Diseño neutro (`bg-slate-50`, borde `slate-200`) con insignia **"PENDIENTE"**.
- Alternador interactivo para marcar rápidamente el estado de pago de cada mes.

### 5. Tabla de Desglose Detallado
- **Columnas:**
  - **Mes:** Nombre y número de mes.
  - **Alquiler Fijo:** Campo numérico editable (con valor inicial del alquiler base) y control de pago independiente.
  - **Recibo Luz 100%:** Campo numérico para el recibo total emitido por la empresa eléctrica.
  - **Luz Inquilino 50%:** Cálculo automático e instantáneo (`Luz × 0.50`), resaltado en pastilla celeste cielo.
  - **Recibo Agua:** Campo numérico editable para el consumo de agua.
  - **Total Servicios:** Subtotal de servicios con control de pago propio.
  - **Total Mes:** Suma global en tiempo real (`Alquiler + (Luz × 0.50) + Agua`) en tipografía destacada.
- **Pie de Tabla:** Fila resumen con los totales anuales de cada concepto.

---

## ⚡ Conectar en Vercel para Persistencia en la Nube (1 Minuto)

Para que los cambios se guarden en la nube y sean visibles entre todos los usuarios al desplegar en Vercel:

1. Ve a tu proyecto en el panel de **[Vercel](https://vercel.com/)**.
2. Haz clic en la pestaña **Storage** -> **Create Database**.
3. Selecciona **KV (Upstash)** (es 100% gratuito, sin tarjeta de crédito).
4. Elige un nombre (ej. `dashboard-kv`) y haz clic en **Connect to Project**.
5. ¡Listo! Vercel configurará automáticamente las variables de entorno (`KV_REST_API_URL` y `KV_REST_API_TOKEN`) y tus datos persistirán en la nube para todos los dispositivos.

---

## 📦 Instalación y Ejecución Local

1. Clona este repositorio:
   ```bash
   git clone git@github.com:RafaelSnor/dashboard-inquilino.git
   cd dashboard-inquilino
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

4. Abre en tu navegador:
   ```
   http://localhost:3000
   ```

---

## 📄 Licencia

MIT © [RafaelSnor](https://github.com/RafaelSnor)
