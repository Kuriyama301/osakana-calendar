import { useState, useCallback, useEffect } from "react";
import { collectionsAPI } from "../api/collections";
import { useAuth } from "./useAuth";

export const useCollectionsState = () => {
  const [collections, setCollections] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const fetchCollections = useCallback(async () => {
    if (!isAuthenticated()) return;
    setIsLoading(true);
    try {
      const response = await collectionsAPI.getCollections();
      setCollections(response);
    } catch (error) {
      console.error("Failed to fetch collections:", error);
      setCollections([]);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const addCollection = useCallback(
    async (fishId) => {
      try {
        await collectionsAPI.addCollection(fishId);
        await fetchCollections();
      } catch (error) {
        console.error("Failed to add collection:", error);
        if (error.response?.status === 422) {
          await fetchCollections();
        }
      }
    },
    [fetchCollections]
  );

  const removeCollection = useCallback(
    async (fishId) => {
      try {
        await collectionsAPI.removeCollection(fishId);
        await fetchCollections();
      } catch (error) {
        console.error("Failed to remove collection:", error);
      }
    },
    [fetchCollections]
  );

  useEffect(() => {
    const initializeCollections = async () => {
      await fetchCollections();
    };
    initializeCollections();
  }, [fetchCollections]);

  return {
    collections,
    isLoading,
    fetchCollections,
    addCollection,
    removeCollection,
  };
};
