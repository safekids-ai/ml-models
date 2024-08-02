import { Theme } from '@mui/material/styles';

declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

declare module '@mui/material/styles' {
  interface Theme {
    colors: {
      [index:string]: string;
    };
  }

  interface ThemeOptions {
    colors?: {
      [index:string]: string;
    };
  }
}
