import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SelectedDateIndexState {
    selectedDateIndex: number;
    setSelectedDateIndex: (index: number) => void;
}

export const useSelectedDateIndexStore = create<SelectedDateIndexState>()(
    persist(
        (set) => ({
            selectedDateIndex: 0,
            setSelectedDateIndex: (index) => set({ selectedDateIndex: index }),
        }),
        {
            name: 'weather-selected-date-index-store',
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