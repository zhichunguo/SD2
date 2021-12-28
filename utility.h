#ifndef UTILITY_H
#define UTILITY_H

#include <fstream>

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

#endif
