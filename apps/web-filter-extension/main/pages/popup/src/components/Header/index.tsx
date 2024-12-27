import React from 'react';

import {Container} from '@src/components/Header/header.styles';

export const Header: React.FC = () => {
  return (
    <Container>
      <div className="left-section">
        <div className="img-container">
          <img src="/pages/popup/images/safekidsAiLogo.svg" alt="Safekids Logo"/>
        </div>
        <p className="title">at Home</p>
      </div>
    </Container>
  );
};
