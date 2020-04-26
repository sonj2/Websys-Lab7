const {MongoClient} = require('mongodb');

const uri = "mongodb+srv://User:ttrr123@cluster0-zagqc.azure.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});

var test = {
    "c": 30.09,
    "h": 30.9599,
    "l": 29.96,
    "o": 30.63,
    "pc": 31.13,
    "t": 1586999503
}

async function main(){
    try {
        await client.connect();
        await buildDB(client, test);
    } catch (e) {
        console.error(e);
    } finally {
        console.log("boo");
        await client.close();
    }
}

main().catch(console.error);

async function listDb(client) {
    const dbList = await client.db().admin().listDatabases();
    console.log("Databases:");
    dbList.databases.forEach(db => console.log(` - ${db.name}`));
}

async function buildDB(client, document){
    try {
        //await client.connect();
        var result = await client.db("Test").collection("Quotes").insertOne(document);
        console.log(`New listing created with the following id: ${result.insertedId}`);
    } catch(e) {
        console.log(e);
    } finally {
        //await client.close();
    }
}
