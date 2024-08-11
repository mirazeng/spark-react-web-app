// File path: src/Spark/index.tsx

import {Route, Routes, Navigate} from "react-router-dom";
import SparkLanding from "./Landing";
import Account from "./Account";
import Signin from "./Account/Signin";
import {Provider} from "react-redux";
import store from "./store";
import Signup from "./Account/Signup";

export default function Spark() {
    return (
        <Provider store={store}>
            <div id="wd-spark">
                <Routes>
                    <Route path="/" element={<SparkLanding/>}/>
                    <Route path="Home" element={<SparkLanding/>}/>
                    <Route path="Account/*" element={<Account/>}/>
                    <Route path="*" element={<Navigate to="Home"/>}/>

                    {/*<Route path="Profile" element={<Profile/>}/>
                    <Route path="/Account/Signin" element={<Signin/>}/>
                    <Route path="/Account/Signup" element={<Signup/>}/>*/}
                </Routes>
            </div>
        </Provider>
    );
}