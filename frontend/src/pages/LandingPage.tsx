import './pages.css';
import LoginLogo from '../assets/loginLogo.png';
import Header from '../components/header/Header';

function LandingPage() {
  return (
    <>
      <div className="App">
        <div className="App-header">
          <Header />
        </div>
        <div className="App-body">
          <img src={LoginLogo} className="App-logo mb-5" alt="logo" />
          <p className="mt-5">Log in to see your expenses!</p>
        </div>
      </div>
    </>
  );
}

export default LandingPage;
