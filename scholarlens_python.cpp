#include "MySQLPaperQuery.h"
#include <boost/python.hpp>

char output[1000000];
MySQLPaperQuery sql_paper;

const char* scholarlens(const char* request) {
	sql_paper.processRequest(request);
	sql_paper.produceOutput(output);
	return output;
} 

const char* scholarlens_aligned(const char* request_1, const char* request_2){
	sql_paper.processRequestAligned(request_1, request_2);
	sql_paper.produceOutput(output);
	return output;
}

BOOST_PYTHON_MODULE(scholarlens_python) {
	using namespace boost::python;
	def("scholarlens", scholarlens);
	def("scholarlens_aligned", scholarlens_aligned);
}