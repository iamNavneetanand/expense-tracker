import React, { useContext, useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = "https://expense-tracker-backend-36o7.onrender.com/api/v1/auth/";

const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            fetchMe();
        } else {
            setLoading(false);
        }
    }, []);

    const fetchMe = async () => {
        try {
            const res = await axios.get(`${BASE_URL}me`);
            setUser(res.data);
        } catch (err) {
            logout();
        } finally {
            setLoading(false);
        }
    };

    const register = async (name, email, password) => {
        try {
            const res = await axios.post(`${BASE_URL}register`, { name, email, password });
            const { token, user } = res.data;
            localStorage.setItem("token", token);
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            setToken(token);
            setUser(user);
            setError(null);
            return true;
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
            return false;
        }
    };

    const login = async (email, password) => {
        try {
            const res = await axios.post(`${BASE_URL}login`, { email, password });
            const { token, user } = res.data;
            localStorage.setItem("token", token);
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            setToken(token);
            setUser(user);
            setError(null);
            return true;
        } catch (err) {
            setError(err.response?.data?.message || "Invalid email or password");
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        delete axios.defaults.headers.common["Authorization"];
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            loading,
            error,
            setError,
            login,
            register,
            logout,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);