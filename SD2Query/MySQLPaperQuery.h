#ifndef MYSQL_PAPER_QUERY_H
#define MYSQL_PAPER_QUERY_H

//********************************************************************************
// file: MySQLPaperQuery
// 
// Defines the structures that stores the paper information, venue information,
// citation relations, and all kinds of modes in the query
//
// Defines the MySQLPaperQuery class that received request as a json string, parse
// the json request, perform the request to query MySQL server. The queried 
// information will be stored in cache, which can be further exported to a temporary
// file. This class can restore the cache using a previously saved temporary file
// as well. In that case, it can be executed on a machine without MySQL server and
// any data in the database, and simply relies on the temporary file.
//********************************************************************************

//define this macro to produce 
#define MYSQL_PAPRE_QUERY_DEBUG

#ifdef USE_MYSQL
#include <mysql/mysql.h>
#endif
#include "utility.h"
#include <cstdlib>
#include <iostream>
#include <sstream>
#include <fstream>
#include <string>
#include <vector>
#include <map>
#include <set>
#include <algorithm>
#include <functional>
#include <rapidjson/document.h>
#include <rapidjson/pointer.h>


//define the positions of each field in the venue info array
typedef enum {
	VENUE_INFO_NAME = 0,
	VENUE_INFO_ABBREV,
	VENUE_INFO_TYPE,
	VENUE_INFO_RANK,
} VenueInfoFieldType;

//define the positions of each field in the paper info array
typedef enum {
	PAPER_INFO_TITLE = 0,
	PAPER_INFO_YEAR,
	PAPER_INFO_CITATION,
	PAPER_INFO_VENUE,
	PAPER_INFO_RANK,
	PAPER_INFO_TYPE,
	PAPER_INFO_NUM
} PaperInfoFieldType;
#define CITING_PAPER_INFO_BIT 0x100

//structure for storing the venue info in C++ arrays
typedef struct {
	std::string abbrev;
	std::string rank;
} VenueInfo;

//structure for storing the paper info in C++ arrays
typedef struct _PaperInfo {
	_PaperInfo(const std::string& _id) {
		id = _id;
		citation = -1;
		store_props_mask = 0;
	}
	int citation;
	unsigned char store_props_mask;
	std::string id;
	std::string props[6];
} PaperInfo;

//add quotes for MySQL syntax
inline std::string composeMySQLList(const std::vector<std::string>& strs) {
	std::string quote_start("\"");
	std::string quote_end("\",");

	std::string ret = "(";
	for (int i = 0; i < strs.size(); ++i) {
		ret += quote_start + strs[i] + quote_end;
	}
	ret[ret.length() - 1] = ')';

	return ret;
}

typedef std::map<std::string, int> StringMap;

//manage venue name to the venue information (abbrevation and CCF rank)
class VenueInfoMap {
public:
	VenueInfoMap()
	{
		mIgnoreWords.insert("is");
		mIgnoreWords.insert("of");
		mIgnoreWords.insert("and");
		mIgnoreWords.insert("in");
		mIgnoreWords.insert("on");
		mIgnoreWords.insert("with");
		mIgnoreWords.insert("by");

		mKeepWords.insert("arXiv:");
		mKeepWords.insert("IEEE");
		mKeepWords.insert("ACM");
	};

	//produce the abbreviation for a single word
	//return empty string if the word should be ignored
	//return full string if the word should be kept
	inline std::string getAbbrevOfWord(const std::string& word) {
		std::string ret;
		if (word.empty()) {
			return ret;
		}

		auto it = mIgnoreWords.find(word);
		if (it != mIgnoreWords.end()) {
			return ret;
		}

		it = mKeepWords.find(word);
		if (it != mKeepWords.end()) {
			return word;
		}

		if (word.substr(0, 2) == "\\/") {
			ret += word.substr(0, 3);
		} else {
			ret += word.substr(0, 1);
		}

		return ret;
	}

	//produce the abbrevation for the venue, if the abbrevation is not found in the database
	inline std::string genAbbreviation(const std::string& name) {
		std::stringstream ss(name);
		std::string word;
		std::string ret;
		while (std::getline(ss, word, ' ')) {
			ret += getAbbrevOfWord(word);
		}
		return ret;
	}

	//query the venue information from the database
	const VenueInfo& getVenueInfo(const std::string& name) {
		StringMap::iterator it = mNameMap.find(name);
		if (it != mNameMap.end()) {
			return mVenues[it->second];
		}
#ifdef USE_MYSQL
		std::string query = "select `name`, `rank` from venue_info where `venue` =\"" + name + "\";";
		mysql_query(mConn, query.c_str());
		MYSQL_RES *res = mysql_store_result(mConn);
		MYSQL_ROW row;
		VenueInfo info;
		if (row = mysql_fetch_row(res)) {
			info.abbrev = row[0];
			info.rank = row[1];
		}
		if (info.abbrev == "" || info.abbrev == "HTTPS:") {
			info.abbrev = genAbbreviation(name);
		}
		if (info.rank == "") {
			info.rank = "Other";
		}
		info.abbrev += "~" + name;
		mNameMap[name] = mVenues.size();
		mVenues.push_back(info);
		return mVenues[mVenues.size() - 1];
#else 
		std::cout << "Missing Venue info of name. Automatically creating one." << std::endl;
		VenueInfo vinfo;
		vinfo.abbrev = genAbbreviation(name);
		vinfo.rank = "";
		mNameMap[name] = mVenues.size();
		mVenues.push_back(vinfo);
		return mVenues[mVenues.size() - 1];
#endif
	}

	std::set<std::string> mIgnoreWords;
	std::set<std::string> mKeepWords;
	std::vector<VenueInfo> mVenues;
	StringMap mNameMap;

#ifdef USE_MYSQL
	void setConnection(MYSQL* conn) {
		mConn = conn;
	}
	MYSQL* mConn;
#endif
};

//query paper info from MySQL server or from a previously saved temporary file
class MySQLPaperQuery {
public:
	MySQLPaperQuery()
		:mVenues(VenueInfoMap())
	{
#ifdef USE_MYSQL
		mConn = new MYSQL();
		connectMySQL(*mConn);
		mVenues.setConnection(mConn);
#endif
		mPapers.reserve(250000);

		mColumnName["Individual Paper"] = "title";
		mColumnName["Year"] = "year";
		mColumnName["Citation Count"] = "citation";
		mColumnName["Venue"] = "venue";
		mColumnName["CCF Rank"] = "venue";
		mColumnName["Venue Type"] = "doc_type";

		mPropertyInfoId["Individual Paper"] = PAPER_INFO_TITLE;
		mPropertyInfoId["Year"] = PAPER_INFO_YEAR;
		mPropertyInfoId["Citation Count"] = PAPER_INFO_CITATION;
		mPropertyInfoId["Venue"] = PAPER_INFO_VENUE;
		mPropertyInfoId["CCF Rank"] = PAPER_INFO_RANK;
		mPropertyInfoId["Venue Type"] = PAPER_INFO_TYPE;

		mIgnoreFlag = "ignore";
		mIgnoreGroupNames.insert("~");
		mIgnoreGroupNames.insert("~\n");
		mIgnoreGroupNames.insert("");
		mIgnoreGroupNames.insert("\n");

		printf("Finish init MySQLPaperQuery.\n");
	}

	//query MySQL server for paper ids using paper title
	void getPapersIdByTitle(std::vector<std::string>& ids, const std::vector<std::string>& titles) {
#ifdef USE_MYSQL
		if (titles.empty()) return;

		std::string query = "select id from paper_info_list_short where title in ";
		query += composeMySQLList(titles) + ";";

		MYSQL_RES *res;
		MYSQL_ROW  row;

		ids.reserve(titles.size());

		mysql_query(mConn, query.c_str());
		res = mysql_store_result(mConn);
		int num_fields = mysql_num_fields(res);
		while ((row = mysql_fetch_row(res))) {
			ids.push_back(row[0]);
		}
#else
		std::cout << "Query paper by title is not performed." << std::endl;
#endif
	}

	//query from the cached data
	int getPaperIntId(const std::string& paper_id) {
		auto it = mPaperIdMap.find(paper_id);
		if (it != mPaperIdMap.end()) {
			return it->second;
		}
		mPaperIdMap[paper_id] = mPapers.size();
		mPapers.push_back(PaperInfo(paper_id));
		return mPapers.size() - 1;
	}

	//query citation information, query server if the value is not initialized and server exists
	//otherwise, use cached data
	void getCitation(PaperInfo& paper, const std::string& value) {
		paper.citation = atoi(value.c_str());
#ifdef USE_MYSQL
		if (paper.citation < 0) { //citation value is not read yet
			std::string query = "select count(*) from reference_list where reference_id = \"" + paper.id + "\";";
			mysql_query(mConn, query.c_str());
			MYSQL_RES *res = mysql_store_result(mConn);
			MYSQL_ROW row = mysql_fetch_row(res);
			paper.citation = atoi(row[0]);
			query = "update paper_info_list_short set citation = \"" + std::string(row[0]);
			query += " \" where id = \"" + paper.id + "\";";
			mysql_query(mConn, query.c_str());
		}
#else
		std::cout << "Query citation is not performed." << std::endl;
#endif
		if (paper.citation > 50) {
			paper.props[(int)PAPER_INFO_CITATION] = "High";
		} else if (paper.citation > 10) {
			paper.props[(int)PAPER_INFO_CITATION] = "Med";
		} else {
			paper.props[(int)PAPER_INFO_CITATION] = "|Low";
		}
	}

	//replace double quote from string for MySQL syntax
	std::string replaceDoubleQuote(const std::string& str) {
		std::string ret(str);
		for (int i = 0; i < ret.size(); ++i) {
			if (ret[i] == '\"') {
				ret[i] = '\'';
			}
		}
		return ret;
	}

	//update the cached paper info fields
	void updatePropertyValue(PaperInfo& paper, const std::string& value, const PaperInfoFieldType& prop) {
		if (prop == PAPER_INFO_VENUE) {
			const std::string& abbrev = mVenues.getVenueInfo(value).abbrev;
			if (!abbrev.empty()) {
				paper.props[(int)PAPER_INFO_VENUE] = abbrev;
			} else if (!value.empty()) {
				paper.props[(int)PAPER_INFO_VENUE] = value;
			} else {
				paper.props[(int)PAPER_INFO_VENUE] = "|OTHERS~Other Venues";
			}
		} else if (prop == PAPER_INFO_RANK) {
			paper.props[(int)PAPER_INFO_RANK] = mVenues.getVenueInfo(value).rank;
		} else if (prop == PAPER_INFO_CITATION) {
			getCitation(paper, value);
		} else if (prop == PAPER_INFO_TYPE) {
			if (value == "Conference") {
				paper.props[(int)PAPER_INFO_TYPE] = "[C]";
			} else if (value == "Journal") {
				paper.props[(int)PAPER_INFO_TYPE] = "[J]";
			} else {
				paper.props[(int)PAPER_INFO_TYPE] = "[O]";
			}
		} else if (prop == PAPER_INFO_TITLE) {
			paper.props[(int)PAPER_INFO_TITLE] = replaceDoubleQuote(value);
		} else {
			paper.props[(int)prop] = value;
		}
		paper.store_props_mask |= 1 << (int)prop;
	}

	//generate MySQL paper query statements
	inline void prepareQueryStatement(std::string& query, std::vector<PaperInfoFieldType>& prop_ids, const std::string& search_by,
		const std::vector<std::string>& query_props)
	{
		query = "select ";
		for (int i = 0; i < query_props.size(); ++i) {
			query += mColumnName[query_props[i]] + ", ";
			prop_ids[i] = mPropertyInfoId[query_props[i]];
		}
		query += " id from paper_info_list_short where " + search_by;
	}

#ifdef USE_MYSQL
	inline void updatePaperInfo(const MYSQL_ROW& row, const std::vector<PaperInfoFieldType>& prop_ids) {
		std::string paper_id_str = row[prop_ids.size()];
		int paper_id = getPaperIntId(paper_id_str);
		PaperInfo& paper = mPapers[paper_id];

		for (int i = 0; i < prop_ids.size(); ++i) {//for each property
			if (row[i] != NULL) {
				updatePropertyValue(paper, row[i], prop_ids[i]);
			}
		}
	}
#endif

	//query all fields of paper info from MySQL server
	void queryPapers(const std::vector<std::string>& papers, const std::string& search_by,
		const std::vector<std::string>& query_props)
	{
		if (papers.empty()) return;
#ifdef USE_MYSQL
		std::vector<PaperInfoFieldType> prop_ids(query_props.size());
		std::string query;
		prepareQueryStatement(query, prop_ids, search_by, query_props);
		query += " in " + composeMySQLList(papers) + ";";

		MYSQL_RES *res;
		MYSQL_ROW  row;

		mysql_query(mConn, query.c_str());
		res = mysql_store_result(mConn);
		if (res != NULL) {
			mysql_query(mConn, "START TRANSACTION");//for citation update
			while ((row = mysql_fetch_row(res))) {//for each row
				updatePaperInfo(row, prop_ids);
			}
			mysql_query(mConn, "COMMIT");
		}
#else
		std::cout << "Query papers not performed." << std::endl;
#endif
	}

	//query multiple paper from MySQL server in batches
	void queryPaperInBatches(const std::vector<std::string>& papers, const std::string& search_by,
		const std::vector<std::string>& query_props, const int& size)
	{
#ifdef USE_MYSQL
		std::vector<std::string> one_batch;
		for (int i = 0; i < papers.size(); i += size) {
			int end = i + size;
			if (end > papers.size()) {
				end = papers.size();
			}
			one_batch.assign(papers.begin() + i, papers.begin() + end);
			queryPapers(one_batch, search_by, query_props);
		}
#else //do nothing
		std::cout << "Query papers in batches not performed." << std::endl;
#endif
	}

	//query multiple paper from MySQL server in smaller size of batches
	void queryIndividualPapers(const std::vector<std::string>& papers, const std::string& search_by,
		const std::vector<std::string>& query_props, const int& batch_size=100)
	{
		if (papers.empty()) return;
#ifdef USE_MYSQL
		int num_col = query_props.size();
		std::vector<PaperInfoFieldType> prop_ids(query_props.size());

		std::string query_prefix;
		prepareQueryStatement(query_prefix, prop_ids, search_by, query_props);
		query_prefix;

		MYSQL_RES *res;
		MYSQL_ROW  row;

		mysql_query(mConn, "START TRANSACTION");//for citation update
		for (int i = 0; i < papers.size(); ++i) {
			std::string query = query_prefix + " = \"" + papers[i] + "\";";
			mysql_query(mConn, query.c_str());
			res = mysql_store_result(mConn);
			if (res != NULL) {
				row = mysql_fetch_row(res);
				if (row != NULL) {
					updatePaperInfo(row, prop_ids);
				}
			}
			if (i % batch_size == 0) {
				mysql_query(mConn, "COMMIT");
				mysql_query(mConn, "START TRANSACTION");
			}
		}
		mysql_query(mConn, "COMMIT");
#else //do nothing
		std::cout << "Query individual papers not performed." << std::endl;
#endif
	}

	void queryPapersByTitle(const std::vector<std::string>& paper_titles, const std::vector<std::string>& ret_props) {
		queryIndividualPapers(paper_titles, "title", ret_props);
	}

	void queryPapersById(const std::vector<std::string>& paper_ids, const std::vector<std::string>& ret_props) {
		queryPaperInBatches(paper_ids, "id", ret_props, 100);
	}

	//defining the query to be performed on publication papers
	//or citation papers
	typedef enum {
		PAPER_PROPERTY = 0,
		CITING_PROPERTY,
		PROPERTY_NOT_DEFINED
	} PROPERTY_TYPE;

	//if the property starts from 'C': citation papers
	//else if starts from 'P': publication papers
	inline PROPERTY_TYPE getPropertyType(const std::string& p) {
		if (p[0] == 'C' && p[1] == '.') {
			return CITING_PROPERTY;
		} else if (p[0] == 'P' && p[1] == '.') {
			return PAPER_PROPERTY;
		}
		return PROPERTY_NOT_DEFINED;
	}

	//test the citation bit to see whether the property is 
	//a citation property or a publication property
	inline bool isCitingProperty(const int& prop) {
		return (prop&CITING_PAPER_INFO_BIT);
	}

	//stores the ids of the citing paper and cited paper
	//the id is a number in the cache
	typedef struct {
		int cited_paper;
		int citing_paper;
	} CitingRelation;

	//create a citing relation
	inline CitingRelation makeCitingRelation(const int& cited, const int& citing) {
		CitingRelation ret = { cited, citing };
		return ret;
	}


	void updateCitingRelationsIndividual(std::vector<std::string>& citing, std::vector<CitingRelation>& citing_relations, const std::vector<std::string>& cited) {
		if (cited.empty()) return;

		for (int i = 0; i < cited.size(); ++i) {
			getPaperIntId(cited[i]);
		}

		std::string query_prefix = "select cite_id, reference_id from reference_list where reference_id = \"";

		std::set<int> citing_ids;
		for (int i = 0; i < cited.size(); ++i) {
			int cited_i = getPaperIntId(cited[i]);
			auto it = mCitations.find(getPaperIntId(cited[i]));
			if (it != mCitations.end()) {
				std::vector<int>& citations = it->second;
				for (int j = 0; j < citations.size(); ++j) {
					citing_relations.push_back(makeCitingRelation(cited_i, citations[j]));
					citing_ids.insert(citing_ids.end(), citations[j]);
				}
			} else {
#ifdef USE_MYSQL
				std::string query = query_prefix + cited[i] + "\";";
				mysql_query(mConn, query.c_str());
				MYSQL_RES *res = mysql_store_result(mConn);
				std::vector<int>& citations = mCitations[cited_i];
				if (res != NULL) {
					MYSQL_ROW  row;
					while ((row = mysql_fetch_row(res))) {
						int citing_id = getPaperIntId(row[0]);
						citing_relations.push_back(makeCitingRelation(cited_i, citing_id));
						citing_ids.insert(citing_ids.end(), citing_id);
						citations.push_back(citing_id);
					}
				}
#else //do nothing
				std::cout << "Citation data not found." << std::endl;
#endif
			}
		}

		citing.reserve(citing_ids.size());
		for (auto it = citing_ids.begin(); it != citing_ids.end(); ++it) {
			citing.push_back(mPapers[*it].id);
		}
	}

	//query citation relations from mysql server and update the cache
	void updateCitingRelations(std::vector<std::string>& citing, std::vector<CitingRelation>& citing_relations, const std::vector<std::string>& cited) {
		if (cited.empty()) return;

		for (int i = 0; i < cited.size(); ++i) {
			getPaperIntId(cited[i]);
		}

#ifdef USE_MYSQL
		std::string query = "select cite_id, reference_id from reference_list where reference_id in ";
		query += composeMySQLList(cited) + ";";

		mysql_query(mConn, query.c_str());
		MYSQL_RES *res = mysql_store_result(mConn);
		MYSQL_ROW  row;

		std::set<int> citing_ids;
		int num_fields = mysql_num_fields(res);
		while ((row = mysql_fetch_row(res))) {
			int citing_id = getPaperIntId(row[0]);
			citing_relations.push_back(makeCitingRelation(getPaperIntId(row[1]), citing_id));
			citing_ids.insert(citing_ids.end(), citing_id);
		}

		citing.reserve(citing_ids.size());
		for (auto it = citing_ids.begin(); it != citing_ids.end(); ++it) {
			citing.push_back(mPapers[*it].id);
		}
#else //do nothing
		std::cout << "Query relation is not performed." << std::endl;
#endif
	}

	//retrieve citing or cited paper property according to the property id
	const std::string& getPropertyValue(const CitingRelation& rel, const int& prop_id, const std::map<std::string, std::string>& prop_group) {
		const std::string& val = (isCitingProperty(prop_id)) ?
			mPapers[rel.citing_paper].props[prop_id - CITING_PAPER_INFO_BIT] : mPapers[rel.cited_paper].props[prop_id];
		if (!prop_group.empty()) {
			auto it = prop_group.find(val);
			if (it != prop_group.end()) {
				return it->second;
			} else {
				return mIgnoreFlag;
			}
		}
		return val;
	}

	//group information of a set of papers
	typedef struct _GroupInfo {
		_GroupInfo() {
			agg_val = 0;
		}
		int agg_val;
		std::vector<int> citations;
	} GroupInfo;

	//histogram bin with a name and a number
	typedef struct {
		std::string name;
		int num;
	} SortHistogramType;

	//sort histogram bins by numbers
	static bool compareHistogramBinByNum(const SortHistogramType& a, const SortHistogramType& b) {
		if (a.num == b.num) {
			return (a.name > b.name);
		}
		return (a.num > b.num);
	}

	//sort histogram bins by names
	static bool compareHistogramBinByName(const SortHistogramType& a, const SortHistogramType& b) {
		if (a.name == b.name) {
			return (a.num < b.num);
		}
		return (a.name < b.name);
	}

	//aggregation mode return number of papers, citations,
	//h-index of publication sets, or h-index of citation set
	typedef enum {
		AGG_COUNT_RELATION = 0,
		AGG_COUNT_PAPER_CITATION,
		AGG_PAPER_HINDEX,
		AGG_CITING_HINDEX
	} AggregationMode;

	//return results by hierarchy or by sorted histogram bins
	typedef enum {
		PRODUCT_HIERARCHIES = 0,
		PRODUCT_RANKED_HISTOGRAM
	} ProductMode;

	//if the properties used for partition contains any citation properties
	//use citation paper set; otherwise, use agg_prop string to determine the mode 
	AggregationMode getAggregationMode(const bool& has_citing_prop, const std::string& agg_prop) {
		if (agg_prop == "H-index") {
			if (has_citing_prop) {
				return AGG_CITING_HINDEX;
			} else {
				return AGG_PAPER_HINDEX;
			}
		} else if (!has_citing_prop && agg_prop == "# Citations") {
			return AGG_COUNT_PAPER_CITATION;
		}
		return AGG_COUNT_RELATION;
	}

	//parse product mode
	inline ProductMode getProductMode(const std::string& product_mode) {
		if (product_mode == "ranked histogram") {
			return PRODUCT_RANKED_HISTOGRAM;
		}
		return PRODUCT_HIERARCHIES;
	}

	//return information of a paper set based on the aggregation mdoe
	inline void updateGroupInfo(GroupInfo& ginfo, const CitingRelation& rel, const AggregationMode& mode) {
		if (mode == AGG_COUNT_RELATION) {
			++ginfo.agg_val;
		} else if (mode == AGG_COUNT_PAPER_CITATION) {
			ginfo.agg_val += mPapers[rel.cited_paper].citation;
		} else if (mode == AGG_PAPER_HINDEX) {
			ginfo.citations.push_back(mPapers[rel.cited_paper].citation);
		} else if (mode == AGG_CITING_HINDEX) {
			ginfo.citations.push_back(mPapers[rel.citing_paper].citation);
		}
	}

	//compute h-index or an array
	int computeHIndex(std::vector<int>& arr) {//COULD BE IMPROVED USING PARTITION
		std::sort(arr.begin(), arr.end(), std::greater<int>());
		int ret = 0;
		for (ret = 0; ret < arr.size(); ++ret) {
			if (ret >= arr[ret]) {
				return ret;
			}
		}
		return ret;
	}

	//get the name of the next group (paper set)
	inline std::string getNextName(int& offset, const std::string& group_name) {
		int prev_cap = offset;
		offset = group_name.find('\n', prev_cap + 1);
		return fixNameForDisplay(group_name.substr(prev_cap + 1, offset - prev_cap - 1));
	}

	//remove the special encoding for display
	inline std::string fixNameForDisplay(const std::string& name) {
		if (!name.empty() && name[0] == '|') {
			return name.substr(1, name.length() - 1);
		}
		return name;
	}

	//special encoding to guarantee the display order during sorting
	inline void reencode(std::string& prop_value) {
		if (prop_value == "Low") {
			prop_value.insert(prop_value.begin(), '|');
		} else if (prop_value == "OTHERS~Other Venues") {
			prop_value.insert(prop_value.begin(), '|');
		}
	}

	//special encoding to guarantee the display order during sorting
	inline void reencode(PaperInfo& pinfo) {
		if (pinfo.props[PAPER_INFO_CITATION] == "Low") {
			pinfo.props[PAPER_INFO_CITATION] = "|Low";
		}
		if (pinfo.props[PAPER_INFO_TYPE] == "") {
			pinfo.props[PAPER_INFO_TYPE] = "[O]";
		}
		if (pinfo.props[PAPER_INFO_VENUE] == "") {
			pinfo.props[PAPER_INFO_VENUE] = "|OTHERS~Other Venues";
		}
		if (pinfo.props[PAPER_INFO_RANK] == "" | pinfo.props[PAPER_INFO_RANK]=="Other") {
			pinfo.props[PAPER_INFO_RANK] = "O";
		}
	}

	//convert the information of a paper set to json format
	std::string groupsToString(const std::vector<SortHistogramType>& groups, const int& num_lev) {
		std::string ret = "{\"name\":\"flare\", \"children\": [";
		std::vector<std::string> current_prefix;
		for (int gid = 0; gid < groups.size(); ++gid) {
			const SortHistogramType& group = groups[gid];
			int offset = -1, matched = 0;
			for (int i = 0; i < num_lev - 1; ++i) {
				std::string name = getNextName(offset, group.name);
				if (i >= current_prefix.size()) {
					ret += "{\"name\":\"" + name + "\", \"children\": [";
					current_prefix.push_back(name);
				} else if (name != current_prefix[i]) {
					for (int j = i; j < current_prefix.size(); ++j) {
						ret += "]}";
					}
					ret += ", {\"name\":\"" + name + "\", \"children\": [";
					current_prefix.resize(i);
					current_prefix.push_back(name);
				} else {
					++matched;
				}
			}
			std::string name = getNextName(offset, group.name);
			std::stringstream ss_num;
			ss_num << group.num;
			if (matched == num_lev - 1 && ret[ret.size() - 1] == '}') {
				ret += ", ";
			}
			ret += "{\"name\":\"" + name + "\", \"size\": " + ss_num.str() + "}";
		}
		for (int i = 0; i < num_lev; ++i) {
			ret += "]}";
		}
		return ret;
	}

	//convert the groups to a ranked histogram
	std::string groupsToRankedHistogram(std::vector<SortHistogramType>& groups, const std::vector<int>& prop_ids) {
		std::string ret;
		if (prop_ids.size() != 1) {
			printf("Error: cannot produce histogram with # properties other than 1.\n");
			return ret;
		} else if (groups.empty()) {
			printf("Error: no group to produce histogram. \n");
			return ret;
		}

		if ((prop_ids[0] | CITING_PAPER_INFO_BIT) == (PAPER_INFO_VENUE | CITING_PAPER_INFO_BIT)) {
			std::sort(groups.begin(), groups.end(), compareHistogramBinByNum);
		}

		ret += "{";
		int size = (groups.size() > 100) ? (100) : groups.size();
		for (int i = 0; i < size; ++i) {
			if (mIgnoreGroupNames.find(groups[i].name) != mIgnoreGroupNames.end()) {
				continue;
			}
			ret += "\"" + fixNameForDisplay(groups[i].name);
			ret[ret.size() - 1] = '\"';
			ret += ":[";
			for (int j = 0; j < groups[i].num; ++j) {
				ret += "0,";
			}
			if (groups[i].num != 0) {
				ret[ret.size() - 1] = ']';
			} else {
				ret += "]";
			}
			ret += ",";
		}
		char& last_char = ret[ret.size() - 1];
		if (last_char == ',') {
			last_char = '}';
		} else {
			ret += "}";
		}
		return ret;
	}

	//sort the groups by their names
	void sortGroupsByName(std::vector<SortHistogramType>& sroted_groups, const std::map<std::string, GroupInfo>& groups) {
		sroted_groups.reserve(groups.size());
		for (auto it = groups.begin(); it != groups.end(); ++it) {
			SortHistogramType g;
			g.name = it->first;
			g.num = it->second.agg_val;
			sroted_groups.push_back(g);
		}
		std::sort(sroted_groups.begin(), sroted_groups.end(), compareHistogramBinByName);
	}

	//generate the return information for request concerning property groups 
	//results are stored in the mOutput member variable to avoid garbage collection
	std::string produceGroups(const std::vector<CitingRelation>& citing_relations, const std::vector<int>& prop_ids,
		const std::vector<std::map<std::string, std::string>>& prop_groups, AggregationMode& agg_mode, const ProductMode& product_mode)
	{
		mGroups.clear();
		for (int i = 0; i < citing_relations.size(); ++i) {
			std::string g;
			bool b_ignore = false;
			for (int j = 0; j < prop_ids.size(); ++j) {
				const std::string& prop = getPropertyValue(citing_relations[i], prop_ids[j], prop_groups[j]);
				if (prop == mIgnoreFlag) {
					b_ignore = true;
					continue;
				}
				g += prop + "\n";
			}
			if (!b_ignore) {
				updateGroupInfo(mGroups[g], citing_relations[i], agg_mode);
			}
		}

		if (agg_mode == AGG_PAPER_HINDEX || agg_mode == AGG_CITING_HINDEX) {
			for (auto it = mGroups.begin(); it != mGroups.end(); ++it) {
				it->second.agg_val = computeHIndex(it->second.citations);
				it->second.citations.clear();
			}
		}

		std::vector<SortHistogramType> simple_groups;
		sortGroupsByName(simple_groups, mGroups);

		if (product_mode == PRODUCT_HIERARCHIES) {
			mOutput.assign(groupsToString(simple_groups, prop_ids.size()));
		} else if (product_mode == PRODUCT_RANKED_HISTOGRAM) {
			mOutput.assign(groupsToRankedHistogram(simple_groups, prop_ids));
		}
		return mOutput;
	}

	//clear paper information
	void clearData() {
		mPapers.clear();
		mPaperIdMap.clear();
	}

	//determine whether there is any missing information that requires queries to mysql server
	inline bool needQuery(const std::string& paper_id, const unsigned char& query_mask) {
		unsigned char paper_props_mask = mPapers[getPaperIntId(paper_id)].store_props_mask;
		return (((paper_props_mask^query_mask)&query_mask) != 0);
	}

	//return the papers where information is missing, which requires queries to mysql server
	void getPapersNeedQuery(std::vector<std::string>& papers_need_query, const std::vector<std::string>& papers,
		const unsigned char& query_mask)
	{
		if (mPapers.empty()) {
			papers_need_query.assign(papers.begin(), papers.end());
			return;
		}
		papers_need_query.clear();
		papers_need_query.reserve(papers.size());
		for (int i = 0; i < papers.size(); ++i) {
			if (needQuery(papers[i], query_mask)) {
				papers_need_query.push_back(papers[i]);
			}
		}
	}

	//read information from a temporay file
	bool readFile(const char* file_path) {
		mVenues.mNameMap.clear();
		mVenues.mVenues.clear();
		mPaperIdMap.clear();
		mPapers.clear();
		mCitations.clear();
		std::ifstream file;
		if (!open_file(file, file_path)) {
			return false;
		}

		//read venues
		int num, id;
		std::string name, tmp_str;
		std::getline(file, tmp_str);
		num = atoi(tmp_str.c_str());
		for (int i = 0; i < num; ++i) {
			std::getline(file, name);
			std::getline(file, tmp_str);
			id = atoi(tmp_str.c_str());
			mVenues.mNameMap[name] = id;
		}
		std::getline(file, tmp_str);
		num = atoi(tmp_str.c_str());
		mVenues.mVenues.reserve(num);
		for (int i = 0; i < num; ++i) {
			VenueInfo vinfo;
			std::getline(file, vinfo.abbrev);
			std::getline(file, vinfo.rank);
			mVenues.mVenues.push_back(vinfo);
		}
		//read papers
		std::getline(file, tmp_str);
		num = atoi(tmp_str.c_str());
		for (int i = 0; i < num; ++i) {
			std::getline(file, name);
			std::getline(file, tmp_str);
			id = atoi(tmp_str.c_str());
			mPaperIdMap[name] = id;
		}

		std::getline(file, tmp_str);
		num = atoi(tmp_str.c_str());
		mPapers.reserve(num);
		for (int i = 0; i < num; ++i) {
			PaperInfo pinfo("");
			std::getline(file, tmp_str);
			pinfo.citation = atoi(tmp_str.c_str());
			std::getline(file, tmp_str);
			pinfo.store_props_mask = (unsigned char)atoi(tmp_str.c_str());
			std::getline(file, pinfo.id);
			for (int j = 0; j < PAPER_INFO_NUM; ++j) {
				std::getline(file, pinfo.props[j]);
			}
			mPapers.push_back(pinfo);
		}
		//encode citation category
		for (int i = 0; i < num; ++i) {
			reencode(mPapers[i]);
		}

		//read citations
		std::getline(file, tmp_str);
		num = atoi(tmp_str.c_str());
		for (int i = 0; i < num; ++i) {
			std::getline(file, tmp_str);
			id = atoi(tmp_str.c_str());
			std::getline(file, tmp_str);
			int ci_size = atoi(tmp_str.c_str());
			std::vector<int>& citations = mCitations[id];
			citations.resize(ci_size);
			for (int j = 0; j < ci_size; ++j) {
				std::getline(file, tmp_str);
				citations[j] = atoi(tmp_str.c_str());
			}
		}
		file.close();
		return true;
	}

	//write the cached information to a temporary file
	bool writeFile(const char* file_path) {
		std::ofstream file;
		if (!open_file(file, file_path)) {
			return false;
		}
		//write venues
		file << mVenues.mNameMap.size() << std::endl;
		for (auto it = mVenues.mNameMap.begin(); it != mVenues.mNameMap.end(); ++it) {
			file << it->first << std::endl << it->second << std::endl;
		}
		file << mVenues.mVenues.size() << std::endl;
		for (int i = 0; i < mVenues.mVenues.size(); ++i) {
			file << mVenues.mVenues[i].abbrev << std::endl;
			file << mVenues.mVenues[i].rank << std::endl;
		}
		//write papers
		file << mPaperIdMap.size() << std::endl;
		for (auto it = mPaperIdMap.begin(); it != mPaperIdMap.end(); ++it) {
			file << it->first << std::endl << it->second << std::endl;
		}
		file << mPapers.size() << std::endl;
		for (int i = 0; i < mPapers.size(); ++i) {
			file << mPapers[i].citation << std::endl
				<< (unsigned int)mPapers[i].store_props_mask << std::endl
				<< mPapers[i].id << std::endl;
			for (int j = 0; j < PAPER_INFO_NUM; ++j) {
				file << mPapers[i].props[j] << std::endl;
			}
		}
		//write citations
		file << mCitations.size() << std::endl;
		for (auto it = mCitations.begin(); it != mCitations.end(); ++it) {
			const std::vector<int>& citations = it->second;
			file << it->first << std::endl << citations.size() << std::endl;
			for (int j = 0; j < citations.size(); ++j) {
				file << citations[j] << std::endl;
			}
		}
		file.close();
		return true;
	}

	//process the request for given papers, query properties, property grouping, aggregation mode, and product mode
	//result is store in mOutput member variable
	void processRequest(const std::vector<std::string>& papers, const std::vector<std::string>& query_props,
		const std::vector<std::map<std::string, std::string>>& prop_groups, const std::string& agg_prop, const std::string& product_mode)
	{
		std::vector<std::string> citing_props;
		std::vector<std::string> paper_props;
		unsigned char citing_props_mask = 0;
		unsigned char paper_props_mask = 0;
		std::vector<int> prop_ids(query_props.size());
		bool paper_props_contain_citation = false;
		bool citing_props_contain_citation = false;
		for (int i = 0; i < query_props.size(); i++) {
			PROPERTY_TYPE type = getPropertyType(query_props[i]);
			if (type == PROPERTY_NOT_DEFINED) {
				paper_props.push_back(query_props[i]);
				prop_ids[i] = mPropertyInfoId[query_props[i]];
				paper_props_mask |= 1 << (int)prop_ids[i];
			} else {
				std::string prop_name = query_props[i].substr(3, query_props[i].size() - 3);
				int prop_id = mPropertyInfoId[prop_name];
				if (type == CITING_PROPERTY) {
					citing_props.push_back(prop_name);
					prop_ids[i] = prop_id | CITING_PAPER_INFO_BIT;
					citing_props_mask |= 1 << (int)prop_id;
				} else if (type == PAPER_PROPERTY) {
					paper_props.push_back(prop_name);
					prop_ids[i] = prop_id;
					paper_props_mask |= 1 << (int)prop_id;
				}
			}
			if (prop_ids[i] == PAPER_INFO_CITATION) {
				paper_props_contain_citation = true;
			} else if (prop_ids[i] == (PAPER_INFO_CITATION | CITING_PAPER_INFO_BIT)) {
				citing_props_contain_citation = true;
			}
		}

		AggregationMode agg_mode = getAggregationMode(!citing_props.empty(), agg_prop);
		if (agg_mode == AGG_CITING_HINDEX && !citing_props_contain_citation) {
			citing_props.push_back("Citation Count");
			citing_props_mask |= 1 << (int)PAPER_INFO_CITATION;
		} else if ((agg_mode == AGG_PAPER_HINDEX || agg_mode == AGG_COUNT_PAPER_CITATION) && !paper_props_contain_citation) {
			paper_props.push_back("Citation Count");
			paper_props_mask |= 1 << (int)PAPER_INFO_CITATION;
		}

		std::vector<std::string> query_papers;
		getPapersNeedQuery(query_papers, papers, paper_props_mask);
		std::vector<CitingRelation> citing_relations;
		queryPapersById(query_papers, paper_props);
		if (!citing_props.empty()) {
			std::vector<std::string> citing_papers;
			updateCitingRelationsIndividual(citing_papers, citing_relations, papers);
			getPapersNeedQuery(query_papers, citing_papers, citing_props_mask);
			queryPapersById(query_papers, citing_props);
		} else {
			citing_relations.resize(papers.size());
			for (int i = 0; i < papers.size(); ++i) {
				citing_relations[i].cited_paper = getPaperIntId(papers[i]);
			}
		}

		ProductMode _product_mode = getProductMode(product_mode);
		produceGroups(citing_relations, prop_ids, prop_groups, agg_mode, _product_mode);
		mPreviousRequestPropIds = prop_ids;
	}

	//parse the request string and produce parameters for the other processRequest function
	void processRequest(const std::string request_str) {
#ifdef MYSQL_PAPRE_QUERY_DEBUG
		std::ofstream request_file;
		open_file(request_file, "last_request.txt");
		request_file << request_str;
		request_file.close();
#endif //MYSQL_PAPRE_QUERY_DEBUG

		rapidjson::Document request;
		request.Parse(request_str.c_str());

		auto read_it = request.FindMember("read file");
		if (read_it != request.MemberEnd()) {
			std::string file_path = read_it->value.GetString();
			if (readFile(file_path.c_str())) {
				mOutput = "Success :)";
			} else {
				mOutput = "Fail :(";
			}
			return;
		}

		auto write_it = request.FindMember("write file");
		if (write_it != request.MemberEnd()) {
			std::string file_path = write_it->value.GetString();
			if (writeFile(file_path.c_str())) {
				mOutput = "Success :)";
			} else {
				mOutput = "Fail :(";
			}
			return;
		}

		const rapidjson::Value& papers = request["papers"];
		std::vector<std::string> paper_ids(papers.Size());
		for (int i = 0; i < papers.Size(); ++i) {
			paper_ids[i] = papers[i].GetString();
		}

		const rapidjson::Value& properties = request["properties"];
		int num_props = properties.Size();
		std::vector<std::string> query_props(properties.Size());
		std::map<std::string, int> query_prop_ids;
		for (int i = 0; i < num_props; ++i) {
			query_props[i] = properties[num_props - 1 - i].GetString();
			query_prop_ids[query_props[i]] = i;
		}

		std::string agg_prop = request["agg property"].GetString();

		const rapidjson::Value& groups = request["groups"];
		std::vector<std::map<std::string, std::string>> prop_groups(num_props);
		for (auto it = groups.MemberBegin(); it != groups.MemberEnd(); ++it) {
			std::string prop = it->name.GetString();
			auto qit = query_prop_ids.find(prop);
			if (qit == query_prop_ids.end()) {
				continue;
			}
			int prop_id = qit->second;

			const rapidjson::Value& values = it->value["lists"];
			for (auto vit = values.MemberBegin(); vit != values.MemberEnd(); ++vit) {
				std::string name = vit->name.GetString();
				reencode(name);
				std::cout << prop_id << " " << name << " " << vit->value.GetString() << std::endl;
				prop_groups[prop_id][name] = vit->value.GetString();
			}
		}

		std::string product_mode;
		auto pm_it = request.FindMember("product mode");
		if (pm_it != request.MemberEnd()) {
			product_mode = pm_it->value.GetString();
		} else {
			product_mode = "hierarchies";
		}
		processRequest(paper_ids, query_props, prop_groups, agg_prop, product_mode);

#ifdef MYSQL_PAPRE_QUERY_DEBUG
		std::ofstream output_file;
		open_file(output_file, "output.txt");
		output_file << mOutput;
		output_file.close();
#endif //MYSQL_PAPRE_QUERY_DEBUG
	}

	//producing missing bins for the other hierarchical histogram
	void augmentGroups(const std::map<std::string, GroupInfo>& g1, std::map<std::string, GroupInfo>& g2) {
		for (auto it = g1.begin(); it != g1.end(); ++it) {
			if (g2.find(it->first) == g2.end()) {
				GroupInfo ginfo;
				ginfo.agg_val = -1;
				g2[it->first] = ginfo;
			}
		}
	}

	//produce results for two request and align the results
	void processRequestAligned(const std::string request1, const std::string request2) {
		processRequest(request1);
		std::map<std::string, GroupInfo> g1 = mGroups;
		processRequest(request2);
		std::map<std::string, GroupInfo> g2 = mGroups;

		augmentGroups(g1, g2);
		augmentGroups(g2, g1);

		mOutput = "{\"first\":";
		std::vector<SortHistogramType> sort_g1;
		sortGroupsByName(sort_g1, g1);
		mOutput += groupsToString(sort_g1, mPreviousRequestPropIds.size());

		mOutput += ", \"second\":";
		std::vector<SortHistogramType> sort_g2;
		sortGroupsByName(sort_g2, g2);
		mOutput += groupsToString(sort_g2, mPreviousRequestPropIds.size());
		mOutput += "}";
	}

	//copy the output to desired memory locations
	void produceOutput(char* output) {
		memcpy(output, mOutput.c_str(), mOutput.length());
		output[mOutput.length()] = '\0';
	}

	std::set<std::string> mIgnoreGroupNames;
	std::map<int, std::vector<int>> mCitations;
	std::string mIgnoreFlag;
	std::map<std::string, std::string> mColumnName;
	std::map<std::string, PaperInfoFieldType> mPropertyInfoId;
	StringMap mPaperIdMap;
	std::vector<PaperInfo> mPapers;

	VenueInfoMap mVenues;
	//for request results
	std::vector<int> mPreviousRequestPropIds;
	std::string mOutput;
	std::map<std::string, GroupInfo> mGroups;

#ifdef USE_MYSQL
	void setConnection(MYSQL* conn) {
		mConn = conn;
		mVenues.setConnection(conn);
	}
	MYSQL* mConn;
#endif
};

#endif //MYSQL_PAPER_QUERY_H