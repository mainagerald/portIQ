import React, { ChangeEvent, SyntheticEvent } from "react";
import { FiSearch } from "react-icons/fi";

interface Props {
  onSearchSubmit: (e: SyntheticEvent) => void;
  search: string | undefined;
  handleSearchChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const Search: React.FC<Props> = ({
  onSearchSubmit,
  search,
  handleSearchChange,
}: Props): JSX.Element => {
  return (
    <section className="bg-blue-200">
      <div className="max-w-4xl mx-auto p-6">
        <form
          className="flex items-center bg-white rounded-lg shadow-md"
          onSubmit={onSearchSubmit}
        >
          <div className="flex-grow">
            <input
              className="w-full px-4 py-3 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 placeholder-gray-600"
              id="search-input"
              placeholder="Search companies"
              value={search}
              onChange={handleSearchChange}
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 rounded-r-lg text-blue font-semibold transition-colors duration-300"
          >
            <FiSearch />
          </button>
        </form>
      </div>
    </section>
  );
};

export default Search;
