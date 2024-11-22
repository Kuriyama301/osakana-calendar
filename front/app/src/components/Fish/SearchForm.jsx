import React, { useState } from "react";
import { Search, X } from "lucide-react";
import PropTypes from "prop-types";

const SearchForm = ({ onSearch, isLoading }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm);
    }
  };

  const handleClear = () => {
    setSearchTerm("");
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative flex items-center">
        <Search
          size={20}
          className="absolute left-3 text-blue-500"
          strokeWidth={2}
        />
        <input
          type="text"
          value={searchTerm}
          onChange={handleChange}
          placeholder="オサカナを検索"
          className="w-full pl-10 pr-12 py-2 bg-white border-2 border-gray-200 rounded-lg
            shadow-sm placeholder:text-gray-400 text-gray-900
            focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200
            transition duration-200 ease-in-out
            disabled:bg-gray-50 disabled:opacity-75"
          disabled={isLoading}
        />
        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2
              text-gray-600 bg-white hover:bg-gray-300 hover:text-gray-800 
              rounded-full p-2 transition-colors duration-200"
            disabled={isLoading}
            aria-label="クリア"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </form>
  );
};

SearchForm.propTypes = {
  onSearch: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export default SearchForm;
