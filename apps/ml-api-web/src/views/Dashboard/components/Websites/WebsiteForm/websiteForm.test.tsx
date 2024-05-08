import React from 'react';
import { cleanup, screen, render, fireEvent } from '@testing-library/react';
import { IFilteredWebsites } from '../website.types';
import WebsitesForm from './index';
import { addUrls, removeUrlItem } from './websiteForms.utility';

const mockData: IFilteredWebsites[] = [
    {
        id: 'f60ccea1-3594-42b1-ac0f-ce2bf471ae1b',
        name: 'Kid 1',
        urls: [
            {
                name: 'javascript.plainenglish.io',
                enabled: true,
            },
            {
                name: 'v4.mui.com',
                enabled: true,
            },
            {
                name: 'meet.google.com',
                enabled: true,
            },
            {
                name: 'developer.mozilla.org',
                enabled: true,
            },
        ],
    },
    {
        id: 'f8f38787-c5af-4e62-8d53-29f2735d339d',
        name: 'Kid 2',
        urls: [
            {
                name: 'www.instagram.com',
                enabled: true,
            },
            {
                name: 'https://discord.com/',
                enabled: true,
            },
        ],
    },
];

const Component = <WebsitesForm filteredWebsites={mockData} clearSelectedKidId={() => jest.fn()} externalSelectedKidId="" />;

describe('Kid Settings => Filtered Categories Table', () => {
    beforeEach(() => {
        cleanup();
    });
    afterEach(() => {
        cleanup();
    });

    test('Filtered Websites Form component is rendering text correctly', () => {
        render(Component);
        expect(screen.getByText(/Choose a family member:/i)).toBeInTheDocument();
        expect(screen.getByText(/Always Allowed/i)).toBeInTheDocument();
        expect(screen.getByText(/To add more websites to this list, copy and paste them here/i)).toBeInTheDocument();
    });

    test('Filtered Websites Add sites button are disabled by default', () => {
        render(Component);
        const addBtn = screen.getByTestId(/test-Add-btn/i);
        expect(addBtn).toBeDisabled();
    });
    test('Filtered Websites Form is displaying the default selected kid websites list correctly', () => {
        render(Component);
        const list = screen.getAllByRole('list');
        const listItems = screen.getAllByRole('listitem');
        expect(list.length).toEqual(1);
        expect(listItems.length).toEqual(mockData[0]?.urls?.length);
    });
    test('Filtered Websites Form is displaying the default selected kid websites remove buttons in the list correctly', () => {
        render(Component);
        const removeBtn = screen.getAllByTestId(/test-remove-btn/i);
        expect(removeBtn.length).toEqual(mockData[0]?.urls?.length);
    });
    test('Filtered Websites Form is displaying the inputs correctly', () => {
        render(Component);
        const inputName = screen.getByRole('textbox').getAttribute('name');
        const inputPlaceHolder = screen.getByRole('textbox').getAttribute('placeholder');
        expect(inputName).toBe('add-websites-input');
        expect(inputPlaceHolder).toBe('Enter website(s) here');
    });
    test('Filtered Websites Form is displaying the added urls via inputs correctly', async () => {
        render(Component);
        const input = screen.getByRole('textbox');
        const addBtn = screen.getByTestId('test-Add-btn');
        await fireEvent.change(input, { target: { value: 'tutorialspoint.com' } });
        await fireEvent.click(addBtn);
        const listItems = screen.getAllByRole('listitem');
        expect(listItems.length).toEqual(mockData[0]?.urls?.length);
    });
    test('Filtered Websites Form is removing URLs correctly', async () => {
        render(Component);
        const removeBtn = screen.getAllByTestId(/test-remove-btn/i);
        await fireEvent.click(removeBtn[0]);
        const listItems = screen.getAllByRole('listitem');
        expect(listItems.length).toEqual(mockData[0]?.urls?.length - 1);
    });
});

test('Add Urls function from utility is working properly', () => {
    const urlsToAdd = 'hbo.com,foxnews.com, cnn.com';
    const totalNewUrls = urlsToAdd.split(',').length;
    const newMockData = addUrls(urlsToAdd, mockData[0].id, mockData);
    expect(newMockData.id).toBeTruthy();
    expect(newMockData.name).toBeTruthy();
    expect(newMockData.urlsToAdd.length).toEqual(totalNewUrls);
    expect(newMockData.nonFilteredUrls.length).toEqual(mockData[0].urls.length + totalNewUrls);
});

test('Remove Urls function from utility is working properly', async () => {
    const selectedUrls = mockData[0].urls;
    const length = selectedUrls.length;
    const newMockUrlsLength = removeUrlItem(mockData[0].id, selectedUrls[0].name, mockData)[0].urls;
    expect(newMockUrlsLength.length).toEqual(length - 1);
});
