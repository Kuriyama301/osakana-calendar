import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Utensils } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useCollections } from "../../contexts/CollectionsContext";

const CollectionButton = ({ fishId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const { collections, addCollection, removeCollection } = useCollections();
  const [isCollected, setIsCollected] = useState(false);

  // コレクション状態を更新
  useEffect(() => {
    if (collections && fishId) {
      setIsCollected(collections.some((fish) => fish.id === fishId));
    }
  }, [collections, fishId]);

  const handleClick = async (e) => {
    e.stopPropagation();
    if (!isAuthenticated()) return;

    setIsLoading(true);
    try {
      if (isCollected) {
        await removeCollection(fishId);
      } else {
        await addCollection(fishId);
      }
    } catch (error) {
      console.error("Collection operation failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 未認証時に空のボタンを返す
  if (!isAuthenticated()) {
    return <div style={{ display: "none" }} />;
  }

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className="flex items-center justify-center bg-transparent transform-none"
      style={{ padding: "8px" }}
      aria-label={isCollected ? "コレクションから削除" : "コレクションに追加"}
    >
      <Utensils
        className={`w-6 h-6 transform-none ${
          isLoading
            ? "text-gray-300"
            : isCollected
            ? "fill-yellow-250 text-yellow-200"
            : "text-gray-400"
        }`}
      />
    </button>
  );
};

CollectionButton.propTypes = {
  fishId: PropTypes.number.isRequired,
};

export default CollectionButton;
