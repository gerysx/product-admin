#  ERP de Ventas — Sistema de Gestión Empresarial

Este repositorio contiene un **ERP ** desarrollado como proyecto de fin de grado. Es un sistema completo de gestión de ventas, clientes, productos y usuarios con autenticación basada en roles, generación de facturas en PDF y despliegue en la nube. Puedes entrar como administrador para ver todas las funcionalidades: emaiL: pruebas@try.com password:Pruebas1234  **USO RESPONSABLE**

---

##  Tecnologías Utilizadas

###  Backend
- **Node.js** + **Express** — API RESTful
- **Sequelize ORM** — Mapeo objeto-relacional
- **PostgreSQL** — Base de datos relacional
- **JWT** — Autenticación y autorización
- **Docker** — Entorno de contenedores
- **Render** — Despliegue del backend

###  Frontend
- **Angular Standalone Components** — Estructura moderna y modular
- **Bootstrap** + **Angular Material** — Interfaz limpia y responsiva
- **Guards (`authGuard`, `roleGuard`)** — Control de acceso por rutas
- **Lazy Loading** — Carga eficiente de módulos

---

##  Funcionalidades

- Registro e inicio de sesión con JWT
- Control de accesos basado en roles: `admin`, `empleado`
- Gestión completa de:
  -  Clientes
  -  Productos
  -  Facturas
- Generación de PDFs para facturas
- Filtros dinámicos por fecha, cliente o producto
- Validaciones avanzadas en formularios
- Panel de usuario con perfil e imagen editable
- Despliegue fullstack (Render + Vercel)

---

##  Cómo usarlo

1. Debes realizar el clonado `git clone https://github.com/tu-usuario/frontend-erp.git`
2. Accede hasta tu carpeta`cd frontend-erp`
3. Abrir en tu editor de código y ejecutar en la termina`npm install`
4. Ejecuta este comando para lanzar el servidor`ng serve  `

