import { tokenRepository } from '../../api/index.ts';
import { ROLES } from '../../api/RBAC/userRoles.ts';
import CollectorDashboard from './components/collector-dashboard.tsx';
import MainDashboard from './components/main-dashboard.tsx';


const Dashboard = () => {

  const showMainDashboard =
    tokenRepository.getUserRole() !== ROLES.COLLECTION_OFFICER; ;

  return (
    <>
      {showMainDashboard ? <MainDashboard/> : <CollectorDashboard/>}
    </>
  );
};

export default Dashboard;
