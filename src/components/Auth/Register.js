import React from "react";
import firebase from "../../firebase";
import { auth, provider } from "../../firebase";
import {
  Grid,
  Form,
  Segment,
  Button,
  Header,
  Message,
  Icon,
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import md5 from "md5";
import cvrrlogo from "./cvrr_logo.jpg";

class Register extends React.Component {
  state = {
    username: "",
    email: "",
    password: "",
    passwordConfirmation: "",
    errors: [],
    loading: false,
    usersRef: firebase.database().ref("users"),
  };

  isFormValid = () => {
    let errors = [];
    let error;

    if (this.isFormEmpty(this.state)) {
      error = { message: "Fill in all fields" };
      this.setState({ errors: errors.concat(error) });
      return false;
    } else if (!this.isPasswordValid(this.state)) {
      error = { message: "Password is invalid" };
      this.setState({ errors: errors.concat(error) });
      return false;
    } else {
      return true;
    }
  };

  isFormEmpty = ({ username, email, password, passwordConfirmation }) => {
    return (
      !username.length ||
      !email.length ||
      !password.length ||
      !passwordConfirmation.length
    );
  };

  isPasswordValid = ({ password, passwordConfirmation }) => {
    if (password.length < 6 || passwordConfirmation.length < 6) {
      return false;
    } else if (password !== passwordConfirmation) {
      return false;
    } else {
      return true;
    }
  };

  displayErrors = (errors) =>
    errors.map((error, i) => <p key={i}>{error.message}</p>);

  handleChange = (evt) => {
    this.setState({
      [evt.target.name]: evt.target.value,
    });
  };

  signIn = () => {
    auth
      .signInWithPopup(provider)
      .then((result) => {
        //console.log(result); //result.user.id (/displayName/email/photoURL)
        result.user
          .updateProfile({
            displayName: result.user.displayName,
            photoURL: result.user.photoURL,
          })
          .then(() => {
            this.saveUser(result).then(() => {
              //console.log("user saved");
              this.setState({ loading: false });
            });
          })
          .catch((error) => {
            console.log(error);
            this.setState({
              errors: this.state.errors.concat(error),
              loading: false,
            });
          });
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    if (this.isFormValid()) {
      this.setState({ errors: [], loading: true });
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then((createdUser) => {
          console.log(createdUser);
          createdUser.user
            .updateProfile({
              displayName: this.state.username,
              photoURL: `http://gravatar.com/avatar/${md5(
                createdUser.user.email
              )}?d=identicon`,
            })
            .then(() => {
              this.saveUser(createdUser).then(() => {
                console.log("user saved");
                this.setState({ loading: false });
              });
            })
            .catch((error) => {
              console.log(error);
              this.setState({
                errors: this.state.errors.concat(error),
                loading: false,
              });
            });
        })
        .catch((error) => {
          console.log(error);
          this.setState({
            loading: false,
            errors: this.state.errors.concat(error),
          });
        });
    }
  };

  handleInputError = (errors, inputName) => {
    return errors.some((item) => item.message.toLowerCase().includes(inputName))
      ? "error"
      : "";
  };

  saveUser = (createdUser) => {
    return this.state.usersRef.child(createdUser.user.uid).set({
      name: createdUser.user.displayName,
      avatar: createdUser.user.photoURL,
    });
  };

  render() {
    const {
      username,
      email,
      password,
      passwordConfirmation,
      loading,
      errors,
    } = this.state;
    return (
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={{ maxWidth: 450 }}>
          <h4 className="navbar-brand mt-1">
            <Link to={{ pathname: "http://cvrrocket.ga/" }} target="_blank">
              <img
                class="img"
                src={cvrrlogo}
                alt=""
                width="50"
                height="50"
                style={{ borderRadius: "50%" }}
              ></img>
            </Link>
          </h4>
          <Header as="h1" icon color="black" textAlign="center">
            <Icon name="sort" color="yellow" />
            Join cvrr_chat-rooms/NITHO
          </Header>
          <Form size="large" onSubmit={this.handleSubmit}>
            <Segment stacked>
              <Form.Input
                fluid
                name="username"
                icon="user"
                iconPosition="left"
                placeholder="Username"
                onChange={this.handleChange}
                value={username}
                type="text"
              />

              <Form.Input
                fluid
                name="email"
                icon="mail"
                iconPosition="left"
                placeholder="Email Address"
                value={email}
                onChange={this.handleChange}
                type="email"
                className={this.handleInputError(errors, "email")}
              />

              <Form.Input
                fluid
                name="password"
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                value={password}
                onChange={this.handleChange}
                type="password"
                className={this.handleInputError(errors, "password")}
              />

              <Form.Input
                fluid
                name="passwordConfirmation"
                icon="repeat"
                iconPosition="left"
                placeholder="Password Confirmation"
                value={passwordConfirmation}
                onChange={this.handleChange}
                type="password"
                className={this.handleInputError(errors, "password")}
              />

              <Button
                disabled={loading}
                className={loading ? "loading" : ""}
                color="green"
                fluid
                size="large"
              >
                Submit
              </Button>
            </Segment>
          </Form>
          {this.state.errors.length > 0 && (
            <Message error>
              <h3>Error</h3>
              {this.displayErrors(this.state.errors)}
            </Message>
          )}
          <Message>
            Already a user? <Link to="/login">Login</Link>
            <div>
              <img src={cvrrlogo} alt="cvrr_logo" width="202"
                height="202"/>
              <h1>Sign in to cvrr_chatrooms</h1>
              <p></p>
              <Button onClick={() => this.signIn()}>Sign in with Google</Button>
            </div>
          </Message>
        </Grid.Column>
      </Grid>
    );
  }
}

export default Register;
