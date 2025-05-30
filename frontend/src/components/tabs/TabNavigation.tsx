import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

function TabNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [tabKey, setTabKey] = useState('expenses-list');

  useEffect(() => {
    // Map URL path to corresponding tab key
    if (location.pathname === '/expenses-list') {
      setTabKey('expenses-list');
    } else if (location.pathname === '/income-list') {
      setTabKey('income-list');
    } else if (location.pathname === '/categories-list') {
      setTabKey('categories-list');
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
      defaultActiveKey={'expenses-list'}
      id="headerNavigationTabs"
      activeKey={tabKey}
      onSelect={handleSelect}
      variant="underline"
    >
      <Tab eventKey="expenses-list" title="Expenses"></Tab>
      <Tab eventKey="income-list" title="Income"></Tab>
      <Tab eventKey="categories-list" title="Categories"></Tab>
    </Tabs>
  );
}

export default TabNavigation;
