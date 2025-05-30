import React from 'react';
import { cleanup, fireEvent, render, wait } from '@testing-library/react';

import AddKid from './AddKid';

afterEach(cleanup);


test('it renders correct title', async () => {
    const { getAllByText, getByText } = render(<AddKid isOnBoarding nextStep={jest.fn()} />);
    await wait();
    const title = getAllByText(/Add Kid/i);
    expect(title).toBeTruthy();

});

test('it renders correct form', async () => {
    const { getByTestId, queryByTestId } = render(<AddKid isOnBoarding nextStep={jest.fn()} />);
    await wait();
    const firstNameField = getByTestId('kid-firstname-field');
    const lastNameField = getByTestId('kid-lastname-field');
    const dOBField = getByTestId('kid-dob-field');
    const addMoreButton = getByTestId('kid-add-button');
    const NextButton = getByTestId('kid-submit-button');
    const removeButton = queryByTestId('remove-kid-button');

    expect(firstNameField).toBeInTheDocument();
    expect(lastNameField).toBeInTheDocument();
    expect(dOBField).toBeInTheDocument();
    expect(addMoreButton).toBeEnabled();
    expect(NextButton).toBeDisabled();
    expect(removeButton).not.toBeInTheDocument();
});

test('it renders a new form when add more button clicked', async () => {
    const { getAllByTestId, getByTestId } = render(<AddKid isOnBoarding nextStep={jest.fn()} />);
    await wait();
    const addMoreButton = getByTestId('kid-add-button');
    fireEvent.click(addMoreButton);
    await wait();
    const firstNameField = getAllByTestId('kid-firstname-field');
    const lastNameField = getAllByTestId('kid-lastname-field');
    const dOBField = getAllByTestId('kid-dob-field');
    const removeButton = getAllByTestId('remove-kid-button');

    expect(firstNameField).toHaveLength(2);
    expect(lastNameField).toHaveLength(2);
    expect(dOBField).toHaveLength(2);
    expect(removeButton).toHaveLength(2);
});

test('it deletes a form when remove button clicked', async () => {
    const { getAllByTestId, getByTestId, queryByTestId } = render(<AddKid isOnBoarding nextStep={jest.fn()} />);
    await wait();
    const addMoreButton = getByTestId('kid-add-button');
    fireEvent.click(addMoreButton);
    await wait();
    fireEvent.click(getAllByTestId('remove-kid-button')[0]);
    await wait();
    const firstNameField = getAllByTestId('kid-firstname-field');
    const lastNameField = getAllByTestId('kid-lastname-field');
    const dOBField = getAllByTestId('kid-dob-field');
    const removeButton = queryByTestId('remove-kid-button');

    expect(firstNameField).toHaveLength(1);
    expect(lastNameField).toHaveLength(1);
    expect(dOBField).toHaveLength(1);
    expect(removeButton).not.toBeInTheDocument();
});

test('it enables the submit button with valid values', async () => {
    const { getByTestId } = render(<AddKid isOnBoarding nextStep={jest.fn()} />);
    await wait();
    const firstNameField = getByTestId('kid-firstname-field');
    const lastNameField = getByTestId('kid-lastname-field');
    const dOBField = getByTestId('kid-dob-field');
    fireEvent.change(firstNameField, { target: { value: 'John' } });
    fireEvent.change(lastNameField, { target: { value: 'Smith' } });
    fireEvent.change(dOBField, { target: { value: '2004' } });
    await wait();

    const NextButton = getByTestId('kid-submit-button');
    expect(NextButton).toBeEnabled();
});

test('it shows correct text on onboarding flow', async () => {
    const { getAllByText } = render(<AddKid isOnBoarding nextStep={jest.fn()} />);
    await wait();
    const submitButtonText = getAllByText(/Next/i);

    expect(submitButtonText).toBeTruthy();
});

test('it shows correct text on setting flow', async () => {
    jest.spyOn(React, 'useEffect').mockImplementation(() => {
        jest.fn();
    });
    const { getAllByText } = render(<AddKid isOnBoarding={false} nextStep={jest.fn()} />);
    await wait();
    const addMoreText = getAllByText(/Want to add additional family members\? Press add more button/i);
    const submitButtonText = getAllByText(/Save/i);

    expect(addMoreText).toBeTruthy();
    expect(submitButtonText).toBeTruthy();
});
