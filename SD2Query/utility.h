#ifndef UTILITY_H
#define UTILITY_H

#ifdef USE_MYSQL
#include <mysql/mysql.h>
#include <iostream>
#endif
#include <fstream>

//the parameters used to connect to your MySQL server
//PLEASE UPDATE them with your own information
#define MySQLServerAddr "localhost"
#define MySQLUserName "root"
#define MySQLPassword NULL
//make sure you create the database before calling functions in this file
#define MySQLDatabaseName "SD2" 

inline bool open_file(std::ifstream& fin, const char* fname, const bool& binary=false){
	if (binary) {
		fin.open(fname, std::ios_base::in|std::ios::binary);
	} else {
		fin.open(fname);
	}
	if(!fin.is_open()){
		printf("Fail to read file: %s.\n", fname);
		return false;
	}

	return true;
}

inline bool open_file(std::ofstream& fout, const char* fname, const bool& binary=false){
	if (binary) {
		fout.open(fname, std::ios_base::out|std::ios::binary);
	} else {
		fout.open(fname);
	}
	if(!fout.is_open()){
		printf("Fail to read file: %s.\n", fname);
		return false;
	}

	return true;
}

//a utility function to connect to the mysql server
#ifdef USE_MYSQL
inline bool connectMySQL(MYSQL& conn) {
	if (0 == mysql_library_init(0, NULL, NULL)) {
		std::cout << "mysql_library_init() succeed" << std::endl;
	} else {
		std::cout << "mysql_library_init() failed" << std::endl;
		return false;
	}
	if (NULL != mysql_init(&conn)) {
		std::cout << "mysql_init() succeed" << std::endl;
	} else {
		std::cout << "mysql_init() failed" << std::endl;
		return false;
	}
	if (NULL != mysql_real_connect(&conn, MySQLServerAddr, MySQLUserName, MySQLPassword, MySQLDatabaseName, 0, NULL, 0)) {
		std::cout << "mysql_real_connect() succeed" << std::endl;
	} else {
		std::cout << "mysql_real_connect() failed" << std::endl;
		return false;
	}
	return true;
}
#endif //USE_MYSQL

#endif //UTILITY_H
