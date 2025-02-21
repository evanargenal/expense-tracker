import './pages.css';
import loginLogo from '../assets/loginLogo.png';
import Header from '../components/header/header';

function LandingPage() {
  return (
    <>
      <div className="App">
        <div className="App-header">
          <Header />
        </div>
        <div className="App-body">
          <img src={loginLogo} className="App-logo mb-5" alt="logo" />
          <p className="mt-5">Log in to see your expenses!</p>
        </div>
      </div>
    </>
  );
}

export default LandingPage;
