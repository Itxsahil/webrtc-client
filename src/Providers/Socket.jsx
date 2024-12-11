import React, {useContext, useMemo} from "react";

import {io} from "socket.io-client";

const SocketContext = React.createContext(null);

export function useSocket() {
    return useContext(SocketContext);
}

export function SocketProvider({children}) {
    const socket = useMemo(() => io("https://web-rtc-9on3.onrender.com"), []);
    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
}
