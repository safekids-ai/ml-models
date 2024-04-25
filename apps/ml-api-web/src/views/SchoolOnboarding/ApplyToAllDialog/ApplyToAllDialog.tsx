import { Button, Dialog, makeStyles } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';
import { Props } from './ApplyToAllDialog.types';
import CloseIcon from '@material-ui/icons/Close';

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
    font-family: 'Merriweather';
    font-style: normal;
    font-weight: 900;
    font-size: 28px;
    line-height: 35px;
    letter-spacing: -0.21875px;
    color: #4a4a4a;
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

const ApplyToAllDialog = ({ onClose, onApply }: Props) => {
    const classes = useStyles();
    return (
        <Dialog maxWidth="xl" classes={{ paper: classes.paper }} open>
            <Root>
                <CloseIcon onClick={() => onClose()} />
                <Title>Are you sure?</Title>
                <Description>
                    It appears that you made at least one change at a lower level and by checking this box again at the root level, you’ll be negating the
                    change you made at that lower level. <br />
                    <br />
                    <b>Do you really want to override the changes you made?</b>
                </Description>
                <Button color="primary" variant="contained" onClick={() => onApply()}>
                    YES
                </Button>
            </Root>
        </Dialog>
    );
};

export default ApplyToAllDialog;
