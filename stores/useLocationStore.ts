import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Location {
    id?: string;
    name: string;
    path?: string;
}

interface LocationState {
    location: Location;
    setLocation: (location: Location) => void;
}

export const useLocationStore = create<LocationState>()(
    persist(
        (set) => ({
            location: { name: '泉州' },
            setLocation: (location) => set({ location }),
        }),
        {
            name: 'weather-location-store',
            storage: {
                getItem: async (name) => {
                    const json = await AsyncStorage.getItem(name);
                    return json ? JSON.parse(json) : null;
                },
                setItem: async (name, value) => {
                    await AsyncStorage.setItem(name, JSON.stringify(value));
                },
                removeItem: async (name) => {
                    await AsyncStorage.removeItem(name);
                },
            },
        }
    )
);
