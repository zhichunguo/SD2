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

**Database setting**: You need to define the database information, such as the MySQL server address, user name, user password, and database name, at the beginning of the file *MySQLPaperQuery.h*.

**Compilation options**: The package can be compiled with two options by defining MACROS ``USE_MYSQL`` and ``MYSQL_PAPRE_QUERY_DEBUG``.

``USE_MYSQL``: Compile the package with the ability to query MySQL server. If this macro is not defined, the package can still run with the information provided in previously saved external files. In that case, the server will not require the MySQL server and the database to run.

``MYSQL_PAPRE_QUERY_DEBUG``: Compile the package with the ability to produce log files for debugging.

**Reading/writing external files**: You may send a request to read or write a file through the Flask server. The Flask server will then send the request to the package. To write the cached information to a file, you need to run ``host_address:1234/writefile?name=file.txt``, where ``host_address`` is the IP address of the host and *file.txt* is the name of the file. To read information from a file to cache, you may run ``host_address:1234/readfile?name=file.txt``.

**Compilation**: The SD2Query package can be compiled using the *CMakeList.txt* file. For *Linux/MacOS*, you may simply run ``cmake ./`` to produce a Makefile, and run ``make`` to compile. For *Windows*, you may use cmake to produce a visual studio project for compilation. A successful compilation will create a dynamic library, and you need to copy that to the directory containing server.py to ensure the package is discoverable by python. 

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


## Step-by-step instuction to use this tool in linux
### Prepare server
#### Prepare python environment
``cd server``

``apt install python``

``apt install pip``

``pip install -r requirements``


#### SD2Query compilation
``cd ../SD2Query``

``pip install PyMySQL==0.7.11``

``apt install cmake``

``sudo apt-get install mysql-client mysql-server``

``sudo apt-get install libmysqlclient-dev``

``sudo apt-get install openssl``

``sudo apt-get install libboost-dev``

``wget -O boost_1_65_1.tar.gz https://sourceforge.net/projects/boost/files/boost/1.65.1/boost_1_65_1.tar.gz/download``

``tar xzvf boost_1_65_1.tar.gz``

``cd boost_1_65_1/``

``./bootstrap.sh --prefix=/usr/include``

``./b2``

``sudo ./b2 install``

``cmake ./``

Then ``cd ../server``, run ``python server.py`` should can work.

### Prepare mysql
1. Download the paper sets from [Microsoft Academic Graph (MAG)](https://www.microsoft.com/en-us/research/project/open-academic-graph/) and save the files under build_database/mag_papers folder. We gives an example file (mag_papers_1.txt) in this folder to test.
2. compile MYSQL and run to build the mysql database and insert datasets into it automatically.

### Interface
1. Change the fist line of interface/js/myjs.js to the IP address of your linux.
2. Open interface/SD2.html using Chrome. If there is no display with your linux, you can follow the instruction of [this guidance](https://www.digitalocean.com/community/tutorials/how-to-install-the-apache-web-server-on-ubuntu-20-04) to build an apache web server on the linux. Then you can using http://yourIPAdress/SD2.html in any chrome of other computers to access the server.

### Important tips
There are two parts of the server query. 1) When you input a new author name in the SD2.html to query, the server need to obtain this authors' all the information listed in the google scholar using a crawler. Then save these information and his co-authors' information into ``data`` folder. 2) The server need to query all the related papers' information from mysql database. Then save these information. If some papers' information are not save in the database, these papers will not be shown in the website. We save all the papers' information of Jiawei Han' group utilized in our paper in ``server/christosjiawei.txt``, which the server do not need to query using mysql database again.

We can not promise our crawler can work in all environment or machines. We provide our pre-crawled all the authors' google scholar pages in ``data/authors_info_lists``. You can query all the authors in this folder. For the mysql part, you can use ``http://YourIPAddress:1234/readfile?name=christosjiawei.txt`` to preload Jiawei's papers, then you do not need to insert all his papers into your mysql database.
