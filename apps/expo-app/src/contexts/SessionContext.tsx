import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface StrokeData {
  id: string;
  label: string;
  confidence: number;
  timestamp: number;
}

interface PuttHistoryContextType {
  puttHistory: StrokeData[];
  totalPutts: number;
  averageConfidence: number;
  labelCounts: Record<string, number>;
  addPutt: (putt: Omit<StrokeData, 'id'>) => void;
  clearHistory: () => void;
  getRecentPutts: (count: number) => StrokeData[];
  getLabelPercentage: (label: string) => number;
}

const PuttHistoryContext = createContext<PuttHistoryContextType | undefined>(undefined);

export const usePuttHistory = () => {
  const context = useContext(PuttHistoryContext);
  if (!context) {
    throw new Error('usePuttHistory must be used within a PuttHistoryProvider');
  }
  return context;
};

export const PuttHistoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [puttHistory, setPuttHistory] = useState<StrokeData[]>([]);

  // Load history from storage on app start
  useEffect(() => {
    loadHistory();
  }, []);

  // Save history to storage whenever it changes
  useEffect(() => {
    saveHistory();
  }, [puttHistory]);

  const loadHistory = async () => {
    try {
      const savedHistory = await AsyncStorage.getItem('puttHistory');
      if (savedHistory) {
        setPuttHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error('Error loading putt history:', error);
    }
  };

  const saveHistory = async () => {
    try {
      await AsyncStorage.setItem('puttHistory', JSON.stringify(puttHistory));
    } catch (error) {
      console.error('Error saving putt history:', error);
    }
  };

  const addPutt = useCallback((putt: Omit<StrokeData, 'id'>) => {
    const newPutt: StrokeData = {
      ...putt,
      id: Date.now().toString(),
    };
    setPuttHistory(prev => [newPutt, ...prev]);
  }, []);

  const clearHistory = useCallback(async () => {
    try {
      await AsyncStorage.removeItem('puttHistory');
      setPuttHistory([]);
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  }, []);

  const getRecentPutts = useCallback((count: number) => {
    return puttHistory.slice(0, count);
  }, [puttHistory]);

  const getLabelPercentage = useCallback((label: string) => {
    if (puttHistory.length === 0) return 0;
    const count = puttHistory.filter(putt => putt.label === label).length;
    return (count / puttHistory.length) * 100;
  }, [puttHistory]);

  // Calculate statistics
  const totalPutts = puttHistory.length;
  const averageConfidence = puttHistory.length > 0 
    ? puttHistory.reduce((sum, putt) => sum + putt.confidence, 0) / puttHistory.length 
    : 0;

  const labelCounts = puttHistory.reduce((counts, putt) => {
    counts[putt.label] = (counts[putt.label] || 0) + 1;
    return counts;
  }, {} as Record<string, number>);

  const value: PuttHistoryContextType = {
    puttHistory,
    totalPutts,
    averageConfidence,
    labelCounts,
    addPutt,
    clearHistory,
    getRecentPutts,
    getLabelPercentage,
  };

  return (
    <PuttHistoryContext.Provider value={value}>
      {children}
    </PuttHistoryContext.Provider>
  );
};
