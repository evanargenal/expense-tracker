import LoginLogo from '../../assets/loginLogo.png';
import Header from '../../components/header/Header';

import './../../styles/shared.css';
import styles from './LandingPage.module.css';

function LandingPage() {
  return (
    <>
      <div className="App">
        <div className="App-header">
          <Header />
        </div>
        <div className={styles.landingPage}>
          <img src={LoginLogo} className="App-logo mb-5" alt="logo" />
          <p className="mt-5">Log in to see your expenses!</p>
        </div>
      </div>
    </>
  );
}

export default LandingPage;
