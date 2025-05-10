import LoginLogo from '../../assets/loginLogo.png';
import Header from '../../components/header/Header';

import './../../styles/shared.css';
import styles from './LandingPage.module.css';

function LandingPage() {
  return (
    <>
      <div className="app">
        <div className="app-header">
          <Header />
        </div>
        <div className={styles['landing-page__container']}>
          <img src={LoginLogo} className="app-logo" alt="logo" />
          Log in to see your expenses!
        </div>
      </div>
    </>
  );
}

export default LandingPage;
