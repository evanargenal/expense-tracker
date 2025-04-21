import cryHard from '../../assets/cryHard.png';

import './../../styles/shared.css';
import styles from './NoMatchPage.module.css';

function NoMatchPage() {
  return (
    <>
      <div className="App">
        <div className={styles.noMatchPage}>
          <img src={cryHard} className="App-logo mb-5" alt="logo" />
          <p>Sorry boss, no page here!</p>
        </div>
      </div>
    </>
  );
}

export default NoMatchPage;
