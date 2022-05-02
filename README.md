# CISC 375: Web Development Project #3 - RESTful API Server

## Project Description

The main purpose of this project is to demonstrate the implementation of a RESTful API Server that can access information stored on a database within this repository. The SQL database contains St. Paul crime data over the last few years and can be accessed via cURL HTTP requests when the API server is hosted locally. To setup the server, please see the "Installation Process" section.

## Project Overview

Project Assignment Outline PDF: [project_assignment.pdf](/docs/project_assignment.pdf) </br>
cURL Example Requests: [curl_commands.txt](/docs/curl_commands.txt) </br>

### Installation Process
1. $git clone https://github.com/benfrey/cisc375-project3
2. $cd cisc375-project3
3. $npm install
4. $node server.js
5. Perform GET, PUT, DELETE requests using cURL

### Example API Usage
Server Activation
![Server Activation with Terminal](/docs/server_activation.png?raw=true "Server Activation with Terminal")
Example API Command
![Example API Usage with Terminal](/docs/example_usage.png?raw=true "Example API Usage")

# Project Components
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
