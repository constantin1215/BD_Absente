import React, { useState } from "react";
import MainMenu from "./MainMenu";
import Login from "./Login";
import SelectComponent from "./SelectComponent";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
    {
        path: "/",
        element: <MainMenu />,
    },
    {
        path: "/view",
        element: <SelectComponent />
    },
    {
        path: "/input",
        element: <SelectComponent />
    },
    {
        path: "/transaction",
        element: <SelectComponent />
    },
]);

const App = () => {
    const [token, setToken] = useState();


    const render = () => {
        if (token)
            return <Login setToken={setToken} />
        else
            return <RouterProvider router={router} />
    }


    return <div className="wrap">
        <h1 className="title">Registru absenţe</h1>
        {render()}
    </div>
}

export default App;