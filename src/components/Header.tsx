import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

type HeaderProps = {
  toggleTheme: () => void;
  darkMode: boolean;
};

export default function Header({ toggleTheme, darkMode }: HeaderProps) {
  return (
    <AppBar
      position="fixed"
      sx={{ width: '100vw', zIndex: 3, background: 'linear-gradient(90deg, #646cff, #4fc3f7)' }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6" component={Link} to="/" color="inherit">
          Сотрудники
        </Typography>

        <IconButton color="inherit" onClick={toggleTheme}>
          {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
