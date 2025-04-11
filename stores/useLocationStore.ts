import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LocationSearchItem } from '@/apis/location';

type LocationState = {
    location: LocationSearchItem | null;
    setLocation: (location: LocationSearchItem) => void;
};

export const useLocationStore = create<LocationState>()(
    persist(
        (set) => ({
            location: null,
            setLocation: (location) => set({ location }),
        }),
        {
            name: 'weather-location-store', // 储存在AsyncStorage 的 key
        }
    )
);
