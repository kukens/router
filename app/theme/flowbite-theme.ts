import { createTheme } from "flowbite-react";
import { buttonTheme } from "flowbite-react";

export const appFlowbiteTheme = createTheme({
  button: {
    color: {
       light: `${buttonTheme.color.light} btn-light-shadow`,
       teal: `${buttonTheme.color.teal} btn-teal-shadow`,
       dark: `${buttonTheme.color.dark} btn-dark-shadow`,
       alternative: `${buttonTheme.color.alternative} btn-alt-shadow`,
    },
  },
});
