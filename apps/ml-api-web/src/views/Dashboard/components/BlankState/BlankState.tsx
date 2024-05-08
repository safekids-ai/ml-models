import React from 'react';
import { TextContainer } from './BlankState.style';

const BlankState = () => (
    <TextContainer>
        <span className="heading">
            <span className="red-text">PLEASE NOTE</span>:
        </span>
        <span className="description">Your search returned no results. Please try a new search.</span>
    </TextContainer>
);

export default BlankState;
