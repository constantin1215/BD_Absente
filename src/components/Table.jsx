import React from "react";
import tableStyles from "../modules/Table.module.css";

const Table = (props) => {
    const { metaData, rows } = props.content;

    return <div className={tableStyles.tableWrap}>
        <div className={tableStyles.tableHead} style={{ gridTemplateColumns: `repeat(${metaData.length}, 1fr)` }} >
            {metaData.map((item, index) => <span key={index}>{item.name}</span>)}
        </div>
        <div className={tableStyles.tableBody} style={{ gridTemplateRows: `repeat(${rows.length}, 1fr)` }} >
            {rows.map((item, index) =>
                <div className={tableStyles.row} style={{ gridTemplateColumns: `repeat(${metaData.length}, 1fr)`, background: index % 2 ? "#eee" : "white" }}
                    key={index}>
                    {item.map((elem, i) => <span style={{ position: "relative", top: "100%", transform: "transateY(-50%)" }} key={i}>{elem}</span>)}
                    <br />
                </div>
            )}
        </div>
    </div>
}

export default Table;