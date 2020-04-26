const https = require('https');
const fs = require('fs');
const { MongoClient } = require('mongodb');
const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const { parse } = require('json2csv');
const convert = require('xml-js');
var router = express.Router();

const uri = "mongodb+srv://User:ttrr123@cluster0-zagqc.azure.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.set('port', 3000);
app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

async function connect() {
    try {
        await client.connect();
    } catch (e) {
        console.error(e);
    }
}

async function readDB(client, res) {
    try {
        await client.db("Test").collection("Quotes").find().toArray((err, result) => {
            if (err) {
                throw err;
            }
            res.send(result);
            //console.log(result);
            //console.log(new Date(result[1].t * 1000));
        });
    } catch (e) {
        console.log(e);
    }
}

async function buildDB(client, document) {
    try {
        //await client.connect();
        var result = await client.db("Test").collection("Quotes").insertOne(document);
        console.log(`New listing created with the following id: ${result.insertedId}`);
    } catch (e) {
        console.log(e);
    } finally {
        //await client.close();
    }
}

async function resetDB(client) {
    try {
        await client.db("Test").collection("Quotes").deleteMany({});
    } catch (e) {
        console.log(e);
    } finally {
        console.log("command sent");
    }
}

//Build Database
app.post('/apicall', async function (req, res) {
    //var file = fs.createWriteStream("sonj2-finnhub.json");
    var symbol = req.body.symbol;
    var url = "https://finnhub.io/api/v1/quote?symbol=" + symbol + "&token=bpcg0u7rh5rfp0uqfg1g"
    console.log(url)
    await https.get(url, function (response) {
        var body = '';
        response.on('data', function (chunk) {
            body += chunk;
        });
        response.on('end', function () {
            if (body == "Symbol not supported") {
                res.send("The stock symbol is not supported");
            } else {
                var result = JSON.parse(body);
                result["symbol"] = symbol;
                console.log(result);
                buildDB(client, result);
            }
        });
        //response.pipe(file);
    }).on('error', function (e) {
        console.log("Got error:" + e.message);
    });
});

//Read data
app.get('/data', function (req, res) {
    readDB(client, res);
});

//Reset
app.post('/reset', function (req, res) {
    resetDB(client);
    res.send("Reset Database");
});

//Export
app.get('/export/:type', async function (req, res) {
    var type = req.params.type;
    //console.log(type);
    //var file = fs.createWriteStream("sonj2-finhub." + type);
    //await client.connect(uri, (err,client) => {
    //if(err) throw err;
    await client
        .db("Test")
        .collection("Quotes")
        .find({})
        .toArray((err, data) => {
            if (err) throw err;
            var tempData = data;
            tempData.forEach(document => {
                delete document["_id"];
            });
            //delete tempData[0]["_id"];
            if (type == "csv") {
                var csvData = parse(tempData);
                //console.log(csvData);
                fs.writeFile("sonj2-finnhub.csv", csvData, function (error) {
                    if (error) throw error;
                    res.download("sonj2-finnhub.csv", function (err) {
                        if (err) throw err;
                        fs.unlink("sonj2-finnhub.csv", function (error) {
                            if (error) throw error;
                        });
                    });
                });
            } else if (type == "xml") {
                var xmlData = convert.json2xml(tempData, { compact: true, spaces: 4 });
                //console.log(xmlData);
                fs.writeFile("sonj2-finnhub.xml", xmlData, function (error) {
                    if (error) throw error;
                    res.download("sonj2-finnhub.xml", function (err) {
                        if (err) throw err;
                        fs.unlink("sonj2-finnhub.xml", function (error) {
                            if (error) throw error;
                        });
                    });
                });
            } else if (type == "json") {
                var text = JSON.stringify(tempData);
                fs.writeFile("sonj2-finnhub.json", text, function (error) {
                    if (error) throw error;
                    res.download("sonj2-finnhub.json", function (err) {
                        if (err) throw err;
                        fs.unlink("sonj2-finnhub.json", function (error) {
                            if (error) throw error;
                        });
                    });
                });
            } else {
                console.error("Can't find the export type");
            }
            //client.close();
        });
    //});
});

app.get('/test', async (req, res) => { //check if the DB collection is empty
    try {
        await client.db("Test").collection("Quotes").countDocuments((err, result) => {
            if (err) {
                throw err;
            }
            res.json(result);
        });
    } catch (e) {
        console.log(e);
    }
});

app.listen(app.get('port'), function () {
    connect().then(r => console.log('The server is running on http://localhost:' + app.get('port')));
});