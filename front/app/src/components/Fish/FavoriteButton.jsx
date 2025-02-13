/**
* お気に入りボタンのコンポーネント
* 魚のお気に入り登録・解除の操作を行う
*/

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Heart } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useFavorites } from "../../contexts/FavoritesContext";

const FavoriteButton = ({ fishId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const { favorites, addFavorite, removeFavorite } = useFavorites();
  const [isFavorited, setIsFavorited] = useState(false);

  // お気に入り状態を更新
  useEffect(() => {
    if (favorites && fishId) {
      setIsFavorited(favorites.some((fish) => fish.id === fishId));
    }
  }, [favorites, fishId]);

  const handleClick = async (e) => {
    e.stopPropagation();
    if (!isAuthenticated()) return;

    setIsLoading(true);
    try {
      if (isFavorited) {
        await removeFavorite(fishId);
      } else {
        await addFavorite(fishId);
      }
    } catch (error) {
      console.error("Favorite operation failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated()) {
    return <div style={{ display: "none" }} />;
  }

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className="flex items-center justify-center bg-transparent transform-none"
      style={{ padding: "8px" }}
      aria-label={isFavorited ? "お気に入りから削除" : "お気に入りに追加"}
    >
      <Heart
        className={`w-6 h-6 transform-none ${
          isLoading
            ? "text-gray-300"
            : isFavorited
            ? "fill-pink-300 text-pink-300"
            : "text-gray-400"
        }`}
      />
    </button>
  );
};

FavoriteButton.propTypes = {
  fishId: PropTypes.number.isRequired,
};

export default FavoriteButton;
