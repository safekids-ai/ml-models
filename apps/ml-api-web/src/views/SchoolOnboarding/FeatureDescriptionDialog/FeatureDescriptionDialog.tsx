import { Dialog, makeStyles } from '@mui/material';
import React from 'react';
import styled from 'styled-components';
import { Props } from './FeatureDescriptionDialog.types';
import CloseIcon from '@mui/icons-material/Close';
import { HelpIcon } from '../../../svgs/SchoolOnboarding';

const Root = styled.div`
    width: 780px;
    height: 375px;
    padding: 25px 30px 40px 50px;
    display: flex;
    flex-direction: column;
    & button {
        width: 290px;
        height: 60px;
        align-self: center;
        margin-top: 100px;
    }
    & svg {
        display: flex;
        align-self: self-end;
        height: 35px;
        fill: white;
        background-color: #c1c7d0;
        border-radius: 50%;
        width: 35px;
        padding: 5px;
        cursor: pointer;
    }
`;

const Title = styled.span`
    display: flex;
    font-family: 'Merriweather';
    font-style: normal;
    font-weight: 900;
    font-size: 28px;
    line-height: 35px;
    letter-spacing: -0.21875px;
    color: #4a4a4a;
    & svg {
        background-color: unset;
        cursor: default;
        width: 40px;
    }
`;

const Description = styled.span`
    max-width: 600px;
    margin-top: 20px;
    font-family: 'Lato';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
    color: #4a4a4a;
`;

const useStyles = makeStyles(() => ({
    paper: {
        border: '1px solid #979797',
        boxShadow: '0px 5px 4px rgba(0, 0, 0, 0.5)',
        borderRadius: '43px',
    },
}));

const FeatureDescriptionDialog = ({ onClose, description }: Props) => {
    const classes = useStyles();
    return (
        <Dialog maxWidth="xl" classes={{ paper: classes.paper }} open>
            <Root>
                <CloseIcon onClick={() => onClose()} />
                <Title>
                    How does this feature work?
                    <HelpIcon />
                </Title>
                <Description>{description}</Description>
            </Root>
        </Dialog>
    );
};

export default FeatureDescriptionDialog;
