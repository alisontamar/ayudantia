import { useState, useEffect } from 'react';
import { 
  Button, 
  List, 
  ListItemText, 
  Paper, 
  Typography,
  TextField,
  Box,
  Card,
  CardContent
} from '@mui/material';
import { supabase } from '../config/supabaseClient';

export function ListaPuntos({ role }) {
  const [students, setStudents] = useState([]);
  const [newStudentName, setNewStudentName] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    const { data, error } = await supabase
      .from('students')
      .select('id, name, points')
      .order('points', { ascending: false });

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
      .insert([{ name: newStudentName, points: 0 }])
      .select();
  
    if (error) {
      console.error('🚨 Error al agregar alumno:', error.message);
      return;
    }
  
    setStudents([...students, ...data]);
    setNewStudentName('');
  };
  
  const addPoint = async (studentId) => {
    const { error } = await supabase.rpc('increment_points', { student_id: studentId });

    if (error) {
      console.error('Error adding point:', error);
    } else {
      fetchStudents();
    }
  };

  // Función para asignar medallas a los 3 primeros
  const getMedal = (index) => {
    const medals = ["🥇", "🥈", "🥉"];
    return index < 3 ? medals[index] : "";
  };

  return (
    
    <Paper sx={{ p: 3, width: '100%', maxWidth: 500, margin: 'auto' }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom align="center">
        🏆 Ranking
      </Typography>

      {role === 'profesor' && (
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <TextField
            label="Nombre del alumno"
            variant="outlined"
            fullWidth
            value={newStudentName}
            onChange={(e) => setNewStudentName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button 
  variant="contained" 
  onClick={addStudent}
  disabled={!newStudentName.trim()}
  sx={{ backgroundColor: "#000", color: "white", "&:hover": { backgroundColor: "#333" } }}
>
  Agregar alumno
</Button>

        </Box>
      )}

      <List sx={{ mt: 2 }}>
        {students.map((student, index) => (
          <Card 
            key={student.id} 
            sx={{ 
              mb: 2, 
              borderRadius: 2, 
              boxShadow: 2, 
              transition: "0.3s", 
              "&:hover": { transform: "scale(1.05)", boxShadow: 4 } // Efecto hover
            }}
          >
            <CardContent 
              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <ListItemText
                primary={
                  <Typography variant="h6">
                    {getMedal(index)} {student.name}
                  </Typography>
                }
                secondary={`${student.points} puntos`}
              />
              {role === 'profesor' && (
                <Button 
                  variant="contained" 
                  size="small"
                  sx={{ backgroundColor: "#D97706", color: "white", "&:hover": { backgroundColor: "#e69500" } }}
                  onClick={() => addPoint(student.id)}
                >
                  +1 Punto
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </List>
    </Paper>
  );
}
