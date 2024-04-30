import React from 'react';
import { Props } from './SearchButton.type';
import { SearchBtn } from './SearchButton.style';
import SearchIcon from '@mui/icons-material/Search';
const SearchButton = ({ onClick }: Props) => (
    <SearchBtn onClick={onClick} variant="contained">
        <SearchIcon/> <span className="search-span">Search</span>
    </SearchBtn>
);

export default SearchButton;
