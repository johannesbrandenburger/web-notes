// @ts-check
import withRouter from 'next/dist/client/with-router'
import Head from 'next/head'
import { Component } from 'react'
import { FrontEndController } from '../controller/frontEndController'
import styles from '../styles/Profile.module.css'
import { Header } from '../components/header'
import { Footer } from '../components/footer'
import { checkPasswordOnRegex } from '../shared/check_password_regex'

/**
 * @class Profile Component Class
 * @component
 * @category Pages
 */
class Profile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoggedIn: undefined,
      currentToken: "",
      currentUser: undefined,
      showRequirements: false,
      oldPassword: "",
      newPassword: "",
      newPasswordConfirm: "",
      isInputValidForChangePassword: false,
      feedbackMessage: "",
      updatedPasswordMessage: "",
    }
  }

  /**
   * This method is called when the component is mounted.
   */
  async componentDidMount() {
    this.updateLoginState();
    window.addEventListener('storage', this.storageTokenListener)
    this.setState({ currentUser: await FrontEndController.getUserFromToken(FrontEndController.getUserToken()) });
  }

  /** 
   * This method is called when the component will unmount.
   */
  componentWillUnmount() {
    window.removeEventListener('storage', this.storageTokenListener)
  }

  /**
   * This method checks whether the event contains a change in the user-token. If it does, it updates the login state.
   * @param {any} event Event triggered by an EventListener
   */
  async storageTokenListener(event) {
    if (event.key === FrontEndController.userTokenName) {
      this.updateLoginState();
    }
  }

  /**
   * This method updates the isLoggedIn state and currentToken state according to the current token in local storage.
   */
  async updateLoginState() {
    let currentToken = FrontEndController.getUserToken();
    if (await FrontEndController.verifyUserByToken(currentToken)) {
      this.setState({ isLoggedIn: true, currentToken: currentToken })
    } else {
      const { router } = this.props
      router.push("/")
    }
  }

  /**
   * This method is used to handle the event when the user clicks on the change password button.
   * It triggers the changePassword method of the FrontEndController.
   */
  async changePassword() {
    this.setState({ feedbackMessage: "" })
    const changedPasswordSuccessfully = await FrontEndController.changePassword(this.state.oldPassword, this.state.newPassword);

    if (!changedPasswordSuccessfully) {
      this.setState({ isInputValidForChangePassword: false, feedbackMessage: "Altes Passwort falsch.", oldPassword: "", newPassword: "", newPasswordConfirm: "" });
    } else {
      this.setState({ isInputValidForChangePassword: false, feedbackMessage: "", oldPassword: "", newPassword: "", newPasswordConfirm: "", updatedPasswordMessage: "Password changed successfully." });
    }
    document.getElementById("userInput")?.focus();
  }

  /**
   * This function is used to handle the user input. 
   * It evaluates the input and sets the feedback state accordingly.
   * @param {any} event the change event
   */
  async changedInput(event) {

    // get all input values
    const oldPassword = event.target.name === "oldPassword" ? event.target.value : this.state.oldPassword;
    const newPassword = event.target.name === "newPassword" ? event.target.value : this.state.newPassword;
    const newPasswordConfirm = event.target.name === "newPasswordConfirm" ? event.target.value : this.state.newPasswordConfirm;

    let isInputValidForChangePassword = false;
    let feedbackMessage = "";

    // evaluate input values and set the feedback
    if (oldPassword.length > 0 && newPassword.length > 0 && checkPasswordOnRegex(newPassword) !== "") {
      feedbackMessage = "Das Passwort erfüllt die Anforderungen nicht.";
    }
    if (oldPassword.length > 0 && newPassword.length > 0 && newPasswordConfirm.length > 0) {
      if (checkPasswordOnRegex(newPassword) !== "") {
        feedbackMessage = "Das Passwort erfüllt die Anforderungen nicht.";
      } else if (newPassword === newPasswordConfirm) {
        isInputValidForChangePassword = true;
      } else {
        isInputValidForChangePassword = false;
        feedbackMessage = "Die Passwörter stimmen nicht überein.";
      }
    } else {
      isInputValidForChangePassword = false;
    }

    // apply the feedback and the input values to the state
    this.setState({ [event.target.name]: event.target.value, isInputValidForChangePassword: isInputValidForChangePassword, feedbackMessage: feedbackMessage, updatedPasswordMessage: "" });
  }

  /**
   * This method checks for enter key press in event and calls the changePasswordVerification method.
   * @param {any} event Button-Press event
   */
  async changeEnter(event) {
    if (event.key.toLowerCase() === "enter") {
      event.preventDefault();
      this.changePassword();
    }
  }

  /**
   * Generates the JSX Output for the Client
   * @returns JSX Output
   */
  render() {
    if (this.state.isLoggedIn === undefined) {
      return (
        <div>
          <Head>
            <title>Profile</title>
            <meta name="description" content="Profile page." />
            <link rel="icon" href="/favicon.ico" />
          </Head>

          <header>
            <Header username={""} hideLogin={true} hideLogout={true} />
          </header>
        </div>
      )
    } else {
      return (
        <div>
          <Head>
            <title>Profile</title>
            <meta name="description" content="Profile page." />
            <link rel="icon" href="/favicon.ico" />
          </Head>

          <header>
            <Header username={FrontEndController.getUsernameFromToken(this.state.currentToken)} hideLogin={this.state.isLoggedIn} hideLogout={!this.state.isLoggedIn} />
          </header>

          <div className="scrollBody">
            <main>
              <div className={styles.content}>
                <h1>Benutzername: {FrontEndController.getUsernameFromToken(FrontEndController.getUserToken())}</h1>

                <div>

                  <div className={styles.fieldDiv}>
                    <h2>Passwort ändern</h2>
                    <input
                      type="password"
                      placeholder="Altes Passwort..."
                      id='userInput'
                      className='formularInput'
                      name="oldPassword"
                      onChange={(event) => { this.changedInput(event) }}
                      value={this.state.oldPassword}
                      onKeyDown={(event) => { this.changeEnter }} />
                    <input
                      type="password"
                      placeholder="Neues Passwort..."
                      className='formularInput'
                      name="newPassword"
                      onChange={(event) => { this.changedInput(event) }}
                      value={this.state.newPassword}
                      onKeyDown={(event) => { this.changeEnter }} />
                    <input
                      type="password"
                      placeholder="Neues Passwort bestätigen..."
                      className='formularInput'
                      name="newPasswordConfirm"
                      onChange={(event) => { this.changedInput(event) }}
                      value={this.state.newPasswordConfirm}
                      onKeyDown={(event) => { this.changeEnter }} />
                    <div hidden={this.state.feedbackMessage === ""} className={styles.error} >
                      {this.state.feedbackMessage}
                    </div>
                    <div hidden={this.state.updatedPasswordMessage === ""} className={styles.success}>
                      {this.state.updatedPasswordMessage}
                    </div>
                    <button disabled={!this.state.isInputValidForChangePassword} onClick={() => { this.changePassword }}>Passwort ändern</button>
                    <p className={styles.showReq}>
                      <a onClick={() => { this.setState({ showRequirements: !this.state.showRequirements }) }}>
                        {this.state.showRequirements ? "Verberge Anforderungen" : "Zeige Anforderungen"}
                      </a>
                    </p>
                  </div>
                  <div>
                    <div hidden={!this.state.showRequirements} className={styles.requirementsDiv}>
                      <h2>Benutzername</h2>
                      <ul>
                        <li>4-16 Zeichen</li>
                        <li>nur Zahlen und Buchstaben</li>
                        <li>Zeichenfolge &ldquo;admin&ldquo; ist nicht erlaubt</li>
                      </ul>
                      <h2>Password</h2>
                      <ul>
                        <li>min. 8 Zeichen</li>
                        <li>min. 1 Zahl, 1 Kleinbuchstabe, 1 Großbuchstabe</li>
                        <li>min. 1 der folgenden Zeichen: ! * # , ; ? + - _ . = ~ ^ % ( ) &#123; &#125; | : &ldquo; /</li>
                        <li>nur Zahlen, Buchstaben und die oben genennten Sonderzeichen</li>
                      </ul>
                    </div>
                  </div>

                </div>

              </div>
            </main >

            <footer>
              <Footer isLoggedIn={this.state.isLoggedIn} />
            </footer>
          </div>
        </div >
      )
    }
  }
}

export default withRouter(Profile)
