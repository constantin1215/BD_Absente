import React, { useEffect, useState } from "react";
import deleteStyles from "../modules/DeleteTable.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faExclamation } from '@fortawesome/free-solid-svg-icons';
import Select from "react-select";
import axios from "axios";

const DeleteTable = (props) => {
    const [lista, setLista] = useState([{ value: "loading", label: "loading" }]);
    const [choice, setChoice] = useState(null);
    const [thumb, setThumb] = useState(false);
    const [gotError, setGotError] = useState(false);
    const [reload, setReload] = useState(0);

    const loadList = () => {
        axios.post("http://localhost:8080/select", { tableName: props.table })
            .then(response => setLista(response.data.content.rows.map(row => row.map((elem, i) => "#" + response.data.content.metaData[i].name + ": " + elem)).map(arr => arr.join(" ")).map(elem => elem = { value: elem, label: elem })))
            .catch(err => console.log(err))
    }

    const deletos = () => {
        const id_denumire = choice.value.split(" ")[0].slice(1, -1);
        const id_val = choice.value.split(" ")[1];

        axios.post("http://localhost:8080/delete", { id_denumire: id_denumire, id_val: id_val, table: props.table })
        .then(_ => setGotError(false))
        .catch(_ => setGotError(true))

        setThumb(true);
        setTimeout(() => {setThumb(false); setGotError(false)} , 4000);
        setReload(reload + 1);
    }

    useEffect(() => {
        loadList();
    }, [])

    useEffect(() => {
        loadList();
    }, [reload])

    return <div className={deleteStyles.deleteWrap}>
        <h3>Alege ce să ştergi:</h3>
        <Select options={lista} onChange={value => setChoice(value)} />
        <button disabled={choice === null} className={deleteStyles.btn} onClick={deletos}>STERGE</button>
        {thumb ? <div style={{ textAlign: "center" }}>
                <FontAwesomeIcon style={gotError ? { color: "red" } : { color: "green" }} icon={!gotError ? faThumbsUp : faExclamation} size={"3x"} />
                <p style={gotError ? { color: "red" } : { color: "green" }}>{gotError ? "Acest entry există în altă tabelă" : "OK!"}</p>
            </div> : null}
    </div>
}

export default DeleteTable;