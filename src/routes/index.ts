import { lazy } from 'react';
import {
  Main_Dashboard,
  Reports_Menu,
  View_Branch,
  View_Center,
  View_Loan,
  View_Loan_Product,
  View_Member,
  View_User,
  My_Profile,
  Collector_Dashboard,
  Add_Branch,
  Edit_Branch,
  Add_Center,
  Edit_Center,
  Add_Member,
  Edit_Member,
  Add_Loan_Product,
  Edit_Loan_Product,
  Add_Loan,
  Edit_Loan,
  Add_Loan_Payment,
  Edit_Loan_Payment,
  Delete_Loan_Payment,
  Add_User,
  Edit_User,
  Inactive_User,
  Inactive_Member,
  Day_Collection_Report,
  Ledger_Report,
  Receipt_Report,
  Total_Outstanding_Report,
  Memberwise_Collection_Report,
  Default_Report,
  Add_Bulk_Payment,
} from '../api/RBAC/userAccess';
import Collections from '../pages/Collections';

const Dashboard = lazy(() => import('../pages/Dashboard'));
const Branches = lazy(() => import('../pages/Branches'));
const Centers = lazy(() => import('../pages/Centers'));
const Members = lazy(() => import('../pages/Members'));
const LoanProducts = lazy(() => import('../pages/LoanProducts'));
const Loans = lazy(() => import('../pages/Loans'));
const LoanDetails = lazy(() => import('../pages/LoanDetails'));
const Users = lazy(() => import('../pages/Users'));
const Profile = lazy(() => import('../pages/Profile'));
const Reports = lazy(() => import('../pages/Reports'));
const Payments = lazy(() => import('../pages/Payments'));

const Chart = lazy(() => import('../pages/Chart'));
const FormElements = lazy(() => import('../pages/Form/FormElements'));
const FormLayout = lazy(() => import('../pages/Form/FormLayout'));
const Tables = lazy(() => import('../pages/Tables'));
const Alerts = lazy(() => import('../pages/UiElements/Alerts'));
const Buttons = lazy(() => import('../pages/UiElements/Buttons'));

const coreRoutes = [
  {
    path: '/',
    title: 'Dashboard',
    component: Dashboard,
    allowedAccess: [Main_Dashboard, Collector_Dashboard],
  },
  {
    path: '/branch',
    title: 'Branch',
    component: Branches,
    allowedAccess: [View_Branch, Add_Branch, Edit_Branch],
  },
  {
    path: '/centers',
    title: 'Centers',
    component: Centers,
    allowedAccess: [View_Center, Add_Center, Edit_Center],
  },
  {
    path: '/members',
    title: 'Members',
    component: Members,
    allowedAccess: [View_Member, Add_Member, Edit_Member, Inactive_Member],
  },
  {
    path: '/products',
    title: 'Loan Products',
    component: LoanProducts,
    allowedAccess: [View_Loan_Product, Add_Loan_Product, Edit_Loan_Product],
  },
  {
    path: '/loans',
    title: 'Loans',
    component: Loans,
    allowedAccess: [
      View_Loan,
      Add_Loan,
      Edit_Loan,
      Add_Loan_Payment,
      Edit_Loan_Payment,
      Delete_Loan_Payment,
    ],
  },
  {
    path: '/loan/:id',
    title: 'Loan Details',
    component: LoanDetails,
    allowedAccess: [
      View_Loan,
      Add_Loan,
      Edit_Loan,
      Add_Loan_Payment,
      Edit_Loan_Payment,
      Delete_Loan_Payment,
    ],
  },
  {
    path: '/users',
    title: 'Users',
    component: Users,
    allowedAccess: [View_User, Add_User, Edit_User, Inactive_User],
  },
  {
    path: '/reports',
    title: 'Reports',
    component: Reports,
    allowedAccess: [
      Reports_Menu,
      Day_Collection_Report,
      Ledger_Report,
      Receipt_Report,
      Total_Outstanding_Report,
      Default_Report,
      Memberwise_Collection_Report,
    ],
  },
  {
    path: '/payments',
    title: 'Payments',
    component: Payments,
    allowedAccess: [
      Add_Bulk_Payment,
    ],
  },
  {
    path: '/profile',
    title: 'Profile',
    component: Profile,
    allowedAccess: [My_Profile],
  },

  //collector
  {
    path: '/collections',
    title: 'Collections',
    component: Collections,
    allowedAccess: [Collector_Dashboard],
  },
  {
    path: '/forms/form-elements',
    title: 'Forms Elements',
    component: FormElements,
    allowedAccess: [My_Profile],
  },
  {
    path: '/forms/form-layout',
    title: 'Form Layouts',
    component: FormLayout,
    allowedAccess: [My_Profile],
  },
  {
    path: '/tables',
    title: 'Tables',
    component: Tables,
    allowedAccess: [My_Profile],
  },
  {
    path: '/chart',
    title: 'Chart',
    component: Chart,
    allowedAccess: [My_Profile],
  },
  {
    path: '/ui/alerts',
    title: 'Alerts',
    component: Alerts,
    allowedAccess: [My_Profile],
  },
  {
    path: '/ui/buttons',
    title: 'Buttons',
    component: Buttons,
    allowedAccess: [My_Profile],
  },
];

const routes = [...coreRoutes];
export default routes;
