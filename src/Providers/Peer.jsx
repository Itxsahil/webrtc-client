import { useContext, useMemo, createContext, useState, useCallback, useEffect } from "react";

const PeerContext = createContext(null);

export function usePeer() {
  return useContext(PeerContext);
}





export const PeerProvider = (props) => {

  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);



  const peer = useMemo(
    () =>
      new RTCPeerConnection({
        iceServers: [
          {
            urls: [
              "stun:stun.l.google.com:19302",
              "stun:global.stun.twilio.com:3478",
            ],
          },
        ],
      }),
    []
  );


  
  const getLocalStream = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      console.log("Successfully acquired local stream:", stream); // Debugging log
      setLocalStream(stream); // Store the stream in state
      return stream; // Return the stream
    } catch (error) {
      console.error("Error acquiring local stream:", error);
      return null; // Return null if there is an error
    }
  }, []);
  
  

  const inCommingStream = useCallback((event) => {
    const stream = event.streams[0];
    setRemoteStream(stream);
  },[]); 
  
  const sendStream = useCallback(
    async (stream) => {
      if (!stream) {
        console.error("No stream to send.");
        return;
      }
  
      const tracks = stream.getTracks();
      console.log("Adding tracks to peer:", tracks); // Debugging log
      for (const track of tracks) {
        peer.addTrack(track, stream);
      }
    },
    [peer]
  );
  
  





  useEffect(() => {
    peer.addEventListener("track", inCommingStream);

    return () => {
      peer.removeEventListener("track", inCommingStream);
    }
  },[peer, inCommingStream])


  const createOffer = async () => {
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    return offer;
  };

  const setAnswer = async (answer) => {
    await peer.setRemoteDescription(new RTCSessionDescription(answer));
  };

  const createAnswer = async(offer) => {
    await peer.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);
      return answer;
  }

  return <PeerContext.Provider 
    value={{peer, createOffer, createAnswer, setAnswer , localStream, getLocalStream,sendStream, remoteStream}}>
    {props.children}
    </PeerContext.Provider>;
};
