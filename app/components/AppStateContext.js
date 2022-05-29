import React, { useState } from 'react';

const AppStateContext = React.createContext();

export const AppStateProvider = props => {
    const [context, setContext] = useState("");

    return (
        <AppStateContext.Provider value={{ context, setContext }}>
            {props.children}
        </AppStateContext.Provider>
    );
};

export default AppStateContext;