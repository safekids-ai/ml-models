import React from 'react';
import { cleanup, screen, render, fireEvent } from '@testing-library/react';

import CategoriesHeader from './index';

const KidDataTemp = [
    {
        id: '123',
        name: 'Kid 1',
        categories: [
            {
                id: 'ENTERTAINMENT_NEWS_STREAMING',
                name: 'Entertainment News and Streaming',
                enabled: true,
                status: 'ALLOW',
            },
            {
                id: 'DRUGS_ALCOHOL_TOBACCO',
                name: 'Drugs, Alcohol, or Tobacco Related',
                enabled: true,
                status: 'PREVENT',
            },
        ],
    },
    {
        id: '456',
        name: 'Kid 2',
        categories: [
            {
                id: 'ENTERTAINMENT_NEWS_STREAMING',
                name: 'Entertainment News and Streaming',
                enabled: true,
                status: 'ALLOW',
            },
            {
                id: 'DRUGS_ALCOHOL_TOBACCO',
                name: 'Drugs, Alcohol, or Tobacco Related',
                enabled: true,
                status: 'PREVENT',
            },
        ],
    },
];

const KidData = [
    {
        id: '123',
        name: 'Kid 1',
    },
    {
        id: '456',
        name: 'Kid 2',
    },
];

const selectedKidData = {
    id: '123',
    name: 'Kid 1',
};

const mockedSaveData = jest.fn();
const mockedSetSelectedKid = jest.fn();

const Component = (
    <CategoriesHeader
        btnLoading={false}
        enableSave={true}
        kidsData={KidData}
        saveData={mockedSaveData()}
        selectedKid={selectedKidData}
        setSelectedKid={mockedSetSelectedKid()}
    />
);

describe('Kid Settings => Filtered Categories Footer', () => {
    beforeEach(() => {
        cleanup();
    });
    afterEach(() => {
        cleanup();
    });

    test('Filtered Categories Header component is rendering dropdown text correctly', () => {
        render(Component);
        expect(screen.getByText(/Choose a family member:/i)).toBeInTheDocument();
    });

    test('Filtered Categories Header component button is rendering text correctly', () => {
        render(Component);
        expect(screen.getByText(/Save/i)).toBeInTheDocument();
    });

    test('Filtered Categories Header component button is performing onclick event on button correctly', async () => {
        const { getByTestId } = render(Component);
        fireEvent.click(getByTestId('test-Save-btn'));
        expect(mockedSaveData).toHaveBeenCalled();
    });
});
