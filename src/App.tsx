import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { useState } from "react";
import { lightTheme, darkTheme } from "./theme";
import UsersList from "./pages/UsersList/UsersList.tsx";
import UserPage from "./pages/UserPage/UserPage.tsx";
import Layout from "./components/Layout/Layout.tsx";

function App() {
    const [darkMode, setDarkMode] = useState(false);
    const toggleTheme = () => setDarkMode(!darkMode);

    return (
        <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
            <CssBaseline />
            <BrowserRouter>
                <Routes>
                    <Route element={<Layout toggleTheme={toggleTheme} darkMode={darkMode} />}>
                        <Route path="/" element={<UsersList />} />
                        <Route path="/users/:id" element={<UserPage />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
