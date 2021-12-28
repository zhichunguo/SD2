# SD2: Slicing and Dicing Scholarly Data for Interactive Evaluation of Academic Performance

This repository contains the code package for the paper: 

SD2: Slicing and Dicing Scholarly Data for Interactive Evaluation of Academic Performance. 

## Dataset Download
Our data come from [Microsoft Academic Graph](https://www.microsoft.com/en-us/research/project/open-academic-graph/). You should download MAG papers and build a MySQL database using this dataset.
There are two tables:  
**1. "papers_info_list": Saving (id, title, year, citation, doc_type, key_words, publication)**.  
**2. "reference_list": Saving (reference_id, id)**. 

We also download the list of computer science conferences and journals recommended by China Computer Federation, which is saved in ccf.json. You should build another table:    
**3. "venue_info": Saving (venue, name, type, rank)**

Then when you check different venues, the venues' information will be automatically saved in this table.

## Server
#### Mainfile: server.py
The server is a Flask server written in python. It listens to the port 1234 for requests and processes the requests by crawling online information and querying MySQL database.

Install packages which are listed in requirements.txt. 

In the server.py, you should change the line 28-line 31 according to your database settings.

#### scholarlens_python Library
The scholarlens_python library is a python library written in C++ to speedup the queries to the MySQL database. The library will cache all queried information in RAM to avoid repeated queries to the MySQL server. It can also write the cached information to an external file, and restore information from the file.
**Database setting**: You need to define the database information, such as the MySQL server address, user name, user password, and database name, at the beginning of the *MySQLPaperQuery.h*. 
**Options**: The library can be compiled with two options by defining MACROS ``USE_MYSQL`` and ``MYSQL_PAPRE_QUERY_DEBUG``.
``USE_MYSQL``: Compile the library with the ability to query MySQL server. If this macro is not defined, the library can still run with information provided in previously saved external files. In that case, the server will not require the MySQL server and the database to run.
``MYSQL_PAPRE_QUERY_DEBUG``: Compile the library with the ability to produce log files for debugging. 
**Reading/writing external files**: You may send a request to read or write a file through the Flask server. The Flask server will then send the request to the library. To write the cached information to a file, you need to run ``host_address:1234/writefile?name=file.txt``, where ``host_address`` is the IP address of the host and ``file.txt`` is the name of the file. To read information from a file to cache, you may run ``host_address:1234/readfile?name=file.txt``.
**Compilation**: The scholarlens_python library can be compiled using the *CMakeList.txt* file. For **Linux/MacOS**, you may simply run ``cmake ./`` to produce a Makefile, and run ``make`` to compile. For **Windows**, you may use cmake to produce a visual studio project for compilation.
**Dependencies**: The library requires Python and Boost to export the C++ library to Python. It also requires the MySQL C++ connector lirary if compiled with the ``USE_MYSQL`` compilation option.

## Web interface
### Introduction of each file

**SD2**

- **scholarlens.html / html.css / sunburst.css:** Design website layout

- **js/**

  
  **myjs.js:** Control scholar view, publication view. Also entry for hierarchical histogram view
  
  **sunburst.js:** Control hierarchical histogram view 
  
  **sunburst_up.js:** Draw upper histogram
  
  **sunburst_up_second.js:** Control attributes to partition the upper paper set 
  
  **sunburst_down.js:** Draw lower histogram
  
  **sunburst_down_second.js:** Control attributes to partition the lower paper set 
  
  **sunburst_drag_logo.js:** Switch attributes position
  
  **sunburst_group_histogram.js:** Control bar grouping
  
  **add_hints.js:** Add hints
  
  **d3v4.js:** d3 library
  
  **sunburst_drag.js(obsolete):** Was used to drag bars in the hierarchical histograms 

### Steps to run the interface:
1. Change the 1st line in myjs.js IP_address to your IP address. 

2. ``python server.py``

3. Open SD2/scholarlens.html using **Chrome.** Then you can use this system.

## Easies way to use web interface
If you want to explore our visualization part, you can skip dataset download and server part. You can download SD2 folder and open SD2/scholarlens.html using Chrome to use our system. We only upload limited datasets in our server station. You can explore Jiawei Han and Christos's cases in this way.
