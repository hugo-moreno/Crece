import { useState } from 'react'
import axios from 'axios'

function App() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      // Usamos el puerto que te funcionó en Postman
      const res = await axios.post('http://localhost:50644/api/auth/login', {
        email,
        password
      })
      alert(`¡Éxito Hugo! Token recibido: ${res.data.token.substring(0, 20)}...`)
      console.log("Respuesta completa:", res.data)
    } catch (err) {
      alert("Error al conectar: " + (err.response?.data?.message || "Servidor apagado"))
    }
  }

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>Login Sistema TI</h1>
      <form onSubmit={handleLogin} style={{ display: 'inline-block', textAlign: 'left' }}>
        <div>
          <label>Correo:</label><br/>
          <input type="email" onChange={(e) => setEmail(e.target.value)} required />
        </div><br/>
        <div>
          <label>Contraseña:</label><br/>
          <input type="password" onChange={(e) => setPassword(e.target.value)} required />
        </div><br/>
        <button type="submit">Probar Conexión</button>
      </form>
    </div>
  )
}

export default App