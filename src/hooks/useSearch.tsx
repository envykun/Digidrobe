import { useEffect, useState } from "react";

interface UseSearchProps<T> {
  data?: T;
}

export const useSearch = <T,>({ data }: UseSearchProps<T>) => {
  const [filteredData, setFilteredData] = useState<T | undefined>(data);
  const [searchQuery, setSearchQuery] = useState<string | undefined>();

  useEffect(() => {
    searchQuery ? handleSearch(searchQuery, data) : setFilteredData(data);
  }, [data, searchQuery]);

  const handleSearch = (query: string, data?: T) => {
    let tempData = data;

    tempData = handleTitleSearch(query, tempData) as T;

    setFilteredData(tempData);
  };

  const handleTitleSearch = (query: string, data?: T) => {
    if (!Array.isArray(data)) return;
    return data.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()));
  };

  return { searchedData: filteredData, onSearchQuery: setSearchQuery, searchQuery };
};
