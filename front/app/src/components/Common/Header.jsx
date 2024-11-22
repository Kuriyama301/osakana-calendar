import React, { useState } from "react";
import { Link } from "react-router-dom";
import SearchForm from "../Fish/SearchForm";
import SearchModal from "../Fish/SearchModal";
import { searchFish } from "../../api/fish";

function Header() {
  const [searchResults, setSearchResults] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (searchTerm) => {
    setIsLoading(true);
    try {
      const results = await searchFish(searchTerm);
      setSearchResults(results);
      setIsModalOpen(true); // 検索結果が取得できたらモーダルを開く
    } catch (error) {
      console.error('Search failed:', error);
      // エラー処理を追加する場合はここに
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <header className="bg-white bg-opacity-85 backdrop-blur-md fixed top-0 left-0 right-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
              <img
                src="/titlelogo.png"
                alt=""
                className="h-24 w-24 object-contain"
              />
            </Link>
            
            <div className="flex items-center gap-4 flex-grow justify-end max-w-lg">
              <SearchForm 
                onSearch={handleSearch}
                isLoading={isLoading}
                className="flex-grow max-w-md"
              />
            </div>
          </nav>
        </div>
      </header>

      <SearchModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        searchResults={searchResults}
      />
    </>
  );
}

export default Header;