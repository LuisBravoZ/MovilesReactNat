import axios from 'axios';
import api from '../components/api';


//obtener el perfil
export const obtenerPerfil = async (token) => {
    const response = await api.get('/perfil', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};

//actualizar perfil
export const actualizarPerfil = async (profileData, token) => {
    const response = await api.put('/perfil', profileData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};


// Obtener los datos personales del usuario autenticado
export const obtenerDatosPersonales = async (token) => {
    const response = await api.get('/datos-personales', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};

// Crear nuevos datos personales para el usuario autenticado
export const crearDatosPersonales = async (datos, token) => {
    const response = await api.post('/datos-personales', datos, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};

// Actualizar los datos personales del usuario autenticado
export const actualizarDatosPersonales = async (datos, token) => {
    const response = await api.put('/datos-personales', datos, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};

// Eliminar los datos personales del usuario autenticado
export const eliminarDatosPersonales = async (token) => {
    const response = await api.delete('/datos-personales', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};
