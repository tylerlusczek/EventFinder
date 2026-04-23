CREATE DATABASE EventFinder;
USE EventFinder;

CREATE TABLE Users (
    user_id INT AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255),
    PRIMARY KEY (user_id),
    UNIQUE(email)
);

CREATE TABLE Administrator (
    user_id INT,
    admin_level VARCHAR(255),
    PRIMARY KEY(user_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE Student (
    user_id INT,
    grad_year INT,
    major VARCHAR(255),
    PRIMARY KEY (user_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE OrganizationClub (
    org_id INT AUTO_INCREMENT,
    org_name VARCHAR(255),
    description TEXT,
    category VARCHAR(255),
    created_at DATETIME,
    UNIQUE(org_name),
    PRIMARY KEY (org_id)
);

CREATE TABLE Membership (
    student_id INT,
    org_id INT,
    join_date date,
    role VARCHAR(255),
    status VARCHAR(255),
    PRIMARY KEY (student_id, org_id),
    FOREIGN KEY (org_id) REFERENCES OrganizationClub(org_id),
    FOREIGN KEY (student_id) REFERENCES Student(user_id)
);

CREATE TABLE Event (
    event_id INT AUTO_INCREMENT,
    org_id INT,
    title VARCHAR(255),
    description TEXT,
    location VARCHAR(255),
    start_time DATETIME,
    end_time DATETIME,
    capacity INT,
    visibility VARCHAR(255),
    created_by INT,
    PRIMARY KEY (event_id),
    FOREIGN KEY (created_by) REFERENCES Users(user_id),
    FOREIGN KEY (org_id) REFERENCES OrganizationClub(org_id)
);

CREATE TABLE EventRegistration (
    student_id INT,
    event_id INT,
    rsvp_status VARCHAR(255),
    registered_at DATETIME,
    PRIMARY KEY (student_id, event_id),
    FOREIGN KEY (student_id) REFERENCES Student(user_id),
    FOREIGN KEY (event_id) REFERENCES Event(event_id)
);


INSERT INTO Users (email, first_name, last_name) VALUES
('alice1@example.com','Alice','Smith'),
('bob2@example.com','Bob','Johnson'),
('carol3@example.com','Carol','Davis'),
('david4@example.com','David','Miller'),
('emma5@example.com','Emma','Wilson'),
('frank6@example.com','Frank','Moore'),
('grace7@example.com','Grace','Taylor'),
('henry8@example.com','Henry','Anderson'),
('ivy9@example.com','Ivy','Thomas'),
('jack10@example.com','Jack','Jackson'),
('karen11@example.com','Karen','White'),
('leo12@example.com','Leo','Harris'),
('mia13@example.com','Mia','Martin'),
('nina14@example.com','Nina','Thompson'),
('oliver15@example.com','Oliver','Garcia'),
('paul16@example.com','Paul','Martinez'),
('quinn17@example.com','Quinn','Robinson'),
('rachel18@example.com','Rachel','Clark'),
('sam19@example.com','Sam','Rodriguez'),
('tina20@example.com','Tina','Lewis');


INSERT INTO Administrator (user_id, admin_level) VALUES
(1, 'Super'),
(2, 'Standard'),
(3, 'Standard');

INSERT INTO Student (user_id, grad_year, major) VALUES
(4, 2026, 'Mathematics'),
(5, 2025, 'Physics'),
(6, 2026, 'Chemistry'),
(7, 2027, 'English'),
(8, 2025, 'History'),
(9, 2026, 'Engineering'),
(10, 2025, 'Psychology'),
(11, 2027, 'Economics'),
(12, 2026, 'Art'),
(13, 2025, 'Music'),
(14, 2026, 'Philosophy'),
(15, 2027, 'Sociology'),
(16, 2025, 'Political Science'),
(17, 2026, 'Statistics'),
(18, 2027, 'Information Systems'),
(19, 2025, 'Finance'),
(20, 2026, 'Marketing');


INSERT INTO OrganizationClub (org_name, description, category, created_at) VALUES
('Tech Club','Technology enthusiasts','Academic','2024-01-01 10:00:00'),
('Business Society','Future entrepreneurs','Professional','2024-02-01 11:00:00'),
('Art Club','Creative arts','Creative','2024-03-01 12:00:00'),
('Music Club','Music lovers','Creative','2024-01-15 14:00:00'),
('Sports Club','All about sports','Recreational','2024-02-20 09:00:00'),
('Debate Club','Debating skills','Academic','2024-03-10 16:00:00'),
('Gaming Club','Video games','Recreational','2024-01-25 18:00:00'),
('Volunteer Club','Community service','Service','2024-02-28 13:00:00'),
('Science Club','Science discussions','Academic','2024-03-15 10:30:00'),
('Film Club','Movie lovers','Creative','2024-01-05 17:00:00');


INSERT INTO Membership (student_id, org_id, join_date, role, status) VALUES
(1,1,'2024-02-01','Member','Active'),
(2,2,'2024-02-02','Member','Active'),
(3,3,'2024-02-03','Member','Active'),
(4,4,'2024-02-04','Member','Active'),
(5,5,'2024-02-05','Member','Active'),
(6,6,'2024-02-06','Member','Active'),
(7,7,'2024-02-07','Member','Active'),
(8,8,'2024-02-08','Member','Active'),
(9,9,'2024-02-09','Member','Active'),
(10,10,'2024-02-10','Member','Active'),
(11,1,'2024-02-11','Member','Active'),
(12,2,'2024-02-12','Member','Active'),
(13,3,'2024-02-13','Member','Active'),
(14,4,'2024-02-14','Member','Active'),
(15,5,'2024-02-15','Member','Active'),
(16,6,'2024-02-16','Member','Active'),
(17,7,'2024-02-17','Member','Active'),
(18,8,'2024-02-18','Member','Active'),
(19,9,'2024-02-19','Member','Active'),
(20,10,'2024-02-20','Member','Active');


INSERT INTO Event (org_id, title, description, location, start_time, end_time, capacity, visibility) VALUES
(1,'Hackathon','Coding event','Room A','2024-04-01 10:00:00','2024-04-01 18:00:00',50,'Public'),
(2,'Startup Talk','Entrepreneurship','Room B','2024-04-02 11:00:00','2024-04-02 13:00:00',40,'Public'),
(3,'Art Expo','Showcase art','Gallery','2024-04-03 12:00:00','2024-04-03 16:00:00',30,'Public'),
(4,'Concert','Live music','Hall','2024-04-04 18:00:00','2024-04-04 21:00:00',100,'Public'),
(5,'Football Match','Sports event','Field','2024-04-05 15:00:00','2024-04-05 17:00:00',60,'Public'),
(6,'Debate Night','Discussion','Room C','2024-04-06 17:00:00','2024-04-06 19:00:00',25,'Public'),
(7,'Gaming Night','Games','Room D','2024-04-07 19:00:00','2024-04-07 22:00:00',35,'Public'),
(8,'Charity Drive','Help community','Lobby','2024-04-08 10:00:00','2024-04-08 14:00:00',50,'Public'),
(9,'Science Fair','Projects','Lab','2024-04-09 09:00:00','2024-04-09 15:00:00',45,'Public'),
(10,'Movie Night','Film screening','Auditorium','2024-04-10 20:00:00','2024-04-10 22:00:00',80,'Public'),

(1,'AI Workshop','Learn AI','Room A','2024-04-11 10:00:00','2024-04-11 12:00:00',40,'Public'),
(2,'Marketing 101','Basics','Room B','2024-04-12 11:00:00','2024-04-12 13:00:00',30,'Public'),
(3,'Painting Class','Art skills','Studio','2024-04-13 14:00:00','2024-04-13 16:00:00',20,'Public'),
(4,'Band Practice','Music','Hall','2024-04-14 18:00:00','2024-04-14 20:00:00',25,'Public'),
(5,'Basketball Game','Sports','Court','2024-04-15 16:00:00','2024-04-15 18:00:00',60,'Public'),
(6,'Policy Debate','Debate','Room C','2024-04-16 17:00:00','2024-04-16 19:00:00',20,'Public'),
(7,'Esports Tournament','Gaming','Room D','2024-04-17 19:00:00','2024-04-17 22:00:00',40,'Public'),
(8,'Food Drive','Volunteer','Lobby','2024-04-18 10:00:00','2024-04-18 14:00:00',50,'Public'),
(9,'Robotics Demo','Science','Lab','2024-04-19 09:00:00','2024-04-19 12:00:00',35,'Public'),
(10,'Film Discussion','Movies','Auditorium','2024-04-20 20:00:00','2024-04-20 22:00:00',60,'Public');


INSERT INTO EventRegistration (student_id, event_id, rsvp_status, registered_at) VALUES
(1,1,'Going','2024-03-25 10:00:00'),
(2,2,'Going','2024-03-25 11:00:00'),
(3,3,'Interested','2024-03-25 12:00:00'),
(4,4,'Going','2024-03-25 13:00:00'),
(5,5,'Going','2024-03-25 14:00:00'),
(6,6,'Interested','2024-03-25 15:00:00'),
(7,7,'Going','2024-03-25 16:00:00'),
(8,8,'Going','2024-03-25 17:00:00'),
(9,9,'Interested','2024-03-25 18:00:00'),
(10,10,'Going','2024-03-25 19:00:00'),
(11,11,'Going','2024-03-26 10:00:00'),
(12,12,'Going','2024-03-26 11:00:00'),
(13,13,'Interested','2024-03-26 12:00:00'),
(14,14,'Going','2024-03-26 13:00:00'),
(15,15,'Going','2024-03-26 14:00:00'),
(16,16,'Interested','2024-03-26 15:00:00'),
(17,17,'Going','2024-03-26 16:00:00'),
(18,18,'Going','2024-03-26 17:00:00'),
(19,19,'Interested','2024-03-26 18:00:00'),
(20,20,'Going','2024-03-26 19:00:00');

