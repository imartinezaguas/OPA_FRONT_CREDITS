<div align="center">
  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Angular_full_color_logo.svg/2048px-Angular_full_color_logo.svg.png" width="120" alt="Angular Logo">
  <h1>OPA Front-End: Gestión de Créditos</h1>
  <p><b>Aplicación SPA moderna e interactiva para la gestión integral de solicitudes de crédito solidario.</b></p>
</div>

---

## 🚀 Características Principales

*   **📊 Panel Local (Dashboard):** Visualización en tiempo real de las solicitudes de crédito, estados y KPIs relevantes.
*   **➕ Creación de Solicitudes:** Formularios interactivos para el registro de nuevos créditos (monto, plazos, tasa de interés, forma de pago).
*   **🔍 Detalles y Actualización:** Visualización detallada de cada crédito en un panel deslizable (Drawer) totalmente responsivo.
*   **🛠️ Gestión de Estados:** Flujo de trabajo completo para aprobar, rechazar o desembolsar créditos.
*   **🚫 Interceptor de Errores Global:** Manejo inteligente de errores de validación de negocio provenientes de la API .NET y presentación amigable mediante modales responsivos.
*   **📱 Diseño 100% Responsivo:** Interfaz Premium adaptada a dispositivos móviles, tablets y escritorios (Mobile-First approach).

## 🛠️ Stack Tecnológico

*   **Framework:** [Angular 18+](https://angular.dev/) (Standalone Components, Signals, Nuevo Control Flow)
*   **Estilos:** SCSS (CSS Grid, Flexbox, UI/UX Moderno)
*   **Estado:** Angular Signals (`signal`, `computed`, `effect`)
*   **HTTP:** Angular HttpClient + Interceptores
*   **Arquitectura:** Clean Architecture (Modularización por Features)

## 📁 Estructura del Proyecto

El proyecto sigue un estándar estricto de Arquitectura Limpia para alta escalabilidad:

```text
src/app/
├── core/            # Núcleo: Servicios Singleton, Modelos, Interceptores, Guards, Layout
├── features/        # Módulos y funcionalidades de negocio aisladas
│   ├── auth/        # Lógica y páginas de inicio de sesión
│   └── credits/     # Gestión principal de la cartera (Dashboard, Summary)
├── shared/          # Componentes reutilizables, UI kits, utilidades
```

## ⚙️ Instalación y Configuración

Para correr el proyecto localmente y conectarlo a tu backend .NET:

1.  **Clona el repositorio:**
    ```bash
    git clone https://github.com/imartinezaguas/OPA_FRONT_CREDITS.git
    cd OPA_FRONT_CREDITS
    ```

2.  **Instala las dependencias:**
    ```bash
    npm install
    ```

3.  **Ejecuta el servidor de desarrollo:**
    ```bash
    ng serve -o
    ```
    La aplicación se compilará y abrirá automáticamente en tu navegador apuntando a `http://localhost:4200/`.

---
<div align="center">
  <small>Desarrollado con ❤️ para OPA - CEPHAS</small>
</div>