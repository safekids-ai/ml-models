import React from 'react';
import { Formik } from 'formik';
import { CustomSelectField, SubmitButton } from '../../../../../../components/InputFields';
import { makeStyles, MenuItem } from '@mui/material';
import { Root, SelectSection } from './categoriesHeader.style';
import { IKid } from '../categories.types';

type Values = {
    selectedKid: IKid | string;
};

interface Props {
    kidsData: IKid[];
    selectedKid: IKid;
    setSelectedKid: (selectedId: string) => void;
    enableSave: boolean;
    saveData: () => void;
    btnLoading: boolean;
}

const useStyles = makeStyles({
    field: {
        minHeight: '48px',
        background: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0px 12px',
        '& .date-field, & .select-field': {
            display: 'flex',
            justifyContent: 'center',
            '& .MuiInputBase-input': {
                fontFamily: 'Lato',
                fontWeight: '400',
                fontSize: '14px',
                lineHeight: '18px',
                color: '#FA6400',
            },
        },
    },
    selectField: {
        height: '48px',
        width: '146px',
        border: '2px solid #7A7A7A',
        borderRadius: '7.93px',
        '& .MuiInputLabel-root': {
            display: 'none',
        },
        '&:hover': {
            border: '2px solid #000',
        },
    },
});

const CategoriesHeader = ({ kidsData, selectedKid, setSelectedKid, enableSave, saveData, btnLoading }: Props) => {
    const classes = useStyles();
    return (
        <>
            <Formik
                initialValues={{
                    selectedKid: selectedKid.id,
                }}
                enableReinitialize
                onSubmit={(values: Values) => {
                    console.log(values);
                }}
            >
                {() => {
                    return (
                        <form onSubmit={() => {}}>
                            <Root>
                                <SelectSection>
                                    <span className="select-label">Choose a family member:</span>
                                    <div className={`${classes.selectField} ${classes.field}`}>
                                        <CustomSelectField
                                            name="selectedKid"
                                            label={null}
                                            variant={'standard'}
                                            className="select-field"
                                            multiple={false}
                                            onChange={(e: any) => {
                                                setSelectedKid(e?.target?.value);
                                            }}
                                            SelectProps={{ displayEmpty: true }}
                                        >
                                            {kidsData.map((kData) => (
                                                <MenuItem key={kData.id} value={kData.id}>
                                                    {kData.name}
                                                </MenuItem>
                                            ))}
                                        </CustomSelectField>
                                    </div>
                                </SelectSection>
                                <SubmitButton
                                    isSubmitting={btnLoading}
                                    marginTop={0}
                                    text={'Save'}
                                    disabled={enableSave}
                                    marginBottom={20}
                                    onClick={(e: React.MouseEvent<HTMLElement>) => {
                                        e.preventDefault();
                                        saveData();
                                    }}
                                    id="test-Save-btn"
                                    data-testid="test-Save-btn"
                                />
                            </Root>
                        </form>
                    );
                }}
            </Formik>
        </>
    );
};

export default CategoriesHeader;
