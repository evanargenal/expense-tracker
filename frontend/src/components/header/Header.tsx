import { useAuth } from '../../context/AuthContext';

import styles from './Header.module.css';
import LoginModal from '../modals/LoginModal';
import TabNavigation from '../tabs/TabNavigation';

function Header() {
  const { user } = useAuth();

  return (
    <>
      <div className={styles.headerContainer}>
        {user && (
          <p className="mb-1">
            {user.fullName} {user.isAdmin && '(Admin)'}
          </p>
        )}
        {user && (
          <div className={styles.tabContainer}>
            <TabNavigation />
          </div>
        )}
      </div>
      <div className={styles.logInLogOutButtonContainer}>
        <LoginModal />
      </div>
    </>
  );
}

export default Header;
