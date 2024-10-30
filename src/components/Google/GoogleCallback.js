import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from 'aws-amplify/auth';

const GoogleCallback = () => {
    const navigate = useNavigate();
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTokens = async () => {
            const query = new URLSearchParams(window.location.search);
            const code = query.get('code');

            if (code) {
                try {
                    // Obtener el `sub` del usuario desde Cognito
                    const { userId } = await getCurrentUser();
                    
                    // Enviar `code` y `sub` a la Lambda
                    const response = await fetch('https://j1asmzdgbg.execute-api.eu-west-3.amazonaws.com/google-reviews/google-auth', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ code, sub: userId })
                    });

                    if (!response.ok) {
                        throw new Error('Error en la respuesta del servidor');
                    }

                    alert('Conexión exitosa con Google My Business');
                    navigate('/settings');
                } catch (error) {
                    console.error("Error al conectar con Google:", error);
                    setError(error.message);
                    setTimeout(() => navigate('/settings'), 3000);
                }
            }
        };
        fetchTokens();
    }, [navigate]);

    if (error) {
        return <p>Error: {error}. Redirigiendo...</p>;
    }

    return <p>Conectando con Google My Business...</p>;
};

export default GoogleCallback;
