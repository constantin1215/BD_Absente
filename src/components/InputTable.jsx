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

    console.log(denumire, descriere, abreviere)


    useEffect(() => {
        loadNivele();
    }, []);

    const renderCustomInput = (type) => {
        switch (type) {
            case "ABSENTA":
                return (props.metaData.slice(1).map((item, index) =>
                    <div className={inputStyles.pair}>
                        <span key={index}>{item.name}</span>
                        <input name={item.name} type="text" />
                    </div>));
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
                return <>
                    
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
                        <input name={props.metaData[3].name} type="text" /> {/* TO DO !!!!!!!!!!!!!!!!!!!!!!!!!!! */}
                    </div>
                </>
            default:
                return <p>In aceasta tabela nu se pot adauga date</p>;
        }
    }

    return <div className={inputStyles.inputWrap}>
        <form>
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