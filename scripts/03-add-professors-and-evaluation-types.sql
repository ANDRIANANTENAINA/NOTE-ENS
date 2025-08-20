-- Ajout des professeurs et types d'évaluations pour système universitaire

-- Table des professeurs
CREATE TABLE IF NOT EXISTS professors (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    department VARCHAR(100),
    title VARCHAR(100), -- Professeur, Maître de conférences, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ajout du professeur responsable aux matières
ALTER TABLE subjects 
ADD COLUMN IF NOT EXISTS professor_id INTEGER REFERENCES professors(id),
ADD COLUMN IF NOT EXISTS semester VARCHAR(20) DEFAULT 'S1',
ADD COLUMN IF NOT EXISTS academic_year VARCHAR(10) DEFAULT '2024-2025';

-- Mise à jour des types d'évaluations pour inclure rattrapage et repêchage
ALTER TABLE evaluations 
ADD COLUMN IF NOT EXISTS session_type VARCHAR(20) DEFAULT 'normal' CHECK (session_type IN ('normal', 'rattrapage', 'repechage')),
ADD COLUMN IF NOT EXISTS is_makeup BOOLEAN DEFAULT FALSE;

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_subjects_professor ON subjects(professor_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_session_type ON evaluations(session_type);

-- Données d'exemple pour les professeurs
INSERT INTO professors (first_name, last_name, email, department, title) VALUES
('Jean', 'Dubois', 'j.dubois@universite.fr', 'Mathématiques', 'Professeur'),
('Marie', 'Leroy', 'm.leroy@universite.fr', 'Lettres', 'Maître de conférences'),
('Pierre', 'Moreau', 'p.moreau@universite.fr', 'Histoire', 'Professeur'),
('Sophie', 'Roux', 's.roux@universite.fr', 'Physique', 'Professeur'),
('Antoine', 'Blanc', 'a.blanc@universite.fr', 'Langues', 'Maître de conférences')
ON CONFLICT (email) DO NOTHING;

-- Mise à jour des matières avec les professeurs
UPDATE subjects SET professor_id = 1 WHERE code = 'MATH';
UPDATE subjects SET professor_id = 2 WHERE code = 'FR';
UPDATE subjects SET professor_id = 3 WHERE code = 'HG';
UPDATE subjects SET professor_id = 4 WHERE code = 'PHY';
UPDATE subjects SET professor_id = 5 WHERE code = 'ANG';

-- RLS pour les professeurs
ALTER TABLE professors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Professors are viewable by everyone" ON professors FOR SELECT USING (true);
CREATE POLICY "Only authenticated users can insert professors" ON professors FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Only authenticated users can update professors" ON professors FOR UPDATE USING (auth.role() = 'authenticated');
