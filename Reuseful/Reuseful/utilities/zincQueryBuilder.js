const GLOBAL_VARS = require('../GLOBAL_VARS.json');
const zinc = require("../connections/zincConnector");

exports.getElasticCustomAggsDataWithCriteria = function (searchData, aggField, index) {
    const query = queryBuilder(searchData);

    const payload = {
        "size": 0,
        "query": query,
        "aggs": aggField
    };

    const response = zinc.zincSelect(payload, index);

    if (response.getResponseCode() == 200) {
        return JSON.parse(response.getContentText());
    }
};

exports.getElasticAggsDataWithCriteria = function (searchData, aggField, index) {
    const query = queryBuilder(searchData);

    const payload = {
        "from": 0,
        "size": 0,
        "query": query,
        "aggs": {
            "text": {
                "terms": {
                    "field": aggField
                }
            }
        }
    };

    const response = zinc.zincSelect(payload, index);

    if (response.getResponseCode() == 200) {
        return JSON.parse(response.getContentText());
    }
};

exports.getElasticAggsData = async function (aggField, index) {
    var payload = {
        "from": 0,
        "size": 0,
        "aggs": {
            "text": {
                "terms": {
                    "field": aggField
                }
            }
        }
    };

    const response = await zinc.zincSelect(payload, index);

    if (response.getResponseCode() == 200) {
        return JSON.parse(response.getContentText());
    }
};

exports.insertIntoZs = function (data, index, docId) {
    return zinc.zincUpdate(data, index, docId)

}


exports.removeDocFromZs = function (index, docId) {
    return zinc.zincRemove(index, docId)
}


exports.getElasticData = function (start, size, searchData, index) {

    const query = queryBuilder(searchData,searchType='MUST');
  
    var payload = {
      "from": start,
      "size": size,
      "query": query,
      "_source": [],
      "sort": [
        { "price": "desc" },
        { "id": "asc" }
      ]
    };
  
  
    return zinc.zincSelect(payload, index)
  }
    



exports.getReusableElasticData = function(start, size, index, brandname) {

    let queryData = [];

    if (brandname) {
      queryData.push({
        "match": {
          "brand_name": brandname
        }
      });
    }
  
    if (queryData.length) {
      queryData = {
        "bool": {
          "must": queryData
        }
      };
    } else {
      //if user skipped all options, then show all records we have
      queryData = {
        "match_all": {}
      };
    }
  
    var payload = {
      "from": start,
      "size": size,
      "query": queryData
    };
  
    return zinc.zincSelect(payload, index);
  }
  
  

      



function queryBuilder(searchData, searchType) {
    var searchCriteria = [];
    var query = {
        "bool": {
            [searchType]: searchCriteria
        }
    };

    for (const e of searchData) {
        const filter = e["query"];
        const filterType = e["type"];
        const filterValue = e["value"];
        if (filterValue) {
            searchCriteria.push(buildSubQuery(filter, filterType, filterValue));
        }
    }

    if (searchCriteria.length == 0) {
        var query = {
            "match_all": {}
        }
    }

    return query;
}

function buildSubQuery(filter, filterType, filterValue) {
    var subQuery;
    var rValue;

    if (filterType == 'range') {
      if (filter === 'price') {
        filterValue = parseInt(filterValue) + 2500;
  
        var rValue = {
          "lte": filterValue
        };
  
        subQuery = {
          [filter]: rValue
        };
      }
    } else if (filterType == 'term') {
        filter = filter + ".keyword";
        subQuery = {
            [filter]: filterValue
        }
    } else if (filterType == 'match' || filterType == 'match_phrase') {
        subQuery = {
            [filter]: filterValue
        }
    } else if (filterType == 'fuzzy') {
        subQuery = {
            [filter]: filterValue.toLowerCase()
        }
    }

    return {
        [filterType]: subQuery
    };
}

