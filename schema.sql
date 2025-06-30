-- =================================================================
-- Schema for Thesis and Internship Management System
-- Version: 3.0 (Full Application Schema)
-- Description: A comprehensive schema including user management,
-- academic entities, thesis and internship workflows, and detailed seed data.
-- =================================================================

-- To avoid dependency errors, drop tables in reverse order of creation.
DROP TABLE IF EXISTS Menu_Permissions;
DROP TABLE IF EXISTS Role_Permissions;
DROP TABLE IF EXISTS User_Roles;
DROP TABLE IF EXISTS Thesis_Milestones;
DROP TABLE IF EXISTS Thesis_Defenses;
DROP TABLE IF EXISTS Internship_Evaluations;
DROP TABLE IF EXISTS Internships;
DROP TABLE IF EXISTS Theses;
DROP TABLE IF EXISTS Student_Profiles;
DROP TABLE IF EXISTS Lecturer_Profiles;
DROP TABLE IF EXISTS Companies;
DROP TABLE IF EXISTS Semesters;
DROP TABLE IF EXISTS Menus;
DROP TABLE IF EXISTS Permissions;
DROP TABLE IF EXISTS Roles;
DROP TABLE IF EXISTS Users;

-- =================================================================
-- Core User and Authentication Tables
-- =================================================================

-- -----------------------------------------------------
-- Table `Users`
-- Stores base user account information.
-- -----------------------------------------------------
CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'active', -- active, inactive, suspended
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_users_email ON Users(email);
CREATE INDEX idx_users_status ON Users(status);

-- -----------------------------------------------------
-- Table `Roles`
-- Defines roles like ADMIN, LECTURER, STUDENT.
-- -----------------------------------------------------
CREATE TABLE Roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT
);

-- -----------------------------------------------------
-- Table `Permissions`
-- Defines granular actions, e.g., 'thesis:create', 'users:manage'.
-- -----------------------------------------------------
CREATE TABLE Permissions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    module VARCHAR(50) -- e.g., 'THESIS', 'INTERNSHIP', 'USERS'
);
CREATE INDEX idx_permissions_module ON Permissions(module);

-- -----------------------------------------------------
-- Table `Menus`
-- Defines the navigation menu structure.
-- -----------------------------------------------------
CREATE TABLE Menus (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    path VARCHAR(255) UNIQUE NOT NULL,
    icon VARCHAR(255),
    parent_id INTEGER REFERENCES Menus(id) ON DELETE SET NULL,
    display_order INTEGER DEFAULT 0
);
CREATE INDEX idx_menus_parent_id ON Menus(parent_id);

-- =================================================================
-- Core Academic and Profile Tables
-- =================================================================

-- -----------------------------------------------------
-- Table `Student_Profiles`
-- Stores student-specific information.
-- -----------------------------------------------------
CREATE TABLE Student_Profiles (
    user_id INTEGER PRIMARY KEY REFERENCES Users(id) ON DELETE CASCADE,
    student_code VARCHAR(20) UNIQUE NOT NULL,
    major VARCHAR(255),
    enrollment_year INTEGER
);
CREATE INDEX idx_student_profiles_student_code ON Student_Profiles(student_code);

-- -----------------------------------------------------
-- Table `Lecturer_Profiles`
-- Stores lecturer-specific information.
-- -----------------------------------------------------
CREATE TABLE Lecturer_Profiles (
    user_id INTEGER PRIMARY KEY REFERENCES Users(id) ON DELETE CASCADE,
    department VARCHAR(255),
    academic_rank VARCHAR(100) -- e.g., 'TS', 'PGS.TS'
);

-- -----------------------------------------------------
-- Table `Semesters`
-- Manages academic semesters.
-- -----------------------------------------------------
CREATE TABLE Semesters (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL, -- e.g., "Học kỳ 1 2024-2025"
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT false
);

-- -----------------------------------------------------
-- Table `Companies`
-- Manages internship partner companies.
-- -----------------------------------------------------
CREATE TABLE Companies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    address TEXT,
    website VARCHAR(255),
    contact_person VARCHAR(255),
    contact_email VARCHAR(255)
);

-- =================================================================
-- Thesis Module Tables
-- =================================================================

CREATE TABLE Theses (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    student_user_id INTEGER NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    supervisor_user_id INTEGER NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    semester_id INTEGER NOT NULL REFERENCES Semesters(id) ON DELETE RESTRICT,
    status VARCHAR(50) NOT NULL, -- PENDING_APPROVAL, APPROVED, IN_PROGRESS, PENDING_DEFENSE, COMPLETED, CANCELLED
    registration_date DATE DEFAULT CURRENT_DATE,
    deadline_date DATE,
    final_grade NUMERIC(4, 2)
);
CREATE INDEX idx_theses_student_id ON Theses(student_user_id);
CREATE INDEX idx_theses_supervisor_id ON Theses(supervisor_user_id);
CREATE INDEX idx_theses_status ON Theses(status);

CREATE TABLE Thesis_Milestones (
    id SERIAL PRIMARY KEY,
    thesis_id INTEGER NOT NULL REFERENCES Theses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date DATE,
    completed_date DATE,
    status VARCHAR(50) NOT NULL -- PENDING, COMPLETED, OVERDUE
);
CREATE INDEX idx_thesis_milestones_thesis_id ON Thesis_Milestones(thesis_id);

CREATE TABLE Thesis_Defenses (
    id SERIAL PRIMARY KEY,
    thesis_id INTEGER NOT NULL REFERENCES Theses(id) ON DELETE CASCADE,
    defense_date TIMESTAMPTZ,
    location VARCHAR(255),
    council_members JSONB -- [{"name": "TS. A", "role": "Chủ tịch"}, {"name": "PGS.TS. B", "role": "Phản biện"}]
);

-- =================================================================
-- Internship Module Tables
-- =================================================================

CREATE TABLE Internships (
    id SERIAL PRIMARY KEY,
    student_user_id INTEGER NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    company_id INTEGER NOT NULL REFERENCES Companies(id) ON DELETE RESTRICT,
    lecturer_supervisor_id INTEGER NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    semester_id INTEGER NOT NULL REFERENCES Semesters(id) ON DELETE RESTRICT,
    position VARCHAR(255),
    start_date DATE,
    end_date DATE,
    status VARCHAR(50) NOT NULL -- PENDING_APPROVAL, APPROVED, IN_PROGRESS, PENDING_EVALUATION, COMPLETED, CANCELLED
);
CREATE INDEX idx_internships_student_id ON Internships(student_user_id);
CREATE INDEX idx_internships_company_id ON Internships(company_id);

CREATE TABLE Internship_Evaluations (
    id SERIAL PRIMARY KEY,
    internship_id INTEGER NOT NULL REFERENCES Internships(id) ON DELETE CASCADE,
    company_grade NUMERIC(4, 2),
    company_comments TEXT,
    lecturer_grade NUMERIC(4, 2),
    lecturer_comments TEXT,
    final_grade NUMERIC(4, 2),
    evaluation_date DATE DEFAULT CURRENT_DATE
);

-- =================================================================
-- Junction Tables for Many-to-Many Relationships
-- =================================================================

CREATE TABLE User_Roles (
    user_id INTEGER NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    role_id INTEGER NOT NULL REFERENCES Roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

CREATE TABLE Role_Permissions (
    role_id INTEGER NOT NULL REFERENCES Roles(id) ON DELETE CASCADE,
    permission_id INTEGER NOT NULL REFERENCES Permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE Menu_Permissions (
    menu_id INTEGER NOT NULL REFERENCES Menus(id) ON DELETE CASCADE,
    permission_id INTEGER NOT NULL REFERENCES Permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (menu_id, permission_id)
);


-- =================================================================
-- ==                                                             ==
-- ==                     COMPREHENSIVE SEED DATA                 ==
-- ==                                                             ==
-- =================================================================

BEGIN;

-- -----------------------------------------------------
-- Step 1: Insert Core Roles
-- -----------------------------------------------------
INSERT INTO Roles (id, name, description) VALUES
(1, 'ADMIN', 'Quản trị viên hệ thống - có toàn bộ quyền'),
(2, 'LECTURER', 'Giảng viên - quản lý khóa luận, thực tập'),
(3, 'STUDENT', 'Sinh viên - đăng ký và xem tiến độ');

-- -----------------------------------------------------
-- Step 2: Insert Detailed, Module-based Permissions
-- -----------------------------------------------------
INSERT INTO Permissions (name, module, description) VALUES
-- SYSTEM & USERS
('system:settings:manage', 'SYSTEM', 'Quản lý cài đặt toàn hệ thống'),
('system:users:list', 'USERS', 'Xem danh sách tất cả người dùng'),
('system:users:manage', 'USERS', 'Quản lý người dùng (thêm, sửa, xóa)'),
('system:roles:assign', 'USERS', 'Gán vai trò cho người dùng'),
('system:dashboard:view', 'SYSTEM', 'Xem trang tổng quan chung'),
('system:reports:generate', 'REPORTS', 'Tạo và xuất các loại báo cáo'),
('system:documents:manage', 'DOCUMENTS', 'Quản lý tài liệu và biểu mẫu'),

-- THESIS
('thesis:topic:register', 'THESIS', 'Sinh viên đăng ký đề tài khóa luận'),
('thesis:topic:approve', 'THESIS', 'Giảng viên duyệt hoặc từ chối đề tài'),
('thesis:view:own', 'THESIS', 'Sinh viên xem thông tin khóa luận của mình'),
('thesis:view:assigned', 'THESIS', 'Giảng viên xem các khóa luận mình hướng dẫn'),
('thesis:view:all', 'THESIS', 'Admin/Trưởng bộ môn xem tất cả khóa luận'),
('thesis:manage:all', 'THESIS', 'Admin có thể sửa/xóa mọi khóa luận'),
('thesis:progress:update_own', 'THESIS', 'Sinh viên cập nhật tiến độ của mình'),
('thesis:progress:update_assigned', 'THESIS', 'Giảng viên cập nhật tiến độ cho SV được giao'),
('thesis:defense:schedule', 'THESIS', 'Lên lịch bảo vệ khóa luận'),
('thesis:defense:grade', 'THESIS', 'Nhập điểm sau khi bảo vệ'),

-- INTERNSHIP
('internship:topic:register', 'INTERNSHIP', 'Sinh viên đăng ký thực tập'),
('internship:topic:approve', 'INTERNSHIP', 'Giảng viên duyệt đăng ký thực tập'),
('internship:view:own', 'INTERNSHIP', 'Sinh viên xem thông tin thực tập của mình'),
('internship:view:assigned', 'INTERNSHIP', 'Giảng viên xem các SV thực tập mình hướng dẫn'),
('internship:view:all', 'INTERNSHIP', 'Admin/Trưởng bộ môn xem tất cả thông tin thực tập'),
('internship:evaluation:submit', 'INTERNSHIP', 'Giảng viên nộp đánh giá cho sinh viên'),
('internship:partners:manage', 'INTERNSHIP', 'Quản lý danh sách các công ty đối tác');

-- -----------------------------------------------------
-- Step 3: Map Permissions to Roles
-- -----------------------------------------------------
DO $$
DECLARE
    admin_role_id INT := 1;
    lecturer_role_id INT := 2;
    student_role_id INT := 3;
    p_id INT;
BEGIN
    -- ADMIN gets all permissions
    FOR p_id IN SELECT id FROM Permissions LOOP
        INSERT INTO Role_Permissions (role_id, permission_id) VALUES (admin_role_id, p_id);
    END LOOP;

    -- LECTURER permissions
    INSERT INTO Role_Permissions (role_id, permission_id) SELECT lecturer_role_id, id FROM Permissions WHERE name IN (
        'system:dashboard:view',
        'system:documents:manage',
        'system:reports:generate',
        'thesis:topic:approve', 'thesis:view:assigned', 'thesis:progress:update_assigned', 'thesis:defense:schedule', 'thesis:defense:grade',
        'internship:topic:approve', 'internship:view:assigned', 'internship:evaluation:submit', 'internship:partners:manage'
    );

    -- STUDENT permissions
    INSERT INTO Role_Permissions (role_id, permission_id) SELECT student_role_id, id FROM Permissions WHERE name IN (
        'system:dashboard:view',
        'thesis:topic:register', 'thesis:view:own', 'thesis:progress:update_own',
        'internship:topic:register', 'internship:view:own'
    );
END $$;

-- -----------------------------------------------------
-- Step 4: Create Sample Users and Profiles
-- -----------------------------------------------------
-- Passwords are placeholders, use a secure hashing function in production.
INSERT INTO Users (id, name, email, password_hash) VALUES
(1, 'Admin User', 'admin@example.com', 'hashed_password'),
(2, 'Lecturer A', 'lecturer.a@example.com', 'hashed_password'),
(3, 'Lecturer B', 'lecturer.b@example.com', 'hashed_password'),
(4, 'Student A', 'student.a@example.com', 'hashed_password'),
(5, 'Student B', 'student.b@example.com', 'hashed_password');

INSERT INTO Lecturer_Profiles (user_id, department, academic_rank) VALUES
(2, 'Công nghệ Thông tin', 'TS'),
(3, 'Kỹ thuật Phần mềm', 'PGS.TS');

INSERT INTO Student_Profiles (user_id, student_code, major, enrollment_year) VALUES
(4, '20IT001', 'Công nghệ Thông tin', 2020),
(5, '20IT002', 'An toàn Thông tin', 2020);

-- -----------------------------------------------------
-- Step 5: Assign Roles to Sample Users
-- -----------------------------------------------------
INSERT INTO User_Roles (user_id, role_id) VALUES
(1, 1), -- Admin User -> ADMIN
(2, 2), -- Lecturer A -> LECTURER
(3, 2), -- Lecturer B -> LECTURER
(4, 3), -- Student A -> STUDENT
(5, 3); -- Student B -> STUDENT

-- -----------------------------------------------------
-- Step 6: Create Sample Academic Data
-- -----------------------------------------------------
INSERT INTO Semesters (id, name, start_date, end_date, is_active) VALUES
(1, 'Học kỳ 1 2024-2025', '2024-09-02', '2025-01-05', true);

INSERT INTO Companies (id, name, description, address, website) VALUES
(1, 'FPT Software', 'Global IT services and solutions provider.', 'Khu Công nghệ cao, TP. Thủ Đức, TP. HCM', 'https://fptsoftware.com'),
(2, 'Viettel Digital', 'Digital transformation services.', '47 Hàng Bún, Ba Đình, Hà Nội', 'https://vietteldigital.com.vn');

-- -----------------------------------------------------
-- Step 7: Create Sample Thesis and Internship Data
-- -----------------------------------------------------
INSERT INTO Theses (id, title, student_user_id, supervisor_user_id, semester_id, status, deadline_date) VALUES
(1, 'Ứng dụng AI trong chẩn đoán hình ảnh y tế', 4, 2, 1, 'IN_PROGRESS', '2024-12-15');

INSERT INTO Thesis_Milestones (thesis_id, title, due_date, status) VALUES
(1, 'Nộp đề cương chi tiết', '2024-09-30', 'COMPLETED'),
(1, 'Hoàn thành chương 1: Tổng quan', '2024-10-20', 'COMPLETED'),
(1, 'Hoàn thành chương 2: Xây dựng mô hình', '2024-11-20', 'PENDING'),
(1, 'Nộp bản nháp đầy đủ', '2024-12-05', 'PENDING');

INSERT INTO Internships (student_user_id, company_id, lecturer_supervisor_id, semester_id, position, start_date, end_date, status) VALUES
(5, 1, 3, 1, 'Frontend Developer Intern', '2024-09-16', '2024-12-16', 'PENDING_EVALUATION');


-- -----------------------------------------------------
-- Step 8: Insert Menu Structure & Link to Permissions
-- This section remains largely the same but ensure paths match the app routes.
-- -----------------------------------------------------
INSERT INTO Menus (id, name, path, icon, display_order) VALUES
(1, 'Tổng quan', '/dashboard', 'dashboard', 1),
(2, 'Khóa luận', '/thesis', 'book', 2),
(3, 'Thực tập', '/internship', 'briefcase', 3),
(4, 'Người dùng', '/users', 'users', 4),
(5, 'Đối tác', '/internship/partners', 'building', 5),
(6, 'Tài liệu', '/documents', 'folder', 6),
(7, 'Báo cáo', '/dashboard/reports', 'bar-chart', 7),
(8, 'Cài đặt', '/settings', 'settings', 99);

-- Child Menus
INSERT INTO Menus (name, path, parent_id, display_order) VALUES
-- Thesis
('Khóa luận của tôi', '/thesis/progress', 2, 1),
('Đăng ký đề tài', '/thesis/register', 2, 2),
('Quản lý khóa luận', '/thesis/active', 2, 3),
-- Internship
('Thực tập của tôi', '/internship/active', 3, 1),
('Đăng ký thực tập', '/internship/register', 3, 2),
('Quản lý thực tập', '/internship/evaluation', 3, 3);

-- Linking Menus to Permissions
INSERT INTO Menu_Permissions (menu_id, permission_id)
SELECT m.id, p.id FROM Menus m, Permissions p WHERE
    (m.path = '/dashboard' AND p.name = 'system:dashboard:view') OR
    (m.path = '/thesis/progress' AND p.name = 'thesis:view:own') OR
    (m.path = '/thesis/register' AND p.name = 'thesis:topic:register') OR
    (m.path = '/thesis/active' AND p.name IN ('thesis:view:assigned', 'thesis:view:all')) OR
    (m.path = '/internship/active' AND p.name = 'internship:view:own') OR
    (m.path = '/internship/register' AND p.name = 'internship:topic:register') OR
    (m.path = '/internship/evaluation' AND p.name IN ('internship:view:assigned', 'internship:view:all')) OR
    (m.path = '/internship/partners' AND p.name = 'internship:partners:manage') OR
    (m.path = '/users' AND p.name = 'system:users:manage') OR
    (m.path = '/documents' AND p.name = 'system:documents:manage') OR
    (m.path = '/dashboard/reports' AND p.name = 'system:reports:generate') OR
    (m.path = '/settings' AND p.name = 'system:settings:manage');

COMMIT;

-- =================================================================
-- End of Schema and Seed Data
-- =================================================================
SELECT 'Schema and seed data v3.0 loaded successfully.' as status; 