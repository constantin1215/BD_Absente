const OracleDB = require("oracledb");
const dbConfig = require("./dbConfing");
const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');

const app = express();

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    optionSuccessStatus: 200
}
app.use(cors(corsOptions));
app.use(bodyParser.json({ 'Content-Type': 'application/json' }));

async function run() {

    let libPath;
    if (process.platform === 'win32') {
        libPath = 'C:\\oracle\\instantclient_21_7';
    }

    if (libPath && fs.existsSync(libPath)) {
        OracleDB.initOracleClient({ libDir: libPath });
    }

    try {
        await OracleDB.createPool(dbConfig);
        console.log("OracleDB: Connection pool created!");
    } catch (err) {
        console.error(err);
    }
}

async function select(table) {

    let connection, pool;
    try {
        pool = OracleDB.getPool();
        connection = await pool.getConnection();
        console.log("Fetching...");
        let result;
        if (table !== 'info')
            result = await connection.execute(`SELECT * FROM ${table}`);
        else
            result = await connection.execute(`SELECT A.DATA_INREGISTRARII, A.MOTIVATA, S.NUME || ' ' || S.PRENUME AS "STUDENT", G.COD_GRUPA || G.SEMIGRUPA AS "SEMIGRUPA", S.EMAIL , L.ORA, M.DENUMIRE, P.NUME || ' ' || P.PRENUME AS "PROFESOR" FROM ABSENTA A, STUDENT S, LABORATOR L, MATERIE M, PROFESOR P, GRUPA G WHERE A.ID_STUDENT = S.ID_STUDENT AND A.ID_LAB = L.ID_LAB AND L.ID_MATERIE = M.ID_MATERIE AND L.ID_PROF = P.ID_PROF AND S.ID_GRUPA = G.ID_GRUPA`);
        console.log("Fetched");


        return result;

    } catch (err) {
        console.log(err)
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}

async function tables() {

    let connection, pool;
    try {
        pool = OracleDB.getPool();
        connection = await pool.getConnection();
        console.log("Fetching...");
        const result = await connection.execute(`SELECT table_name FROM user_tables`);
        console.log("Fetched");

        return result.rows;

    } catch (err) {
        console.log(err)
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}

async function closePoolAndExit() {
    console.log("\nNode: Terminating");
    try {
        await OracleDB.getPool().close(10);
        process.exit(0);
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}

process
    .once('SIGTERM', closePoolAndExit)
    .once('SIGINT', closePoolAndExit);


app.post("/login", (req, res) => {
    if (req.body.user === 'admin' && req.body.pass === 'password')
        res.send({ token: 'parola_este_parola' });
    else
        res.status(401).send({ message: "Error: Invalid Username or Password" });
});

app.post("/select", (req, res) => {
    const tableName = req.body.tableName;
    res.header('Access-Control-Allow-Origin', '*');

    if (tableName !== undefined)
        select(tableName).then(table => { res.send({ content: table });});
    else
        res.status(404).send({ message: "Error: Table not selected" });
});

app.post("/input" , (req, res) => {

});

app.get("/table", (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    tables().then(output => res.send({ content: output }));
});

app.listen(8080, async () => { await run() });