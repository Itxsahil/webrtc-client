import React, {useContext, useMemo} from "react";

import {io} from "socket.io-client";

const SocketContext = React.createContext(null);

export function useSocket() {
    return useContext(SocketContext);
}

export function SocketProvider({children}) {
    const socket = useMemo(() => io("http://localhost:3000"), []);
    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
}
