import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import PropTypes from "prop-types";
import { collectionsAPI } from "../api/collections";
import { useAuth } from "../hooks/useAuth";

const CollectionsContext = createContext(null);

export const CollectionsProvider = ({ children }) => {
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

  const value = {
    collections,
    isLoading,
    fetchCollections,
    addCollection,
    removeCollection,
  };

  return (
    <CollectionsContext.Provider value={value}>
      {children}
    </CollectionsContext.Provider>
  );
};

CollectionsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useCollections = () => {
  const context = useContext(CollectionsContext);
  if (!context) {
    throw new Error("useCollections must be used within a CollectionsProvider");
  }
  return context;
};

export default CollectionsContext;
