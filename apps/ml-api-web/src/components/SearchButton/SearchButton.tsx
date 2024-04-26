import React from 'react';
import { Props } from './SearchButton.type';
import SearchIcon from '@mui/icons-material/Search';
import { SearchBtn } from './SearchButton.style';

const SearchButton = ({ onClick }: Props) => (
    <SearchBtn onClick={onClick} variant="contained">
        <Search /> <span className="search-span">Search</span>
    </SearchBtn>
);

export default SearchButton;
