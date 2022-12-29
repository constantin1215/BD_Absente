import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faRefresh, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import selectStyle from "../modules/SelectComponent.module.css";
import InputTable from "./InputTable";
import DeleteTable from "./DeleteTable";
import Table from "./Table";
import Select from "react-select";
import axios from "axios";

const SelectComponent = () => {
    const [choice, setChoice] = useState(null); //{ value: 'ABSENTA' }
    const [tableContent, setTableContent] = useState(null);
    const [options, setOptions] = useState(null);
    const [showInput, setShowInput] = useState(false);
    const [showDelete, setShowDelete] = useState(false)

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

    const handleLoad = () => {
        axios.post("http://localhost:8080/select", {tableName: "tables"})
            .then(res => {
                setOptions([...res.data.content.rows.map(element => element = { value: element[0], label: element[0].charAt(0) + element[0].slice(1).toLowerCase().replace("_", " ") }), { value: "info", label: "Absente detalii" }]);
            })
            .catch(err => console.log(err));
    }

    useEffect(() => {
        handleLoad();
    }, []);

    return <div className={selectStyle.box}>
        <div className={selectStyle.selectWrap}>
            {options ? <>
                {tableContent ? <FontAwesomeIcon className={selectStyle.trash} icon={faTrashCan} size={"xl"} onClick={() => {setShowDelete(!showDelete); setShowInput(false)}} /> : null }
                {tableContent ? <FontAwesomeIcon className={selectStyle.plus} style={showInput ? { transform: "rotate(45deg)", color: "red" } : null} icon={faPlus} size={"2xl"} onClick={() => {setShowInput(!showInput); setShowDelete(false)}} /> : null}
                <h1 className={selectStyle.title}>Vizualizati:</h1>
                <Select isDisabled={showInput || showDelete} styles={{
                    control: (baseStyles, _) => ({
                        ...baseStyles,
                        width: '20rem',
                    }),
                }} options={options} onChange={choice => { setChoice(choice.value); setShowInput(false); }} />
                { choice !== null ? (!showInput && !showDelete) ? 
                <button className={selectStyle.btn} onClick={handleButton} >OK</button> : 
                <FontAwesomeIcon className={selectStyle.refresh} icon={faRefresh} size={"2xl"} onClick={handleButton} /> : null }
            </> : <p>Loading...</p>}
        </div>
        {showDelete ? <DeleteTable table={choice} /> : null}
        {showInput ? <InputTable metaData={tableContent.metaData} table={choice} /> : null}
        {tableContent !== null ? <Table content={tableContent} /> : null}
    </div>
}

export default SelectComponent;