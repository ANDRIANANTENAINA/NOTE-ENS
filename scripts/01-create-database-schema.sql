-- Création du schéma complet pour la gestion des notes avec Supabase
-- Tables pour la gestion des notes académiques

-- Table des matières
CREATE TABLE IF NOT EXISTS subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    coefficient DECIMAL(3,2) DEFAULT 1.0,
    description TEXT,
    color VARCHAR(7) DEFAULT '#15803d',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des classes
CREATE TABLE IF NOT EXISTS classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL,
    level VARCHAR(20) NOT NULL,
    academic_year VARCHAR(9) NOT NULL, -- Format: 2024-2025
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des étudiants
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_number VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    date_of_birth DATE,
    class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des types d'évaluation
CREATE TABLE IF NOT EXISTS evaluation_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL,
    coefficient DECIMAL(3,2) DEFAULT 1.0,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des évaluations
CREATE TABLE IF NOT EXISTS evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(100) NOT NULL,
    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    evaluation_type_id UUID NOT NULL REFERENCES evaluation_types(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    max_score DECIMAL(5,2) DEFAULT 20.0,
    evaluation_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des notes
CREATE TABLE IF NOT EXISTS grades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    evaluation_id UUID NOT NULL REFERENCES evaluations(id) ON DELETE CASCADE,
    score DECIMAL(5,2),
    comment TEXT,
    is_absent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id, evaluation_id)
);

-- Activation de RLS sur toutes les tables
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluation_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;

-- Politiques RLS (pour l'instant, accès libre pour tous les utilisateurs authentifiés)
-- En production, vous pourriez vouloir des politiques plus restrictives basées sur les rôles

-- Subjects policies
CREATE POLICY "Allow authenticated users to view subjects" ON subjects FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to insert subjects" ON subjects FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to update subjects" ON subjects FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to delete subjects" ON subjects FOR DELETE USING (auth.role() = 'authenticated');

-- Classes policies
CREATE POLICY "Allow authenticated users to view classes" ON classes FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to insert classes" ON classes FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to update classes" ON classes FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to delete classes" ON classes FOR DELETE USING (auth.role() = 'authenticated');

-- Students policies
CREATE POLICY "Allow authenticated users to view students" ON students FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to insert students" ON students FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to update students" ON students FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to delete students" ON students FOR DELETE USING (auth.role() = 'authenticated');

-- Evaluation types policies
CREATE POLICY "Allow authenticated users to view evaluation_types" ON evaluation_types FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to insert evaluation_types" ON evaluation_types FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to update evaluation_types" ON evaluation_types FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to delete evaluation_types" ON evaluation_types FOR DELETE USING (auth.role() = 'authenticated');

-- Evaluations policies
CREATE POLICY "Allow authenticated users to view evaluations" ON evaluations FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to insert evaluations" ON evaluations FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to update evaluations" ON evaluations FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to delete evaluations" ON evaluations FOR DELETE USING (auth.role() = 'authenticated');

-- Grades policies
CREATE POLICY "Allow authenticated users to view grades" ON grades FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to insert grades" ON grades FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to update grades" ON grades FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to delete grades" ON grades FOR DELETE USING (auth.role() = 'authenticated');

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_students_class_id ON students(class_id);
CREATE INDEX IF NOT EXISTS idx_students_student_number ON students(student_number);
CREATE INDEX IF NOT EXISTS idx_evaluations_subject_id ON evaluations(subject_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_class_id ON evaluations(class_id);
CREATE INDEX IF NOT EXISTS idx_grades_student_id ON grades(student_id);
CREATE INDEX IF NOT EXISTS idx_grades_evaluation_id ON grades(evaluation_id);
