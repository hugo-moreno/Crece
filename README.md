# 🏫 Escuela Virtual - Fase II (Backend & Base de Datos)

Este proyecto es una plataforma de gestión educativa desarrollada para la materia de Tecnologías de la Información. Actualmente, el Backend está finalizado y conectado a SQLyog, listo para la integración con el Frontend en Vite.

---

## 🛠️ Avances Técnicos del Backend

### 1. Seguridad y Autenticación
* **Validación de Contraseñas**: Se implementó una lógica estricta que exige entre **13 y 15 caracteres**, incluyendo mayúsculas, minúsculas y caracteres especiales (Ej: `@`, `#`, `!`).
* **Encriptación**: Uso de `bcrypt` para el hasheo de contraseñas antes de almacenarlas en la base de datos.
* **JWT (JSON Web Tokens)**: Generación de tokens seguros para mantener la sesión del usuario por 2 horas.

### 2. Gestión de Roles (RBAC)
Se configuraron tres niveles de acceso para controlar las funcionalidades del sistema:
* **Admin**: Acceso total (Hugo Moreno).
* **Staff**: Acceso a reportes y gestión de contenido (Susana/Alexis).
* **User**: Estudiantes con acceso a visualización (Leonel).

### 3. Base de Datos
* **ORM**: Utilización de **Sequelize** para la gestión de modelos y consultas.
* **Sincronización**: El servidor realiza un `sync({ alter: true })` automáticamente, asegurando que las tablas de `users` y `courses` en SQLyog coincidan con el código.

---

## 🚀 Guía para el Programador de Frontend (Vite)

Para cumplir con los criterios de **Manipulación del DOM** y **Elementos Dinámicos**, sigue estas instrucciones:

### Endpoints Disponibles
* **Base URL**: `http://localhost:50644/api`
* **Cursos**: `GET /api/courses` (Requiere Token).
* **Login**: `POST /api/auth/login` (Devuelve Token y Rol).

### Integración Dinámica
1. Realiza un `fetch` a la ruta de cursos.
2. Recibe el JSON (Array de objetos).
3. Utiliza JavaScript para generar tarjetas dinámicas en el dashboard. Esto cubre el requisito de **Manipulación del DOM**.

---

## 🔑 Credenciales de Prueba

| Usuario | Email | Password | Rol |
| :--- | :--- | :--- | :--- |
| **Hugo Moreno** | `hugo@test.com` | `HugoMoreno@2026` | Admin |
| **Susana Morales** | `susana@escuela.com` | `SusanaStaff@26` | Staff |
| **Leonel Martinez** | `leonel@escuela.com` | `LeonelUser#2026` | User |

---

**Desarrollado por:** Hugo David Moreno Llamas  
**Empresa:** Lubral / Universidad TI