import React, { Component } from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import Identicon from "react-identicons";
import {
  Navbar,
  NavbarBrand,
  UncontrolledTooltip,
  NavItem,
  NavLink,
} from "reactstrap";
import Editor from "react-medium-editor";
import "medium-editor/dist/css/medium-editor.css";
import "medium-editor/dist/css/themes/default.css";
import "./App.css";
import SampleVideo from "./sample-mp4-file.mp4";
import firebase from "./firebase";

const client = new W3CWebSocket("ws://127.0.0.1:8000");
const contentDefaultMessage = "Start writing your document here";
const contentDefaultMessageVideo = "Enter Video TimeStamp";

class App extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {
      currentUsers: [],
      userActivity: [],
      username: localStorage.getItem("user") || "",
      value: "",
      time: "",
      videoTimeStamp: "",
      video: SampleVideo,
      videoName: "sample-mp4-file",
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleVideoChange = this.handleVideoChange.bind(this);
  }
  handleSubmit(event) {
    if (
      this.state.value &&
      this.state.time &&
      this.state.time <= parseInt(this.myRef.current.duration)
    ) {
      const db = firebase.firestore().collection("VideoCaptions");

      db.where("VideoName", "==", this.state.videoName)
        .where("StartTime", "==", Number(this.state.time))
        .get()
        .then((querySnapshot) => {
          const result = querySnapshot.docs.map((doc) => doc.data());
          const docId = querySnapshot.docs.map((doc) => doc.id)[0];

          if (result.length == 0) {
            db.add({
              Caption: this.state.value,
              StartTime: Number(this.state.time),
              EndTime: Number(this.state.time) + 3,
              VideoName: this.state.videoName,
            });
            this.setState({ value: null });
            this.setState({ time: "" });
          } else {
            db.doc(docId).update({
              Caption: this.state.value,
              EndTime: Number(this.state.time) + 3,
            });
            this.setState({ value: null });
            this.setState({ time: "" });
          }
        });
    }

    event.preventDefault();
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleVideoChange(event) {
    this.setState({ time: event.target.value });
  }

  logInUser = () => {
    const username = this.username.value;
    localStorage.setItem("user", username);
    if (username.trim()) {
      const data = {
        username,
      };
      this.setState(
        {
          ...data,
        },
        () => {
          client.send(
            JSON.stringify({
              ...data,
              type: "userevent",
            })
          );
        }
      );
    }
  };

  loadtracks = async () => {
    var hello = this.myRef.current.addTextTrack("subtitles", "English", "en");
    hello.mode = "showing";

    const db = firebase.firestore();
    const data = await db.collection("VideoCaptions");

    const snapshot = await data.get();
    snapshot.forEach((doc) => {
      hello.addCue(
        new VTTCue(doc.data().StartTime, doc.data().EndTime, doc.data().Caption)
      );
    });
  };

  onEditorStateChange = (text) => {
    this.setState({ value: text });
  };

  logOut = () => {
    localStorage.removeItem("user");
    window.location.reload(false);
  };
  PlayAgain = () => {
    window.location.reload(false);
  };

  componentWillMount() {
    client.onopen = () => {
      console.log("WebSocket Client Connected");
    };
    client.onmessage = (message) => {
      const dataFromServer = JSON.parse(message.data);
      const stateToChange = {};
      if (dataFromServer.type === "userevent") {
        stateToChange.currentUsers = Object.values(dataFromServer.data.users);
      } else if (dataFromServer.type === "contentchange") {
        stateToChange.text =
          dataFromServer.data.editorContent || contentDefaultMessage;
      } else if (dataFromServer.type === "videotimechange") {
        stateToChange.videoTimeStamp =
          dataFromServer.data.VideoTimeStamp || contentDefaultMessageVideo;
      }
      stateToChange.userActivity = dataFromServer.data.userActivity;
      this.setState({
        ...stateToChange,
      });
    };
  }

  showLoginSection = () => (
    <div className="account">
      <div className="account__wrapper">
        <div className="account__card">
          <div className="account__profile">
            <Identicon
              className="account__avatar"
              size={64}
              string="randomness"
            />
            <p className="account__name">Hello, user!</p>
            <p className="account__sub">Join the Session</p>
          </div>
          <input
            name="username"
            ref={(input) => {
              this.username = input;
            }}
            className="form-control"
          />
          <button
            type="button"
            onClick={() => this.logInUser()}
            className="btn btn-primary account__btn"
          >
            Join
          </button>
        </div>
      </div>
    </div>
  );

  showEditorSection = () => (
    <div className="main-content">
      <div className="document-holder">
        <div className="currentusers">
          {this.state.currentUsers.map((user) => (
            <React.Fragment>
              <span id={user.username} className="userInfo" key={user.username}>
                <Identicon
                  className="account__avatar"
                  style={{ backgroundColor: user.randomcolor }}
                  size={40}
                  string={user.username}
                />
              </span>
              <UncontrolledTooltip placement="top" target={user.username}>
                {user.username}
              </UncontrolledTooltip>
            </React.Fragment>
          ))}
        </div>
        <video
          className="sample-video"
          controls
          autoPlay={true}
          ref={this.myRef}
          onLoadedMetadata={this.loadtracks}
        >
          <source src={this.state.video} type="video/mp4" />
        </video>
        <br />

        <form onSubmit={this.handleSubmit}>
          <label>
            Enter video Time (in sec):
            <input
              type="text"
              value={this.state.time}
              className="form-control"
              onChange={this.handleVideoChange}
            />
          </label>
          <label>
            Enter Text:
            <Editor
              className="form-control"
              text={this.state.value}
              onChange={this.onEditorStateChange}
            />
          </label>

          <input
            type="submit"
            className="btn btn-primary account__btn"
            value="Submit"
          />
          <br />
          <br />
          <input
            className="btn btn-primary account__btn"
            onClick={this.PlayAgain}
            value="Play Again"
          />
        </form>
      </div>
      <div className="history-holder">
        <ul>
          {this.state.userActivity.map((activity, index) => (
            <li key={`activity-${index}`}>{activity}</li>
          ))}
        </ul>
      </div>
    </div>
  );

  render() {
    const { username } = this.state;
    return (
      <React.Fragment>
        <Navbar color="light" light>
          <NavbarBrand href="/">V i r t i</NavbarBrand>
          {username && (
            <NavItem>
              <span className="logout" onClick={this.logOut}>
                Logout
              </span>
            </NavItem>
          )}
        </Navbar>
        <div className="container-fluid">
          {username ? this.showEditorSection() : this.showLoginSection()}
        </div>
      </React.Fragment>
    );
  }
}

export default App;
