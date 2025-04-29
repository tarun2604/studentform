import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Paper, Alert } from '@mui/material';
import { createUser, getForm } from '../services/api';
import { UserData, FormResponse } from '../types/form';

interface LoginProps {
  onLoginSuccess: (formData: FormResponse) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [userData, setUserData] = useState<UserData>({
    rollNumber: '',
    name: '',
  });
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await createUser(userData);
      const formData = await getForm(userData.rollNumber);
      onLoginSuccess(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        padding: 2,
      }}
    >
      <Paper elevation={3} sx={{ padding: 4, maxWidth: 400, width: '100%' }}>
        <Typography variant="h5" component="h1" gutterBottom align="center">
          Student Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Roll Number"
            value={userData.rollNumber}
            onChange={(e) => setUserData({ ...userData, rollNumber: e.target.value })}
            margin="normal"
            required
            disabled={isLoading}
          />
          <TextField
            fullWidth
            label="Name"
            value={userData.name}
            onChange={(e) => setUserData({ ...userData, name: e.target.value })}
            margin="normal"
            required
            disabled={isLoading}
          />
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 3 }}
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Login; 