CREATE DATABASE store_db;



USE store_db;

CREATE TABLE employee
(
    id int NOT NULL AUTO_INCREMENT,
	first_name varchar(255) NOT NULL,
    last_name varchar(255) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT,
	PRIMARY KEY(id)
);

CREATE TABLE department
(
    id int not null AUTO_INCREMENT,
    department_name VARCHAR(30) NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE role
(
    id INT NOT NULL AUTO_INCREMENT primary key,
    role_title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INT NOT NULL references department(id)
)
