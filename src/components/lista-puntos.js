import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Grid from '@mui/material/Grid';
import { supabase } from '../config/supabaseClient';

export function ListaPuntos({ role }) {
  const [students, setStudents] = useState([]);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentParallel, setNewStudentParallel] = useState(1);
  const [filter, setFilter] = useState('global');

  useEffect(() => {
    fetchStudents(); // Cargar la lista inicialmente
  
    const subscription = supabase
      .channel('students-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'students' }, () => {
        fetchStudents(); // Refrescar la lista cuando haya cambios en la tabla
      })
      .subscribe();
  
    return () => {
      supabase.removeChannel(subscription); // Eliminar la suscripción cuando el componente se desmonte
    };
  }, [filter]); // Se ejecuta cuando cambia el filtro
  

  const fetchStudents = async () => {
    let query = supabase
      .from('students')
      .select('id, name, points, paralelo')
      .order('points', { ascending: false });

    if (filter === 'paralelo1') {
      query = query.eq('paralelo', 1);
    } else if (filter === 'paralelo2') {
      query = query.eq('paralelo', 2);
    } else if (filter === 'paralelo3') {
      query = query.eq('paralelo', 3);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching students:', error);
    } else {
      setStudents(data);
    }
  };

  const addStudent = async () => {
    if (!newStudentName.trim()) return;

    const { data, error } = await supabase
      .from('students')
      .insert([{ 
        name: newStudentName, 
        points: 0, 
        paralelo: newStudentParallel
      }])
      .select();

    if (error) {
      console.error('🚨 Error al agregar alumno:', error.message);
      return;
    }

    setStudents([...students, ...data]);
    setNewStudentName('');
    setNewStudentParallel(1);
  };

  const addPoint = async (studentId) => {
    const { error } = await supabase.rpc('increment_points', { student_id: studentId });
  
    if (error) {
      console.error('Error adding point:', error);
    } else {
      
       fetchStudents();
    }
  };
  
  const decrementPoint = async (studentId) => {
    const { error } = await supabase.rpc('decrement_points', { student_id: studentId });
  
    if (error) {
      console.error('Error subtracting point:', error);
    } else {
      fetchStudents();
    }
  };

  const getMedal = (index, points) => {
    const medals = ["🥇", "🥈", "🥉"];
    return points > 0 && index < 3 ? medals[index] : "";
  };

  return (
    <Paper sx={{ p: 3, width: '100%', maxWidth: 500, margin: 'auto' }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom align="center">
        🏆 Ranking
      </Typography>

      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <FormControl fullWidth>
          <InputLabel>Filtrar por</InputLabel>
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            label="Filtrar por"
          >
            <MenuItem value="global">Todos</MenuItem>
            <MenuItem value="paralelo1">Paralelo 1</MenuItem>
            <MenuItem value="paralelo2">Paralelo 2</MenuItem>
            <MenuItem value="paralelo3">Paralelo 3</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {role === 'profesor' && (
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={8}>
              <TextField
                label="Nombre del alumno"
                variant="outlined"
                fullWidth
                value={newStudentName}
                onChange={(e) => setNewStudentName(e.target.value)}
              />
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <InputLabel>Paralelo</InputLabel>
                <Select
                  value={newStudentParallel}
                  onChange={(e) => setNewStudentParallel(e.target.value)}
                  label="Paralelo"
                >
                  <MenuItem value={1}>1</MenuItem>
                  <MenuItem value={2}>2</MenuItem>
                  <MenuItem value={3}>3</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Button 
            variant="contained" 
            onClick={addStudent}
            disabled={!newStudentName.trim()}
            sx={{ 
              mt: 2, 
              backgroundColor: "#000", 
              color: "white", 
              "&:hover": { backgroundColor: "#333" } 
            }}
          >
            Agregar alumno
          </Button>
        </Box>
      )}

      <List sx={{ mt: 2 }}>
        {students.length === 0 ? (
          <Typography variant="body1" align="center" sx={{ color: 'text.secondary' }}>
            Aún no hay competidores
          </Typography>
        ) : (
          students.map((student, index) => (
            <Card 
              key={student.id} 
              sx={{ 
                mb: 2, 
                borderRadius: 2, 
                boxShadow: 2, 
                transition: "0.3s", 
                "&:hover": { transform: "scale(1.05)", boxShadow: 4 }
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h6">
                      {getMedal(index, student.points)} {student.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Paralelo {student.paralelo}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                      {student.points} puntos
                    </Typography>
                    {role === 'profesor' && (
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button 
                          variant="contained" 
                          size="small"
                          sx={{ 
                            backgroundColor: "#000000", 
                            color: "white", 
                            "&:hover": { backgroundColor: "#333333" } 
                          }}
                          onClick={() => addPoint(student.id)}
                        >
                          +1 Punto
                        </Button>
                        <Button 
                          variant="contained" 
                          size="small"
                          sx={{ 
                            backgroundColor: "#ff0000", 
                            color: "white", 
                            "&:hover": { backgroundColor: "#cc0000" } 
                          }}
                          onClick={() => decrementPoint(student.id)}
                        >
                          -1 Punto
                        </Button>
                      </Box>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))
        )}
      </List>
    </Paper>
  );}