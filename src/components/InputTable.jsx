import React, { useEffect, useState } from "react";
import inputStyles from "../modules/InputTable.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import Select from "react-select";
import axios from "axios";

const InputTable = (props) => {
    const [reload, setReload] = useState(0);
    const [thumb, setThumb] = useState(false);
    const [gotError, setGotError] = useState(false);

    //LEGITIMATIE
    const [caminAles, setCaminAles] = useState({ value: "T1" });
    const [cameraAleasa, setCameraAleasa] = useState(300);

    //PROFESOR
    const [numeP, setName] = useState('');
    const [prenumeP, setPrenume] = useState('');
    const [emailP, setEmail] = useState('');
    const [nivel, setLevel] = useState('');

    const [nivele, setNivele] = useState();

    //MATERIE

    const [denumire, setDenumire] = useState('');
    const [descriere, setDesc] = useState('');
    const [abreviere, setAbr] = useState('');

    //GRUPA
    const [cod, setCod] = useState(1000);
    const [an, setAn] = useState(1);
    const [semigrupa, setSemigrupa] = useState('');

    //STUDENT

    const [numeS, setNameS] = useState('');
    const [prenumeS, setPrenumeS] = useState('');
    const [emailS, setEmailS] = useState('');
    const [specializare, setSpecial] = useState('');
    const [credit, setCredit] = useState(0);
    const [cazare, setCazare] = useState(null);
    const [grupa, setGrupa] = useState('');

    const [camereLibere, setCamere] = useState('');
    const [grupe, setGrupe] = useState('');

    //LABORATOR

    const [sala, setSala] = useState('');
    const [ora, setOra] = useState('');
    const [zi, setZi] = useState('');
    const [materie, setMaterie] = useState('');
    const [profesor, setProfesor] = useState('');
    const [grupaLab, setGrupaLab] = useState('');

    const [materii, setMaterii] = useState('');
    const [profesori, setProfesori] = useState('');

    //ABSENTA

    const [motivata, setMotivata] = useState('');
    const [inregistrare, setData] = useState('');
    const [student, setStudent] = useState('');
    const [lab, setLab] = useState('');

    const [studenti, setStudenti] = useState('');
    const [laboratoare, setLaboratoare] = useState('');

    const loadLaboratoare = () => {
        axios.post("http://localhost:8080/select", { tableName: "LABORATOR" })
            .then(res => setLaboratoare(res.data.content.rows.map(item => item = { value: item[0], label: materii[item[4] - 1].label + " " + item[3] + " " + item[1] })))
            .catch(err => console.log(err));
    }

    const loadType1 = (table, setter, index1) => {
        axios.post("http://localhost:8080/select", { tableName: table })
            .then(res => setter(res.data.content.rows.map(item => item = { value: item[0], label: item[index1] })))
            .catch(err => console.log(err));
    }

    const loadType2 = (table, setter, index1, index2) => {
        axios.post("http://localhost:8080/select", { tableName: table })
            .then(res => setter(res.data.content.rows.map(item => item = { value: item[0], label: item[index1] + " " + item[index2] })))
            .catch(err => console.log(err));
    }

    useEffect(() => {
        loadType1("MATERIE", setMaterii, 1);
        loadType1("GRUPA", setGrupe, 0);
        loadType1("NIVEL_PROFESOR", setNivele, 1);
        loadType2("leg_not_null", setCamere, 1, 2);
        loadType2("PROFESOR", setProfesori, 1, 2);
        loadType2("STUDENT", setStudenti, 1, 2);
    }, [reload]);

    useEffect(() => {
        loadLaboratoare();
    }, [materii])

    const renderCustomInput = (type) => {
        switch (type) {
            case "ABSENTA":
                let today = new Date();
                const dd = String(today.getDate()).padStart(2, '0');
                const mm = String(today.getMonth() + 1).padStart(2, '0');
                const yyyy = today.getFullYear();

                today = dd + '/' + mm + '/' + yyyy;
                const yesterday = (dd - 1) + '/' + mm + '/' + yyyy;

                const date = [{ label: "Astazi", value: today }, { label: "Ieri", value: yesterday }];
                const status = [{ label: "DA", value: "DA" }, { label: "NU", value: "NU" }]

                return <>
                    <div className={inputStyles.pair}>
                        <span>{props.metaData[1].name}</span>
                        <Select options={status} onChange={choice => setMotivata(choice)} />
                    </div>
                    <div className={inputStyles.pair}>
                        <span>{props.metaData[2].name}</span>
                        <Select options={date} onChange={choice => setData(choice)} />
                    </div>
                    <div className={inputStyles.pair}>
                        <span>STUDENT</span>
                        <Select options={studenti} onChange={choice => setStudent(choice)} />
                    </div>
                    <div className={inputStyles.pair}>
                        <span>LABORATOR</span>
                        <Select options={laboratoare} onChange={choice => setLab(choice)} />
                    </div>
                </>
            case "PROFESOR":
                return <>
                    <div className={inputStyles.pair}>
                        <span>{props.metaData[1].name}</span>
                        <input required={true} name={props.metaData[1].name} type="text" onChange={e => setName(e.target.value)} />
                    </div>
                    <div className={inputStyles.pair}>
                        <span>{props.metaData[2].name}</span>
                        <input required={true} name={props.metaData[2].name} type="text" onChange={e => setPrenume(e.target.value)} />
                    </div>
                    <div className={inputStyles.pair}>
                        <span>{props.metaData[3].name}</span>
                        <input name={props.metaData[3].name} type="text" onChange={e => setEmail(e.target.value)} />
                    </div>
                    <div className={inputStyles.pair}>
                        <span>{props.metaData[4].name}</span>
                        <Select options={nivele} onChange={e => setLevel(e)} />
                    </div>
                </>
            case "MATERIE":
                return <>
                    <div className={inputStyles.pair}>
                        <span>{props.metaData[1].name}</span>
                        <input required={true} name={props.metaData[1].name} type="text" onChange={e => setDenumire(e.target.value)} />
                    </div>
                    <div className={inputStyles.pair}>
                        <span>{props.metaData[2].name}</span>
                        <input required={true} name={props.metaData[2].name} type="text" onChange={e => setDesc(e.target.value)} />
                    </div>
                    <div className={inputStyles.pair}>
                        <span>{props.metaData[3].name}</span>
                        <input name={props.metaData[3].name} type="text" onChange={e => setAbr(e.target.value)} />
                    </div>
                </>
            case "GRUPA":
                const ani = Array.from({ length: 4 }, (_, i) => i = { value: i + 1, label: i + 1 });
                const coduri = Array.from({ length: 99 }, (_, i) => i = { value: 1000 + i + 1, label: 1000 + i + 1 });
                const semigrupe = [{ value: 'A', label: 'A' }, { value: 'B', label: 'B' }];

                return <>
                    <div className={inputStyles.pair}>
                        <span>{props.metaData[1].name}</span>
                        <Select options={coduri} onChange={choice => setCod(choice)} />
                    </div>
                    <div className={inputStyles.pair}>
                        <span>{props.metaData[2].name}</span>
                        <Select options={ani} onChange={choice => setAn(choice)} />
                    </div>
                    <div className={inputStyles.pair}>
                        <span>{props.metaData[3].name}</span>
                        <Select options={semigrupe} onChange={choice => setSemigrupa(choice)} />
                    </div>
                </>
            case "LEGITIMATIE":
                const camine = Array.from({ length: 30 }, (_, i) => i = { value: "T" + (1 + i), label: "T" + (1 + i) })
                const camere = Array.from({ length: 300 }, (_, i) => i = { value: i + 1, label: i + 1 })
                const moduleA = Array.from({ length: 60 }, (_, i) => i + 1 + "A")
                const moduleB = Array.from({ length: 60 }, (_, i) => i + 1 + "B")
                const module = moduleA.map((e, i) => [{ value: e, label: e }, { value: moduleB[i], label: moduleB[i] }]).flatMap(e => e);

                return <>
                    <div className={inputStyles.pair}>
                        <span>{props.metaData[1].name}</span>
                        <Select options={camine} onChange={choice => setCaminAles(choice)} />
                    </div>
                    <div className={inputStyles.pair}>
                        <span>{props.metaData[2].name}</span>
                        <Select options={parseInt(caminAles.value.slice(1)) < 9 ? camere : module} onChange={choice => setCameraAleasa(choice)} />
                    </div>
                    <div className={inputStyles.pair}>
                        <span>STUDENT</span>
                        <p>Acest camp este completat la momentul cazarii in campus</p>
                    </div>
                </>
            case "STUDENT":
                const specializari = [{ value: 'CTI', label: 'CTI' }, { value: 'IS', label: 'IS' }];
                const credite = Array.from({ length: 241 }, (_, i) => i = { value: i, label: i });

                return <>
                    <div className={inputStyles.pair}>
                        <span>{props.metaData[1].name}</span>
                        <input required={true} name={props.metaData[1].name} type="text" onChange={e => setNameS(e.target.value)} />
                    </div>
                    <div className={inputStyles.pair}>
                        <span>{props.metaData[2].name}</span>
                        <input required={true} name={props.metaData[2].name} type="text" onChange={e => setPrenumeS(e.target.value)} />
                    </div>
                    <div className={inputStyles.pair}>
                        <span>{props.metaData[3].name}</span>
                        <input name={props.metaData[3].name} type="text" onChange={e => setEmailS(e.target.value)} />
                    </div>
                    <div className={inputStyles.pair}>
                        <span>{props.metaData[4].name}</span>
                        <Select options={specializari} onChange={choice => setSpecial(choice)} />
                    </div>
                    <div className={inputStyles.pair}>
                        <span>{props.metaData[5].name}</span>
                        <Select options={credite} onChange={choice => setCredit(choice)} />
                    </div>
                    <div className={inputStyles.pair}>
                        <span>CAMIN CAZAT</span>
                        <Select options={camereLibere} onChange={choice => setCazare(choice)} />
                    </div>
                    <div className={inputStyles.pair}>
                        <span>GRUPA</span>
                        <Select options={grupe} onChange={choice => setGrupa(choice)} />
                    </div>
                </>
            case "LABORATOR":
                const sourceOre = ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00"];
                const sourceZile = ["Luni", "Marti", "Miercuri", "Joi", "Vineri"]
                const sourceSali = ["AC-01", "AC-02", "AC-03", "C4-2", "C0-1", "C0-2", "C0-3", "C0-4", "C2-9", "C2-10", "C2-11"]

                const ore = sourceOre.map(item => item = { label: item, value: item })
                const zile = sourceZile.map(item => item = { label: item, value: item })
                const sali = sourceSali.map(item => item = { label: item, value: item })


                return <>
                    <div className={inputStyles.pair}>
                        <span>{props.metaData[1].name}</span>
                        <Select options={sali} onChange={choice => setSala(choice)} />
                    </div>
                    <div className={inputStyles.pair}>
                        <span>{props.metaData[2].name}</span>
                        <Select options={zile} onChange={choice => setZi(choice)} />
                    </div>
                    <div className={inputStyles.pair}>
                        <span>{props.metaData[3].name}</span>
                        <Select options={ore} onChange={choice => setOra(choice)} />
                    </div>
                    <div className={inputStyles.pair}>
                        <span>MATERIE</span>
                        <Select options={materii} onChange={choice => setMaterie(choice)} />
                    </div>
                    <div className={inputStyles.pair}>
                        <span>PROFESOR</span>
                        <Select options={profesori} onChange={choice => setProfesor(choice)} />
                    </div>
                    <div className={inputStyles.pair}>
                        <span>GRUPA</span>
                        <Select options={grupe} onChange={choice => setGrupaLab(choice)} />
                    </div>
                </>
            default:
                return <div style={{ gridColumnStart: props.metaData.length / 2 - 1, gridColumnEnd: props.metaData.length / 2 + 2, justifySelf: "center" }}><p>In aceasta tabela nu se pot adauga date</p></div>;
        }
    }

    const handleSubmit = e => {
        e.preventDefault();

        let data;

        switch (props.table) {
            case "ABSENTA":
                data = {
                    motivata: motivata.value,
                    inregistrare: inregistrare.value,
                    student: student.value,
                    lab: lab.value
                }
                console.log(data)
                break
            case "PROFESOR":
                data = {
                    nume: numeP.charAt(0).toUpperCase() + numeP.slice(1).toLocaleLowerCase(),
                    prenume: prenumeP.charAt(0).toUpperCase() + prenumeP.slice(1).toLocaleLowerCase(),
                    email: emailP,
                    lvl: nivel.value
                }
                break
            case "MATERIE":
                data = {
                    denumire: denumire,
                    descriere: descriere,
                    abreviere: abreviere
                }
                break
            case "GRUPA":
                data = {
                    id: cod.value + an.value * 100 + semigrupa.value,
                    cod: cod.value,
                    an: an.value,
                    semigrupa: semigrupa.value
                }
                break
            case "LEGITIMATIE":
                data = {
                    camin: caminAles.value,
                    camera: cameraAleasa.value
                }
                break
            case "STUDENT":
                data = {
                    numeS: numeS.charAt(0).toUpperCase() + numeS.slice(1).toLocaleLowerCase(),
                    prenumeS: prenumeS.charAt(0).toUpperCase() + prenumeS.slice(1).toLocaleLowerCase(),
                    emailS: emailS,
                    specializare: specializare.value,
                    credite: credit.value,
                    legitimatie: cazare === null ? null : cazare.value,
                    grupa: grupa.value
                }
                break
            case "LABORATOR":
                data = {
                    sala: sala.value,
                    ora: ora.value,
                    zi: zi.value,
                    materie: materie.value,
                    profesor: profesor.value,
                    grupaLab: grupaLab.value
                }
                break
            default:
                data = 0;
        }

        axios.post("http://localhost:8080/input", { content: data, table: props.table })
            .then(_ => setGotError(false))
            .catch(_ => setGotError(true));

        setReload(reload + 1);
        setThumb(true);
        setTimeout(() => { setThumb(false); setGotError(false); }, 2000);
    }

    return <div className={inputStyles.inputWrap}>
        <form onSubmit={handleSubmit}>
            <div className={inputStyles.input} style={{ gridTemplateColumns: `repeat(${props.metaData.length - 1}, 1fr)` }} >
                {renderCustomInput(props.table)}
            </div>
            <div style={{ textAlign: "center", margin: "1rem" }}>
                <button type="submit" disabled={props.table === "NIVEL_PROFESOR" ? true : false} className={inputStyles.btn}>Add entry</button>
            </div>
            {thumb ? <div style={{ textAlign: "center" }}>
                <FontAwesomeIcon style={gotError ? { color: "red" } : { color: "green" }} icon={!gotError ? faThumbsUp : faThumbsDown} size={"3x"} />
                <p style={gotError ? { color: "red" } : { color: "green" }}>{gotError ? "Eroare" : "OK!"}</p>
            </div> : null}
        </form>
    </div>
}

export default InputTable;