import React, { createContext, useContext, useState, useEffect } from 'react';

// Cria o contexto
const UserContext = createContext();

// Componente Provedor do Contexto
export const UserProvider = ({ children }) => {
    const [permissaoUser, setPermissaoUser] = useState(null);
    const [telaUser, setTelaUser] = useState(null);

    useEffect(() => {
        // Aqui você pode pegar o permissaoUser do localStorage, cookie ou token
        const storedPermissaoUser = localStorage.getItem('permissaoUser');
        const storedtelaUser = localStorage.getItem('telaUser');
        if (storedPermissaoUser) {
            setPermissaoUser(storedPermissaoUser);
        }
        if (storedtelaUser) {
            setTelaUser(storedtelaUser)
        }
    }, []);

    const value = {
        permissaoUser,
        setPermissaoUser,
        telaUser,
        setTelaUser
    };

return (
    <UserContext.Provider value={value}>
        {children}
    </UserContext.Provider>
);
};

// Hook para usar o contexto em outros componentes
export const useUser = () => useContext(UserContext);