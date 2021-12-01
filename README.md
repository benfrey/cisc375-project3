# RESTful Server - CISC375: Web Development Project #3

1. $git clone https://github.com/<user>/<project>
2. $cd <project>
3. Copy my local version of 'stpaul_crime.sqlite3' to the 'db' folder
4. $npm install
5. $node server.js
6. Perform GET, PUT, DELETE requests using curl

# Project components
Implement the following to earn 30/40 points (grade: C)
- Package.json **(Ben)**
    - Fill out the author and contributors sections in package.json (author should be whoever's GitHub account is used to host the code, contributors should be all group members)
    - Fill out the URL of the repository
    - Ensure all used modules downloaded via NPM are in the dependencies object
    - Add the following routes for your API
- GET /codes **(Ben)**
    - Return JSON array with list of codes and their corresponding incident type (ordered by code number)
- GET /neighborhoods **(Ben)**
    - Return JSON object with list of neighborhood ids and their corresponding neighborhood name (ordered by id)
- GET /incidents **(Ben)**
    - Return JSON object with list of crime incidents (ordered by date/time). Note date and time should be separate fields.
- PUT /new-incident **(Grant)**
    - Upload incident data to be inserted into the SQLite3 database
    - Data fields: case_number, date, time, code, incident, police_grid, neighborhood_number, block
    - Note: response should reject (status 500) if the case number already exists in the database
- DELETE /remove-incident **(Logan)**
    - Remove data from the SQLite3 database
    - Data fields: case_number
    - Note: reponse should reject (status 500) if the case number does not exist in the database

Implement additional features to earn a B or A
- Add the following query option for GET /codes (2 pts) **(Ben)**
    - code - comma separated list of codes to include in result (e.g. ?code=110,700). By default all codes should be included.
- Add the following query options for GET /neighborhoods (2 pts) **(Ben)**
    - id - comma separated list of neighborhood numbers to include in result (e.g. ?id=11,14). By default all neighborhoods should be included.
- Add the following query options for GET /incidents (6 pts) **(Logan + whoever)**
    - start_date - first date to include in results (e.g. ?start_date=2019-09-01)
    - end_date - last date to include in results (e.g. ?end_date=2019-10-31)
    - code - comma separated list of codes to include in result (e.g. ?code=110,700). By default all codes should be included.
    - grid - comma separated list of police grid numbers to include in result (e.g. ?grid=38,65). By default all police grids should be included.
    - neighborhood - comma separated list of neighborhood numbers to include in result (e.g. ?neighborhood=11,14). By default all neighborhoods should be included.
    - limit - maximum number of incidents to include in result (e.g. ?limit=50). By default the limit should be 1,000. Result should include the N most recent incidents (within specified date range).

    
    
    =================================testing curl commands (grant)======================= </br>
    curl -X GET "http://localhost:8000/incidents?end_date=2019-02-01&start_date=2019-01-01" </br>
    curl -X GET "http://localhost:8000/incidents?limit=4&end_date=2019-02-01&start_date=2019-01-01" </br>
    curl -X GET "http://localhost:8000/incidents?limit=4&end_date=2019-02-01&start_date=2019-01-01&code=9954" </br>
    curl -X GET "http://localhost:8000/incidents?limit=4&end_date=2019-02-01&start_date=2019-01-01&code=9954&neighborhood=10" </br>
    curl -X DELETE "http://localhost:8000/incidents?case_number=<number>"
    
    
 {
"case_number": "999999",
"date_time": "2021-06-08T15:26:00.000",
"code": 9954,
"incident" : "Proactive Police Visit",
"police_grid": 98,
"neighborhood_number": 1,
"block": "63X KENNARD ST"
}
send this in the body of a request in raw JSON format to http://localhost:8000/new-incident
from this website https://www.webtools.services/online-rest-api-client
    
