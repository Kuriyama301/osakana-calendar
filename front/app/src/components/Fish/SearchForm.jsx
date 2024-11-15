import React, { useState } from 'react';
import { Search } from 'lucide-react';
import PropTypes from 'prop-types';

const SearchForm = ({ onSearch, isLoading }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <div className="mb-6">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="オサカナを検索"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-500 hover:text-blue-500 disabled:opacity-50"
          disabled={isLoading}
        >
          <Search size={20} />
        </button>
      </form>
    </div>
  );
};

SearchForm.propTypes = {
  onSearch: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  className: PropTypes.string
};

SearchForm.defaultProps = {
  isLoading: false,
  className: ''
};

export default SearchForm;