import json
import pymysql as MySQLdb
import sys
from imp import reload
reload(sys)

def connectMYSQL(dbname):
    db = MySQLdb.connect(host = "127.0.0.1",
                         user = "root",
                         passwd = "vis556623",
                         db = dbname)
    cur = db.cursor()
    return db, cur

file = open("../server/ccf.json", "r")
infos = json.load(file)
file.close()

for key in infos:
    db, cur = connectMYSQL('open_academic_graph')
    cur.execute("insert into venue_info (`venue`, `name`, `type`, `rank`) values ('" + infos[key]['full_name'] + "', '" + infos[key]['name'] + "', '" + infos[key]['type'] + "','" + infos[key]['rank'] + "');")
    db.commit()
