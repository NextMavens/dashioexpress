CREATE DATABASE driver_data;
USE driver_data;

CREATE TABLE driver_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    companyname VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    country VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NOT NULL,
    street_address VARCHAR(255) NOT NULL,
    street_number VARCHAR(10) NOT NULL,
    postal_code VARCHAR(10) NOT NULL,
    town VARCHAR(255) NOT NULL,
    industry VARCHAR(255),
    role VARCHAR(255),
    companysize VARCHAR(255),
    terms_agreement TINYINT(1) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE document_files (
    id INT AUTO_INCREMENT PRIMARY KEY,
    driver_id INT NOT NULL,
    file_type ENUM('gewerbeanmeldung', 'frachtfuhrerversicherung', 'eu_lizenz') NOT NULL,
    file_side ENUM('front', 'back') NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    FOREIGN KEY (driver_id) REFERENCES driver_details(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
