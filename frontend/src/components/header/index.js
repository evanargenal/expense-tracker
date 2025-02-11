import Alert from 'react-bootstrap/Alert';

import 'bootstrap/dist/css/bootstrap.css';
import './style.css';

function Header({ userName, isVisible }) {
  return (
    <div>
      {isVisible && (
        <Alert key="primary" variant="primary">
          Welcome {userName}!
        </Alert>
      )}
    </div>
  );
}

export default Header;
