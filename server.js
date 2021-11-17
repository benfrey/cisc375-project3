// Built-in Node.js modules
let fs = require('fs');
let path = require('path');

// NPM modules
let express = require('express');
let sqlite3 = require('sqlite3');
const { response } = require('express');

let public_dir = path.join(__dirname, 'public');
let template_dir = path.join(__dirname, 'templates');
let db_filename = path.join(__dirname, 'db', 'stpaul_crime.sqlite3');

let app = express();
let port = 8000;

/*
// Open usenergy.sqlite3 database
let db = new sqlite3.Database(db_filename, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
        console.log('Error opening ' + db_filename);
    }
    else {
        console.log('Now connected to ' + db_filename);
    }
});

// Serve static files from 'public' directory
app.use(express.static(public_dir));


// GET request handler for home page '/' (redirect to /year/2018)
app.get('/', (req, res) => {
    res.redirect('/year/2018');
});

// GET request handler for '/year/*'
app.get('/year/:selected_year', (req, res) => {
    console.log(req.params.selected_year);
    fs.readFile(path.join(template_dir, 'year.html'), (err, template) => {
        // modify `template` and send response
        // this will require a query to the SQL database
        if(err)
        {
            res.status(404).send('Error: no data for the year' + req.params.selected_year);
        }
        else
        {
            let response = template.toString().replace('{{{YEAR HERE}}}', req.params.selected_year);
            db.all('SELECT state_abbreviation, coal, natural_gas, nuclear, petroleum, renewable FROM Consumption WHERE year = ?', [req.params.selected_year], (err, rows) => {
                if (rows.length < 1) {
                    res.status(404).send('Error: no data for the year ' + req.params.selected_year);
                } else {


                    let i;
                    let list_items = '';
                    let total = 0;
                    let coal_total = 0, natural_gas_total = 0, nuclear_total = 0, petroleum_total = 0,
                        renewable_total = 0;
                    for (i = 0; i < rows.length; i++) {
                        total = 0;
                        coal_total += rows[i].coal;
                        natural_gas_total += rows[i].natural_gas;
                        nuclear_total += rows[i].nuclear;
                        petroleum_total += rows[i].petroleum;
                        renewable_total += rows[i].renewable;
                        total += (rows[i].coal + rows[i].natural_gas + rows[i].nuclear + rows[i].petroleum + rows[i].renewable);
                        list_items += '<tr>\n' + '<td>' + rows[i].state_abbreviation + '</td>\n' + '<td>' + rows[i].coal + '</td>\n' + '<td>' + rows[i].natural_gas + '</td>\n' + '<td>' + rows[i].nuclear + '</td>\n' + '<td>' + rows[i].petroleum + '</td>\n' + '<td>' + rows[i].renewable + '</td>\n' + '<td>' + total + '</td>\n' + '</tr>\n';
                    }

                    // Reformat rows object
                    //let reformatted_data = {states:rows.map(a => a.state_abbreviation), coal:rows.map(a => a.coal), natural_gas:rows.map(a => a.natural_gas), petroleum:rows.map(a => a.petroleum), renewable:rows.map(a => a.renewable)};

                    // Arrange bar stacks
                    //let coalStack = {x: reformatted_data.states, y: reformatted_data.coal, name: 'Coal', type: 'bar'};
                    //let naturalStack = {x: reformatted_data.states, y: reformatted_data.natural_gas, name: 'Natural Gas', type: 'bar'};
                    //let nuclearStack = {x: reformatted_data.states, y: reformatted_data.nuclear, name: 'Nuclear', type: 'bar'};
                    //let petroleumStack = {x: reformatted_data.states, y: reformatted_data.petroleum, name: 'Petroleum', type: 'bar'};
                    //let renewableStack = {x: reformatted_data.states, y: reformatted_data.petroleum, name: 'Petroleum', type: 'bar'};

                    response = response.replace('{{{YEAR}}}', req.params.selected_year);
                    response = response.replace('{{{COAL_COUNT}}}', coal_total);
                    response = response.replace('{{{NATURAL_GAS_COUNT}}}', natural_gas_total);
                    response = response.replace('{{{NUCLEAR_COUNT}}}', nuclear_total);
                    response = response.replace('{{{PETROLEUM_COUNT}}}', petroleum_total);
                    response = response.replace('{{{RENEWABLE_COUNT}}}', renewable_total);

                    response = response.replace('{{{DATA HERE}}}', list_items);
                    //res.render('years.html',reformatted_data);
                    res.status(200).type('html').send(response);
                }
            });
        }

       // res.status(200).type('html').send(template); // <-- you may need to change this
    });
});

// GET request handler for '/state/*'
app.get('/state/:selected_state', (req, res) => {
    console.log(req.params.selected_state);
    fs.readFile(path.join(template_dir, 'state.html'), (err, template) => {
        // modify `template` and send response
        // this will require a query to the SQL database
        if(err)
        {
            res.status(404).send('Error: no data for the state' + req.params.selected_state);
        }
        else
        {
            let response = template.toString().replace('{{{STATE HERE}}}', capitalize(req.params.selected_state));
            response = response.replace('{{{STATE NAME 2}}}', capitalize(req.params.selected_state));

            if (req.params.selected_state.length == 2) {
                response = response.replace('{{{STATE IMG HERE}}}', '../images/state-flags/' + req.params.selected_state.toLowerCase() + '.png');
            }
            else {
                db.get('SELECT state_abbreviation FROM States where state_name = ?', [req.params.selected_state], (err, row) => {
                    if (row === undefined) {
                        res.status(404).send("Error: state not found " + req.params.selected_state);
                    } else {
                        response = response.replace('{{{STATE IMG HERE}}}', '../images/state-flags/' + row.state_abbreviation + '.png');
                    }
                })
            }
            db.all('SELECT year, coal, natural_gas, nuclear, petroleum, renewable FROM Consumption INNER JOIN States ON Consumption.state_abbreviation = States.state_abbreviation WHERE Consumption.state_abbreviation = ? OR state_name = ?',[req.params.selected_state.toUpperCase(), req.params.selected_state], (err, rows) =>{
                if (rows.length < 1) {
                    res.status(404).send('Error: no data for the state ' + req.params.selected_state);
                } else {
                    let i;
                    let list_items = '';
                    let total;
                    for (i = 0; i < rows.length; i++) {
                        total = 0;
                        total += (rows[i].coal + rows[i].natural_gas + rows[i].nuclear + rows[i].petroleum + rows[i].renewable);
                        list_items += '<tr>\n' + '<td>' + rows[i].year + '</td>\n' + '<td>' + rows[i].coal + '</td>\n' + '<td>' + rows[i].natural_gas + '</td>\n' + '<td>' + rows[i].nuclear + '</td>\n' + '<td>' + rows[i].petroleum + '</td>\n' + '<td>' + rows[i].renewable + '</td>\n' + '<td>' + total + '</td>\n' + '</tr>\n';
                    }

                    // Arrange/reformat data
                    let years = JSON.stringify(rows.map(a => a.year));
                    let coalStack = JSON.stringify(rows.map(a => a.coal));
                    let naturalStack = JSON.stringify(rows.map(a => a.natural_gas));
                    let nuclearStack = JSON.stringify(rows.map(a => a.nuclear));
                    let petroleumStack = JSON.stringify(rows.map(a => a.petroleum));
                    let renewableStack = JSON.stringify(rows.map(a => a.renewable));
                    //console.log(coalStack);

                    response = response.replace('{{{STATE}}}', req.params.selected_state);
                    response = response.replace('{{{YEAR_RANGE}}}', years);
                    response = response.replace('{{{COAL_COUNTS}}}', coalStack);
                    response = response.replace('{{{NATURAL_GAS_COUNTS}}}', naturalStack);
                    response = response.replace('{{{NUCLEAR_COUNTS}}}', nuclearStack);
                    response = response.replace('{{{PETROLEUM_COUNTS}}}', petroleumStack);
                    response = response.replace('{{{RENEWABLE_COUNTS}}}', renewableStack);

                    response = response.replace('{{{DATA HERE}}}', list_items);
                    res.status(200).type('html').send(response);
                }
            });
        }

        ///res.status(200).type('html').send(template); // <-- you may need to change this
    });
});

// GET request handler for '/energy/*'
app.get('/energy/:selected_energy_source', (req, res) => {
    console.log(req.params.selected_energy_source);
    fs.readFile(path.join(template_dir, 'energy.html'), (err, template) => {
        // modify `template` and send response
        // this will require a query to the SQL database
        if(err)
        {
            res.status(404).send('Error: file not found' + req.params.selected_energy_source);
        }
        else
        {
            let response = template.toString().replace('{{{ENERGY TYPE HERE}}}',capitalize(req.params.selected_energy_source));
            response = response.replace('{{{ENERGY IMG HERE}}}', '../images/energy-types/' + req.params.selected_energy_source.toLowerCase() + '.jpg');
            let year_array = [];

            // Declare
            let xData;
            let state_abbreviations;
            let yData;

            // we want to know how many years there are to iterate over
            db.all('SELECT DISTINCT year FROM Consumption', (err, rows) =>{
                let i;
                for(i=0; i<rows.length; i++)
                {
                    year_array.push(i);
                }

                // Get all years
                xData = rows.map(a => a.year);
            });

            // we want to know how state abbrevs
            db.all('SELECT DISTINCT state_abbreviation FROM States', (err, rows) =>{
                // get all state abbrevs
                state_abbreviations = rows.map(a => a.state_abbreviation);
            });

            db.all('SELECT year, state_abbreviation, ' + capitalize(req.params.selected_energy_source) +  ' FROM Consumption ORDER BY year', (err, rows) => {
                let i;
                let j;
                let list_items = '';
                let count = 0;
                let count2 = 0;
                let year_count = 1960;

                // Empty yData for graph usage, see energy template for end format
                yData = [];

                for(i=0; i<year_array.length; i++)
                {
                    list_items += '<tr>\n'
                    list_items += '<td>' + year_count + '</td>\n';

                    let yCol = [];

                    for(j=count; j<rows.length; j++)
                    {
                        // Push energy data for one state of particular year
                        yCol.push(rows[j][req.params.selected_energy_source.toLowerCase()]);

                        list_items += '<td>' + rows[j][req.params.selected_energy_source.toLowerCase()] + '</td>\n';
                        if(count2 == 50)
                        {
                            count2 = 0;
                            break;
                        }
                        count2++;
                    }

                    // Push energy data for all states of particular year
                    yData.push(yCol);

                    count += 51;
                    list_items += '</tr>\n';
                    year_count++;
                }
                response = response.replace('{{{DATA HERE}}}', list_items);

                // Transpose because we want states as highest level of order [[1, 2, 4, 7, ...], [3, 4, 5, 6, ...], [4, 3, 5, 8, ...], ...] (state order, year order)
                yData = transpose(yData)

                // stringifies to pass data later
                state_abbreviations = JSON.stringify(state_abbreviations);
                xData = JSON.stringify(xData);
                yData = JSON.stringify(yData);

                //console.log(xData);
                //console.log(state_abbreviations);
                //console.log(yData);

                // Replace data
                response = response.replace('{{{STATES}}}', state_abbreviations);
                response = response.replace('{{{XDATA}}}', xData);
                response = response.replace('{{{YDATA}}}', yData);

                res.status(200).type('html').send(response);
            });
        }

        //res.status(200).type('html').send(template); // <-- you may need to change this/
    });
});

function capitalize(str) {
    if (str.length == 2) {
        return str.toUpperCase();
    } else {
        return str.charAt(0).toUpperCase() + str.toLowerCase().slice(1);
    }
}
*/

app.listen(port, () => {
    console.log('Now listening on port ' + port);
});

/*
// Transpose method from https://www.tutorialspoint.com/finding-transpose-of-a-2-d-array-javascript
const transpose = arr => {
  let res = [];
  res = arr.reduce((acc, val, ind) => {
    val.forEach((el, index) => {
        acc[index] = acc[index] || [];
        acc[index][ind] = el;
    });
    return acc;
  }, [])
  return res;
};
*/
