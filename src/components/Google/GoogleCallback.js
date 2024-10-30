import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API } from 'aws-amplify';
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

                    await API.post('YOUR_API_NAME', '/auth/google/callback', {
                        body: { code },
                        headers: {
                            Authorization: idToken.getJwtToken(),
                        }
                    });

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
