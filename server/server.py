from flask import Flask, render_template
from flask import request
from flask import jsonify
from flask_cors import CORS

import requests
import re
import time
import json
import os
from lxml import etree
import pymysql as MySQLdb
import sys
from imp import reload
reload(sys)

import SD2Query

# ********************************************************************************
# file: server.py
# 
# This file is to prepare the datasets according to the queries.
# 1. Crawl the authors' information, publication and their co-authors' information and publications from their google scholar pages.
# 2. Update MySQL databases and save authors' infromation into an external file to speedup the queries. (obsolete)
# 3. Prepare the data according to different queries, like grouping the paper sets. (obsolete)
# 4. Build Flask server which listens to the port 1234 for requests and process the requests.
# ********************************************************************************

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    print("Connected!")
    return render_template('index.html')

def connectMYSQL(dbname):
    db = MySQLdb.connect(host = "127.0.0.1",
                         user = "root",
                         passwd = "vis556623",
                         db = dbname)
    cur = db.cursor()
    return db, cur

def removeNonAscii(s): return "".join(i for i in s if ord(i)<128)
def removeNumber(s): return "".join(i for i in s if (i<'0' or i>'9'))


# ********************************************************************************
# 1. Crawl the authors' information, publication and their co-authors' information and publications from their google scholar pages.
# ********************************************************************************

def headers(tree, result):   #### Crawler head
    headers = tree.xpath(r'//div[@id = "gsc_prf_i"]')[0]
    result['name'] = headers.xpath(r'./div[@id = "gsc_prf_in"]/text()')[0]
    title = headers.xpath(r'./div[@class = "gsc_prf_il"]')[0]
    if len(title.xpath(r'./text()')) == 1 and title.xpath(r'./a') != []:
        result['title'] = title.xpath(r'./text()')[0][:-2]
        result['University'] = title.xpath(r'./a/text()')[0]
    elif len(title.xpath(r'./text()')) == 1 and title.xpath(r'./a') == []:
        result['title'] = title.xpath(r'./text()')[0]
        result['University'] = ''
    elif len(title.xpath(r'./text()')) == 0 and title.xpath(r'./a') != []:
        result['title'] = ''
        result['University'] = title.xpath(r'./a/text()')[0]
    else:
        result['title'] = ''
        result['University'] = ''
    
    if headers.xpath(r'./div[@class = "gsc_prf_il"]')[1].xpath(r'./a') != []:
        result['homepage'] = headers.xpath(r'./div[@class = "gsc_prf_il"]/a/@href')[1]
    else:
        result['homepage'] = ''
    if headers.xpath(r'./div[@class = "gsc_prf_il"]')[2].xpath(r'./a/text()') != []:
        result['major in'] = headers.xpath(r'./div[@class = "gsc_prf_il"]')[2].xpath(r'./a/text()')
    else:
        result['major in'] = ''


def citations(tree, result):   ### Check citation information on the author's google scholar page
    citations = tree.xpath(r'//div[@class = "gsc_rsb_s gsc_prf_pnl"]')[0]
    from_year = citations.xpath(r'./table[@id = "gsc_rsb_st"]/thead/tr/th/text()')[1][:4]
    table1 = citations.xpath(r'./table[@id = "gsc_rsb_st"]/tbody/tr/td/text()')
    result['citation_sum'] = table1[0]
    result['citation_sum_from_' + str(from_year)] = table1[1]
    result['h-index'] = table1[2]
    result['h-index_from_' + str(from_year)] = table1[3]
    result['i10'] = table1[4]
    result['i10_from_' + str(from_year)] = table1[5]
    result['citation_eachyear'] = []
    table = tree.xpath(r'//div[@class = "gsc_g_hist_wrp"]')[0]
    table2 = table.xpath(r'./div/div[@class = "gsc_md_hist_b"]//text()')
    for each in range(len(table2)/2):
        result['citation_eachyear'].append([table2[each], table2[each + len(table2)/2]])



def co_authers(urlname, result):    ### Check co-authors information on the author's google scholar page
    getHeaders = {r"Host": r"scholar.google.com",
                    r"User-Agent": r"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.117 Safari/537.36",
                    r"Accept": r"text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                    r"Accept-Language": r"zh-CN,zh;q=0.9,en;q=0.8",
                    r"Accept-Encoding": r"gzip, deflate, br",
                    r"DNT": r"1",
                    r"accept": r"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8"}

    url = "https://scholar.google.com/citations?view_op=list_colleagues&hl=zh-CN&json=&user=" + urlname

    s = requests.Session()
    s.headers.update(getHeaders)

    index = s.get(url)
    tree = etree.HTML(index.text)

    all_coauthers = tree.xpath(r'//div[@id = "gsc_codb_content"]/div')
    result['co_authors'] = []
    for each in all_coauthers:
        author = {}
        try:
            author['name'] = each.xpath(r'.//div[@class = "gs_ai_t gs_ai_pss"]/h3//text()')[0]
        except:
            continue
        author_url = each.xpath(r'.//div[@class = "gs_ai_t gs_ai_pss"]/h3/a/@href')[0]
        begin = (re.search('user=', author_url)).span()[1]
        end = (re.search('hl=', author_url)).span()[0] -1
        if end > begin:
            author['urlname'] = author_url[begin:end]
        else:
            author['urlname'] = author_url[begin:] 
        if each.xpath(r'.//div/div[@class = "gs_ai_aff"]/text()') != []:
            author['title'] = each.xpath(r'.//div/div[@class = "gs_ai_aff"]/text()')[0]
        else:
            author['title'] = ''
        co_authors_info = login_coauthor(author['urlname'],result)
        author['paper_num'] = co_authors_info['paper_sum']
        author['co_paper_num'] = co_authors_info['co_paper_sum']
        print(author)
        result['co_authors'].append(author)

# ********************************************************************************
# 2. Update MySQL databases and save authors' infromation into an external file to speedup the queries. (obsolete)
# ********************************************************************************


def papers(urlname, tree, result):   ### Check paper information. If this author's papers information have been saved in co_authors_list, just read it. Or craw the papers titles using google scholar and then check them in the database. 
    result['papers'] = {}
    db, cur = connectMYSQL('open_academic_graph')

    if os.path.exists("./co_authors_info_lists/" + urlname + ".txt"):
        file = open("./co_authors_info_lists/" + urlname + ".txt", 'r')
        co_author_papers = json.loads(file.read())
        file.close()

        for id in co_author_papers['ids']:
            try:
                cur.execute("select * from papers_info_list where id = '" + id + "';")
                data = cur.fetchall()[0]
                result['papers'][data[0]] = {}
                result['papers'][data[0]]['title'] = data[1]
                result['papers'][data[0]]['year'] = data[2]
                result['papers'][data[0]]['citation'] = data[3]
                if data[3] == -1:
                    cur.execute("select count(*) from reference_list where reference_id = '" + data[0] + "';")
                    result['papers'][data[0]]['citation'] = cur.fetchall()[0][0]
                    print("citation:", result['papers'][data[0]]['citation'])
                    cur.execute("update papers_info_list set citation = " + str(result['papers'][data[0]]['citation']) + " where id = '" + data[0] + "';")
                    db.commit()
                result['papers'][data[0]]['doc_type'] = data[4]
                result['papers'][data[0]]['publication'] = data[6]
            except Exception as e:
                continue
        
    else:
        co_authors_papers = {}
        co_authors_papers['titles'] = []
        co_authors_papers['ids'] = []
        t = 0
        postHeaders = {r"User-Agent": r"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.117 Safari/537.36",
                    r"accept": r"*/*",
                    r"accept-language": r"zh-CN,zh;q=0.9,en;q=0.8",
                    r"accept-encoding": r"gzip, deflate, br",
                    r"x-requested-with": r"XHR",
                    r"content-length": r"6",
                    r"content-type": r"application/x-www-form-urlencoded",
                    r"origin": r"https://scholar.google.com"}

        t += 1
        papers = tree.xpath(r'//table[@id = "gsc_a_t"]/tbody/tr')
        for each in papers:
            #paper = {}
            title = each.xpath(r'./td[@class = "gsc_a_t"]/a/text()')[0]
            if len(each.xpath(r'./td[@class = "gsc_a_t"]/div[@class = "gs_gray"]/text()')) == 2:
                publication = each.xpath(r'./td[@class = "gsc_a_t"]/div[@class = "gs_gray"]/text()')[1]
            else:
                publication = ''
            try:
                # print '1'
                co_authors_papers['titles'].append(title)
                cur.execute("select * from papers_info_list where title = '" + title + "';")
                data = cur.fetchall()[0]
                co_authors_papers['ids'].append(data[0])
                result['papers'][data[0]] = {}
                result['papers'][data[0]]['title'] = data[1]
                result['papers'][data[0]]['year'] = data[2]
                result['papers'][data[0]]['citation'] = data[3]
                if data[3] == -1:
                    cur.execute("select count(*) from reference_list where reference_id = '" + data[0] + "';")
                    result['papers'][data[0]]['citation'] = cur.fetchall()[0][0]
                    print("citation:", result['papers'][data[0]]['citation'])
                    cur.execute("update papers_info_list set citation = " + str(result['papers'][data[0]]['citation']) + " where id = '" + data[0] + "';")
                    db.commit()
                result['papers'][data[0]]['doc_type'] = data[4]
                result['papers'][data[0]]['publication'] = data[6]
            except Exception as e:
                continue

        while tree.xpath(r'//button[@id = "gsc_bpf_more"]/@disabled') == []:
            if t != 0:
                if t == 1:
                    url = "https://scholar.google.com/citations?user=" + urlname + "&hl=zh-CN&cstart=20&pagesize=80"
                else:
                    url = "https://scholar.google.com/citations?user=" + urlname + "&hl=zh-CN&cstart=" + str((t-1)*100) + "&pagesize=100"
                print(url)
                #time.sleep(30)
                s = requests.Session()
                s.headers.update(postHeaders)

                index = s.post(url, postHeaders)
                tree = etree.HTML(index.text)
            t += 1
            papers = tree.xpath(r'//table[@id = "gsc_a_t"]/tbody/tr')
            for each in papers:
                #paper = {}
                title = each.xpath(r'./td[@class = "gsc_a_t"]/a/text()')[0]
                if len(each.xpath(r'./td[@class = "gsc_a_t"]/div[@class = "gs_gray"]/text()')) == 2:
                    publication = each.xpath(r'./td[@class = "gsc_a_t"]/div[@class = "gs_gray"]/text()')[1]
                else:
                    publication = ''
                try:
                    # print '1'
                    co_authors_papers['titles'].append(title)
                    cur.execute("select * from papers_info_list where title = '" + title + "';")
                    data = cur.fetchall()[0]
                    co_authors_papers['ids'].append(data[0])
                    result['papers'][data[0]] = {}
                    result['papers'][data[0]]['title'] = data[1]
                    result['papers'][data[0]]['year'] = data[2]
                    result['papers'][data[0]]['citation'] = data[3]
                    if data[3] == -1:
                        cur.execute("select count(*) from reference_list where reference_id = '" + data[0] + "';")
                        result['papers'][data[0]]['citation'] = cur.fetchall()[0][0]
                        print("citation:", result['papers'][data[0]]['citation'])
                        cur.execute("update papers_info_list set citation = " + str(result['papers'][data[0]]['citation']) + " where id = '" + data[0] + "';")
                        db.commit()
                    result['papers'][data[0]]['doc_type'] = data[4]
                    result['papers'][data[0]]['publication'] = data[6]
                except Exception as e:
                    continue
        
        file = open("./co_authors_info_lists/" + urlname + ".txt", 'w')
        file.write(json.dumps(co_authors_papers))
        file.close()

def co_papers(urlname, tree, result, author_result):  ### Check the author's co-authors' papers' information
    co_authors_papers = {}
    co_authors_papers['titles'] = []
    co_authors_papers['ids'] = []
    t = 0
    paper_sum = 0
    co_paper_sum = 0
    db, cur = connectMYSQL('open_academic_graph')
    postHeaders = {r"User-Agent": r"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.117 Safari/537.36",
                   r"accept": r"*/*",
                   r"accept-language": r"zh-CN,zh;q=0.9,en;q=0.8",
                   r"accept-encoding": r"gzip, deflate, br",
                   r"x-requested-with": r"XHR",
                   r"content-length": r"6",
                   r"content-type": r"application/x-www-form-urlencoded",
                   r"origin": r"https://scholar.google.com"}

    t += 1
    papers = tree.xpath(r'//table[@id = "gsc_a_t"]/tbody/tr')
    for each in papers:
        title = each.xpath(r'./td[@class = "gsc_a_t"]/a/text()')[0]
        try:
            paper_sum += 1
            co_authors_papers['titles'].append(title)
            cur.execute("select * from papers_info_list where title = '" + title + "';")
            data = cur.fetchall()[0]
            co_authors_papers['ids'].append(data[0])
            if data[0] in author_result['papers'].keys():
                co_paper_sum += 1
        except Exception as e:
            continue

    while tree.xpath(r'//button[@id = "gsc_bpf_more"]/@disabled') == []:
        if t != 0:
            if t == 1:
                url = "https://scholar.google.com/citations?user=" + urlname + "&hl=zh-CN&cstart=20&pagesize=80"
            else:
                url = "https://scholar.google.com/citations?user=" + urlname + "&hl=zh-CN&cstart=" + str((t-1)*100) + "&pagesize=100"
            print(url)
            #time.sleep(30)
            s = requests.Session()
            s.headers.update(postHeaders)

            index = s.post(url, postHeaders)
            tree = etree.HTML(index.text)
        t += 1
        papers = tree.xpath(r'//table[@id = "gsc_a_t"]/tbody/tr')
        for each in papers:
            title = each.xpath(r'./td[@class = "gsc_a_t"]/a/text()')[0]
            try:
                paper_sum += 1
                co_authors_papers['titles'].append(title)
                cur.execute("select * from papers_info_list where title = '" + title + "';")
                data = cur.fetchall()[0]
                co_authors_papers['ids'].append(data[0])
                if data[0] in author_result['papers'].keys():
                    co_paper_sum += 1

            except Exception as e:
                continue
    
    file = open("./co_authors_info_lists/" + urlname + ".txt", 'w')
    file.write(json.dumps(co_authors_papers))
    file.close()

    result['paper_sum'] = paper_sum
    result['co_paper_sum'] = co_paper_sum

def login_coauthor(urlname,author_result): ###  Check co-authors information on the co-author's google scholar page
    result = {}
    if os.path.exists("./co_authors_info_lists/" + urlname + ".txt"):
        file = open("./co_authors_info_lists/" + urlname + ".txt", 'r')
        co_author_papers = json.loads(file.read())
        file.close()

        result['paper_sum'] = len(co_author_papers['titles'])
        co_paper_sum = 0
        for id in co_author_papers['ids']:
            if id in author_result['papers'].keys():
                co_paper_sum += 1
        result['co_paper_sum'] = co_paper_sum
        
    else:
        loginHeaders = {
            r"User-Agent": r"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36",
            r"accept": r"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
            r"accept-language": r"zh-CN,zh;q=0.9,en;q=0.8",
            r"accept-encoding": r"gzip, deflate, br",
            r"cache-control": r"max-age=0",
            r"upgrade-insecure-requests": r"1"}

        url = "https://scholar.google.com/citations?user=" + urlname + "&hl=en"

        s = requests.Session()
        s.headers.update(loginHeaders)

        index = s.get(url)
        tree = etree.HTML(index.text)

        co_papers(urlname, tree, result, author_result)
    return result

def dtails(urlname, tree):   ### explore more information of the author 
    result = {}
    headers(tree, result)
    if os.path.exists("./authors_info_lists/" + result['name'] + ".txt"):
        file = open("./authors_info_lists/" + result['name'] + ".txt", 'r')
        author_info = json.loads(file.read())
        file.close()
        return author_info

    citations(tree, result)
    papers(urlname, tree, result)
    co_authers(urlname, result)

    file = open("./authors_info_lists/" + result['name'] + ".txt", 'w')
    file.write(json.dumps(result))
    file.close()

    return result

def login(urlname):   ### login to the author's google scholar page
    loginHeaders = {r"User-Agent": r"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36",
                    r"accept": r"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
                    r"accept-language": r"zh-CN,zh;q=0.9,en;q=0.8",
                    r"accept-encoding": r"gzip, deflate, br",
                    r"cache-control": r"max-age=0",
                    r"upgrade-insecure-requests": r"1"}

    url = "https://scholar.google.com/citations?user=" + urlname + "&hl=en"

    s = requests.Session()
    s.headers.update(loginHeaders)

    index = s.get(url)
    tree = etree.HTML(index.text)

    author_info = dtails(urlname, tree)

    return author_info

def check(id, name):  ### check if this author's information has been saved or need to be crawled.
    if id == 1 or id == 2:
        if id == 1:
            urlname = name
            begin = (re.search('user=', urlname)).span()[1]
            end = (re.search('hl=', urlname)).span()[0] -1
            if end > begin:
                urlname = urlname[begin:end]
            else:
                urlname = urlname[begin:]
        else:
            urlname = name
        author_info = login(urlname)
        res = {}
        res['num'] = '0'
        res['name'] = author_info['name']
        res['sum'] = len(author_info['papers'])
        res['co_authors'] = author_info['co_authors']
        print(res)
        return jsonify(res)
    else:
        if os.path.exists("./authors_info_lists/" + name + ".txt"):
            file = open("./authors_info_lists/" + name + ".txt", 'r')
            author_info = json.loads(file.read())
            file.close()
            res = {}
            res['num'] = '0'
            res['name'] = author_info['name']
            res['sum'] = len(author_info['papers'])
            res['co_authors'] = author_info['co_authors']
            return jsonify(res)
        else:
            name = name.replace(" ", "+")
            Headers = {r"accept": r"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
                        r"Accept-Language": r"zh-CN,zh;q=0.9,en;q=0.8",
                        r"Accept-Encoding": r"gzip, deflate, br",
                        r"User-Agent": r"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.117 Safari/537.36",
                        r"referer": r"https://scholar.google.com/",
                        r"upgrade-insecure-requests": r"1"
            }
            url = "https://scholar.google.com/scholar?hl=en&as_sdt=0%2C15&q=" + name + "&btnG="
            response = requests.get(url, headers = Headers)
            tree = etree.HTML(response.text)
            res = {}
            if tree.xpath(r'//h4[@class = "gs_rt2"]/a/@href') != []:
                urlname = tree.xpath(r'//h4[@class = "gs_rt2"]/a/@href')[0]
                begin = (re.search('user=', urlname)).span()[1]
                end = (re.search('&hl=', urlname)).span()[0]
                urlname = urlname[begin:end]
                author_info = login(urlname)
                res['num'] = '0'
                res['name'] = author_info['name']
                res['sum'] = len(author_info['papers'])
                res['co_authors'] = author_info['co_authors']
                print(res)
                return jsonify(res)
            else:
                res['num'] = '1'
                res['name'] = ''
                res['sum'] = ''
                res['co_authors'] = ''
                return jsonify(res)


# ********************************************************************************
# 3. Prepare the data according to different queries, like grouping the paper sets. (obsolete)
# ********************************************************************************

def show_histogram(orselect_list, select_list, unselect_list, v_select_list, v_unselect_list):   ### Identify set operations and organize the paper set to scholar view

    venue_papers = {}
    for i in range(len(v_select_list)):
        file = open('./venues_info_lists/' + v_select_list[i] + '.txt', 'r')
        r = json.loads(file.read())
        file.close()
        for paper in r:
            if paper not in venue_papers:
                venue_papers[paper] = r[paper]

    un_venue_papers = {}
    for i in range(len(v_unselect_list)):
        file = open('./venues_info_lists/' + v_unselect_list[i] + '.txt', 'r')
        r = json.loads(file.read())
        file.close()
        for paper in r:
            if paper not in un_venue_papers:
                un_venue_papers[paper] = r[paper]

    if len(orselect_list) == 0 and len(select_list) == 0:
        all_papers = {}
        for paper in venue_papers:
            if venue_papers[paper]['year'] not in all_papers:
                all_papers[venue_papers[paper]['year']] = []
                all_papers[venue_papers[paper]['year']].append(paper)
            else:
                all_papers[venue_papers[paper]['year']].append(paper)

    else:
        all_info = {}
        papers = {}
        for i in range(len(orselect_list)):
            file = open('./authors_info_lists/' + orselect_list[i] + '.txt', 'r')
            r = json.loads(file.read())
            file.close()
            for paper in r['papers']:
                if paper not in papers:
                    papers[paper] = r['papers'][paper]
        
        for i in range(len(select_list)):
            file = open('./authors_info_lists/' + select_list[i] + '.txt', 'r')
            r = json.loads(file.read())
            file.close()
            if r['name'] not in all_info:
                all_info[r['name']] = r['papers']
        for i in range(len(unselect_list)):
            file = open('./authors_info_lists/' + unselect_list[i] + '.txt', 'r')
            r = json.loads(file.read())
            file.close()
            if r['name'] not in all_info:
                all_info[r['name']] = r['papers']

        all_papers = { }
        if len(orselect_list) == 0:
            for paper in all_info[select_list[0]]:
                right = 0
                #print "find : " + paper
                if len(select_list) > 1:
                    for j in range(1,len(select_list)):
                        if paper not in all_info[select_list[j]]:
                            right = 1
                            break
                if len(unselect_list) >0:
                    for j in range(len(unselect_list)):
                        if paper in all_info[unselect_list[j]]:
                            right = 1
                            break
                if len(v_select_list) > 0:
                    if paper not in venue_papers:
                        right = 1    
                if len(v_unselect_list) > 0:
                    if paper in un_venue_papers:
                        right = 1

                if right == 0:
                    if all_info[select_list[0]][paper]['year'] not in all_papers:
                        all_papers[all_info[select_list[0]][paper]['year']] = []
                        all_papers[all_info[select_list[0]][paper]['year']].append(paper)
                    else:
                        all_papers[all_info[select_list[0]][paper]['year']].append(paper)
        else:
            for paper in papers:
                right = 0
                if len(select_list) > 0:
                    for j in range(0,len(select_list)):
                        if paper not in all_info[select_list[j]]:
                            right = 1
                            break
                if len(unselect_list) >0:
                    for j in range(len(unselect_list)):
                        if paper in all_info[unselect_list[j]]:
                            right = 1
                            break
                if len(v_select_list) > 0:
                    if paper not in venue_papers:
                        right = 1
                        
                if len(v_unselect_list) > 0:
                    if paper in un_venue_papers:
                        right = 1
                if right == 0:
                    if papers[paper]['year'] not in all_papers:
                        all_papers[papers[paper]['year']] = []
                        all_papers[papers[paper]['year']].append(paper)
                    else:
                        all_papers[papers[paper]['year']].append(paper)

    #all_papers = sorted(all_papers.items(), key = lambda d:d[0], reverse = False)
    print(all_papers)
    if len(all_papers) >0:
        res = {}
        res['num'] = '0'
        res['paper_info'] = all_papers
    else:
        res = {}
        res['num'] = '1'
        res['paper_info'] = ''
    return jsonify(res)

def show_coauthors(name):  ### Click the author's name to show his co-authors
    res = {}

    if os.path.exists("./authors_info_lists/" + name + ".txt"):
        file = open("./authors_info_lists/" + name + ".txt", 'r')
        author_info = json.loads(file.read())
        file.close()
        res['num'] = '0'
        res['co_authors'] = author_info['co_authors']
    else:
        res['num'] = '1'
        res['co_authors'] = ''

    return jsonify(res)

def find_n_sub_str(src, sub, pos, start):
    index = src.find(sub, start)
    if index != -1 and pos > 0:
        return find_n_sub_str(src, sub, pos - 1, index + 1)
    return index

def crawler_venue_type(name):  ### Check the venue's full name using google
    name = name.replace(" ", "+")
    name = name.replace("(", "%28")
    name = name.replace(")", "%29")
    name = name.replace(",", "%2")

    #name = removeNumber(name)

    Headers = {r"accept": r"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
               r"Accept-Language": r"en-US,en;q=0.9",
               r"Accept-Encoding": r"gzip, deflate",
               r"User-Agent": r"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.117 Safari/537.36",
               r"referer": r"https://www.google.com/",
               r"upgrade-insecure-requests": r"1"
               }
    url = "https://www.google.com/search?q=dblp+" + name + "&oq=" + name
    print(url)
    response = requests.get(url, headers=Headers)
    tree = etree.HTML(response.text)

    have_dblp = 0
    for i in range(10):
        if tree.xpath(r'//div[@class = "r"]/a/@href') != []:
            if len(tree.xpath(r'//div[@class = "r"]/a/@href')) > i+1:
                urlname = tree.xpath(r'//div[@class = "r"]/a/@href')[i]
        elif tree.xpath(r'//h3[@class = "r"]/a/@href') != []:
            if len(tree.xpath(r'//h3[@class = "r"]/a/@href')) > i+1:
                urlname = tree.xpath(r'//h3[@class = "r"]/a/@href')[i]
        else:
            urlname = ''
        if 'https://dblp' in urlname and '/pers/' not in urlname:
            have_dblp = 1
            break

    re = {}
    if have_dblp == 1:      
        print(urlname)
        started = find_n_sub_str(urlname, '/', 1, 8)
        start = find_n_sub_str(urlname, '/', 2, 8)
        type = urlname[started + 1: start]
        if type != 'journals' or type != 'conf':
            type = 'others'
        re['type'] = type
        end = urlname.find('/', start+1)
        name = urlname[start+1:end]
        print(name)
        re['name'] = name
    
        file = open('ccf.json', 'r')
        result = json.load(file)
        file.close()

        if name not in result:
            re['rank'] = ''
        else:
            print(result[name]['rank'])
            if result[name]['name'] != '':
                re['name'] = result[name]['name']
            re['rank'] = result[name]['rank']
    else:
        re['type'] = 'others'
        re['name'] = ''
        re['rank'] = ''
    return re


def hIndex(lists):
    if lists == [] or list == None:
        return 0
    for i, c in enumerate(sorted(lists, reverse = True)):
        if c == 0:
            return 0
        j = i + 1
        if j >= c:
            return j
    return i

def compute_size(papers_list, property):  ### calculate paper set's citation, h-index and paper number
    db, cur = connectMYSQL('open_academic_graph')
    if property == '# Citations':
        num = 0
        n = 0
        for i in papers_list:
            print(n)
            n+=1
            cur.execute("select * from papers_info_list where id = '" + i + "';")
            data = cur.fetchall()[0]
            citation = data[3]
            if data[3] == -1:
                cur.execute("select count(*) from reference_list where reference_id = '" + data[0] + "';")
                citation = cur.fetchall()[0][0]
                cur.execute(
                    "update papers_info_list set citation = " + str(citation) + " where id = '" + data[0] + "';")
                db.commit()
            num += citation
        return num
    elif property == 'H-index':
        citation_list = []
        for i in papers_list:
            cur.execute("select * from reference_list where reference_id = '" + i + "';")
            cite_papers = cur.fetchall()
            for j in cite_papers:
                cur.execute("select * from papers_info_list where id = '" + j[0] + "';")
                data = cur.fetchall()[0]
                citation = data[3]
                if data[3] == -1:
                    cur.execute("select count(*) from reference_list where reference_id = '" + data[0] + "';")
                    citation = cur.fetchall()[0][0]
                    cur.execute(
                        "update papers_info_list set citation = " + str(citation) + " where id = '" + data[0] + "';")
                    db.commit()
                citation_list.append(citation)
        return hIndex(citation_list)
    elif property == '# Papers':
        return len(papers_list)

def group(papers_list, group_by, num, result, property, group_lists):  ### prepare tree for hierarchical histograms
    db, cur = connectMYSQL('open_academic_graph')
    temp_result = {}

    if group_by[num] == 'P. Year' or group_by[num] == 'C. Year':
        if group_by[num] == 'P. Year':
            for i in papers_list:
                cur.execute("select * from papers_info_list where id = '" + i + "';")
                data = cur.fetchall()[0]
                if 'P. Year' in group_lists:
                    if group_lists['P. Year']['lists'][str(data[2])] not in temp_result:
                        temp_result[group_lists['P. Year']['lists'][str(data[2])]] = []
                    temp_result[group_lists['P. Year']['lists'][str(data[2])]].append(data[0])
                else:
                    if data[2] not in temp_result:
                        temp_result[data[2]] = []
                    temp_result[data[2]].append(data[0])

        else:
            for i in papers_list:
                cur.execute("select * from reference_list where reference_id = '" + i + "';")
                cite_papers = cur.fetchall()
                for j in cite_papers:
                    cur.execute("select * from papers_info_list where id = '" + j[0] + "';")
                    data = cur.fetchall()[0]
                    if 'C. Year' in group_lists:
                        if group_lists['C. Year']['lists'][str(data[2])] not in temp_result:
                            temp_result[group_lists['C. Year']['lists'][str(data[2])]] = []
                        temp_result[group_lists['C. Year']['lists'][str(data[2])]].append(data[0])
                    else:
                        if data[2] not in temp_result:
                            temp_result[data[2]] = []
                        temp_result[data[2]].append(data[0])

        temp_year = sorted(temp_result.items(), key = lambda item:item[0])
        if num != 0:
            for j in temp_year:
                temp = {}
                temp['name'] = j[0]
                temp['children'] = []
                result.append(temp)
                group(j[1], group_by, num - 1, temp['children'], property, group_lists)
        else:
            for j in temp_year:
                temp = {}
                temp['name'] = j[0]
                temp['size'] = compute_size(j[1], property)
                result.append(temp)
    else:
        if group_by[num] == 'P. Venue Type':
            for i in papers_list:
                cur.execute("select * from papers_info_list where id = '" + i + "';")
                data = cur.fetchall()[0]
                if data[4] not in temp_result:
                    temp_result[data[4]] = []
                temp_result[data[4]].append(data[0])

        elif group_by[num] == 'C. Venue Type':
            for i in papers_list:
                cur.execute("select * from reference_list where reference_id = '" + i + "';")
                cite_papers = cur.fetchall()
                for j in cite_papers:
                    cur.execute("select * from papers_info_list where id = '" + j[0] + "';")
                    data = cur.fetchall()[0]
                    if data[4] not in temp_result:
                        temp_result[data[4]] = []
                    temp_result[data[4]].append(i)

        elif group_by[num] == 'P. Citation Count':
            for i in papers_list:
                cur.execute("select * from papers_info_list where id = '" + i + "';")
                data = cur.fetchall()[0]
                citation = data[3]
                if data[3] == -1:
                    cur.execute("select count(*) from reference_list where reference_id = '" + data[0] + "';")
                    citation = cur.fetchall()[0][0]
                    cur.execute("update papers_info_list set citation = " + str(citation) + " where id = '" + data[0] + "';")
                    db.commit()
                if citation >= 50:
                    if 'High' not in temp_result:
                        temp_result['High'] = []
                    temp_result['High'].append(data[0])
                elif citation >= 10 and citation < 50:
                    if 'Med.' not in temp_result:
                        temp_result['Med.'] = []
                    temp_result['Med.'].append(data[0])
                else:
                    if 'Low' not in temp_result:
                        temp_result['Low'] = []
                    temp_result['Low'].append(data[0])

        elif group_by[num] == 'Individual Paper':
            for i in papers_list:
                cur.execute("select * from papers_info_list where id = '" + i + "';")
                data = cur.fetchall()[0]
                if data[1] not in temp_result:
                    temp_result[data[1]] = []
                temp_result[data[1]] = [data[0]]
            print(temp_result)
        
        elif group_by[num] == 'P. CCF Rank':
            for i in papers_list:
                cur.execute("select * from papers_info_list where id = '" + i + "';")
                data = cur.fetchall()[0]
                venue = data[6]
                print(" this is venue:   " + venue)
                if venue != '':
                    cur.execute("select * from venue_info where venue = '" + venue + "';")
                    infos = cur.fetchall()
                    if  infos:
                        rank = infos[0][3]
                    else:
                        re = crawler_venue_type(venue)
                        rank = re['rank']
                        cur.execute("insert into venue_info (`venue`, `name`, `type`, `rank`) values ('" + venue + "', '" + re['name'].upper() + "', '" + re['type'] + "','" + re['rank'] + "');")
                        db.commit()
                else:
                    rank = ''
                if 'P. CCF Rank' in group_lists:
                    if group_lists['P. CCF Rank']['lists'][rank] not in temp_result:
                        temp_result[group_lists['P. CCF Rank']['lists'][rank]] = []
                    temp_result[group_lists['P. CCF Rank']['lists'][rank]].append(i)
                else:
                    if rank not in temp_result:
                        temp_result[rank] = []
                    temp_result[rank].append(i)
        
        elif group_by[num] == 'C. CCF Rank':
            for i in papers_list:
                cur.execute("select * from reference_list where reference_id = '" + i + "';")
                cite_papers = cur.fetchall()
                for j in cite_papers:
                    cur.execute("select * from papers_info_list where id = '" + j[0] + "';")
                    data = cur.fetchall()[0]
                    venue = data[6]
                    if venue != '':
                        cur.execute("select * from venue_info where venue = '" + venue + "';")
                        infos = cur.fetchall()
                        if  infos:
                            rank = infos[0][3]
                        else:
                            re = crawler_venue_type(venue)
                            rank = re['rank']
                            cur.execute("insert into venue_info (`venue`, `name`, `type`, `rank`) values ('" + venue + "', '" + re['name'].upper() + "', '" + re['type'] + "','" + re['rank'] + "');")
                            db.commit()
                    else:
                        rank = ''
                    if 'C. CCF Rank' in group_lists:
                        if group_lists['C. CCF Rank']['lists'][rank] not in temp_result:
                            temp_result[group_lists['C. CCF Rank']['lists'][rank]] = []
                        temp_result[group_lists['C. CCF Rank']['lists'][rank]].append(i)
                    else:
                        if rank not in temp_result:
                            temp_result[rank] = []
                        temp_result[rank].append(i)

        elif group_by[num] == 'P. Venue':
            for i in papers_list:
                cur.execute("select * from papers_info_list where id = '" + i + "';")
                data = cur.fetchall()[0]
                venue = data[6]
                print(" this is venue:   " + venue)
                if venue != '':
                    cur.execute("select * from venue_info where venue = '" + venue + "';")
                    infos = cur.fetchall()
                    if  infos:
                        name = infos[0][1]
                    else:
                        re = crawler_venue_type(venue)
                        name = re['name']
                        cur.execute("insert into venue_info (`venue`, `name`, `type`, `rank`) values ('" + venue + "', '" + re['name'].upper() + "', '" + re['type'] + "','" + re['rank'] + "');")
                        db.commit()
                else:
                    name = ''
                if 'P. Venue' in group_lists:
                    if group_lists['P. Venue']['lists'][name] not in temp_result:
                        temp_result[group_lists['P. Venue']['lists'][name]] = []
                    temp_result[group_lists['P. Venue']['lists'][name]].append(i)
                else:
                    if name not in temp_result:
                        temp_result[name] = []
                    temp_result[name].append(i)
        
        elif group_by[num] == 'C. Venue':
            for i in papers_list:
                cur.execute("select * from reference_list where reference_id = '" + i + "';")
                cite_papers = cur.fetchall()
                for j in cite_papers:
                    cur.execute("select * from papers_info_list where id = '" + j[0] + "';")
                    data = cur.fetchall()[0]
                    venue = data[6]
                    if venue != '':
                        cur.execute("select * from venue_info where venue = '" + venue + "';")
                        infos = cur.fetchall()
                        if  infos:
                            name = infos[0][1]
                        else:
                            re = crawler_venue_type(venue)
                            name = re['name']
                            cur.execute("insert into venue_info (`venue`, `name`, `type`, `rank`) values ('" + venue + "', '" + re['name'].upper() + "', '" + re['type'] + "','" + re['rank'] + "');")
                            db.commit()
                    else:
                        name = ''
                    if 'C. Venue' in group_lists:
                        if group_lists['C. Venue']['lists'][name] not in temp_result:
                            temp_result[group_lists['C. Venue']['lists'][name]] = []
                        temp_result[group_lists['C. Venue']['lists'][name]].append(i)
                    else:
                        if name not in temp_result:
                            temp_result[name] = []
                        temp_result[name].append(i)

        if num != 0:
            for j in temp_result:
                temp = {}
                temp['name'] = j
                temp['children'] = []
                result.append(temp)
                group(temp_result[j], group_by, num - 1, temp['children'], property, group_lists)
        else:
            for j in temp_result:
                temp = {}
                temp['name'] = j
                temp['size'] = compute_size(temp_result[j], property)
                result.append(temp)

def cite_compute_size(papers_list, property):  ### calculate the citation paper set's citation, h-index and paper number
    db, cur = connectMYSQL('open_academic_graph')
    if property == '# Citations':
        return len(papers_list)
    elif property == 'H-index':
        citation_list = []
        cite_paper_list = []
        for i in papers_list:
            if i[1] not in cite_paper_list:
                cite_paper_list.append(i[1])
                cur.execute("select * from papers_info_list where id = '" + i[1] + "';")
                data = cur.fetchall()[0]
                citation = data[3]
                if data[3] == -1:
                    cur.execute("select count(*) from reference_list where reference_id = '" + data[0] + "';")
                    citation = cur.fetchall()[0][0]
                    cur.execute(
                        "update papers_info_list set citation = " + str(citation) + " where id = '" + data[0] + "';")
                    db.commit()
                citation_list.append(citation)
        return hIndex(citation_list)
    elif property == '# Papers':
        paper_list = []
        for i in papers_list:
            if i[0] not in paper_list:
                paper_list.append(i[0])
        return len(paper_list)


def cite_group(papers_list, group_by, num, result, property, group_lists):   ### citation paper sets for hierarchical histograms
    db, cur = connectMYSQL('open_academic_graph')
    temp_result = {}

    if group_by[num] == 'P. Year' or group_by[num] == 'Citation Year':
        if group_by[num] == 'P. Year':
            for i in papers_list:
                cur.execute("select * from papers_info_list where id = '" + i[0] + "';")
                data = cur.fetchall()[0]
                if 'P. Year' in group_lists:
                    if group_lists['P. Year']['lists'][str(data[2])] not in temp_result:
                        temp_result[group_lists['P. Year']['lists'][str(data[2])]] = []
                    temp_result[group_lists['P. Year']['lists'][str(data[2])]].append(i)
                else:
                    if data[2] not in temp_result:
                        temp_result[data[2]] = []
                    temp_result[data[2]].append(i)

        else:
            for i in papers_list:
                cur.execute("select * from papers_info_list where id = '" + i[1] + "';")
                data = cur.fetchall()[0]
                if 'C. Year' in group_lists:
                    if group_lists['C. Year']['lists'][str(data[2])] not in temp_result:
                        temp_result[group_lists['C. Year']['lists'][str(data[2])]] = []
                    temp_result[group_lists['C. Year']['lists'][str(data[2])]].append(i)
                else:
                    if data[2] not in temp_result:
                        temp_result[data[2]] = []
                    temp_result[data[2]].append(i)

        temp_year = sorted(temp_result.items(), key = lambda item:item[0])
        if num != 0:
            for j in temp_year:
                temp = {}
                temp['name'] = j[0]
                temp['children'] = []
                result.append(temp)
                cite_group(j[1], group_by, num - 1, temp['children'], property, group_lists)
        else:
            for j in temp_year:
                temp = {}
                temp['name'] = j[0]
                temp['size'] = cite_compute_size(j[1], property)
                result.append(temp)
    else:
        if group_by[num] == 'P. Venue Type':
            for i in papers_list:
                cur.execute("select * from papers_info_list where id = '" + i[0] + "';")
                data = cur.fetchall()[0]
                if data[4] not in temp_result:
                    temp_result[data[4]] = []
                temp_result[data[4]].append(i)

        elif group_by[num] == 'C. Venue Type':
            for i in papers_list:
                cur.execute("select * from papers_info_list where id = '" + i[1] + "';")
                try:
                    data = cur.fetchall()[0]
                    if data[4] not in temp_result:
                        temp_result[data[4]] = []
                    temp_result[data[4]].append(i)
                except:
                    continue

        elif group_by[num] == 'P. Citation Count':
            cite_paper = {}
            for i in papers_list:
               if i[0] not in cite_paper:
                   cite_paper[i[0]] = 1
               else:
                   cite_paper[i[0]] += 1
            for i in papers_list:
                if cite_paper[i[0]] >= 50:
                    if 'High' not in temp_result:
                        temp_result['High'] = []
                    temp_result['High'].append(i)
                elif cite_paper[i[0]] >= 10 and cite_paper[i[0]] < 50:
                    if 'Med.' not in temp_result:
                        temp_result['Med.'] = []
                    temp_result['Med.'].append(i)
                else:
                    if 'Low' not in temp_result:
                        temp_result['Low'] = []
                    temp_result['Low'].append(i)

        elif group_by[num] == 'C. Citation Count':
            for i in papers_list:
                try:
                    cur.execute("select * from papers_info_list where id = '" + i[1] + "';")
                    data = cur.fetchall()[0]
                    citation = data[3]
                    if data[3] == -1:
                        cur.execute("select count(*) from reference_list where reference_id = '" + data[0] + "';")
                        citation = cur.fetchall()[0][0]
                        cur.execute("update papers_info_list set citation = " + str(citation) + " where id = '" + data[0] + "';")
                        db.commit()
                    if citation >= 50:
                        if 'High' not in temp_result:
                            temp_result['High'] = []
                        temp_result['High'].append(i)
                    elif citation >= 10 and citation < 50:
                        if 'Med.' not in temp_result:
                            temp_result['Med.'] = []
                        temp_result['Med.'].append(i)
                    else:
                        if 'Low' not in temp_result:
                            temp_result['Low'] = []
                        temp_result['Low'].append(i)
                except Exception as e:
                    continue

        elif group_by[num] == 'Individual Paper':
            for i in papers_list:
                cur.execute("select * from papers_info_list where id = '" + i[0] + "';")
                data = cur.fetchall()[0]
                if data[1] not in temp_result:
                    temp_result[data[1]] = []
                temp_result[data[1]].append(i)
            print(temp_result)

        elif group_by[num] == 'P. CCF Rank':
            for i in papers_list:
                cur.execute("select * from papers_info_list where id = '" + i[0] + "';")
                data = cur.fetchall()[0]
                venue = data[6]
                if venue != '':
                    cur.execute("select * from venue_info where venue = '" + venue + "';")
                    infos = cur.fetchall()
                    if  infos:
                        rank = infos[0][3]
                    else:
                        re = crawler_venue_type(venue)
                        rank = re['rank']
                        cur.execute("insert into venue_info (`venue`, `name`, `type`, `rank`) values ('" + venue + "', '" + re['name'].upper() + "', '" + re['type'] + "','" + re['rank'] + "');")
                        db.commit()
                else:
                    rank = ''
                if 'P. CCF Rank' in group_lists:
                    if group_lists['P. CCF Rank']['lists'][rank] not in temp_result:
                        temp_result[group_lists['P. CCF Rank']['lists'][rank]] = []
                    temp_result[group_lists['P. CCF Rank']['lists'][rank]].append(i)
                else:
                    if rank not in temp_result:
                        temp_result[rank] = []
                    temp_result[rank].append(i)

        elif group_by[num] == 'C. CCF Rank':
            for i in papers_list:
                try:
                    cur.execute("select * from papers_info_list where id = '" + i[1] + "';")
                    data = cur.fetchall()[0]
                except:
                    continue
                venue = data[6]
                if venue != '':
                    cur.execute("select * from venue_info where venue = '" + venue + "';")
                    infos = cur.fetchall()
                    if  infos:
                        rank = infos[0][3]
                    else:
                        re = crawler_venue_type(venue)
                        rank = re['rank']
                        cur.execute("insert into venue_info (`venue`, `name`, `type`, `rank`) values ('" + venue + "', '" + re['name'].upper() + "', '" + re['type'] + "','" + re['rank'] + "');")
                        db.commit()
                else:
                    rank = ''
                if 'C. CCF Rank' in group_lists:
                    if group_lists['C. CCF Rank']['lists'][rank] not in temp_result:
                        temp_result[group_lists['C. CCF Rank']['lists'][rank]] = []
                    temp_result[group_lists['C. CCF Rank']['lists'][rank]].append(i)
                else:
                    if rank not in temp_result:
                        temp_result[rank] = []
                    temp_result[rank].append(i)

        elif group_by[num] == 'P. Venue':
            for i in papers_list:
                cur.execute("select * from papers_info_list where id = '" + i[0] + "';")
                data = cur.fetchall()[0]
                venue = data[6]
                if venue != '':
                    cur.execute("select * from venue_info where venue = '" + venue + "';")
                    infos = cur.fetchall()
                    if  infos:
                        name = infos[0][1]
                    else:
                        re = crawler_venue_type(venue)
                        name = re['name']
                        cur.execute("insert into venue_info (`venue`, `name`, `type`, `rank`) values ('" + venue + "', '" + re['name'].upper() + "', '" + re['type'] + "','" + re['rank'] + "');")
                        db.commit()
                else:
                    name = ''
                if 'P. Venue' in group_lists:
                    if group_lists['P. Venue']['lists'][name] not in temp_result:
                        temp_result[group_lists['P. Venue']['lists'][name]] = []
                    temp_result[group_lists['P. Venue']['lists'][name]].append(i)
                else:
                    if name not in temp_result:
                        temp_result[name] = []
                    temp_result[name].append(i)

        elif group_by[num] == 'C. Venue':
            for i in papers_list:
                try:
                    cur.execute("select * from papers_info_list where id = '" + i[1] + "';")
                    data = cur.fetchall()[0]
                except:
                    continue
                venue = data[6]
                if venue != '':
                    cur.execute("select * from venue_info where venue = '" + venue + "';")
                    infos = cur.fetchall()
                    if  infos:
                        name = infos[0][1]
                    else:
                        re = crawler_venue_type(venue)
                        name = re['name']
                        cur.execute("insert into venue_info (`venue`, `name`, `type`, `rank`) values ('" + venue + "', '" + re['name'].upper() + "', '" + re['type'] + "','" + re['rank'] + "');")
                        db.commit()
                else:
                    name = ''
                if 'C. Venue' in group_lists:
                    if group_lists['C. Venue']['lists'][name] not in temp_result:
                        temp_result[group_lists['C. Venue']['lists'][name]] = []
                    temp_result[group_lists['C. Venue']['lists'][name]].append(i)
                else:
                    if name not in temp_result:
                        temp_result[name] = []
                    temp_result[name].append(i)

        if num != 0:
            for j in temp_result:
                temp = {}
                temp['name'] = j
                temp['children'] = []
                result.append(temp)
                cite_group(temp_result[j], group_by, num - 1, temp['children'], property, group_lists)
        else:
            for j in temp_result:
                temp = {}
                temp['name'] = j
                temp['size'] = cite_compute_size(temp_result[j], property)
                result.append(temp)

def show_details(papers_list, property, group_by, group_lists):  ### prepare tree for hierarchical histogram
    result = {}
    result['name'] = 'flare'
    result['children'] = []
    true = 0
    for i in group_by:
        if i == 'C. Venue Type' or i == 'C. Venue' or i == 'C. Year' or i == 'C. CCF Rank' or i == 'C. Citation Count':
            true = 1
    if true == 0:
        group(papers_list, group_by, len(group_by) - 1, result['children'], property, group_lists)
    else:
        papers = []
        db, cur = connectMYSQL('open_academic_graph')
        for i in papers_list:
            cur.execute("select * from reference_list where reference_id = '" + i + "';")
            cite_papers = cur.fetchall()
            for j in cite_papers:
                paper = [i, j[0]]
                papers.append(paper)
        cite_group(papers, group_by, len(group_by) - 1, result['children'], property, group_lists)

    # print result
    res = {}
    res['num'] = 0
    res['tree'] = result
    return jsonify(res)

def show_details_venue(papers_list): ### prepare venue part for hierarchical histogram
    papers = {}
    db, cur = connectMYSQL('open_academic_graph')
    for i in papers_list:
        print(i)
        cur.execute("select * from papers_info_list where id = '" + i + "';")
        data = cur.fetchall()[0]
        if data[4] not in papers:
            papers[data[4]] = {}
            papers[data[4]][data[2]] = []
        elif data[2] not in papers[data[4]]:
            papers[data[4]][data[2]] = []
        one_paper = {}
        one_paper['name'] = data[1]
        cur.execute("select count(*) from reference_list where reference_id = '" + i + "';")
        one_paper['size'] = cur.fetchall()[0][0]
        papers[data[4]][data[2]].append(one_paper)

    result = {}
    result['name'] = 'flare'
    result['children'] = []
    docs = []
    for j in papers:
        doc = {}
        doc['name'] = j
        doc['children'] = []
        years_list = []
        for k in papers[j]:
            years_list.append(k)
        years_list.sort()
        for i in years_list:
            for k in papers[j]:
                if k == i:
                    year = {}
                    year['name'] = k
                    year['children'] = papers[j][k]
                    doc['children'].append(year)
        docs.append(doc)

    result['children'] = docs

    print(result)
    res = {}
    res['num'] = 0
    res['tree'] = result
    return jsonify(res)

def group_histogram(papers, group_by): 
    db, cur = connectMYSQL('open_academic_graph')
    all_papers = {}
    if group_by == 'P. Year':
        for i in papers:
            cur.execute("select * from papers_info_list where id = '" + i + "';")
            data = cur.fetchall()[0]
            if data[2] not in all_papers:
                all_papers[data[2]] = []
            all_papers[data[2]].append(i)

    elif group_by == 'C. Year':
        for i in papers:
            cur.execute("select * from reference_list where reference_id = '" + i + "';")
            cite_papers = cur.fetchall()
            for j in cite_papers:
                cur.execute("select * from papers_info_list where id = '" + j[0] + "';")
                data = cur.fetchall()[0]
                if data[2] not in all_papers:
                    all_papers[data[2]] = []
                all_papers[data[2]].append(i)

    elif group_by == 'P. CCF Rank':
        for i in papers:
            cur.execute("select * from papers_info_list where id = '" + i + "';")
            data = cur.fetchall()[0]
            venue = data[6]
            if venue != '':
                cur.execute("select * from venue_info where venue = '" + venue + "';")
                infos = cur.fetchall()
                if  infos:
                    rank = infos[0][3]
                else:
                    re = crawler_venue_type(venue)
                    rank = re['rank']
                    cur.execute("insert into venue_info (`venue`, `name`, `type`, `rank`) values ('" + venue + "', '" + re['name'].upper() + "', '" + re['type'] + "','" + re['rank'] + "');")
                    db.commit()
            else:
                rank = ''
            if rank not in all_papers:
                all_papers[rank] = []
            all_papers[rank].append(i)

    elif group_by == 'C. CCF Rank':
        for i in papers:
            cur.execute("select * from reference_list where reference_id = '" + i + "';")
            cite_papers = cur.fetchall()
            for j in cite_papers:
                cur.execute("select * from papers_info_list where id = '" + j[0] + "';")
                data = cur.fetchall()[0]
                venue = data[6]
                if venue != '':
                    cur.execute("select * from venue_info where venue = '" + venue + "';")
                    infos = cur.fetchall()
                    if  infos:
                        rank = infos[0][3]
                    else:
                        re = crawler_venue_type(venue)
                        rank = re['rank']
                        cur.execute("insert into venue_info (`venue`, `name`, `type`, `rank`) values ('" + venue + "', '" + re['name'].upper() + "', '" + re['type'] + "','" + re['rank'] + "');")
                        db.commit()
                else:
                    rank = ''
                if rank not in all_papers:
                    all_papers[rank] = []
                all_papers[rank].append(i)


    elif group_by == 'P. Venue':
        for i in papers:
            cur.execute("select * from papers_info_list where id = '" + i + "';")
            data = cur.fetchall()[0]
            venue = data[6]
            if venue != '':
                cur.execute("select * from venue_info where venue = '" + venue + "';")
                infos = cur.fetchall()
                if  infos:
                    name = infos[0][1]
                else:
                    re = crawler_venue_type(venue)
                    name = re['name']
                    cur.execute("insert into venue_info (`venue`, `name`, `type`, `rank`) values ('" + venue + "', '" + re['name'].upper() + "', '" + re['type'] + "','" + re['rank'] + "');")
                    db.commit()
            else:
                name = ''
            if name not in all_papers:
                all_papers[name] = []
            all_papers[name].append(i)

    elif group_by == 'C. Venue':
        for i in papers:
            cur.execute("select * from reference_list where reference_id = '" + i + "';")
            cite_papers = cur.fetchall()
            for j in cite_papers:
                cur.execute("select * from papers_info_list where id = '" + j[0] + "';")
                data = cur.fetchall()[0]
                venue = data[6]
                if venue != '':
                    cur.execute("select * from venue_info where venue = '" + venue + "';")
                    infos = cur.fetchall()
                    if  infos:
                        name = infos[0][1]
                    else:
                        re = crawler_venue_type(venue)
                        name = re['name']
                        cur.execute("insert into venue_info (`venue`, `name`, `type`, `rank`) values ('" + venue + "', '" + re['name'].upper() + "', '" + re['type'] + "','" + re['rank'] + "');")
                        db.commit()
                else:
                    name = ''
                if name not in all_papers:
                    all_papers[name] = []
                all_papers[name].append(i)


    if len(all_papers) >0:
        res = {}
        res['num'] = '0'
        res['paper_info'] = all_papers
    else:
        res = {}
        res['num'] = '1'
        res['paper_info'] = ''
    
    print(res)
    return jsonify(res)

def check_venue(name):   ### check input venue information
    res = {}
    if name == "TVCG" or name == "CHI":
        if name == "TVCG":
            venue_name = "IEEE Transactions on Visualization and Computer Graphics"
            file = open("./venues_info_lists/" + venue_name + ".txt", 'r')
            venue_paper = json.loads(file.read())
            file.close()
            papers_num = len(venue_paper)
        elif name == "CHI":
            venue_name = "human factors in computing systems"
            file = open("./venues_info_lists/" + venue_name + ".txt", 'r')
            venue_paper = json.loads(file.read())
            file.close()
            papers_num = len(venue_paper)

        res['num'] = '0'
        res['name'] = name
        res['venue'] = venue_name
        res['sum'] = papers_num
        res['co_authors'] = ''
        print(res)
        return jsonify(res)

    db, cur = connectMYSQL('open_academic_graph')

    try: 
        cur.execute("select * from venue_info where (name = '" + name + "') or (venue = '" + name + "');")
        data = cur.fetchall()[0]
        venue_name = data[0]

        if os.path.exists("./venues_info_lists/" + venue_name + ".txt"):
            file = open("./venues_info_lists/" + venue_name + ".txt", 'r')
            venue_paper = json.loads(file.read())
            file.close()
            papers_num = len(venue_paper)

        else:
            venue_papers = {}

            cur.execute("select * from paper_info_list_short where venue = '" + venue_name + "';")
            papers = cur.fetchall()
            for i in papers:
                venue_papers[i[0]] = {}
                venue_papers[i[0]]['title'] = i[1]
                venue_papers[i[0]]['year'] = i[3]

            papers_num = len(venue_papers)

            file = open("./venues_info_lists/" + venue_name + ".txt", 'w')
            file.write(json.dumps(venue_papers))
            file.close()

        res['num'] = '0'
        if data[1] != '':
            res['name'] = data[1]
        else:
            res['name'] = venue_name
        res['venue'] = venue_name
        res['sum'] = papers_num
        res['co_authors'] = ''
        print(res)
        return jsonify(res)
    
    except:
        res['num'] = '1'
        res['name'] = ''
        res['venue'] = ''
        res['sum'] = ''
        res['co_authors'] = ''
        print(res)
        return jsonify(res)

def check_coauthor(id, urlname, name):    ### check clicked coauthor
    if os.path.exists("./authors_info_lists/" + name + ".txt"):
        file = open("./authors_info_lists/" + name + ".txt", 'r')
        author_info = json.loads(file.read())
        file.close()
        res = {}
        res['num'] = '0'
        res['name'] = author_info['name']
        res['sum'] = len(author_info['papers'])
        res['co_authors'] = author_info['co_authors']
        return jsonify(res)
    else:
        return check(id, urlname)


# ********************************************************************************
# 4. Build Flask server which listens to the port 1234 for requests and process the requests.
# ********************************************************************************

@app.route('/user')
def user():    
    print(request)
    id = request.args.get('num', default = 1, type = int)
    if id == 0 or id == 1:   ### add author to explore
        name = request.args.get('name', default = 1, type = str)
        return check(id, name)

    elif id == 2:  ### add co_author to explore
        urlname = request.args.get('urlname', default = 1, type = str)
        name = request.args.get('name', default = 1, type = str)
        return check_coauthor(id, urlname, name)

    elif id == 3:  ### prepare paper set to publication view
        orselect_list = request.args.get('orselect', default = 1, type = str)
        select_list = request.args.get('select', default = 1, type = str)
        unselect_list = request.args.get('unselect', default = 1, type = str)
        orselect_list = json.loads(orselect_list)
        select_list = json.loads(select_list)
        unselect_list = json.loads(unselect_list)
        v_select_list = request.args.get('v_select', default = 1, type = str)
        v_unselect_list = request.args.get('v_unselect', default = 1, type = str)
        v_select_list = json.loads(v_select_list)
        v_unselect_list = json.loads(v_unselect_list)
        return show_histogram(orselect_list, select_list, unselect_list, v_select_list, v_unselect_list)
    elif id == 4:   ### show co_author list in scholar view
        name = request.args.get('name', default=1, type=str)
        return show_coauthors(name)

    elif id == 5:  ###  prepare paper set tree to show in hierarchical histogram view
        papers_list = request.args.get('list', default = 1, type = str)
        papers_list = json.loads(papers_list)
        property = request.args.get('property', default=1, type=str)
        group_by = request.args.get('group_by', default = 1, type = str)
        group_by = json.loads(group_by)
        group_lists = request.args.get('group_lists', default = 1, type = str)
        group_lists = json.loads(group_lists)

        query = {}
        query["papers"] = papers_list
        query["agg property"] = property
        query["product mode"] = "hierarchies"
        query["properties"] = group_by
        query["groups"] = group_lists
        res = {}
        res['num'] = 0
        res['tree'] = json.loads(SD2Query.query(json.dumps(query)))

        f= open("last_query.txt","w+")
        f.write(json.dumps(query))
        f.close()

        f= open("scholar_response.txt","w+")
        f.write(SD2Query.query(json.dumps(query)))
        f.close()     

        return jsonify(res)

        # return show_details(papers_list, property, group_by, group_lists)

    elif id == 10:  ### alignment requests
        papers_list = request.args.get('list', default = 1, type = str)
        papers_list = json.loads(papers_list)
        property = request.args.get('property', default=1, type=str)
        group_by = request.args.get('group_by', default = 1, type = str)
        group_by = json.loads(group_by)
        group_lists = request.args.get('group_lists', default = 1, type = str)
        group_lists = json.loads(group_lists)

        up_query = {}
        up_query["papers"] = papers_list
        up_query["agg property"] = property
        up_query["product mode"] = "hierarchies"
        up_query["properties"] = group_by
        up_query["groups"] = group_lists

        papers_list = request.args.get('list_down', default = 1, type = str)
        papers_list = json.loads(papers_list)
        group_lists = request.args.get('group_lists_down', default = 1, type = str)
        group_lists = json.loads(group_lists)

        down_query = {}
        down_query["papers"] = papers_list
        down_query["agg property"] = property
        down_query["product mode"] = "hierarchies"
        down_query["properties"] = group_by
        down_query["groups"] = group_lists

        query_result = json.loads(SD2Query.query_aligned(json.dumps(up_query), json.dumps(down_query)))
        res = {}
        res['num'] = 0
        res['up_tree'] = query_result["first"]
        res['down_tree'] = query_result["second"]
        return jsonify(res)

    elif id == 6:  ### bar grouping
        papers_list = request.args.get('list', default=1, type=str)
        papers_list = json.loads(papers_list)
        group_by = request.args.get('group_by', default=1, type=str)

        query = {}
        query["papers"] = papers_list
        query["agg property"] = "# Papers"
        query["product mode"] = "ranked histogram"
        query["properties"] = [group_by]
        query["groups"] = {}
        res = {}
        res['num'] = 0
        ret_str = SD2Query.query(json.dumps(query))
        print(ret_str)
        res['paper_info'] = json.loads(ret_str)
        return jsonify(res)

        # return group_histogram(papers_list, group_by)

    elif id == 7:  ## add venue to explore
        name = request.args.get('name', default = 1, type = str)
        return check_venue(name)

@app.route('/readfile')
def readfile():
    filename = request.args.get('name', default = 1, type = str)
    print("read file request")
    print(filename)
    query = {}
    query["read file"] = filename
    ret = SD2Query.query(json.dumps(query))
    print(ret)
    if ret=="Success :)":
        return render_template('succeed.html')
    else:
        return render_template('fail.html')

@app.route('/writefile')
def writefile():
    filename = request.args.get('name', default = 1, type = str)
    print("write file request: ")
    print(filename)
    query = {}
    query["write file"] = filename
    ret = SD2Query.query(json.dumps(query))
    print(ret)
    if ret=="Success :)":
        return render_template('succeed.html')
    else:
        return render_template('fail.html')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=1234, debug=True)
    #app.run(debug=True)s
