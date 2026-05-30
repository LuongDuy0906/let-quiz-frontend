"use client";

import { userService } from "@/features/user/user.service";
import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({children}: {children: React.ReactNode}) => {
    const [user, setUser] = useState<any>(null); 
    const [loading, setLoading] = useState<boolean>(true);

    const fetchProfile = async () => {
        const token = localStorage.getItem('accessToken');

        if (!token) {
            setUser(null);
            setLoading(false);
            return;
        }

        try {
            const profile = await userService.getMe();
            if(profile) {
                setUser(profile);
            }
            setLoading(false);
        } catch (error) {
            console.log('Error fetching user profile:', error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, refreshProfile: fetchProfile, loading}}>
            {children}
        </UserContext.Provider>
    )
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}