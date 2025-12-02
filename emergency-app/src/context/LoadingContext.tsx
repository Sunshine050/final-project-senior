import React, { createContext, useContext, useState, ReactNode } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

interface LoadingContextValue {
  setLoading: (loading: boolean) => void;
  isLoading: boolean;
}

const LoadingContext = createContext<LoadingContextValue | undefined>(undefined);

export const LoadingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ setLoading: setIsLoading, isLoading }}>
      {children}
      {isLoading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#DC2626" />
        </View>
      )}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within LoadingProvider');
  }
  return context;
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
});

