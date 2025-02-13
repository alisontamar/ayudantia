import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://iovagfbgagxouewjisak.supabase.co'; // Reemplaza con tu URL de Supabase
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvdmFnZmJnYWd4b3Vld2ppc2FrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkzODg0MjYsImV4cCI6MjA1NDk2NDQyNn0.XKxGTNg4OpmGY7L1q6BzDhNBsJVA7Bhgv8gS1JOk-5Y'; // Reemplaza con tu clave pública

export const supabase = createClient(supabaseUrl, supabaseKey);