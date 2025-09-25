import { Outlet } from 'react-router-dom';
import Header from '../Header/Header.tsx';
import styles from './Layout.module.css';

type LayoutProps = {
  toggleTheme: () => void;
  darkMode: boolean;
};

export default function Layout({ toggleTheme, darkMode }: LayoutProps) {
  return (
    <>
      <Header toggleTheme={toggleTheme} darkMode={darkMode} />
      <main className={styles.main}>
        <Outlet />
      </main>
    </>
  );
}
