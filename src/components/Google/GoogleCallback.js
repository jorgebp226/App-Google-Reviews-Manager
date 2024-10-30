import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';

const GoogleCallback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTokens = async () => {
            const query = new URLSearchParams(window.location.search);
            const code = query.get('code');

            if (code) {
                try {
                    const user = await getCurrentUser();
                    const { idToken } = (await fetchAuthSession()).tokens;

                    const response = await fetch('https://j1asmzdgbg.execute-api.eu-west-3.amazonaws.com/google-reviews/google-auth', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': idToken.toString()
                        },
                        body: JSON.stringify({ code })
                    });

                    if (!response.ok) {
                        throw new Error('Error en la respuesta del servidor');
                    }

                    alert('Conexión exitosa con Google My Business');
                    navigate('/settings');
                } catch (error) {
                    console.error("Error al conectar con Google:", error);
                    alert("Hubo un problema al conectar con Google My Business.");
                }
            }
        };
        fetchTokens();
    }, [navigate]);

    return <p>Conectando con Google My Business...</p>;
};

export default GoogleCallback;
