// Built-in Node.js modules
let fs = require('fs');
let path = require('path');
let cors = require('cors');


// NPM modules
let express = require('express');
let sqlite3 = require('sqlite3');

let public_dir = path.join(__dirname, 'public');
let template_dir = path.join(__dirname, 'templates');
let db_filename = path.join(__dirname, 'db', 'stpaul_crime.sqlite3');

let app = express();
app.use(express.json());
app.use(cors());
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

app.put('/new-incident', (req, res) =>{
    console.log(req.body);
    db.get('SELECT * FROM Incidents WHERE case_number = ?', [req.body.caseNumber], (err, row)=> {
        if(err || row !== undefined ) {
            res.status(500).type('txt').send('Error, could not insert incident');
        } else {
            db.run('INSERT INTO Incidents (case_number, date_time, code, indicent, police_grid, neighborhood_number, block) VALUES(?, ?, ?, ?, ?, ?, ?)',[req.body.caseNumber, req.body.dateTime, req.body.code, req.body.incident, req.body.policeGrid, req.body.neighborhoodNumber, req.body.block], (err) =>{
                res.status(200).type('txt').send('success');
            });
        }
    });
});

// Delete /remove-incident

app.delete('/remove-incident', (req, res) =>{
  console.log(req.body);
  db.get('SELECT * FROM Incidents WHERE case_number = ?', [req.body.caseNumber], (err, row)=> {
      if(err || row !== undefined ) {
          res.status(500).type('txt').send('Error, could not insert incident');
      } else {
          db.run('DELETE FROM Incidents WHERE casse_number = ?',[req.body.caseNumber], (err) =>{
              res.status(200).type('txt').send('deleted');
          });
      }
  });
});




app.listen(port, () => {
    console.log('Now listening on port ' + port);
});
