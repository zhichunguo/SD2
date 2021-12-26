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

## Server Part
Install packages which are listed in requirements.txt. 

In the server.py, you should change the line 28-line 31 according to your database settings.

## Web interface Part
Interface part are all saved in SD2 folder. Then change all "http://140.82.48.134:1234/user" to your IP address in all .js files. 

``python server.py``

**Open SD2/scholarlens.html using Chrome.** Then you can use this system.

## Easies way to use web interface
If you want to explore our visualization part, you can skip dataset download and server part. You can download SD2 folder and open SD2/scholarlens.html using Chrome to use our system. We only upload limited datasets in our server station. You can explore Jiawei Han and Christos's cases in this way.



