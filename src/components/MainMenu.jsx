import React from "react";
import { Link } from "react-router-dom";
import menuStyles from "../modules/MainMenu.module.css";

const MainMenu = () => {
    return <div className="box">
        <Link to="/view">Vizualizare date</Link>
        <Link to="/transaction">Decazare studenti</Link>
    </div>
}

export default MainMenu;