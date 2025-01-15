import { createContext, useContext } from "react";
import PropTypes from "prop-types";
import { useCollectionsState } from "../hooks/useCollectionsState";

const CollectionsContext = createContext(null);

export const CollectionsProvider = ({ children }) => {
  const collectionsState = useCollectionsState();

  return (
    <CollectionsContext.Provider value={collectionsState}>
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
