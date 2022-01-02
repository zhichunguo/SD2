//******************************************************************
// This file is for exporting the C++ function to a Python package.
//******************************************************************


#include "MySQLPaperQuery.h"
#include <boost/python.hpp>

//allocate static memory to host the queried results
char output[1000000];
//define a global variable so that the queried data will be cached
MySQLPaperQuery sql_paper;

//this function is to process request regarding to a single histogram
const char* query(const char* request) {
	sql_paper.processRequest(request);
	sql_paper.produceOutput(output);
	return output;
} 

//this function is to process request of two aligned histograms 
const char* query_aligned(const char* request_1, const char* request_2){
	sql_paper.processRequestAligned(request_1, request_2);
	sql_paper.produceOutput(output);
	return output;
}

//this boost macro exports the functions to a Python package
//the functions exported can be called in the Python server
BOOST_PYTHON_MODULE(SD2Query) {
	using namespace boost::python;
	def("query", query);
	def("query_aligned", query_aligned);
}