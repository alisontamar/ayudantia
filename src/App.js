import { useState, useEffect } from 'react';
import { 
  Container, 
  AppBar, 
  Toolbar, 
  Typography, 
  Button,
  CssBaseline,
  Box
} from '@mui/material';
import { Auth } from './components/auth';
import  {ListaPuntos}  from './components/lista-puntos';
import { supabase } from './config/supabaseClient';
import RoleSelector from './components/role-selector';

function App() {
  const [role, setRole] = useState(null); // Estado para almacenar el rol real del usuario
  const [session, setSession] = useState(null); // Estado para la sesión del usuario
  const [loading, setLoading] = useState(true); // Estado para manejar la carga

  useEffect(() => {
    const fetchSession = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);

      if (session?.user) {
        const { data: userData, error } = await supabase
          .from("users")
          .select("role")
          .eq("id", session.user.id)
          .single();

        if (!error && userData) {
          setRole(userData.role); // Guardamos el rol real del usuario
        }
      }
      setLoading(false);
    };

    fetchSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        fetchSession(); // Volver a obtener datos cuando cambie la sesión
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleRoleSelected = (selectedRole) => {
    setRole(selectedRole);
    if (selectedRole === 'alumno') {
      setSession({ user: { role: 'alumno' } });
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography>Cargando...</Typography>
      </Box>
    );
  }

  if (!role) {
    return <RoleSelector onRoleSelected={handleRoleSelected} />;
  }

  if (!session && role === 'profesor') {
    return (
      <Auth onLogin={(session) => {
        setSession(session);
        if (session?.user) {
          supabase
            .from("users")
            .select("role")
            .eq("id", session.user.id)
            .single()
            .then(({ data, error }) => {
              if (!error && data) {
                setRole(data.role);
              }
            });
        }
      }} />
    );
  }

  return (
    <>
      <CssBaseline />
      <AppBar position="static" sx={{ backgroundColor: "black" }}>

        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Sistema de Ayudantía
          </Typography>
          <Button color="inherit" onClick={() => setRole(null)}>
            Cambiar rol
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <ListaPuntos role={role} />
      </Container>
    </>
  );
}

export default App;
