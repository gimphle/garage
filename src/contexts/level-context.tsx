import { createContext, ReactNode, useContext, useState } from 'react';

type SelectedLevelContextType = {
    selectedLevel: number;
    setSelectedLevelInInput: (id: string | number, value: any) => void;
    resetLevel: () => void;
};

const defaultContext: SelectedLevelContextType = {
    selectedLevel: 1,
    setSelectedLevelInInput: () => {},
    resetLevel: () => {},
};
const SelectedLevelContext = createContext<SelectedLevelContextType>(defaultContext);

const SelectedLevelProvider = ({ children }: { children: ReactNode }) => {
    const [selectedLevel, setSelectedLevel] = useState(1);

    const setSelectedLevelInInput = (_: any, value: number) => setSelectedLevel(value);

    const resetLevel = () => setSelectedLevel(1);

    const value: SelectedLevelContextType = {
        selectedLevel,
        setSelectedLevelInInput,
        resetLevel,
    };

    return <SelectedLevelContext.Provider value={value}>{children}</SelectedLevelContext.Provider>;
};

export const useSelectedLevel = () => {
    return useContext(SelectedLevelContext);
};

export default SelectedLevelProvider;
