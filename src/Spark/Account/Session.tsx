import * as client from "./client";
import {useEffect, useState} from "react";
import {setCurrentUser} from "./reducer";
import {useDispatch} from "react-redux";

export default function Session({children}: { children: any }) {
    const [pending, setPending] = useState(true);
    const dispatch = useDispatch();
    const fetchProfile = async () => {
        try {
            const currentUser = await client.profile();
            console.log("DEBUG: Session.tsx -> fetchProfile -> currentUser", currentUser);
            dispatch(setCurrentUser(currentUser));
        } catch (err: any) {
            console.error("DEBUG: Session.tsx -> fetchProfile -> currentUser -> err", err);
        }
        setPending(false);
    };
    useEffect(() => {
        fetchProfile();
    }, []);
    if (!pending) {
        return children;
    }
}
