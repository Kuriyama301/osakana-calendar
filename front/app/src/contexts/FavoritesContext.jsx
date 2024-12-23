import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
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
        await fetchFavorites(); // 成功後に一覧を更新
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

  // 初期データを取得
  useEffect(() => {
    const initializeFavorites = async () => {
      await fetchFavorites();
    };
    initializeFavorites();
  }, []); // fetchFavorites（無限ループ防止）

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
