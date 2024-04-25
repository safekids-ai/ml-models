import React from 'react';
import loader from '../../images/loader.gif';
import { LoaderContainer } from './Loader.style';

const Loader = () => (
    <LoaderContainer>
        <span className="loading-text">
            Please <span className="red-text">wait a moment</span>...
        </span>
        <img src={loader} alt="Loader"></img>
    </LoaderContainer>
);

export default Loader;
