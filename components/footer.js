// @ts-check
import { Component } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import styles from './Footer.module.css'
// @ts-ignore
import GitHubIcon from '../public/GitHub.png'
// @ts-ignore
import WebNotesIcon from '../public/Logo.png'
// @ts-ignore
import DevChatIcon from '../public/Dev-Chat.png'
import { FrontEndController } from '../controller/frontEndController'

/** 
 * @class Footer Component Class
 * @component
 * @category Components
 */
export class Footer extends Component {
  /**
   * Generates the JSX Output for the Client
   * @returns JSX Output
   */
  render() {
    return (
      <div>
        <div className={styles.footer}>
          <div className={styles.footerElement}>
            <h4>
              Quellcode
            </h4>
            <div className={styles.code}>
              <Link
                href={'https://github.com/DHBW-FN-TIT20/web-notes'}
                passHref>
                <div className={styles.icon}>
                  <Image
                    src={GitHubIcon}
                    objectFit='contain'
                    height={40}
                    width={40}
                    alt='GitHub Icon'
                  />
                </div>
              </Link>
            </div>
          </div>
          <div className={styles.footerElement}>
            <h4>
              Projekte
            </h4>
            <div className={styles.projects}>
              <Link
                href={'https://web-notes.me'}
                passHref>
                <div className={styles.icon}>
                  <Image
                    src={WebNotesIcon}
                    objectFit='contain'
                    height={40}
                    width={40}
                    alt='WebNotes Icon'
                  />
                </div>
              </Link>
              <Link
                href={'https://dev-chat.me'}
                passHref>
                <div className={styles.icon}>
                  <Image
                    src={DevChatIcon}
                    objectFit='contain'
                    height={40}
                    width={40}
                    alt='DEV-CHAT Icon'
                  />
                </div>
              </Link>
            </div>
          </div>
          <div className={styles.footerElement}>
            <h4>
              Kontakt
            </h4>
            <div className={styles.contact}>
              <Link
                href={"/impressum"}>
                Impressum
              </Link>
            </div>
          </div>
          <div className={styles.footerElement}>
            <h4>
              Account
            </h4>
            <div className={styles.account}>
              <div hidden={this.props.isLoggedIn}>
                <Link
                  href={"/login"}>
                  Login
                </Link>
              </div>
              <div hidden={this.props.isLoggedIn}>
                <Link
                  href={"/register"}>
                  Registrieren
                </Link>
              </div>
              <div hidden={!this.props.isLoggedIn}>
                <Link
                  href={"/profile"}>
                  Passwort ändern
                </Link>
              </div>
              <div hidden={!this.props.isLoggedIn} onClick={() => {
                FrontEndController.logoutUser()
                location.reload()
              }}>
                <p className="link">
                  Ausloggen
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}