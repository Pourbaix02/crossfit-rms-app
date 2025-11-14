-- Crear tabla de estudiantes/crossfiteros
CREATE TABLE students (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Crear tabla de ejercicios
CREATE TABLE exercises (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  rm NUMERIC NOT NULL,
  unit TEXT NOT NULL DEFAULT 'kg',
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX idx_exercises_student_id ON exercises(student_id);
CREATE INDEX idx_exercises_date ON exercises(date DESC);
CREATE INDEX idx_students_created_at ON students(created_at DESC);

-- Habilitar RLS (Row Level Security)
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;

-- Políticas de acceso público (para desarrollo)
-- IMPORTANTE: En producción, deberías implementar autenticación y políticas más restrictivas
CREATE POLICY "Enable read access for all users" ON students
  FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON students
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON students
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON students
  FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON exercises
  FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON exercises
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON exercises
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON exercises
  FOR DELETE USING (true);

