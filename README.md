# Control de Pagos de Inquilino 🏠⚡💧

Dashboard moderno, limpio y responsive para la gestión mensual de pagos de alquiler, prorrateo de servicios públicos (Luz 50% / Agua) y seguimiento de cobranza, desarrollado con **Next.js (App Router)**, **React**, **Tailwind CSS** y **Lucide React**.

---

## 🚀 Características Principales

### 1. Panel Superior y Tarjetas KPI
- **Selector de Años:** Alterna fácilmente entre **2025**, **2026** y **2027** con almacenamiento independiente por periodo.
- **Total Recaudado:** Suma dinámica de todos los meses marcados como pagados con indicador de avance porcentual.
- **Pendiente de Cobro:** Suma de montos por regularizar y conteo de meses pendientes.
- **Alquiler Base:** Valor de referencia editable en soles (`S/`), con opción de aplicar a todos los meses con un solo clic.
- **Cuota Luz Inquilino:** Regla fija de prorrateo del **50%** sobre el total de la factura eléctrica.

### 2. Vista Calendario Visual (12 Meses)
- Cuadrícula de 12 tarjetas interactivas (Enero a Diciembre).
- **Mes Pagado:** Fondo verde esmeralda suave (`emerald-50`, borde `emerald-500`), insignia destacada **"PAGADO"** y monto mensual formateado en PEN (`S/ 0.00`).
- **Mes Pendiente:** Diseño neutro (`bg-slate-50`, borde `slate-200`) con insignia **"PENDIENTE"**.
- Alternador interactivo para marcar rápidamente el estado de pago de cada mes.

### 3. Tabla de Desglose Detallado
- **Columnas:**
  - **Mes:** Nombre y número de mes.
  - **Alquiler Fijo:** Campo numérico editable (con valor inicial del alquiler base).
  - **Recibo Luz 100%:** Campo numérico para el recibo total emitido por la empresa eléctrica.
  - **Luz Inquilino 50%:** Cálculo automático e instantáneo (`Luz × 0.50`), resaltado en pastilla celeste cielo.
  - **Recibo Agua:** Campo numérico editable para el consumo de agua.
  - **Total a Pagar:** Cálculo en tiempo real (`Alquiler + (Luz × 0.50) + Agua`) en tipografía destacada.
  - **¿Pagado?:** Casilla interactiva / toggle que sincroniza en tiempo real con el calendario y recalcula los KPIs.
- **Pie de Tabla:** Fila resumen con los totales anuales de cada concepto.

### 4. Exportación y Respaldo
- **Exportar a CSV:** Descarga directa compatible con Microsoft Excel y Google Sheets con codificación UTF-8.
- **Exportar JSON:** Copia de seguridad completa de los datos para respaldo.
- **Imprimir / Guardar como PDF:** Vista optimizada para impresión en formato formal y limpio.
- **Restablecer Datos:** Diálogo modal nativo para volver a los valores iniciales.

### 5. Persistencia Local
- Todo cambio se guarda automáticamente en `localStorage`, asegurando que no se pierdan los datos al recargar la página.

---

## 🛠️ Tecnologías Utilizadas

- **Framework:** [Next.js](https://nextjs.org/) (App Router, React 19)
- **Estilos:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Iconografía:** [Lucide React](https://lucide.dev/)
- **Tipado:** [TypeScript](https://www.typescriptlang.org/)
- **Persistencia:** LocalStorage API

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
