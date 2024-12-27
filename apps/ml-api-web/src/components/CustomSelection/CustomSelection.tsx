import React, { ReactNode } from 'react';
import { CustomSelectionStyled } from './CustomSelection.style';

type Props = {
    selectedValues: string[];
    values: string[];
    onSelect: (value: string) => void;
};

export const CustomSelection = (props: Props) => {
    const { selectedValues, values, onSelect } = props;
    return (
        <CustomSelectionStyled>
            {values?.map((value, index) => {
                return (
                    <div className="values-container" key={`listItem${index}`}>
                        <span
                            className={selectedValues.includes(value) ? 'selected-values' : 'values'}
                            onClick={() => {
                                onSelect(value);
                            }}>{`${value}`}</span>
                    </div>
                );
            })}
        </CustomSelectionStyled>
    );
};
