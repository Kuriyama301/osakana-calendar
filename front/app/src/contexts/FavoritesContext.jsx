/**
* お気に入りの魚の管理コンテキストコンポーネント
* お気に入りデータの取得、追加、削除機能を制御する
*/

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import PropTypes from "prop-types";
import { favoritesAPI } from "../api/favorites";
import { useAuth } from "../hooks/useAuth";

const FavoritesContext = createContext(null);

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const fetchFavorites = useCallback(async () => {
    if (!isAuthenticated()) return;
    setIsLoading(true);
    try {
      const response = await favoritesAPI.getFavorites();
      setFavorites(response);
    } catch (error) {
      console.error("Failed to fetch favorites:", error);
      setFavorites([]);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const addFavorite = useCallback(
    async (fishId) => {
      try {
        await favoritesAPI.addFavorite(fishId);
        await fetchFavorites();
      } catch (error) {
        console.error("Failed to add favorite:", error);
        if (error.response?.status === 422) {
          await fetchFavorites();
        }
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

  useEffect(() => {
    const initializeFavorites = async () => {
      await fetchFavorites();
    };
    initializeFavorites();
  }, [fetchFavorites]);

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

export default FavoritesContext;
