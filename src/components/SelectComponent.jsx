import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import selectStyle from "../modules/SelectComponent.module.css";
import InputTable from "./InputTable";
import Table from "./Table";
import Select from "react-select";
import axios from "axios";

const SelectComponent = () => {
    const [choice, setChoice] = useState({value: 'ABSENTA'});
    const [tableContent, setTableContent] = useState(null);
    const [options, setOptions] = useState(null);
    const [showInput, setShowInput] = useState(false);

    const handleButton = e => {
        e.preventDefault();
        const data = {
            tableName: choice
        }
        axios.post("http://localhost:8080/select", data)
            .then(res => setTableContent(res.data.content))
            .catch(err => console.log(err));

        setShowInput(false);
    }

    const handleLoad = e => {
        axios.get("http://localhost:8080/table")
            .then(res => {
                setOptions([...res.data.content.map(element => element = { value: element[0], label: element[0].charAt(0) + element[0].slice(1).toLowerCase().replace("_", " ") }), { value: "info", label: "Absente detalii" }]);
            })
            .catch(err => console.log(err));
    }

    useEffect(() => {
        handleLoad();
    }, []);

    return <div className={selectStyle.box}>
        <div className={selectStyle.selectWrap}>
            {options ? <>
                {tableContent ? <FontAwesomeIcon className={selectStyle.plus} icon={faPlus} size={"xl"} onClick={() => setShowInput(!showInput)} /> : null}
                <h1 className={selectStyle.title}>Vizualizati:</h1>
                <Select options={options} onChange={choice => {setChoice(choice.value); setShowInput(false);}} />
                <button className={selectStyle.btn} onClick={handleButton} >OK</button>
            </> : <p>Loading...</p>}

        </div>
        {showInput ? <InputTable metaData={tableContent.metaData} table={choice} /> : null}
        {tableContent !== null ? <Table content={tableContent} /> : null}
    </div>
}

export default SelectComponent;