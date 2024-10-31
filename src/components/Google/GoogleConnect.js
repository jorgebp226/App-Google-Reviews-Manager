// src/components/GoogleConnect.js
import React from 'react';

const GoogleConnect = () => {
    const clientId = "179591697653-f9rkd82ajen3g9qn9tmhneck1gnh4of8.apps.googleusercontent.com";
    const redirectUri = "https://reviewsmanager.betalky.es/auth/callback";
    const scope = "https://www.googleapis.com/auth/business.manage";

    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&access_type=offline`;

    const handleConnectGoogle = () => {
        window.location.href = googleAuthUrl;
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium mb-4">Conectar con Google My Business</h2>
            <button 
                onClick={handleConnectGoogle} 
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                Conectar Cuenta de Google
            </button>
        </div>
    );
};

export default GoogleConnect;
