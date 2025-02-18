import { useAuth } from '../../context/authContext';

import 'bootstrap/dist/css/bootstrap.css';
import './style.css';
import LoginModal from '../modals/loginModal';

function Header() {
  const { user } = useAuth();

  return (
    <div className="headerContainer">
      {user && (
        <p>
          Logged in as: {user.fullName}! {user.isAdmin && '(You are an admin!)'}
        </p>
      )}
      <LoginModal />
    </div>
  );
}

export default Header;
