import React, { createContext, useContext, useState, useEffect } from 'react';

interface FavoritesContextType {
  favorites: string[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => { favorited: boolean };
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('visitjhar_favorites');
    return saved ? JSON.parse(saved) : ['6aa8dc640aef597b6eba93ae', '6aa8dc640aef597b6eba93b0']; // Default Hundru & Betla
  });

  useEffect(() => {
    localStorage.setItem('visitjhar_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const isFavorite = (id: string) => favorites.includes(id);

  const toggleFavorite = (id: string) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(favId => favId !== id));
      return { favorited: false };
    } else {
      setFavorites([...favorites, id]);
      return { favorited: true };
    }
  };

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error('useFavorites must be used within a FavoritesProvider');
  return context;
};
