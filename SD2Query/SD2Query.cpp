#include "MySQLPaperQuery.h"
#include <boost/python.hpp>

char output[1000000];
MySQLPaperQuery sql_paper;

const char* query(const char* request) {
	sql_paper.processRequest(request);
	sql_paper.produceOutput(output);
	return output;
} 

const char* query_aligned(const char* request_1, const char* request_2){
	sql_paper.processRequestAligned(request_1, request_2);
	sql_paper.produceOutput(output);
	return output;
}

BOOST_PYTHON_MODULE(SD2Query) {
	using namespace boost::python;
	def("query", query);
	def("query_aligned", query_aligned);
}