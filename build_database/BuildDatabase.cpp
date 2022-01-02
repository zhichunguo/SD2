#include "mysql.h"
#include "typeOperation.h"
#include <cstdlib>
#include <iostream>
#include <fstream>
#include <string>
#include <vector>
#include "../SD2Queries/MySQLPaperQuery.h"

//te directory containing all the mag_paper files from open academic graph project
std::string directory = "./mag_papers/";

// create a table named paper_info_list_short in the mysql
// read mag_paper files from the directory specified by the global variable
// and store all necessary information to the mysql table
bool create_paper_info_list_short(bool b_create_table) {
	MYSQL mydata;
	connectMySQL(mydata);

	//create table if stated
	if (b_create_table){
		std::string sqlstr;
		sqlstr = "create table paper_info_list_short(";
		sqlstr += "id char(36) not null default '',";
		sqlstr += "title varchar(1000) not null default '',";
		sqlstr += "venue varchar(200) not null default '',";
		sqlstr += "year int not null default '-1',";
		sqlstr += "citation int not null default '-1',";
		sqlstr += "doc_type char(18) not null default '',";
		sqlstr += "primary key (id),";
		sqlstr += "index (title),";
		sqlstr += "index (venue)";
		sqlstr += ")engine = InnoDB default charset = utf8;";

		if (0 == mysql_query(&mydata, sqlstr.c_str())) {
			std::cout << "Create MySQL table paper_info_list_short succeed." << std::endl;
		} else {
			std::cout << "Create MySQL table paper_info_list_short fail." << std::endl;
			mysql_close(&mydata);
			return false;
		}
	}

	//read papers from mag_paper files and store to the database
	char* paper_id = "\"id\":";
	char* paper_title = "\"title\":";
	char* paper_venue_key = "\"venue\":";
	char* paper_year = "\"year\":";
	char* paper_doc_type = "\"doc_type\":";

	const int org_offset = 11;

	std::string input_file_prefix = directory+"mag_papers_";
	std::string input_file_path;

	int author_start, authors_end, name_start, name_end, org_start, org_end, author_id, start, end, result_count = 0;
	std::string line, one_paper_info;

	std::string log_file_path = directory +"log.txt";
	std::ofstream log_file;
	if (!open_file(log_file, log_file_path.c_str())) {
		return -1;
	}

	std::string progress_file_path = directory + "progress.txt";
	std::ofstream progress_file;
	if (!open_file(progress_file, progress_file_path.c_str())) {
		return -1;
	}

	for (int file_id = 32; file_id <= 166; ++file_id) {
		input_file_path = input_file_prefix + std::to_string(file_id) + ".txt";

		std::ifstream input_file;
		if (!open_file(input_file, input_file_path.c_str())) {
			return false;
		}

		int count = 0;
		while (std::getline(input_file, line)) {
			one_paper_info = "insert into paper_info_list_short";
			one_paper_info += "(id, title, venue, year, citation, doc_type)";
			one_paper_info += "values";
			one_paper_info += "(\"";

			start = line.find(paper_id);
			start += 7;
			end = findEndingQuote(line, start);
			one_paper_info = one_paper_info + line.substr(start, end - start) + "\",\"";

			start = line.find(paper_title);
			if (start > 0) {
				start += 10;
				end = findEndingQuote(line, start);
				if ((end - start) > 999) {
					continue;
				}
				one_paper_info += line.substr(start, end - start) + "\",\"";
			} else {
				continue;
			}

			start = line.find(paper_venue_key);
			if (start > 0) {
				start += 10;
				end = findEndingQuote(line, start);
				if ((end - start) > 199) {
					end = start+199;
				}
				one_paper_info += line.substr(start, end - start) + "\",";
			} else {
				one_paper_info += "\",";
			}

			start = line.find(paper_year);
			if (start >= 0) {
				start += 8;
				end = line.find(',', start);
				one_paper_info += line.substr(start, end - start) + ",";
			}
			else {
				one_paper_info += "-1,";
			}

			//init citation using -1
			one_paper_info += "-1,\"";

			start = line.find(paper_doc_type);
			if (start >= 0) {
				start += 13;
				end = findEndingQuote(line, start);
				one_paper_info = one_paper_info + line.substr(start, end - start);
			}
			one_paper_info += "\");";

			if (result_count == 0) {
				mysql_query(&mydata, "START TRANSACTION");
			}
			if (0 == mysql_query(&mydata, one_paper_info.c_str())) {
			}
			else {
				std::cout << "mysql_query() insert data failed" << std::endl;
				log_file << line << std::endl << std::endl;
			}
			result_count++;
			if (result_count == 9999) {
				mysql_query(&mydata, "COMMIT");
				result_count = 0;
			}
			
			++count;
			if (count % 10000 == 0) {
				progress_file << "Processing file " << file_id << ": " << count / 10000 << std::endl;
				std::cout << "\rProcessing file " << file_id << ": " << count / 10000;
			}
		}
		input_file.close();
		std::cout << std::endl;
	}
	mysql_close(&mydata);
	return 0;
}

// create a table named reference_list in the mysql
// read mag_paper files from the directory specified by the global variable
// and store all necessary information to the mysql table
bool create_reference_lists(bool b_create_table) {
	MYSQL mydata;
	connectMySQL(mydata);

	//create table if stated
	if (b_create_table){
		std::string sqlstr;
		sqlstr = "create table reference_list(";
		sqlstr += "cite_id char(36) not null default '',";
		sqlstr += "reference_id char(36) not null default '',";
		sqlstr += "index (cite_id)";
		sqlstr += ")engine = InnoDB default charset = utf8;";

		if (0 == mysql_query(&init_mydata, sqlstr.c_str())) {
			std::cout << "Create MySQL table reference_list succeed." << std::endl;
		}
		else {
			std::cout << "Create MySQL table reference_list fail." << std::endl;
			mysql_close(&init_mydata);
			return false
		}
	}

	// read mag_paper files from the directory specified by the global variable
	// and store all necessary information to the mysql table
	char* references = "\"references\": [";
	char* paper_id = "\"id\":";
	int start, end, result_count = 0;
	std::string line, one_reference_line, original_id;

	std::string log_file_path = directory + "reference_log.txt";
	std::ofstream log_file;
	if (!open_file(log_file, log_file_path.c_str())) {
		return -1;
	}

	std::string progress_file_path = directory + "reference_progress.txt";
	std::ofstream progress_file;
	if (!open_file(progress_file, progress_file_path.c_str())) {
		return -1;
	}

	std::string input_file_prefix = directory + "/mag_papers_";
	std::string input_file_path;

	for (int file_id = 66; file_id <= 166; ++file_id) {
		input_file_path = input_file_prefix + std::to_string(file_id) + ".txt";

		std::ifstream input_file;
		if (!open_file(input_file, input_file_path.c_str())) {
			return false;
		}

		int count = 0;
		while (std::getline(input_file, line)) {
			start = line.find(paper_id);
			start += 7;
			end = line.find('\"', start);
			original_id = line.substr(start, end - start);

			start = line.find(references);
			if (start >= 0) {
				start += 15;
				end = line.find(']', start);
				int d_start, d_end;
				while (start < end) {
					d_start = start + 1;
					d_end = line.find('\"', d_start);
					one_reference_line = "insert into reference_list";
					one_reference_line += "(cite_id, reference_id)";
					one_reference_line += "values";
					one_reference_line += "(\"";
					one_reference_line += original_id + "\",\"" + line.substr(d_start, d_end - d_start) + "\");";
					if (result_count == 0) {
						mysql_query(&mydata, "START TRANSACTION");
					}
					if (0 == mysql_query(&mydata, one_reference_line.c_str())) {
					}
					else {
						log_file << line << std::endl << std::endl;
					}
					result_count++;
					if (result_count == 9999) {
						mysql_query(&mydata, "COMMIT");
						result_count = 0;
					}
					start = d_end + 3;
				}
			}
			++count;
			if (count % 10000 == 0) {
				progress_file << "Processing file " << file_id << ": " << count / 10000 << std::endl;
				std::cout << "\rProcessing file " << file_id << ": " << count / 10000;
			}
		}
		input_file.close();
		std::cout << std::endl;
	}
	mysql_close(&mydata);
	return 0;
}

// create a table named venue_info in the mysql
// copy the distinct venues and their types from the paper_info_list_short
// the (abbreviation) name and rank will be filled by the python server from ccf.json
bool create_venue_info(bool b_create_table) {
	MYSQL mydata;
	connectMySQL(mydata);

	//statement for creating the table venue_info
	std::string sqlstr;
	sqlstr = "create table venue_info(";
	sqlstr += "venue varchar(200) not null default '',";
	sqlstr += "name varchar(100) not null default '',";
	sqlstr += "type char(18) not null default '',";
	sqlstr += "rank char(10) not null default '',";
	sqlstr += "primary key (venue),";
	sqlstr += ")engine = InnoDB default charset = utf8;";

	if (0==mysql_query(&mydata, sqlstr.c_str())) {
		std::cout << "Create MySQL table venue_info succeed." << std::endl;
	} else {
		std::cout << "Create MySQL table venue_info fail." << std::endl;
		mysql_close(&mydata);
		return false;
	}

	//statement for filling venue info from paper_info_list_short
	sqlstr = "insert into venue_info(venue, type)";
	sqlstr += "select distinct on (venue) venue doc_type from paper_info_list_short;";

	if (0==mysql_query(&mydata, sqlstr.c_str())) {
		std::cout << "Fill table venue_info succeed." << std::endl;
	} else {
		std::cout << "Fill table venue_info fail." << std::endl;
		mysql_close(&mydata);
		return false;
	}

	mysql_close(&mydata);
	return true;
}

int main() {
	create_paper_info_list_short();
	create_reference_lists();
	create_venue_info();
	return 0;
}