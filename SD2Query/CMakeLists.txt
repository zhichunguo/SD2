cmake_minimum_required( VERSION 2.8 )
 
project( BoostPythonScholarLens CXX )

# use c++11
set (CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} --std=c++11 -no-pie")

# add shared obje
set (CMAKE_MODULE_LINKER_FLAGS "${CMAKE_MODULE_LINKER_FLAGS} -no-pie")

# Find necessary packages
find_package( PythonLibs 2.7 REQUIRED )
include_directories( ${PYTHON_INCLUDE_DIRS} )

add_definitions( -DBOOST_ALL_NO_LIB)
find_package( Boost COMPONENTS python REQUIRED )
include_directories( ${Boost_INCLUDE_DIR} )
link_directories(${LINK_DIRECTORIES} ${BOOST_ROOT}/stage/lib)
 
include_directories(../ ../../)
 
# Define the wrapper library that wraps our library
add_library( SD2Query SHARED SD2Query.cpp utility.h MySQLPaperQuery.h)
target_link_libraries( SD2Query ${Boost_LIBRARIES} )

# don't prepend wrapper library name with lib
set_target_properties( SD2Query PROPERTIES PREFIX "" )
