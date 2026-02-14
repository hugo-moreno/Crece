import React, { useState } from 'react';
import axios from 'axios'; // Importante: npm install axios

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // URL exacta de tu backend funcional
            const response = await axios.post('http://localhost:50644/api/auth/login', {
                email,
                password
            });

            if (response.data.success) {
                // Guardamos el token que generamos en el backend
                localStorage.setItem('token', response.data.token);
                alert(`¡Bienvenido! Tu rol es: ${response.data.role}`);
            }
        } catch (error) {
            alert("Error: " + error.response?.data?.message || "Servidor apagado");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <form onSubmit={handleLogin} className="p-10 bg-white rounded shadow-xl">
                <h1 className="text-2xl font-bold mb-5">Login - Sistema TI</h1>
                <input 
                    type="email" 
                    placeholder="Tu correo" 
                    className="border p-2 mb-4 w-full"
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input 
                    type="password" 
                    placeholder="Tu contraseña" 
                    className="border p-2 mb-4 w-full"
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit" className="bg-blue-600 text-white p-2 rounded w-full">
                    Entrar
                </button>
            </form>
        </div>
    );
};

export default Login;