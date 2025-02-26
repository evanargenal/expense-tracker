import { useAuth } from '../../context/AuthContext';

import styles from './Header.module.css';
import LoginModal from '../modals/LoginModal';

function Header() {
  const { user } = useAuth();

  return (
    <>
      <div className={styles.headerContainer}>
        {user && (
          <p>
            Logged in as: {user.fullName}{' '}
            {user.isAdmin && '(You are an admin!)'}
          </p>
        )}
        <LoginModal />
      </div>
    </>
  );
}

export default Header;
