/**
* 魚のコレクション管理のコンテキストコンポーネント
* ユーザーが食べた魚の記録データを管理する
*/

import { createContext } from "react";
import PropTypes from "prop-types";
import { useCollectionsState } from "../hooks/useCollectionsState";

export const CollectionsContext = createContext(null);

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
