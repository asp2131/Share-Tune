import React, { useEffect, useState } from "react";
import { useSpring, animated } from "react-spring";
import { UploadButton } from "react-uploader";
import socketIO from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import { SearchRounded } from "@material-ui/icons";
import axios from 'axios';

const socket = socketIO.connect('http://localhost:8080');

function App({ uploader, handleChange, list }) {
    return (
        <div>
            <Radio uploader={uploader} handleChange={handleChange} list={list} />
        </div>
    );
}

const Radio = ({ uploader, handleChange, list }) => {
    const [isToggled, setToggle] = useState(false);
    const menubg = useSpring({ background: isToggled ? "#6ce2ff" : "#ebebeb" });
    const { y } = useSpring({
        y: isToggled ? 180 : 0
    });
    const menuAppear = useSpring({
        transform: isToggled ? "translate3D(0,0,0)" : "translate3D(0,-40px,0)",
        opacity: isToggled ? 1 : 0
    });

    return (
        <div style={{ position: "relative", width: "300px", margin: "0 auto" }}>
            <animated.button
                style={menubg}
                className="radiowrapper"
                onClick={() => setToggle(!isToggled)}
            >
                <div className="radio">
                    <p>Menu</p>
                    <animated.p
                        style={{
                            transform: y.to(y => `rotateX(${y}deg)`)
                        }}
                    >
                        ▼
                    </animated.p>
                </div>
            </animated.button>
            <animated.div style={menuAppear}>
                {isToggled ? <RadioContent uploader={uploader} handleChange={handleChange} list={list} setToggle={setToggle} /> : null}
            </animated.div>
        </div>
    );
};

const RadioContent = ({ uploader, handleChange, list, setToggle }) => {
    const [createdSession, setSession] = useState(null);
    const [room, setRoom] = useState(null);
    const [joinedRoom, setJoinedRoom] = useState("");
    const [toggleJoin, setToggleJoin] = useState(false);

    useEffect(() => {
        socket.on("createdSession", (arg) => {
            console.log(arg); // join code
            // setRoom(arg)
            // for(let i of arg){
            //     console.log(i === createdSession); // join code
            // }
        });
    }, [createdSession])

    const createRoom = () => {
        const room = {}
        room.id = uuidv4();
        room.list = list; 
        setSession(room)
        socket.emit("create", room);
    }


    const joinRoom = async (room) => {
        // console.log(room)
        setSession(room)
        socket.emit("join", room);   
        // setJoinedRoom(res.data)
    }

    const toggleJoinRoom = () => {
        setToggleJoin(!toggleJoin);
    }

    const _handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            joinRoom(joinedRoom)
        }
    }

    return (
        <div className="radiocontent">
            {/* <button onClick={() => setToggle(false)} alt="Home">
                close
            </button> */}
            <a alt="About">
                <UploadButton uploader={uploader}
                    options={{ multi: true }}
                    onComplete={files => {
                        handleChange(files[0].fileUrl, files)
                    }}>
                    {({ onClick }) =>
                        <button style={{ color: "black" }} onClick={onClick}>
                            Upload
                        </button>
                    }
                </UploadButton>
                {/* <span onClick={() => console.log("create room")}>
                    Upload
                </span> */}
            </a>
            {/* <a alt="Register">
                <span onClick={createRoom}>
                    {createdSession ? createdSession : "Create Room"}
                </span>
            </a>
            <a alt="Download">
                {toggleJoin ?
                    <div>
                        <input onKeyDown={_handleKeyDown} onChange={(e) => { setJoinedRoom(e.target.value) }}></input>
                        <SearchRounded onClick={() => joinRoom(joinedRoom)} style={{ paddingLeft: 5 }} />
                    </div> :
                    <span onClick={toggleJoinRoom}>
                        Join Room
                    </span>}
            </a>
            <a alt="Login">
                Login
            </a> */}
        </div>
    );
};

export default App;