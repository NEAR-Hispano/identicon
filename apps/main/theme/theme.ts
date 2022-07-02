import { color, extendTheme, type ThemeConfig } from "@chakra-ui/react";
import { theme as proTheme } from "@chakra-ui/pro-theme";
import { colors } from "../constants/colors";

const sizes = {
  sizes: {
    ...proTheme.space,
    max: "max-content",
    min: "min-content",
    full: "100%",
    "3xs": "14rem",
    "2xs": "16rem",
    xs: "20rem",
    sm: "24rem",
    md: "28rem",
    lg: "32rem",
    xl: "76px",
    "2xl": "42rem",
    "3xl": "48rem",
    "4xl": "56rem",
    "5xl": "64rem",
    "6xl": "72rem",
    "7xl": "80rem",
    "8xl": "90rem",
    container: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
    },
  },
};

const fontSizes = {
    xs: "0.75rem",
    sm: "0.875rem",
    md: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
    "5xl": "3rem",
    "6xl": "3.75rem",
    "7xl": "4.5rem",
    "8xl": "6rem",
    "9xl": "8rem",
}

const space = {
    "1xs": "0.125rem",
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.25rem",
    xl: "1.5rem",
    "2xl": "1.75rem",
    "3xl": "2rem",
    "4xl": "2.5rem",
    "5xl": "3rem",
}

const radii = {
    "1xs": "0.125rem",
    xs: "0.25rem",
    sm: "0.5rem",
    md: "0.75rem",
    lm: "1rem",
    // lg: "0.25rem", // DON NOT USE THIS !
    xl: "1.5rem",
    "2xl": "1.5rem",
    "3xl": "2rem",
    "full": "100%",
}

const customTheme = extendTheme(
  {
    initialColorMode: "light",
    useSystemColorMode: false,
    colors: { ...colors, brand: colors.indigo },
    sizes,
    fontSizes,
    space,
    radii,
    styles: {
      global: () => ({
        body: {
          bg: "#F4F5F6",
        }
      })
    },
    fonts: {
      heading: "Meta Space",
      body: "Meta Space",
    },
  },
  proTheme
);

export default customTheme;
