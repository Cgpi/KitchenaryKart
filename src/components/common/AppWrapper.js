import React from "react";
import useValidateUser from "../../hooks/useValidateUser";

const AppWrapper = ({ children }) => {
    useValidateUser();
    return children ?? null;
};

export default AppWrapper;
