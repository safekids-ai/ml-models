import React from 'react';
import { cleanup, screen, render, fireEvent } from '@testing-library/react';
import { IFilteredProcesses } from '../Processes.types';
import ProcessForm from './ProcessesForm';
import { addProcesses, removeProcessItem } from './ProcessesForm.utility';

const mockData: IFilteredProcesses[] = [
    {
        id: 'f60ccea1-3594-42b1-ac0f-ce2bf471ae1b',
        name: 'Kid 1',
        processes: [
            {
                name: 'javascript.plainenglish.io',
                isAllowed: true,
            },
            {
                name: 'v4.mui.com',
                isAllowed: true,
            },
            {
                name: 'meet.google.com',
                isAllowed: true,
            },
            {
                name: 'developer.mozilla.org',
                isAllowed: true,
            },
        ],
    },
    {
        id: 'f8f38787-c5af-4e62-8d53-29f2735d339d',
        name: 'Kid 2',
        processes: [
            {
                name: 'www.instagram.com',
                isAllowed: true,
            },
            {
                name: 'https://discord.com/',
                isAllowed: true,
            },
        ],
    },
];

const Component = <ProcessForm filteredProcesses={mockData} clearSelectedKidId={() => jest.fn()} externalSelectedKidId="" />;

describe('Kid Settings => Filtered Processes Table', () => {
    beforeEach(() => {
        cleanup();
    });
    afterEach(() => {
        cleanup();
    });

    test('Filtered Processes Form component is rendering text correctly', () => {
        render(Component);
        expect(screen.getByText(/Choose a family member:/i)).toBeInTheDocument();
        expect(screen.getByText(/Always Allowed/i)).toBeInTheDocument();
        expect(screen.getByText(/To add more items to this list, copy and paste them here/i)).toBeInTheDocument();
    });

    test('Filtered Processes Add sites button are disabled by default', () => {
        render(Component);
        const addBtn = screen.getByTestId(/test-Add-btn/i);
        expect(addBtn).toBeDisabled();
    });
    test('Filtered Processes Form is displaying the default selected kid websites list correctly', () => {
        render(Component);
        const list = screen.getAllByRole('list');
        const listItems = screen.getAllByRole('listitem');
        expect(list.length).toEqual(1);
        expect(listItems.length).toEqual(mockData[0]?.processes?.length);
    });
    test('Filtered Processes Form is displaying the default selected kid websites remove buttons in the list correctly', () => {
        render(Component);
        const removeBtn = screen.getAllByTestId(/test-remove-btn/i);
        expect(removeBtn.length).toEqual(mockData[0]?.processes?.length);
    });
    test('Filtered Processes Form is displaying the inputs correctly', () => {
        render(Component);
        const inputName = screen.getByRole('textbox').getAttribute('name');
        const inputPlaceHolder = screen.getByRole('textbox').getAttribute('placeholder');
        expect(inputName).toBe('add-processes-input');
        expect(inputPlaceHolder).toBe('Enter process(s) here');
    });
    test('Filtered Processes Form is displaying the added processes via inputs correctly', async () => {
        render(Component);
        const input = screen.getByRole('textbox');
        const addBtn = screen.getByTestId('test-Add-btn');
        await fireEvent.change(input, { target: { value: 'tutorialspoint.com' } });
        await fireEvent.click(addBtn);
        const listItems = screen.getAllByRole('listitem');
        expect(listItems.length).toEqual(mockData[0]?.processes?.length);
    });
    test('Filtered Processes Form is removing Processes correctly', async () => {
        render(Component);
        const removeBtn = screen.getAllByTestId(/test-remove-btn/i);
        await fireEvent.click(removeBtn[0]);
        const listItems = screen.getAllByRole('listitem');
        expect(listItems.length).toEqual(mockData[0]?.processes?.length - 1);
    });
});

test('Add processes function from utility is working properly', () => {
    const processToAdd = 'hbo.com,foxnews.com, cnn.com';
    const processes = processToAdd.split(',').length;
    const newMockData = addProcesses(processToAdd, mockData[0].id, mockData);
    expect(newMockData.id).toBeTruthy();
    expect(newMockData.name).toBeTruthy();
    expect(newMockData.processesToAdd.length).toEqual(processes);
    expect(newMockData.nonFilteredProcesses.length).toEqual(mockData[0].processes.length + processes);
});

test('Remove processes function from utility is working properly', async () => {
    const selectedProcesses = mockData[0].processes;
    const length = selectedProcesses.length;
    const newMockProcessesLength = removeProcessItem(mockData[0].id, selectedProcesses[0].name, mockData)[0].processes;
    expect(newMockProcessesLength.length).toEqual(length - 1);
});
