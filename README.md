# SD<sup>2</sup>: Slicing and Dicing Scholarly Data for Interactive Evaluation of Academic Performance

This repository contains the code package for the paper "SD<sup>2</sup>: Slicing and Dicing Scholarly Data for Interactive Evaluation of Academic Performance". The source codes contain four major components: a **flask server in Python** that listens to request from the web front-end; an **SD2Query package in C++** that can be called by the Python server for efficient queries; a **web interface** that interacts with users and send requests to the flask server; and, a **C++ utility library** that creates the MySQL tables and reads the [Microsoft Academic Graph (MAG)](https://www.microsoft.com/en-us/research/project/open-academic-graph/) data files to fill the database.

## How to Use the tool?
You need to perform the following steps to use the tool:  
1. Install the required packages and run the **flask server**.  
2. Compile the **SD2Query** library and make it discoverable by the flask server.  
3. Open the **web interface** (*interface/SD2.html*) using Google Chrome.  
4. **(Option 1)** Use cached external data file (e.g., *data/christosjiawei.txt*) for queries. Then you can explore Christos Faloutsos and Jiawei Han's case in our paper. 
5. **(Option 2)** Download MAG data and build the **MySQL database** for queries from SD2Query.  

The detailed instructions are stated in the following sections.

## Flask Server
The server is a Flask server written in python. It listens to port 1234 for requests and processes the requests by crawling online information or querying the MySQL database.

**Installation**: The required packages are specified in *requirements.txt*. Please download the file and execute ``pip install -r requirements.txt`` to install the packages.

**Configuration**: This server may connect to the MySQL database for queries. You may replace the MySQL database information in ``connect MYSQL`` function (line 38-41) of server.py. But please note that most functions are obsolete and replaced by the C++ counterparts in the SD2Query package. 

**Running the server**: Please simply run the server with ``python server.py``.

## SD2Query Package
The SD2Query package is a python package written in C++ to speed up the queries to the MySQL database. The package will cache all queried information in RAM to avoid repeated queries to the MySQL server. It can also write the cached information to an external file, and restore information from the file.

**Database setting**: You need to define the database information, such as the MySQL server address, user name, user password, and database name, at the beginning of the file *utility.h*.

**Reading/writing external files**: You may send a request to read or write a file through the Flask server. The Flask server will then send the request to the package. To write the cached information to a file, you need to run ``host_address:1234/writefile?name=file.txt``, where ``host_address`` is the IP address of the host and *file.txt* is the name of the file. To read information from a file to cache, you may run ``host_address:1234/readfile?name=file.txt``.

**Compilation**: The SD2Query package can be compiled using the *CMakeList.txt* file. For *Linux/MacOS*, you may simply run ``cmake ./`` to produce a Makefile, and run ``make`` to compile. For *Windows*, you may use cmake to produce a visual studio project for compilation. A successful compilation will create a dynamic library, and you need to copy that to the directory containing server.py to ensure the package is discoverable by python. 

**Compilation options**: The package can be compiled with two options by defining MACROS ``USE_MYSQL`` and ``MYSQL_PAPRE_QUERY_DEBUG``.

``USE_MYSQL``: Compile the package with the ability to query MySQL server. If this macro is not defined, the package can still run with the information provided in previously saved external files. In that case, the server will not require the MySQL server and the database to run. Please refer to the corresponding ``SD2Query/CMakeLists.txt`` for detail.

``MYSQL_PAPRE_QUERY_DEBUG``: Compile the package with the ability to produce log files for debugging.

**Dependencies**: The package requires Python and Boost to export the C++ library to Python. It also requires the MySQL Connector/C++ library if compiled with the ``USE_MYSQL`` compilation option. In that case, you will need to provide the corresponding include directory and static library in *CMakeLists.txt*. Please follow the instructions in *CMakeLists.txt*.

## Web interface
The web interface is the front-end of our implementation that users interact with. It will send requests to the server to acquire data on demand during the interaction. 

**Source code structure**: The web interface is written in html, css, and javascript. It determines the layout of the interface and page behavior. The files *SD2.html*, *html.css*, and *sunburst.css* determine the layout of three views in the paper. The file *myjs.js* implements the interaction of scholar view and publication view. For the hierarchical histogram view, *sunburst.js* implements the highest level of control for both upper and lower histograms, where the hierarchical histogram redrawing starts. It determines the scale methods, attribute lock, and also bar alignment. All the detailed upper and lower histograms, such as partition the paper set, bar grouping and minimap are implemented in *sunburst_\*.js*. Interaction hints are added by *add_hints.js*.   

**Server configuration**: You need to specify the IP address of your server at the very beginning of myjs.js. If you are running the server locally, you may use "local_host" or "127.0.0.1". The initial IP address points to our VPS server, which only hosts a toy example data set. 

**Usage**: You may simply open ``interface/SD2.html`` using Google Chrome. Please make sure that the server is running (by executing ``python server.py``).

## Data Preparation
We use the data from [Microsoft Academic Graph (MAG)](https://www.microsoft.com/en-us/research/project/open-academic-graph/) project and store the data in a MySQL database for the query. As the MAG data is still being updated, we suggest you download the latest version before building the database. The database can be updated with new files to include new papers using our code as well. 

**Database Definition**: The database should contain the three tables, storing the information of papers, reference relationships (pairs of papers), and venues.  
1. Table **papers_info_list_short** has the following attributes (id, title, venue, year, citation, doc_type), where "id" is the ID of a paper in the MAG data, "title" is the title of the paper, "venue" is the name of the venue where the paper is published, "year" is the year when the paper is published, "citation" is the citation number of the paper, and "doc_type" is either "journal" or "conference".  
2. Table **reference_list** has the following attributes (cite_id, reference_id), where "cite_id" is the id of the paper being cited, and "reference_id" is the id of a citing paper.  
3. **venue_info** has the following attributes (venue, name, type, rank), where "venue" is the full name of the venue, "name" is the abbreviation of the name, "type" is either "journal" or "conference", and "rank" is the CCF rank.  

**Building Database**: The database can be built using our code in the file *BuildDatabase.cpp*. This file contains three functions: `create_paper_info_list_short()`, `create_reference_list()`, and `create_venue_info()`. The functions `create_paper_info_list_short()` and `create_reference_list()` create the respective tables. These two functions also incorporate a simple parser to parse MAG data files and fill the values to the tables. The function `create_venue_info()` create the table "venue_info" and copy the distinctive values from ``paper_info_list_short`` to that table. Please note that the abbreviation and rank information is not in the original MAG data. This information is stored in ccf.json and can be filled into the database by running ``build_database/build_ccf.py``. 

## Easiest Way to Use the Web Interface
If you only want to experiment with the web interface, you can skip all dataset download and code compilation. In this case, you only need to download the interface folder and open *interface/SD2.html* using Chrome. The initial configuration in the interface will connect to our VPS server, which hosts a toy example dataset containing data of Jiawei Han and Christos Faloutsos. Please contact us if the server is not responding correctly.


## Step-by-step Instruction to Compile and Run This Tool on Linux
The steps are tested on a clean Ubuntu 18.04 machine. Python 2.7, CMake 3.10, Boost 1.65.1, and PyMySQL 0.7.11 are installed for testing. The following lists all commands used for building the tool, assuming that you start from the root directory containing the folders *server*, *SD2Query*, *build_database*.
### Build the server
#### Prepare python environment
Please execute the following commands in the listed order:

``cd server``: switch to the *server* folder.

``apt install python``: install *Python 2.7*.

``apt install pip``: install *pip* for package installation.

``pip install -r requirements``: install the packages listed in *requirements.txt*.

#### Compile SD2Query library
Please execute the following commands in the listed order:

``cd ../SD2Query``: switch to the *SD2Query* folder from the *server* folder.

``apt install cmake``: install CMake for producing the Makefile.

**Install Boost library (required for exporting C++ to Python)**

``wget -O boost_1_65_1.tar.gz https://sourceforge.net/projects/boost/files/boost/1.65.1/boost_1_65_1.tar.gz/download``: download the package file. You may find it elsewhere as well. 

``tar xzvf boost_1_65_1.tar.gz``: untar the file in the *boost_1_65_1* folder.

``cd boost_1_65_1/``: switch to the boost folder for compilation.

``./bootstrap.sh --prefix=/usr/include``: set the folder to install boost.

``./b2``: build boost.

``sudo ./b2 install``: perform the actual installation.

Please note that we test ``apt-get install libboost-all-dev`` to install Boost, but the installed version does not work in our testing.

**Install MySQL (optional)**

``sudo apt-get install mysql-client mysql-server``: install MySQL executables. Then you should be able to run ``mysql`` and create your MySQL account and database. The user name, password, database name should be updated in the *utility.h*.

``sudo apt-get install libmysqlclient-dev``: install the development library. You should find the header files in */usr/include/mysql/* and the library in */usr/lib/x86_64-linux-gnu/*. If the files appear in different locations, please update line 34 and 37 in *SD2Query/CMakeLists.txt*.

``sudo apt-get install openssl``: install OpenSSL for MySQL.

``sudo apt-get install libmysqlcppconn-dev``: install MySQL C++ Connector library. This allows executing MySQL queries in C++ codes. You should find the library in */usr/lib/x86_64-linux-gnu/*.

**Build SD2Query library**
``cmake ./``: create Makefile.

``make``: build the library. You should find a dynamic library named *SD2Query.so*.

``cp SD2Query.so ../server``: copy the library to the folder containing the Python server.

### Run the server
``cd ../server``: switch to the *server* folder from the *SD2Query* folder.

``python server.py``: run the server. You may use ``nohup python server.py`` to run the Python server in background, which is useful especially when you are using a remote machine as the server.

### Prepare MySQL database (optional)
1. Download the Microsoft Academic Graph dataset from [Open Academic Graph](https://www.aminer.cn/oag-2-1) and save the files to the *build_database/mag_papers* folder. The folder currently contains an example file (mag_papers_1.txt) for testing purpose. 
2. Compile **BuildDatabase** in the *build_database* directory. The compiled executable will automatically create the tables in MySQL database, read the *mag_papers_\*.txt* files, and fill the data into the MySQL tables. The compilation can be easily done with ``cmake ./`` (to create a Makefile in the build_database) and ``make`` (to create the executable), assuming you already follows the above steps to install MySQL.

### Use local data file
Use ``http://YourIPAddress:1234/readfile?name=christosjiawei.txt`` to load our example data file (*christosjiawei.txt*).

Use ``http://YourIPAddress:1234/writefile?name=file_name.txt`` to write the cached data into a file (*file_name.txt*). Reading the data file is more efficient than MySQL queries.

### Interface
1. You should update the IP address and the port where the server is running and discoveable. To do this, change the fist line in interface/js/myjs.js.
2. If you are running the server locally, you may simply open interface/SD2.html with Chrome. Otherwise, if you are running the server on a remote machine, you may follow the instruction of [this guidance](https://www.digitalocean.com/community/tutorials/how-to-install-the-apache-web-server-on-ubuntu-20-04) to build an apache web server on Linux. Then you can use http://yourIPAdress/SD2.html in any chrome of other computers to access the server.

### Important tips
The query consists of two major steps: crawling data from Google Scholar and querying details from Microsoft Academic Graph usign MySQL. 1) When you enter a new scholar name in the SD2.html for query, the server will attempt to obtain this authors' all the information listed in Google Scholar using a crawler. The crawled data of this scholar and her co-authors' information will be saved into ``data`` folder. Please note that the crawler may fail when Google update their webpage structure or implement new anti-crawling mechanism. We provide our pre-crawled all the authors' google scholar pages in ``data/authors_info_lists``. If the crawler fails to work, you may still experiment our tool with these pre-crawled data. 2) The server will query all the related papers' information from mysql database and cache the queried results. For the papers that are not found in the MySQL database, the corresponding information will not be shown in the visualization. If the server is not compiled with MySQL or the MySQL database is not filled, you may rely on the local file for the query. Please refer to the above "Use local data file" session.
