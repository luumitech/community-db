import React from 'react';
import { SearchBar, type SearchBarProps } from './search-bar';

interface Props extends SearchBarProps {}

export const PropertySearchBar: React.FC<Props> = ({ ...searchBarProps }) => {
  return <SearchBar {...searchBarProps} />;
};
