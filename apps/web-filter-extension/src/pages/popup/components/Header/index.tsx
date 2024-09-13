import React from 'react';

import {Container} from '@pages/popup/components/Header/header.styles';

export const Header: React.FC = () => {
  return (
    <Container>
      <div className="left-section">
        <div className="img-container">
          <img src="/assets/images/safekidsAiLogo.svg" alt="Safekids Logo"/>
        </div>
        <p className="title">at Home</p>
      </div>
    </Container>
  );
};
