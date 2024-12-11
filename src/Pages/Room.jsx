import React, { useCallback, useEffect } from "react";
import { usePeer } from "../Providers/Peer";
import { useSocket } from "../Providers/Socket";
import ReactPlayer from "react-player";

const Room = () => {
  const socket = useSocket();
  const { createOffer, createAnswer, setAnswer, getLocalStream, localStream ,sendStream, remoteStream} =
    usePeer();

  const handelNewUserJoined = useCallback(
    async (data) => {
      const { userName } = data;
      console.log("new user joined : ", userName);
      const offer = await createOffer();
      console.log("This offer is created by me: ", offer);
      socket.emit("send:offer", { to: userName, offer });
    },
    [socket, createOffer]
  );

  const handelANewOffer = useCallback(
    async (data) => {
      const { from, offer } = data;
      console.log(
        "This offer is received from: ",
        from,
        "and the offer is: ",
        offer
      );
      const answer = await createAnswer(offer);
      console.log("This answer is created by me: ", answer);
      socket.emit("send:answer", { to: from, answer });
    },
    [socket, createAnswer]
  );

  const handelANewAnswer = useCallback(
    async (data) => {
      const { from, answer } = data;
      console.log("Answer received:", answer, "from:", from);
      try {
        await setAnswer(answer);
        console.log("Answer set successfully.");
        const stream = await getLocalStream(); // Ensure this works correctly
        console.log("Local stream acquired:", stream); // Check if the stream is valid
        if (stream) {
          sendStream(stream); // Send stream after acquiring it
        } else {
          console.error("Failed to acquire local stream.");
        }
      } catch (error) {
        console.error("Error in handling answer:", error);
      }
    },
    [setAnswer, getLocalStream, sendStream]
  );
  
  

  useEffect(() => {
    socket.on("user:joined", handelNewUserJoined);
    socket.on("you:got:offer", handelANewOffer);
    socket.on("receive:answer", handelANewAnswer);

    return () => {
      socket.off("user:joined", handelNewUserJoined);
      socket.off("you:got:offer", handelANewOffer);
      socket.off("receive:answer", handelANewAnswer);
    };
  }, [socket, handelNewUserJoined, handelANewOffer]);

  return (
    <div>
      <ReactPlayer
        url={localStream}
        width="30vh"
        height="40vh"
        playing={true}
        controls={true}
        muted={true}
      />
      <ReactPlayer
        url={remoteStream}
        width="30vh"
        height="40vh"
        playing={true}
        controls={true}
        // muted={true}
      />
      <button onClick={e => sendStream(localStream)}> send Video</button>
    </div>
  );
};

export default Room;
