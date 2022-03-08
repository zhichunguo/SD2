#########################################################################################
# This CMakeLists is used to produce the library SD2Query.
#
# To compile one with MySQL please add the header file directory of MySQL Connector/C++,
# and link the corresponding static library in target_link_libraries:
# 
# With MySQL: uncomment line 33, 34, 44, and comment 43;
# Without MySQL: comment line 33, 34, 44, and uncomment 43;
#########################################################################################

cmake_minimum_required( VERSION 2.8 )
 
project( SD2Query CXX )

# use c++11
set (CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} --std=c++11 -no-pie")

# add shared obje
set (CMAKE_MODULE_LINKER_FLAGS "${CMAKE_MODULE_LINKER_FLAGS} -no-pie")

# Find necessary packages
find_package( PythonLibs 2.7 REQUIRED )
include_directories( ${PYTHON_INCLUDE_DIRS} )

# For boost library: necessary, leave the following as is
add_definitions(-DBOOST_ALL_NO_LIB)
find_package( Boost COMPONENTS python REQUIRED )
include_directories( ${Boost_INCLUDE_DIR} )
link_directories(${LINK_DIRECTORIES} ${BOOST_ROOT}/stage/lib)

# For the use of MySQL: uncomment the following to use the library with MySQL
# note that you may update the path with the one that contains the MySQL Connector/C++ library
#add_definitions(-DUSE_MYSQL)
#link_directories(/usr/lib/x86_64-linux-gnu/)

# Please include the directory for MySQL Connector/C++ here
include_directories(./ ../ ../../ /usr/include/)
 
# Define the wrapper library that wraps our library
add_library( SD2Query SHARED SD2Query.cpp utility.h MySQLPaperQuery.h)

# Use the first command for compilation without MySQL and the second with MySQL
target_link_libraries( SD2Query ${Boost_LIBRARIES})
#target_link_libraries( SD2Query ${Boost_LIBRARIES} mysqlclient mysqlcppconn)

# don't prepend wrapper library name with lib
set_target_properties( SD2Query PROPERTIES PREFIX "" )
