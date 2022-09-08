
CREATE TABLE Users (
	user_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	name VARCHAR (50)
	public_key VARCHAR(255) NOT NULL
	address VARCHAR(255) NOT NULL
);

CREATE TABLE Documents (
	token_id INT PRIMARY KEY,
  	document_type VARCHAR(50) NOT NULL
  	name VARCHAR(50) NOT NULL
);

CREATE TABLE Secrets (
	user_id INT NOT NULL ,
	document INT NOT NULL,
	private_key VARCHAR(100) NOT NULL,
	FOREIGN KEY (user_id)
		REFERENCES Users (user_id)
		ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY (document)
		REFERENCES Documents (token_id)
		ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE ONLY  Secrets ADD CONSTRAINT "ID_PKEY" PRIMARY KEY (user_id,document);

CREATE TABLE Briefcase (
	case_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	token_id INT NOT NULL,
	type_of_demand VARCHAR (50) NOT NULL,
	place_of_case VARCHAR (255) NOT NULL,
	crime VARCHAR (255) NOT NULL,
	crime_data DATE NOT NULL,
	place_of_crime VARCHAR(255) NOT NULL,
	name_of_plaintiff VARCHAR(50),
	name_of_defendant VARCHAR(50),
	defendants_attorney VARCHAR(50),
	plaintiffs_attorney VARCHAR(50),
	FOREIGN KEY (Documents) 
        REFERENCES documents (document_id) 
        ON DELETE NO ACTION ON UPDATE NO ACTION,
	FOREIGN KEY (Users) 
        REFERENCES users (user_id) 
        ON DELETE NO ACTION ON UPDATE NO ACTION
);

CREATE TABLE BriefCaseDocuments (
	case_id INT NOT NULL, 
	document_id INT NOT NULL,
	FOREIGN KEY (case_id)
		REFERENCES Briefcase (case_id)
		ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY (document_id)
		REFERENCES Documents (token_id)
		ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE BriefcaseUsers(
	user_id INT NOT NULL,
	case_id INT NOT NULL,
	FOREIGN KEY (user_id)
		REFERENCES Users (user_id)
		ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY (case_id)
		REFERENCES Briefcase (case_id)
		ON DELETE CASCADE ON UPDATE CASCADE
);


ALTER TABLE ONLY  BriefCaseDocuments ADD CONSTRAINT "ID_PKEY" PRIMARY KEY (case_id,document_id);
ALTER TABLE ONLY  BriefcaseUsers ADD CONSTRAINT "ID_PKEY" PRIMARY KEY (user_id,case_id);
