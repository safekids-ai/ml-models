import React from 'react';
import { cleanup, screen, render } from '@testing-library/react';
import { IFilteredCategories, CategoryStatus } from '../categories.types';
import CategoriesTable from './index';

const KidDataTemp: IFilteredCategories = {
    id: '71e28ec7-4f8f-4699-a3ab-4219f50e3114',
    name: 'dwef fwef',
    categories: [
        { id: 'SOCIAL_MEDIA_CHAT', name: 'Social Media and Chat', enabled: true, status: CategoryStatus.ALLOW },
        { id: 'CRIMINAL_MALICIOUS', name: 'Criminal/Malicious', enabled: true, status: CategoryStatus.INFORM },
        { id: 'BODY_IMAGE', name: 'Body Image/Related to Disordered Eating', enabled: true, status: CategoryStatus.PREVENT },
        { id: 'FAKE_NEWS', name: 'Fake News', enabled: true, status: CategoryStatus.ASK },
    ],
};

const mockedUpdateCategoriesData = jest.fn();

const Component = <CategoriesTable updateCategoriesData={mockedUpdateCategoriesData} filteredCategoriesData={KidDataTemp} />;

describe('Kid Settings => Filtered Categories Table', () => {
    beforeEach(() => {
        cleanup();
    });
    afterEach(() => {
        cleanup();
    });

    test('Filtered Categories Table component is rendering Table Heading text correctly', () => {
        render(Component);
        expect(screen.getByText(/Ask for/i)).toBeInTheDocument();
        expect(screen.getByText(/but inform/i)).toBeInTheDocument();
    });

    test('Filtered Categories Table component is rendering Table categories correctly', () => {
        render(Component);
        KidDataTemp.categories.forEach((category) => {
            expect(screen.getByText(category.name)).toBeInTheDocument();
        });
    });

    test('Filtered Categories Table component is rendering Table rows correctly', () => {
        const { getAllByRole } = render(Component);
        expect(getAllByRole('row')).toHaveLength(KidDataTemp.categories.length + 1);
    });

    test('Filtered Categories Table component is rendering Radio Buttons correctly', () => {
        const { getAllByRole } = render(Component);
        expect(getAllByRole('radio')).toHaveLength(KidDataTemp.categories.length * 4);
    });

    test('Filtered Categories Table component is rendering Radio Buttons correctly', () => {
        const { getAllByRole } = render(Component);
        const columnRadio = getAllByRole('radio');
        const checkedItems = columnRadio.filter((el) => el.checked);
        expect(checkedItems.length).toEqual(KidDataTemp.categories.length);
    });
});
