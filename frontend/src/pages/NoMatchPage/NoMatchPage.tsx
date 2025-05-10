import cryHard from '../../assets/cryHard.png';

import './../../styles/shared.css';
import styles from './NoMatchPage.module.css';

function NoMatchPage() {
  return (
    <>
      <div className="app">
        <div className={styles['no-match-page__container']}>
          <img src={cryHard} className="app-logo" alt="logo" />
          Sorry boss, no page here!
        </div>
      </div>
    </>
  );
}

export default NoMatchPage;
