import React, { memo } from 'react';
import { Breadcrumbs, Link, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

type Props = {
  userName?: string;
};

const UserBreadcrumbs: React.FC<Props> = ({ userName }) => {
  return (
    <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
      <Link component={RouterLink} to="/" underline="hover" color="inherit">
        Список пользователей
      </Link>
      {userName ? (
        <Typography color="text.primary">{userName}</Typography>
      ) : (
        <Typography color="text.primary">Профиль</Typography>
      )}
    </Breadcrumbs>
  );
};

export default memo(UserBreadcrumbs);
