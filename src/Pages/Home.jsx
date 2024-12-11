import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../Providers/Socket.jsx";
import { use } from "react";



const Home = () => {
    const [userName, setUsername] = useState('');
    const [roomId, setRoomId] = useState('');
    const socket = useSocket();
    const navigate = useNavigate();

    const joinRoom = useCallback(() => {
        if (userName && roomId) {
            socket.emit("join:room", { userName, roomId });
        }
    }, [userName, roomId, socket]);

    const handelYouJoined = useCallback((data)=>{
        console.log("you:joined", data);  
        const {roomId} = data;
        navigate(`/room/${roomId}`);
    },[navigate]);


    useEffect(() => {
        socket.on("you:joined", handelYouJoined);

        return () => {
            socket.off("you:joined", handelYouJoined);
        };
    },[socket, handelYouJoined]);

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-700 to-black">
            <div className="backdrop-blur-lg bg-white/30 border border-white/20 rounded-lg shadow-lg p-6">
                <form className="flex flex-col">
                    <h2 className="text-2xl font-semibold text-white mb-4 text-center">
                        Join a Room
                    </h2>
                    <input
                        className="border border-gray-300 bg-white/20 rounded-lg p-3 m-2 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        type="text"
                        placeholder="Enter your username"
                        value={userName}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        className="border border-gray-300 bg-white/20 rounded-lg p-3 m-2 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        type="text"
                        placeholder="Enter room ID"
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value)}
                    />
                    <button
                        onClick={(event) => {
                            event.preventDefault();
                            joinRoom();
                        }}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg p-3 m-2 transition-all"
                    >
                        Join Room
                    </button>
                </form>
            </div>
        </div>
    );
};



export default Home;