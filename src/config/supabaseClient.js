import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://soxqtytndrewnrghvndw.supabase.co'; // Reemplaza con tu URL de Supabase
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNveHF0eXRuZHJld25yZ2h2bmR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAwMTQ4ODYsImV4cCI6MjA1NTU5MDg4Nn0.z0bZLw4WfYSLoEuOta1QGg7QiDOvG1DdBfw6QMfdGZw'; // Reemplaza con tu clave pública

export const supabase = createClient(supabaseUrl, supabaseKey);