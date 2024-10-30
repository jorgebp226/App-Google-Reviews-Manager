// src/components/layout/AppLayout.js
import React, { useState } from 'react';
import { Home, Settings, BarChart3, MessageCircle } from 'lucide-react';
import PreferencesForm from '../forms/PreferencesForm';
import GoogleConnect from '../Google/GoogleConnect'
const AppLayout = () => {
  const [currentTab, setCurrentTab] = useState('dashboard');

  const renderContent = () => {
    switch(currentTab) {
      case 'settings':
        return (
          <>
            <PreferencesForm />
            <GoogleConnect /> {/* Añadimos el componente de conexión con Google */}
          </>
        );
      case 'dashboard':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium mb-4">Panel de Control</h2>
            {/* Contenido del dashboard */}
          </div>
        );
      case 'reviews':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium mb-4">Gestión de Reseñas</h2>
            {/* Lista de reseñas */}
          </div>
        );
      case 'analytics':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium mb-4">Análisis y Estadísticas</h2>
            {/* Gráficos y estadísticas */}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-gray-900">
                Review Manager
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white p-2 rounded-lg shadow mb-6">
          <nav className="grid grid-cols-4 gap-4">
            {[
              { id: 'dashboard', icon: Home, label: 'Inicio' },
              { id: 'reviews', icon: MessageCircle, label: 'Reseñas' },
              { id: 'analytics', icon: BarChart3, label: 'Análisis' },
              { id: 'settings', icon: Settings, label: 'Configuración' }
            ].map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setCurrentTab(id)}
                className={`flex items-center justify-center gap-2 p-2 rounded ${
                  currentTab === id 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'hover:bg-gray-100'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>

        {renderContent()}
      </main>
    </div>
  );
};

export default AppLayout;
