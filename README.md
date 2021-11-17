# cisc375-project3
Project 3 - RESTful Server

Implement the following to earn 30/40 points (grade: C)
- Package.json
    - Fill out the author and contributors sections in package.json (author should be whoever's GitHub account is used to host the code, contributors should be all group members)
    - Fill out the URL of the repository
    - Ensure all used modules downloaded via NPM are in the dependencies object
    - Add the following routes for your API
- GET /codes
    - Return JSON array with list of codes and their corresponding incident type (ordered by code number)
- GET /neighborhoods
    - Return JSON object with list of neighborhood ids and their corresponding neighborhood name (ordered by id)
- GET /incidents
    - Return JSON object with list of crime incidents (ordered by date/time). Note date and time should be separate fields.
- PUT /new-incident
    - Upload incident data to be inserted into the SQLite3 database
    - Data fields: case_number, date, time, code, incident, police_grid, neighborhood_number, block
    - Note: response should reject (status 500) if the case number already exists in the database
- DELETE /remove-incident
    - Remove data from the SQLite3 database
    - Data fields: case_number
    - Note: reponse should reject (status 500) if the case number does not exist in the database

Implement additional features to earn a B or A
- Add the following query option for GET /codes (2 pts) 
    - code - comma separated list of codes to include in result (e.g. ?code=110,700). By default all codes should be included.
- Add the following query options for GET /neighborhoods (2 pts)
    - id - comma separated list of neighborhood numbers to include in result (e.g. ?id=11,14). By default all neighborhoods should be included.
- Add the following query options for GET /incidents (6 pts)
    - start_date - first date to include in results (e.g. ?start_date=2019-09-01)
    - end_date - last date to include in results (e.g. ?end_date=2019-10-31)
    - code - comma separated list of codes to include in result (e.g. ?code=110,700). By default all codes should be included.
    - grid - comma separated list of police grid numbers to include in result (e.g. ?grid=38,65). By default all police grids should be included.
    - neighborhood - comma separated list of neighborhood numbers to include in result (e.g. ?neighborhood=11,14). By default all neighborhoods should be included.
    - limit - maximum number of incidents to include in result (e.g. ?limit=50). By default the limit should be 1,000. Result should include the N most recent incidents (within specified date range).
