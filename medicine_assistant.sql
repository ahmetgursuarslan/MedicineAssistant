-- Database: medicine_assistant

-- DROP DATABASE IF EXISTS medicine_assistant;

CREATE DATABASE [IF NOT EXISTS] medicine_assistant
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'Turkish_Turkey.1254'
    LC_CTYPE = 'Turkish_Turkey.1254'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;
	
CREATE TABLE IF NOT EXISTS users(
	user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	user_email VARCHAR(200) not null,
	user_password VARCHAR(512) NOT NULL,
	user_registration_date TIMESTAMP NOT NULL,
	user_update_date TIMESTAMP,
	user_active BOOLEAN NOT NULL
);

CREATE TABLE IF NOT EXISTS company(
	company_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	company_created_by UUID NOT NULL,
	company_name VARCHAR(500) NOT NULL,
	company_country VARCHAR(56) NOT NULL,
	company_registration_date TIMESTAMP NOT NULL,
	FOREIGN KEY(company_created_by) 
	REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS medicine(
	medicine_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	medicine_created_by UUID NOT NULL,
	medicine_company_id UUID NOT NULL,
	medicine_name VARCHAR(250) NOT NULL,
	medicine_registration_date TIMESTAMP NOT NULL,
	medicine_update_by UUID,
	medicine_update_date TIMESTAMP,
	FOREIGN KEY(medicine_created_by) 
	REFERENCES users(user_id),
	FOREIGN KEY(medicine_company_id) 
	REFERENCES company(company_id)
);

CREATE TABLE IF NOT EXISTS medicine_prospectus(
	prospectus_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	medicine_id UUID NOT NULL,
	prospectus_description TEXT NOT NULL,
	prospectus_registration_date TIMESTAMP NOT NULL,
	prospectus_created_by UUID NOT NULL,
	prospectus_update_date TIMESTAMP,
	prospectus_update_by UUID,
	FOREIGN KEY(medicine_id) 
	REFERENCES medicine(medicine_id),
	FOREIGN KEY(prospectus_created_by) 
	REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS timer(
	timer_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	user_id UUID NOT NULL,
	medicine_id UUID NOT NULL,
	medicine_count REAL NOT NULL,
	timer_daily_type INT not null,
	timer_start_date TIMESTAMP NOT NULL,
	timer_finish_date TIMESTAMP NOT NULL,
	timer_weekly_type INT NOT NULL,
	FOREIGN KEY(user_id) 
	REFERENCES users(user_id),
	FOREIGN KEY(medicine_id) 
	REFERENCES medicine(medicine_id)
);

CREATE TABLE IF NOT EXISTS reminder(
	reminder_id SERIAL PRIMARY KEY,
	timer_id UUID NOT NULL,
	reminder_execution_time TIMESTAMP NOT NULL,
	reminder_status INT NOT NULL,
	FOREIGN KEY(timer_id) 
	REFERENCES timer(timer_id)
);

CREATE TABLE IF NOT EXISTS 	user_detail(
	user_detail_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	user_id UUID NOT NULL,
	user_name VARCHAR(150) NOT NULL,
	user_surname VARCHAR(100) NOT NULL,
	user_birthday TIMESTAMP NOT NULL,
	user_gender BOOLEAN NOT NULL,
	user_height NUMERIC NOT NULL,
	user_weight REAL NOT NULL,
	user_tel VARCHAR(15),
	FOREIGN KEY(user_id) 
	REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS diseases(
	diseases_id UUID PRIMARY KEY DEFAULT  gen_random_uuid(),
	user_id UUID NOT NULL,
	diseases_name VARCHAR(200) NOT NULL,
	diseases_description VARCHAR(1000) NOT NULL,
	diseases_record_date TIMESTAMP NOT NULL,
	diseases_update_date TIMESTAMP,
	FOREIGN KEY(user_id) 
	REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS alerjens(
	alerjen_id UUID PRIMARY KEY DEFAULT  gen_random_uuid(),
	user_id UUID NOT NULL,
	alerjen_name VARCHAR(200) NOT NULL,
	alerjen_description VARCHAR(1000) NOT NULL,
	alerjen_record_date TIMESTAMP NOT NULL,
	alerjen_update_date TIMESTAMP,
	FOREIGN KEY(user_id) 
	REFERENCES users(user_id)
);




