# 🚀 Backend - Escuela Virtual (API)

Este backend maneja la autenticación y el control de acceso por roles (Admin, Staff, User).

### 🛠️ Configuración
- **Puerto:** `50644`
- **Base de Datos:** MySQL (SQLyog) - Tabla `users`
- **Tecnologías:** Node.js, Express, Sequelize, JWT.

### 🔑 Endpoints de Autenticación
Todos los endpoints comienzan con `http://localhost:50644/api/auth`

1. **POST `/login`**
   - Body: `{ "email": "...", "password": "..." }`
   - Devuelve: `token` y `role`.

2. **GET `/validate`**
   - Header: `Authorization: Bearer <TOKEN>`
   - Uso: Verificar sesión al cargar el Frontend.

3. **GET `/reportes`**
   - Requiere: Rol `Admin` o `Staff`.

4. **GET `/perfil`**
   - Requiere: Estar logueado (Cualquier rol).

### 👥 Usuarios de Prueba
- **Admin:** hugo@test.com
- **Staff:** susana@escuela.com
- **User:** leonel@escuela.com