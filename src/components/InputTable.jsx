import React, { useEffect, useState } from "react";
import inputStyles from "../modules/InputTable.module.css";
import Select from "react-select";
import axios from "axios";

const InputTable = (props) => {
    //LEGITIMATIE
    const [caminAles, setCaminAles] = useState({ value: "T1" });
    const [cameraAleasa, setCameraAleasa] = useState(300);

    //PROFESOR
    const [numeP, setName] = useState('');
    const [prenumeP, setPrenume] = useState('');
    const [emailP, setEmail] = useState('');
    const [nivel, setLevel] = useState('');
    const [nivele, setNivele] = useState();

    const loadNivele = () => {
        axios.post("http://localhost:8080/select", { tableName: "NIVEL_PROFESOR" })
            .then(res => setNivele(res.data.content.rows.map(item => item = { value: item[0], label: item[1] })))
            .catch(err => console.log(err));
    }

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
    const [cazare, setCazare] = useState('');
    const [grupa, setGrupa] = useState('');

    const [camereLibere, setCamere] = useState('');

    const loadCamere = () => {
        axios.post("http://localhost:8080/select", { tableName: "leg_not_null" })
            .then(res => setCamere(res.data.content.rows.map(item => item = { value: item[0], label: item[1] + " " + item[2] })))
            .catch(err => console.log(err));
    }

    const [grupe, setGrupe] = useState('');

    const loadGrupe = () => {
        axios.post("http://localhost:8080/select", { tableName: "GRUPA" })
            .then(res => setGrupe(res.data.content.rows.map(item => item = { value: item[0], label: item[0] })))
            .catch(err => console.log(err));
    }

    //LABORATOR

    const [sala, setSala] = useState('');
    const [ora, setOra] = useState('');
    const [zi, setZi] = useState('');
    const [materie, setMaterie] = useState('');
    const [profesor, setProfesor] = useState('');
    const [grupaLab, setGrupaLab] = useState('');

    const [materii, setMaterii] = useState('');
    const [profesori, setProfesori] = useState('');


    const loadMaterii = () => {
        axios.post("http://localhost:8080/select", { tableName: "MATERIE" })
            .then(res => setMaterii(res.data.content.rows.map(item => item = { value: item[0], label: item[1] })))
            .catch(err => console.log(err));
    }

    const loadProfesori = () => {
        axios.post("http://localhost:8080/select", { tableName: "PROFESOR" })
            .then(res => setProfesori(res.data.content.rows.map(item => item = { value: item[0], label: item[1] + " " + item[2] })))
            .catch(err => console.log(err));
    }

    //ABSENTA

    const [motivata, setMotivata] = useState('');
    const [inregistrare, setData] = useState('');
    const [student, setStudent] = useState('');
    const [lab, setLab] = useState('');

    const [studenti, setStudenti] = useState('');
    const [laboratoare, setLaboratoare] = useState('');

    const loadStudenti = () => {
        axios.post("http://localhost:8080/select", { tableName: "STUDENT" })
            .then(res => setStudenti(res.data.content.rows.map(item => item = { value: item[0], label: item[1] + " " + item[2] })))
            .catch(err => console.log(err));
    }

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

    useEffect(() => {
        loadNivele();
        loadGrupe();
        loadCamere();
        
        //loadType1("MATERIE", setMaterii, 1);
        loadProfesori();
        loadStudenti();
        loadLaboratoare();
        
        loadMaterii();
    }, []);

    const renderCustomInput = (type) => {
        switch (type) {
            case "ABSENTA":
                let today = new Date();
                const dd = String(today.getDate()).padStart(2, '0');
                const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                const yyyy = today.getFullYear();

                today = mm + '/' + dd + '/' + yyyy;
                const yesterday = (mm - 1) + '/' + dd + '/' + yyyy;

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
    }

    return <div className={inputStyles.inputWrap}>
        <form onSubmit={handleSubmit}>
            <div className={inputStyles.input} style={{ gridTemplateColumns: `repeat(${props.metaData.length - 1}, 1fr)` }} >
                {renderCustomInput(props.table)}
            </div>
            <div style={{ textAlign: "center" }}>
                <button type="submit" disabled={props.table === "NIVEL_PROFESOR" ? true : false} className={inputStyles.btn} onClick={() => console.log("click")}>Add entry</button>
            </div>
        </form>
    </div>
}

export default InputTable;