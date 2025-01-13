import {createContext, useContext, useState} from "react";

const AuthContext = createContext();

export const AuthProvider = ({children})=>{
    const [user,setUser] = useState(null);

    const setAuth = (user) => {
        setUser(user);
    }

    const setUserData = (userData)=>{
        setUser({...userData});
    }

    return (
        <AuthContext.Provider value={{user,setAuth,setUserData}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth =()=> useContext(AuthContext);