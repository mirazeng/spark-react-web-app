// File Path: src/Spark/Account/Session.tsx

import * as client from "./account-client";
import {useEffect, useState} from "react";
import {setCurrentUser} from "./reducer";
import {useDispatch} from "react-redux";

export default function Session({children}: { children: any }) {
    const [pending, setPending] = useState(true);
    const dispatch = useDispatch();
    const fetchProfile = async () => {
        try {
            const currentUser = await client.profile();
            dispatch(setCurrentUser(currentUser));
        } catch (err: any) {
            console.error("DEBUG: Session.tsx -> fetchProfile -> error", err);
            dispatch(setCurrentUser(null));
        } finally {
            setPending(false);
        }
    };
    useEffect(() => {
        fetchProfile();
    }, []);

    if (!pending) {
        return children;
    } else {
        return <div>Loading...</div>;
    }
}
