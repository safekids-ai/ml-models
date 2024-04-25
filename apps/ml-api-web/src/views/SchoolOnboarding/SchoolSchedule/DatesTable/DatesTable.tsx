import React from 'react';
import styled from 'styled-components';
import { Props } from './DatesTable.types';

const Root = styled.div`
    display: flex;
    flex-direction: column;
`;

const Heading = styled.span`
    font-family: 'Lato';
    font-style: normal;
    font-weight: 400;
    font-size: 18px;
    line-height: 18px;
    border: 1px solid #565555;
    padding: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;
    color: #000000;
`;

const Content = styled.div`
    align-self: stretch;
    border: 1px solid #565555;
    height: 300px;
    padding: 10px 15px;
    overflow-y: auto;
    color: #000000;
    display: flex;
    flex-direction: column;
`;

const DateContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 10px;
`;

const RemoveIcon = styled.div`
    border-radius: 50%;
    background-color: #000;
    width: 13px;
    height: 13px;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 8px;
    line-height: 9px;
    cursor: pointer;
`;

const DatesTable = ({ data, removeDate }: Props) => {
    return (
        <>
            <Root>
                <Heading>Additional Non-School Days ‘22-’23</Heading>
                <Content>
                    {!data.length ? (
                        <span>(e.g. Dec 22 - Jan 4)</span>
                    ) : (
                        data.map((date) => (
                            <DateContainer>
                                <span>{date}</span>
                                <RemoveIcon onClick={() => removeDate(date)}>x</RemoveIcon>
                            </DateContainer>
                        ))
                    )}
                </Content>
            </Root>
        </>
    );
};

export default DatesTable;
