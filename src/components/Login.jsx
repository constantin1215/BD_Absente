import React, { useState } from "react";
import loginStyles from "../modules/Login.module.css";
import axios from "axios";

const Login = (props) => {
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const [failed, setFailed] = useState(null);

    const handleSubmit = e => {
        e.preventDefault();
        const data = {
            user: username,
            pass: password
        }
        axios.post("http://localhost:8080/login", data)
        .then( res => props.setToken(res.data.token))
        .catch( err => setFailed(<span className={loginStyles.error}>{err.response.data.message}</span>) );
    }

    return <div className="box">
        <h1>Login</h1>
        {failed != null ? failed : null}
        <form onSubmit={handleSubmit}>
            <label>
                <p>Username</p>
                <input type="text" name="username" onChange={ e => setUsername(e.target.value)} />
            </label>
            <label>
                <p>Password</p>
                <input type="password" name="password" onChange={ e => setPassword(e.target.value)} />
            </label>
            <div>
                <button className={loginStyles.btn} type="submit">Log in</button>
            </div>
        </form>
    </div>
}

export default Login;