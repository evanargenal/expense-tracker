import './pages.css';
import cryHard from '../assets/cryHard.png';

function NoMatch() {
  return (
    <>
      <div className="App">
        <div className="noMatchPage">
          <img src={cryHard} className="App-logo mb-5" alt="logo" />
          <p>Sorry boss, no page here!</p>
        </div>
      </div>
    </>
  );
}

export default NoMatch;
