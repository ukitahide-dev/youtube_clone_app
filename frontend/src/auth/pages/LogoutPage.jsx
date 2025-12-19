import { useEffect, useContext } from "react";


import { AuthContext } from "../../context/AuthContext";





export default function LogoutPage() {
    const { logoutUser } = useContext(AuthContext);


    useEffect(() => {
        logoutUser();  // context/AuthContext.jsxのlogoutUser関数

    }, []);


    return null;  // UIはなし
}
