import { useState } from 'react';
import { Button, Typography, Box, Container } from '@mui/material';
import { Auth } from './auth';

export default function RoleSelector({ onRoleSelected }) {
  const [role, setRole] = useState(null);
  const [showLogin, setShowLogin] = useState(false);

  const handleRoleSelection = (selectedRole) => {
    setRole(selectedRole);
    if (selectedRole === 'alumno') {
      onRoleSelected(selectedRole);
    } else if (selectedRole === 'profesor') {
      setShowLogin(true);
    }
  };

  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',

      }}
    >
      <Box
        sx={{
          p: 4,
          backgroundColor: '#EAEAEA',
          borderRadius: 2,
          boxShadow: 3,
          textAlign: 'center',
        }}
      >
        <Typography variant="h4" gutterBottom>
          Bienvenido al Sistema de Ayudantía
        </Typography>
        <Typography variant="body1" gutterBottom>
          Selecciona tu rol para continuar:
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 3 }}>
          <Button
            variant={role === 'profesor' ? 'contained' : 'outlined'}
            onClick={() => handleRoleSelection('profesor')}
             sx={{ 
      backgroundColor: role === 'profesor' ? '#000000' : 'transparent',
      color: role === 'profesor' ? 'white' : '#000000',
      borderColor: '#000000',
      '&:hover': { backgroundColor: '#333333', color: 'white' }
    }}
          >
            Profesor
          </Button>
          <Button
            variant={role === 'alumno' ? 'contained' : 'outlined'}
            onClick={() => handleRoleSelection('alumno')}
            sx={{ 
              backgroundColor: role === 'profesor' ? '#000000' : 'transparent',
              color: role === 'profesor' ? 'white' : '#000000',
              borderColor: '#000000',
              '&:hover': { backgroundColor: '#333333', color: 'white' }
            }}
          >
            Alumno
          </Button>
        </Box>

        {showLogin && role === 'profesor' && (
          <Box sx={{ mt: 4 }}>
            <Auth onLogin={() => onRoleSelected('profesor')} />
          </Box>
        )}
      </Box>
    </Container>
  );
}