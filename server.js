// Built-in Node.js modules
let fs = require('fs');
let path = require('path');

// NPM modules
let express = require('express');
let sqlite3 = require('sqlite3');

let public_dir = path.join(__dirname, 'public');
let template_dir = path.join(__dirname, 'templates');
let db_filename = path.join(__dirname, 'db', 'stpaul_crime.sqlite3');

let app = express();
let port = 8000;

// Open sqlite3 database
let db = new sqlite3.Database(db_filename, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
        console.log('Error opening ' + db_filename);
    }
    else {
        console.log('Now connected to ' + db_filename);
    }
});

// GET /codes
app.get('/codes', (req, res) => {

    // Initial part of sql query
    sqlQuery = 'SELECT * FROM Codes';

    // Specific code(s) was(were) supplied ex: ?code=120,140
    let codes = req.query.code;
    if(codes){
      codeArray = codes.split(",");

      // Add to sql query
      sqlQuery = sqlQuery + " WHERE code = " + codeArray.join(" OR code = ");
    }

    // End of sql query statement
    sqlQuery += " ORDER BY code";

    // Make the database query
    new Promise( (resolve, reject) => {
        db.all(sqlQuery, (err, rows) => {
            if (err) {
                console.log(err); // error somewhere, cannot resolve promise
                reject();
            } else {
                resolve(rows); // rows were received, now resolve
            }
        });
    })
    .then(rows => {
      res.status(200).type('application/json').send(rows);
    }).catch(err => {
      res.status(500).send("Error querying database");
    });
});

// Get /neighborhoods
app.get('/neighborhoods', (req, res) => {

  // Initial part of sql query
  sqlQuery = 'SELECT * FROM Neighborhoods';

  // Specific code(s) was(were) supplied ex: ?id=11,14
  let ids = req.query.id;
  if(ids){
    idArray = ids.split(",");

    // Add to sql query
    sqlQuery = sqlQuery + " WHERE neighborhood_number = " + idArray.join(" OR neighborhood_number = ");
  }

  // End of sql query statement
  sqlQuery += " ORDER BY neighborhood_number";

  // Make the database query
  new Promise( (resolve, reject) => {
      db.all(sqlQuery, (err, rows) => {
          if (err) {
              console.log(err); // error somewhere, cannot resolve promise
              reject();
          } else {
              resolve(rows); // rows were received, now resolve
          }
      });
  })
  .then(rows => {
    res.status(200).type('application/json').send(rows);
  }).catch(err => {
    res.status(500).send("Error querying database");
  });
});

// Get /incidents
app.get('/incidents', (req, res) => {

  // Initial part of sql query
  sqlQuery = 'SELECT * FROM Incidents';

  // Specific query (logan and grant)

  // End of sql query statement
  sqlQuery += " ORDER BY date_time";

  // Make the database query
  new Promise( (resolve, reject) => {
      db.all(sqlQuery, (err, rows) => {
          if (err) {
              console.log(err); // error somewhere, cannot resolve promise
              reject();
          } else {
              resolve(rows); // rows were received, now resolve
          }
      });
  })
  .then(rows => {
    res.status(200).type('application/json').send(rows);
  }).catch(err => {
    res.status(500).send("Error querying database");
  });

  db.all('SELECT * FROM Incidents ORDER BY date_time', (err, rows) => {
    res.status(200).type('json').send(rows); // Still need newline after each row
  });
});

// Put /new-incident

// Delete /remove-incident





app.listen(port, () => {
    console.log('Now listening on port ' + port);
});
