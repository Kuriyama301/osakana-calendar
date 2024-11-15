import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import SearchForm from "../Fish/SearchForm";
import { searchFish } from "../../api/fish"; // API関数をインポート

function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleSearch = async (searchTerm) => {
    try {
      // eslint-disable-next-line no-unused-vars
      const results = await searchFish(searchTerm);
      // 検索結果を使用して必要な処理を行う
      // 例: モーダルで表示、特定の要素にスクロールなど
    } catch (error) {
      console.error('Search failed:', error);
      // エラー処理
    }
  };

  return (
    <header className="bg-white bg-opacity-85 backdrop-blur-md fixed top-0 left-0 right-0 z-10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex justify-between items-center h-16">
          <Link to="/" className="text-blue-500 text-2xl font-bold flex-shrink-0">
            オサカナカレンダー
          </Link>
          
          <div className="flex items-center gap-4 flex-grow justify-end max-w-lg">
            {isSearchOpen ? (
              <SearchForm 
                onSearch={handleSearch}
                className="flex-grow max-w-md"
              />
            ) : (
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="検索を開く"
              >
                <Search size={20} className="text-gray-500" />
              </button>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;