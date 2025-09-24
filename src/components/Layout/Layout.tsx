import { Outlet } from "react-router-dom";
import Header from "../Header.tsx";
import "./Layout.css";

type LayoutProps = {
    toggleTheme: () => void;
    darkMode: boolean;
};

export default function Layout({ toggleTheme, darkMode }: LayoutProps) {
    return (
        <>
            <Header toggleTheme={toggleTheme} darkMode={darkMode} />
            <main className="main">
                <Outlet />
            </main>
        </>
    );
}
