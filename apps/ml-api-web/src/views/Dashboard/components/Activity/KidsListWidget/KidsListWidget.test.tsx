import React from 'react';
import { cleanup, render } from '@testing-library/react';
import { ThemeProvider, Theme, StyledEngineProvider } from '@mui/material';
import { theme } from '../../../../../theme';
import KidsListWidget from '.';
import { KidWidgetType } from '../SchoolActivity.type';


declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}


afterEach(cleanup);

const testData: KidWidgetType = {
    items: [
        {
            id: 2,
            userId: '1345',
            userName: 'Name',
            userEmail: 'talha@emumba.com',
            schoolName: 'ABC School',
            webUrl: 'www.games.com',
            prrCategory: 'Gaming',
            date: new Date('2022-05-18T18:25:07.000Z').toString(),
            accessLimited: false,
            limitAccess: false,
            firstName: 'first',
            lastName: 'last',
            prrLevel: 2,
            read: 0 // FIXME: unsure what value should be
        },
    ],
    totalItems: 5,
};

const renderComponent = (level: number, showViewButton: boolean, eventList: KidWidgetType) =>
    render(
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
                <KidsListWidget level={level} event={eventList} showViewButton={showViewButton} />
            </ThemeProvider>
        </StyledEngineProvider>,
    );

test("it renders See All button if 'showViewButton' is true", () => {
    const { queryByRole } = renderComponent(2, true, testData);
    expect(queryByRole('button', { name: 'SEE ALL' })).toBeTruthy();
});
