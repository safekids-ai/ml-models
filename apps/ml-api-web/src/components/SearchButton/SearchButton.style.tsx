import styled from 'styled-components';
import { Button } from '@mui/material';

export const SearchBtn = styled(Button)`
    height: 40px;
    width: 170px;
    display: flex;
    justify-content: start;
    color: white;
    background: #ff3a29;
    border-radius: 6px;
    & .search-span {
        font-family: 'Lato';
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 22px;
        text-transform: capitalize;
        margin-left: 10px;
    }
    &:hover {
        background-color: #ff3a29;
    }
`;
