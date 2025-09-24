import { createTheme } from "@mui/material/styles";

export const lightTheme = createTheme({
    palette: {
        mode: "light",
        primary: { main: "#646cff" },
        background: { default: "#ffffff", paper: "#f9f9f9" },
        text: { primary: "#213547" },
    },
});

export const darkTheme = createTheme({
    palette: {
        mode: "dark",
        primary: { main: "#646cff" },
        background: { default: "#1b1b1b", paper: "#1a1a1a" },
        text: { primary: "rgba(255, 255, 255, 0.87)" },
    },
});
