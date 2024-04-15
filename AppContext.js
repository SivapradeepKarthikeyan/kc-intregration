import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userFullName, setUserFullName] = useState('');
    const [userEmailOrMobile, setUserEmailOrMobile] = useState('');
    const [accessToken, setAccessToken] = useState('');
    const [idToken, setIdToken] = useState('')
    const [decodedBody, setDecodedBody] = useState('')
    const [openRoutes, setOpenRoutes] = useState(false)



    return (
        <AppContext.Provider
            value={{
                isLoggedIn,
                setIsLoggedIn,
                userFullName,
                setUserFullName,
                userEmailOrMobile,
                setUserEmailOrMobile,
                accessToken,
                setAccessToken,
                idToken,
                setIdToken,
                decodedBody,
                setDecodedBody
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    return useContext(AppContext);
};
