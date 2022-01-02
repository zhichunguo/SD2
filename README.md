# SD2: Slicing and Dicing Scholarly Data for Interactive Evaluation of Academic Performance

This repository contains the code package for the paper "SD2: Slicing and Dicing Scholarly Data for Interactive Evaluation of Academic Performance". The source codes contain four major components: a **flask server in Python** that listens to request from web front-end; a **library SD2Query in C++** that can be called by the Python server for efficient queries; a **web interface** that interact with users and send request to the flask server; and, a **C++ utility library** that creates the MySQL tables, and reads the [Microsoft Academic Graph (MAG)](https://www.microsoft.com/en-us/research/project/open-academic-graph/) data files to fill the database.

## How to Use the tool?
You need to perform the following steps to use the tool:  
1. Install the required packages and run the **flask server**.  
2. Compile the **SD2Query** library and make it discoverable by the flask server.  
3. Open the **web interface** (interface/scholarlens.html) using Chrome.  
4. **(Option 1)** Use cached external data file (e.g., data/christosjiawei.txt) for queries.  
5. **(Option 2)** Download MAG data and build the **MySQL database** for queries from SD2Query.  

The detailed instructions are stated in the following sections.

## Flask Server
The server is a Flask server written in python. It listens to the port 1234 for requests and processes the requests by crawling online information and querying MySQL database.

To run this server, you need to install packages which are listed in requirements.txt by ``pip install -r requirements.txt``. This server needs to connect to the MySQL database to query the papers information from it. You are supposed to change MySQL database information in ``connectMYSQL`` function (line 38-41) of server.py to your database settings. Then do ``python server.py`` to build up the Flask server which listens to the port 1234.

## SD2Query Library
The SD2Query library is a python library written in C++ to speedup the queries to the MySQL database. The library will cache all queried information in RAM to avoid repeated queries to the MySQL server. It can also write the cached information to an external file, and restore information from the file.

**Database setting**: You need to define the database information, such as the MySQL server address, user name, user password, and database name, at the beginning of the file *MySQLPaperQuery.h*.

**Options**: The library can be compiled with two options by defining MACROS ``USE_MYSQL`` and ``MYSQL_PAPRE_QUERY_DEBUG``.

``USE_MYSQL``: Compile the library with the ability to query MySQL server. If this macro is not defined, the library can still run with information provided in previously saved external files. In that case, the server will not require the MySQL server and the database to run.

``MYSQL_PAPRE_QUERY_DEBUG``: Compile the library with the ability to produce log files for debugging.

**Reading/writing external files**: You may send a request to read or write a file through the Flask server. The Flask server will then send the request to the library. To write the cached information to a file, you need to run ``host_address:1234/writefile?name=file.txt``, where ``host_address`` is the IP address of the host and ``file.txt`` is the name of the file. To read information from a file to cache, you may run ``host_address:1234/readfile?name=file.txt``.

**Compilation**: The SD2Query library can be compiled using the *CMakeList.txt* file. For *Linux/MacOS*, you may simply run ``cmake ./`` to produce a Makefile, and run ``make`` to compile. For *Windows*, you may use cmake to produce a visual studio project for compilation. A successful compilation will create a dynamic library, and you need to copy that to the directory containing server.py to ensure the library is discoverable by python.

**Dependencies**: The library requires Python and Boost to export the C++ library to Python. It also requires the MySQL C++ connector library if compiled with the ``USE_MYSQL`` compilation option.  

## Web interface
The web interface is written in html, css and javascript. It determines the layout of the interface and page behavior. ``scholarlens.html / html.css / sunburst.css`` files determine the layout of three views in the paper. The interaction of scholar view and publication view are written in ``myjs.js``. For the hierarchical histogram view, ``sunburst.js`` is the master control for both upper and lower histograms, which is the start of redrawing hirarchical histogram. It determines the scale methods, attribute lock, and also bar alignment. All the detailed upper and lower histograms, such as partition the paper set, bar grouping and minimap are implemented in ``sunburst_*.js``. Hints are added by ``add_hints.js``.   
**IP address settings**: You need to change the 1st line in myjs.js IP_address to your IP address. 
**Usage**: You should open ``interface/scholarlens.html`` using Chrome, when ``server.py`` is running.

<!-- **Introduction of the interface files**:  
- scholarlens.html / html.css / sunburst.css: Design website layout  
- js
  
  myjs.js: Control scholar view, publication view. Also entry for hierarchical histogram view
  
  sunburst.js: Control hierarchical histogram view 
  
  sunburst_up.js: Draw upper histogram
  
  sunburst_up_second.js: Control attributes to partition the upper paper set 
  
  sunburst_down.js: Draw lower histogram
  
  sunburst_down_second.js: Control attributes to partition the lower paper set 
  
  sunburst_drag_logo.js: Switch attributes position
  
  sunburst_group_histogram.js: Control bar grouping
  
  add_hints.js: Add hints
  
  d3v4.js: d3 library
  
  sunburst_drag.js(obsolete): Was used to drag bars in the hierarchical histograms  -->

## Easies way to use web interface
If you want to explore our visualization part, you can skip dataset download and server part. You can download SD2 folder and open SD2/scholarlens.html using Chrome to use our system. We only upload limited datasets in our server station. You can explore Jiawei Han and Christos's cases in this way.

## Data Preparation
We use the data from [Microsoft Academic Graph (MAG)](https://www.microsoft.com/en-us/research/project/open-academic-graph/) project and store the data in a MySQL database for query. As the MAG data is still being updated, we suggest you download the latest version before building the database. The database can be updated with new files to include new papers using our code as well. 

**Database Definition**: The database should contain the three tables, storing the information of papers, reference relationships (pairs of papers), and venues.  
1. Table **papers_info_list_short** has the following attributes (id, title, venue, year, citation, doc_type), where "id" is the ID of a paper in the MAG data, "title" is the title of the paper, "venue" is the name of the venue where the paper is published, "year" is the year when the paper is published, "citation" is the citation number of the paper, and "doc_type" is either "journal" or "conference".  
2. Table **reference_list** has the following attributes (cite_id, reference_id), where "cite_id" is the id of the paper being cited, and "reference_id" is the id of a citing paper.  
3. **venue_info** has the following attributes (venue, name, type, rank), where "venue" is the full name of the venue, "name" is the abbreviation of the name, "type" is either "journal" or "conference", and "rank" is the CCF rank.  

**Building Database**: The database can be built using our code in the file *BuildDatabase.cpp*. This file contains three functions: `create_paper_info_list_short()`, `create_reference_list()`, and `create_venue_info()`. The functions `create_paper_info_list_short()` and `create_reference_list()` create the respective tables. These two functions also incorporate a simple parser to parse MAG data files and fill the values to the tables. The function `create_venue_info()` create the table "venue_info" and copy the distinctive values from ``paper_info_list_short`` to that table. Please note that the abbreviation and rank information is not in the original MAG data. This information is stored in ccf.json and can be filled into the database by calling ??? function in server.py.
