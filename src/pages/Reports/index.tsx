
import { useAuth } from '../../hooks/useAuth';
import Breadcrumb from '../../components/Breadcrumb';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import DayCollectionReport from './components/DayCollectionReport';
import { Day_Collection_Report, Default_Report, Ledger_Report, Memberwise_Collection_Report, Receipt_Report, Total_Outstanding_Report } from '../../api/RBAC/userAccess';

const Reports = () => {
  const { auth }: any = useAuth();


  const allowDayCollection = () => {
    return auth?.access?.includes(Day_Collection_Report);
  };

  const allowLedger = () => {
    return auth?.access?.includes(Ledger_Report);
  };

   const allowReceipt = () => {
     return auth?.access?.includes(Receipt_Report);
   };

   const allowTotalOutstanding = () => {
     return auth?.access?.includes(Total_Outstanding_Report);
   };

   const allowDefault = () => {
     return auth?.access?.includes(Default_Report);
   };

   const allowMemberWiseCollection = () => {
     return auth?.access?.includes(Memberwise_Collection_Report);
   };



  return (
    <>
      <Breadcrumb pageName="Reports" />

      <div className="mt-6">
        <Tabs>
          <TabList>
            {allowDayCollection() && <Tab>Day Collection</Tab>}
            {allowLedger() && <Tab>Ledger</Tab>}
            {allowReceipt() && <Tab>Receipt</Tab>}
            {allowTotalOutstanding() && <Tab>Total Outstanding </Tab>}
            {allowDefault() && <Tab>Default</Tab>}
            {allowMemberWiseCollection() && <Tab>Memberwise collection</Tab>}
          </TabList>

          {allowDayCollection() && (
            <TabPanel>
              <DayCollectionReport />
            </TabPanel>
          )}
          {allowLedger() && (
            <TabPanel>
              <h2>Ledger Report</h2>
            </TabPanel>
          )}

          {allowReceipt() && (
            <TabPanel>
              <h2>Receipt Report</h2>
            </TabPanel>
          )}

          {allowTotalOutstanding() && (
            <TabPanel>
              <h2>Total Outstanding Report</h2>
            </TabPanel>
          )}

          {allowDefault() && (
            <TabPanel>
              <h2>Default Report</h2>
            </TabPanel>
          )}

          {allowMemberWiseCollection() &&
            <TabPanel>
              <h2>Memberwise collection Report </h2>
            </TabPanel>
          }
        </Tabs>
      </div>
    </>
  );
};

export default Reports;
