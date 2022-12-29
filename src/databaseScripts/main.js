const OracleDB = require("oracledb");
const dbConfig = require("./dbConfing");
const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const cors = require("cors");
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200,
}

app.use(cors(corsOptions))

app.use(bodyParser.json({ 'Content-Type': 'application/json' }));
app.use(express.urlencoded({ extended: true }));

OracleDB.autoCommit = true;

app.get("/", (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Max-Age", "1800");
    res.setHeader("Access-Control-Allow-Headers", "content-type");
    res.setHeader("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS");
});

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
        if (table === 'info')
            result = await connection.execute(`SELECT A.DATA_INREGISTRARII, A.MOTIVATA, S.NUME || ' ' || S.PRENUME AS "STUDENT", G.COD_GRUPA || G.SEMIGRUPA AS "SEMIGRUPA", S.EMAIL , L.ORA, M.DENUMIRE, P.NUME || ' ' || P.PRENUME AS "PROFESOR" FROM ABSENTA A, STUDENT S, LABORATOR L, MATERIE M, PROFESOR P, GRUPA G WHERE A.ID_STUDENT = S.ID_STUDENT AND A.ID_LAB = L.ID_LAB AND L.ID_MATERIE = M.ID_MATERIE AND L.ID_PROF = P.ID_PROF AND S.ID_GRUPA = G.ID_GRUPA`);
        else if (table === "leg_not_null")
            result = await connection.execute(`SELECT * FROM LEGITIMATIE WHERE ID_STUDENT IS NULL`);
        else if (table === "tables")
            result = await connection.execute(`SELECT table_name FROM user_tables`);
        else
            result = await connection.execute(`SELECT * FROM ${table}`);
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

async function exec(command) {
    let connection, pool;
    try {
        pool = OracleDB.getPool();
        connection = await pool.getConnection();
        await connection.execute(command);
    } catch (err) {
        console.log(err)
        return err
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
        select(tableName).then(table => { res.send({ content: table }); });
    else
        res.status(404).send({ message: "Error: Table not selected" });
});

app.post("/input", (req, res) => {
    const table = req.body.table;

    switch (table) {
        case "ABSENTA":
            const {motivata, inregistrare, student, lab} = req.body.content;
            exec(`INSERT INTO ABSENTA (MOTIVATA, DATA_INREGISTRARII, ID_STUDENT, ID_LAB) VALUES ('${motivata}', TO_DATE('${inregistrare}', 'DD/MM/YYYY'), ${student}, ${lab})`).then(err => err ? res.status(500).send(err) : res.send("ok") );
            break
        case "PROFESOR":
            const { nume, prenume, email, lvl} = req.body.content;
            exec(`INSERT INTO PROFESOR ( NUME, PRENUME, EMAIL, ID_NIVEL) VALUES ( '${nume}', '${prenume}', '${email}', ${lvl} )`)
            break
        case "MATERIE":
            const { denumire, descriere, abreviere } = req.body.content;
            exec(`INSERT INTO MATERIE ( DENUMIRE, DESCRIERE_MATERIE, ABREVIERE ) VALUES ('${denumire}', '${descriere}', '${abreviere}')`).then(err => err ? res.status(500).send(err) : res.send("ok") );
            break
        case "GRUPA":
            const { id, cod, an, semigrupa } = req.body.content;
            exec(`INSERT INTO GRUPA ( ID_GRUPA, COD_GRUPA, AN, SEMIGRUPA ) VALUES ( '${id}', ${cod}, ${an}, '${semigrupa}' )`).then(err => err ? res.status(500).send(err) : res.send("ok") );
            break
        case "LEGITIMATIE":
            const { camin, camera } = req.body.content;
            exec(`INSERT INTO LEGITIMATIE ( CAMIN, CAMERA ) VALUES ( '${camin}', '${camera}' )`).then(err => err ? res.status(500).send(err) : res.send("ok") );
            break
        case "STUDENT":
            const { numeS, prenumeS, emailS, specializare, credite, legitimatie, grupa } = req.body.content;
            exec(`INSERT INTO STUDENT (NUME, PRENUME, EMAIL, SPECIALIZARE, CREDITE, ID_LEGITIMATIE, ID_GRUPA) VALUES ('${numeS}', '${prenumeS}', '${emailS}', '${specializare}', ${credite}, ${legitimatie}, '${grupa}')`).then(err => err ? res.status(500).send(err) : res.send("ok") );
            exec("UPDATE LEGITIMATIE L SET ID_STUDENT = (SELECT ID_STUDENT FROM STUDENT S WHERE S.ID_LEGITIMATIE = L.ID_LEGITIMATIE)");
            break
        case "LABORATOR":
            const { sala, ora, zi, materie, profesor, grupaLab} = req.body.content;
            exec(`INSERT INTO LABORATOR ( SALA, ZIUA, ORA, ID_MATERIE, ID_PROF, ID_GRUPA ) VALUES ( '${sala}', '${zi}', '${ora}', ${materie}, ${profesor}, '${grupaLab}' )`).then(err => err ? res.status(500).send(err) : res.send("ok") );
            break
        default:
    }
    exec('UPDATE STUDENT SET NUME = INITCAP(LOWER(NUME)), PRENUME = INITCAP(LOWER(PRENUME))');
    exec('UPDATE PROFESOR SET NUME = INITCAP(LOWER(NUME)), PRENUME = INITCAP(LOWER(PRENUME))');
    exec('UPDATE MATERIE SET DENUMIRE = UPPER(SUBSTR(DENUMIRE, 0, 1)) || LOWER(SUBSTR(DENUMIRE, 2, LENGTH(DENUMIRE)))')
});

app.post("/delete", (req, res) => {
    const id_denumire = req.body.id_denumire;
    const id_val = req.body.id_val;
    const table = req.body.table;

    exec(`DELETE FROM ${table} WHERE ${id_denumire} = ${id_val}`).then(err => err ? res.status(500).send(err) : res.send("ok") );
})

var server = app.listen(8080, async () => { await run() });

process
    .once('SIGTERM', closePoolAndExit)
    .once('SIGINT', closePoolAndExit);

async function closePoolAndExit() {
    console.log("\nNode: Terminating");
    try {
        await OracleDB.getPool().close(10);
        server.close();
        process.exit(0);
    } catch (err) {
        console.error(err.message);
        server.close();
        process.exit(1);
    }
}
