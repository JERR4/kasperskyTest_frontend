import React, { memo, useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Alert,
} from '@mui/material';
import type { Group } from '../../types/types.ts';
import { validateUser } from '../../utils/validation.ts';
import type { ValidationErrors } from '../../utils/validation.ts';

type FormValues = {
  name: string;
  email: string;
  age: number | '';
};

type FormValuesWithGroupId = FormValues & {
  groupId: number | 'none';
};

type Props = {
  values: FormValuesWithGroupId;
  groups: Group[];
  error: string;
  success: boolean;
  loading: boolean;
  submitLabel: string;
  onChange: (field: keyof FormValuesWithGroupId, value: string | number | 'none') => void;
  onSubmit: (e: React.FormEvent) => void;
};

const UserFormBase: React.FC<Props> = ({
  values,
  groups,
  error,
  success,
  loading,
  submitLabel,
  onChange,
  onSubmit,
}) => {
  const [errors, setErrors] = useState<ValidationErrors<FormValues>>({});

  const validateField = (field: keyof FormValues, value: string | number | 'none') => {
    const allErrors = validateUser({ ...values, [field]: value });
    setErrors((prev) => {
      const newErrors = { ...prev };

      if (allErrors[field]) {
        newErrors[field] = allErrors[field];
      } else {
        delete newErrors[field];
      }

      return newErrors;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateUser(values);
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSubmit(e);
    }
  };

  return (
    <Box
      component="form"
      noValidate
      onSubmit={handleSubmit}
      p={2}
      border="1px solid #ccc"
      borderRadius={2}
      mb={2}
    >
      <Stack spacing={2}>
        {error && <Alert severity="error">{error}</Alert>}

        <TextField
          label="Имя"
          value={values.name}
          onChange={(e) => onChange('name', e.target.value)}
          onInput={(e) => validateField('name', (e.target as HTMLInputElement).value)}
          error={Boolean(errors.name)}
          helperText={errors.name}
          required
        />

        <TextField
          label="Email"
          value={values.email}
          onChange={(e) => onChange('email', e.target.value)}
          onInput={(e) => validateField('email', (e.target as HTMLInputElement).value)}
          type="email"
          error={Boolean(errors.email)}
          helperText={errors.email}
          required
        />

        <TextField
          label="Возраст"
          value={values.age}
          onChange={(e) => {
            const val = e.target.value;
            onChange('age', val === '' ? '' : Number(val));
          }}
          onInput={(e) => {
            const val = (e.target as HTMLInputElement).value;
            validateField('age', val === '' ? '' : Number(val));
          }}
          type="number"
          error={Boolean(errors.age)}
          helperText={errors.age}
          required
        />

        <FormControl>
          <InputLabel>Группа</InputLabel>
          <Select
            value={values.groupId}
            onChange={(e) => onChange('groupId', e.target.value as number | 'none')}
            label="Группа"
          >
            <MenuItem value="none">Без группы</MenuItem>
            {groups.map((g) => (
              <MenuItem key={g.id} value={g.id}>
                {g.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          type="submit"
          variant="contained"
          disabled={loading || Object.keys(errors).length > 0}
          sx={{
            background: success ? 'linear-gradient(45deg, #4caf50, #81c784)' : undefined,
            color: success ? '#fff' : undefined,
            transition: 'all 0.5s ease',
          }}
        >
          {loading ? 'Сохраняем...' : success ? 'Сохранено!' : submitLabel}
        </Button>
      </Stack>
    </Box>
  );
};

export default memo(UserFormBase);
