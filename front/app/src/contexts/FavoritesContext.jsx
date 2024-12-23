import { createContext, useContext, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { favoritesAPI } from "../api/favorites";

const FavoritesContext = createContext(null);

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchFavorites = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await favoritesAPI.getFavorites();
      setFavorites(data);
    } catch (error) {
      console.error("Failed to fetch favorites:", error);
      setFavorites([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addFavorite = useCallback(
    async (fishId) => {
      try {
        await favoritesAPI.addFavorite(fishId);
        await fetchFavorites();
      } catch (error) {
        console.error("Failed to add favorite:", error);
      }
    },
    [fetchFavorites]
  );

  const removeFavorite = useCallback(
    async (fishId) => {
      try {
        await favoritesAPI.removeFavorite(fishId);
        await fetchFavorites();
      } catch (error) {
        console.error("Failed to remove favorite:", error);
      }
    },
    [fetchFavorites]
  );

  const value = {
    favorites,
    isLoading,
    fetchFavorites,
    addFavorite,
    removeFavorite,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

FavoritesProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};
