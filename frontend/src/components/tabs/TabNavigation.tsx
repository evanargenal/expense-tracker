import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

function TabNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [tabKey, setTabKey] = useState('dashboard');

  useEffect(() => {
    // Map URL path to corresponding tab key
    if (location.pathname === '/dashboard') {
      setTabKey('dashboard');
    } else if (location.pathname === '/categories') {
      setTabKey('categories');
    }
  }, [location.pathname]);

  const handleSelect = (k: string | null) => {
    if (k) {
      setTabKey(k);
      navigate(`/${k}`); // Navigate to the selected route
    }
  };

  return (
    <Tabs
      defaultActiveKey={'dashboard'}
      id="headerNavigationTabs"
      activeKey={tabKey}
      onSelect={handleSelect}
      variant="underline"
    >
      <Tab eventKey="dashboard" title="Dashboard"></Tab>
      <Tab eventKey="categories" title="Categories"></Tab>
    </Tabs>
  );
}

export default TabNavigation;
