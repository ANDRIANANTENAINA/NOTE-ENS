-- Données d'exemple pour tester le système
-- Insertion de données d'exemple

-- Types d'évaluation
INSERT INTO evaluation_types (name, coefficient, description) VALUES
('Contrôle', 1.0, 'Contrôle en classe'),
('Devoir Surveillé', 2.0, 'Devoir surveillé'),
('Examen', 3.0, 'Examen final'),
('Oral', 1.5, 'Présentation orale'),
('Projet', 2.0, 'Projet à rendre')
ON CONFLICT DO NOTHING;

-- Matières
INSERT INTO subjects (name, code, coefficient, description, color) VALUES
('Mathématiques', 'MATH', 4.0, 'Mathématiques générales', '#3b82f6'),
('Français', 'FR', 3.0, 'Langue française', '#ef4444'),
('Anglais', 'EN', 2.0, 'Langue anglaise', '#10b981'),
('Histoire-Géographie', 'HG', 2.0, 'Histoire et géographie', '#f59e0b'),
('Sciences Physiques', 'PHY', 3.0, 'Physique et chimie', '#8b5cf6'),
('Sciences de la Vie et de la Terre', 'SVT', 2.0, 'Biologie et géologie', '#15803d')
ON CONFLICT (code) DO NOTHING;

-- Classes
INSERT INTO classes (name, level, academic_year) VALUES
('Terminale S1', 'Terminale', '2024-2025'),
('Terminale S2', 'Terminale', '2024-2025'),
('Première S1', 'Première', '2024-2025'),
('Seconde A', 'Seconde', '2024-2025')
ON CONFLICT DO NOTHING;

-- Étudiants d'exemple
INSERT INTO students (student_number, first_name, last_name, email, class_id) 
SELECT 
    'STU' || LPAD(generate_series::text, 4, '0'),
    (ARRAY['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry', 'Iris', 'Jack'])[((generate_series - 1) % 10) + 1],
    (ARRAY['Martin', 'Dubois', 'Moreau', 'Laurent', 'Simon', 'Michel', 'Garcia', 'David', 'Thomas', 'Robert'])[((generate_series - 1) % 10) + 1],
    'student' || generate_series || '@school.edu',
    (SELECT id FROM classes LIMIT 1)
FROM generate_series(1, 20)
ON CONFLICT (student_number) DO NOTHING;
