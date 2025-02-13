import { useState, useEffect } from 'react';
import { 
  Button, 
  List, 
  ListItem, 
  ListItemText, 
  Paper, 
  Typography 
} from '@mui/material';
import { supabase } from '../config/supabaseClient';

export function Asistencia({ role }) {
  const [attendances, setAttendances] = useState([]);

  useEffect(() => {
    fetchAttendances();
  }, []);

  const fetchAttendances = async () => {
    const { data, error } = await supabase
      .from('attendances')
      .select(`
        id,
        created_at,
        students (id, name),
        professors (id, name)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching attendances:', error);
    } else {
      setAttendances(data);
    }
  };

  const markAttendance = async (studentId) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('attendances')
      .insert({ student_id: studentId, professor_id: user.id });

    if (error) {
      console.error('Error marking attendance:', error);
    } else {
      fetchAttendances();
    }
  };

  return (
    <Paper sx={{ p: 2, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Asistencia
      </Typography>
      {role === 'profesor' && (
        <Button 
          variant="contained" 
          onClick={() => markAttendance(/* Pasar el ID del alumno */)}
          sx={{ mb: 2 }}
        >
          Marcar Asistencia
        </Button>
      )}
      <List>
        {attendances.map((attendance) => (
          <ListItem key={attendance.id} sx={{ bgcolor: 'orange', mb: 1, borderRadius: 1 }}>
            <ListItemText
              primary={`${attendance.students.name} (Profesor: ${attendance.professors.name})`}
              secondary={new Date(attendance.created_at).toLocaleString()}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}