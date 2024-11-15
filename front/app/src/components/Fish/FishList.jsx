import PropTypes from "prop-types";
import SeasonTerm from "./SeasonTerm";
import React from "react";
import SearchForm from "./SearchForm";

const FishList = ({ fishes, onSearch, isLoading }) => {
  return (
    <div>
      <SearchForm onSearch={onSearch} isLoading={isLoading} />
      {isLoading ? (
        <div className="flex justify-center">
          <p>検索中...</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {fishes.map((fish) => (
            <div key={fish.id} className="flex flex-col items-center">
              <img
                src={fish.image_url}
                alt={fish.name}
                className="w-24 h-24 object-contain"
              />
              <p className="text-center mt-2">{fish.name}</p>
              <SeasonTerm
                startDate={fish.fish_seasons[0].start_date}
                endDate={fish.fish_seasons[0].end_date}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

FishList.propTypes = {
  fishes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      image_url: PropTypes.string.isRequired,
      fish_seasons: PropTypes.arrayOf(
        PropTypes.shape({
          start_date: PropTypes.string.isRequired,
          end_date: PropTypes.string.isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
};

export default FishList;
