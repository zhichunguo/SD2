#########################################################################################
# This CMakeLists is used to produce the library SD2Query without MySQL Connector/C++.
# To compile one with MySQL please add the header file directory of MySQL Connector/C++,
# and link the corresponding static library in target_link_libraries.
#########################################################################################

cmake_minimum_required( VERSION 2.8 )
 
project( BuildDatabase CXX )

# use c++11
set (CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} --std=c++11 -no-pie")

# add shared obje
set (CMAKE_MODULE_LINKER_FLAGS "${CMAKE_MODULE_LINKER_FLAGS} -no-pie")


# for MySQL
add_definitions(-DUSE_MYSQL)
link_directories(/usr/lib/x86_64-linux-gnu/)

# Please include the directory for MySQL Connector/C++ here
include_directories(./ ../ ../../ ../SD2Query /usr/include/)
 
# Define the wrapper library that wraps our library
add_executable( BuildDatabase BuildDatabase.cpp)
# Please link the MySQL Connector/C++ library here
target_link_libraries( BuildDatabase mysqlclient mysqlcppconn)

