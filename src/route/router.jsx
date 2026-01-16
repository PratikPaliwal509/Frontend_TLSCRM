import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layout/root";
import Home from "../pages/home";
import Analytics from "../pages/analytics";
import ReportsSales from "../pages/reports-sales";
// import ReportsLeads from "../pages/reports-leads";
import ReportsProject from "../pages/reports-project";
import AppsChat from "../pages/apps-chat";
import LayoutApplications from "../layout/layoutApplications";
import AppsEmail from "../pages/apps-email";
import ReportsTimesheets from "../pages/reports-timesheets";
import LoginCover from "../pages/login-cover";
import AppsTasks from "../pages/apps-tasks";
import AppsNotes from "../pages/apps-notes";
import AppsCalender from "../pages/apps-calender";
import AppsStorage from "../pages/apps-storage";
import Proposalist from "../pages/proposal-list";
import CustomersList from "../pages/customers-list";
import ProposalView from "../pages/proposal-view";
import ProposalEdit from "../pages/proposal-edit";
import CustomersView from "../pages/customers-view";
import CustomersCreate from "../pages/customers-create";
import ProposalCreate from "../pages/proposal-create";
import PaymentList from "../pages/payment-list";
import PaymentView from "../pages/payment-view/";
import PaymentCreate from "../pages/payment-create";
import ProjectsList from "../pages/projects-list";
import ProjectsView from "../pages/projects-view";
import ProjectsCreate from "../pages/projects-create";
import ProjectEdit from "../pages/project-edit";
import ProjectMember from "../pages/project-member";
import SettingsGaneral from "../pages/settings-ganeral";
import LayoutSetting from "../layout/layoutSetting";
import SettingsSeo from "../pages/settings-seo";
import SettingsTags from "../pages/settings-tags";
import SettingsEmail from "../pages/settings-email";
import SettingsTasks from "../pages/settings-tasks";
import SettingsLeads from "../pages/settings-leads";
import SettingsMiscellaneous from "../pages/settings-miscellaneous";
import SettingsRecaptcha from "../pages/settings-recaptcha";
import SettingsLocalization from "../pages/settings-localization";
import SettingsCustomers from "../pages/settings-customers";
import SettingsGateways from "../pages/settings-gateways";
import SettingsFinance from "../pages/settings-finance";
import SettingsSupport from "../pages/settings-support";
import LayoutAuth from "../layout/layoutAuth";
import LoginMinimal from "../pages/login-minimal";
import LoginCreative from "../pages/login-creative";
import RegisterCover from "../pages/register-cover";
import RegisterMinimal from "../pages/register-minimal";
import RegisterCreative from "../pages/register-creative";
import ResetCover from "../pages/reset-cover";
import ResetMinimal from "../pages/reset-minimal";
import ResetCreative from "../pages/reset-creative";
import ErrorCover from "../pages/error-cover";
import ErrorCreative from "../pages/error-creative";
import ErrorMinimal from "../pages/error-minimal";
import OtpCover from "../pages/otp-cover";
import OtpMinimal from "../pages/otp-minimal";
import OtpCreative from "../pages/otp-creative";
import MaintenanceCover from "../pages/maintenance-cover";
import MaintenanceMinimal from "../pages/maintenance-minimal";
import MaintenanceCreative from "../pages/maintenance-creative";
import HelpKnowledgebase from "../pages/help-knowledgebase";
// WidgetsLists have error and it is not required also
// import WidgetsLists from "../pages/widgets-lists";
import WidgetsTables from "../pages/widgets-tables";
import WidgetsCharts from "../pages/widgets-charts";
import WidgetsStatistics from "../pages/widgets-statistics";
import WidgetsMiscellaneous from "../pages/widgets-miscellaneous";
import AddRoles from "@/components/Roles/AddRoles";
import RoleList from "@/components/Roles/RoleList";
import EditRole from "@/components/Roles/EditRoles";
import ViewRole from "@/components/Roles/View.Roles";
import ClientsList from "../pages/clientsList";
import ClientsView from "../pages/clients-view";
import ClientsCreate from "../pages/clients-create";
import ClientEdit from "../pages/clients-edit";
// ReportsClients have error and it is not required also
// import ReportsClients from "../pages/reports-clients";
import AddDepartments from "../pages/add-departments";
import DepartmentsList from "../pages/departments-list";
import DepartmentsView from "../pages/department-view";
import DepartmentEdit from "../pages/edit-department";
import TeamCreate from "../pages/team-create";
import TeamsView from "../pages/team-view";
import TeamEdit from "../pages/teams-edit";
import TeamsList from "../pages/teams-list";
import AllNotifications from "../pages/AllNotifications";
import Profile from "../pages/profile";
import ProfileEdit from "../pages/profile-edit";
import CreateUser from "../pages/user-add";
import UsersList from "../pages/user-list";
import UsersView from "../pages/user-view";
import UserEditPage from "../pages/user-edit";
export const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        children: [
            {
                path: "/",
                element: <Home />
            },
            {
                path: "profile",
                element: <Profile />
            },
            {
                path: "profile/edit",
                element: <ProfileEdit />
            },
            {
                path: "/notifications",
                element: <AllNotifications />
            },
            {
                path: "/dashboards/analytics",
                element: <Analytics />
            },
            {
                path: "/reports/sales",
                element: <ReportsSales />
            },
            // {
            //     path: "/reports/leads",
            //     element: <ReportsLeads />
            // },
            // {
            //     path: "/reports/clients",
            //     element: <ReportsClients />
            // },
            {
                path: "/reports/project",
                element: <ReportsProject />
            },
            {
                path: "/reports/timesheets",
                element: <ReportsTimesheets />
            },
            {
                path: "/proposal/list",
                element: <Proposalist />
            },
            {
                path: "/proposal/view",
                element: <ProposalView />
            },
            {
                path: "/proposal/edit",
                element: <ProposalEdit />
            },
            {
                path: "/proposal/create",
                element: <ProposalCreate />
            },
            {
                path: "/payment/list",
                element: <PaymentList />
            },
            {
                path: "/payment/view",
                element: <PaymentView />
            },
            {
                path: "/payment/create",
                element: <PaymentCreate />
            },
            {
                path: "/customers/list",
                element: <CustomersList />
            },
            {
                path: "/customers/view",
                element: <CustomersView />
            },
            {
                path: "/customers/create",
                element: <CustomersCreate />
            },
            {
                path: "/clients/list",
                element: <ClientsList />
            },
            {
                path: "/clients/view/:id",
                element: <ClientsView />
            },
            {
                path: "/clients/create",
                element: <ClientsCreate />
            },
            {
                path: "/clients/edit/:id",
                element: <ClientEdit />
            },
            {
                path: "/projects/create",
                element: <ProjectsCreate />
            },
            {
                path: "/projects/list",
                element: <ProjectsList />
            },
            {
                path: "/projects/view/:id",
                element: <ProjectsView />
            },
            {
                path: "/projects/edit/:id",
                element: <ProjectEdit />
            },
            {
                path: "/projects/members/create",
                element: <ProjectMember />
            },
            // {
            //     path: "/widgets/lists",
            //     element: <WidgetsLists />
            // },
            {
                path: "/widgets/tables",
                element: <WidgetsTables />
            },
            {
                path: "/widgets/charts",
                element: <WidgetsCharts />
            },
            {
                path: "/widgets/statistics",
                element: <WidgetsStatistics />
            },
            {
                path: "/widgets/miscellaneous",
                element: <WidgetsMiscellaneous />
            },
            {
                path: "/help/knowledgebase",
                element: <HelpKnowledgebase />
            },
            {
                path: "/teams/create",
                element: <TeamCreate />
            },
            {
                path: "/teams/view/:id",
                element: <TeamsView />
            },
            {
                path: "/teams/edit/:id",
                element: <TeamEdit />
            },
            {
                path: "/teams/list",
                element: <TeamsList />
            },
            {
                path: "/settings/departments/view/:id",
                element: <DepartmentsView />
            },
            {
                path: "/settings/departments/edit/:id",
                element: <DepartmentEdit />
            },
            {
                path: "/settings/departments/list",
                element: <DepartmentsList />
            },
            {
                path: "/settings/departments/create",
                element: <AddDepartments />
            },
            {
                path: "/user/create",
                element: <CreateUser />
            },
            {
                path: "/user/list",
                element: <UsersList />
            },
            {
                path: "/user/view/:id",
                element: <UsersView />
            },
            {
                path: "/user/edit/:id",
                element: <UserEditPage />
            },

        ]
    },
    {
        path: "/",
        element: <LayoutApplications />,
        children: [
            {
                path: "/applications/chat",
                element: <AppsChat />
            },
            {
                path: "/applications/email",
                element: <AppsEmail />
            },
            {
                path: "/applications/tasks",
                element: <AppsTasks />
            },
            {
                path: "/applications/notes",
                element: <AppsNotes />
            },
            {
                path: "/applications/calender",
                element: <AppsCalender />
            },
            {
                path: "/applications/storage",
                element: <AppsStorage />
            },
        ]
    },

    {
        path: "/",
        element: <LayoutSetting />,
        children: [

            {
                path: "/settings/ganeral",
                element: <SettingsGaneral />
            },
            {
                path: "/settings/seo",
                element: <SettingsSeo />
            },
            {
                path: "/settings/tags",
                element: <SettingsTags />
            },
            {
                path: "/settings/email",
                element: <SettingsEmail />
            },
            {
                path: "/settings/tasks",
                element: <SettingsTasks />
            },
            {
                path: "/settings/leads",
                element: <SettingsLeads />
            },
            {
                path: "/settings/Support",
                element: <SettingsSupport />
            },
            {
                path: "/settings/finance",
                element: <SettingsFinance />
            },
            {
                path: "/settings/gateways",
                element: <SettingsGateways />
            },
            {
                path: "/settings/customers",
                element: <SettingsCustomers />
            },
            {
                path: "/settings/localization",
                element: <SettingsLocalization />
            },
            {
                path: "/settings/recaptcha",
                element: <SettingsRecaptcha />
            },
            {
                path: "/settings/miscellaneous",
                element: <SettingsMiscellaneous />
            },

            {
                path: "/",
                // element: <LayoutSetting />,
                children: [
                    {
                        path: "/settings/roles",
                        element: <RoleList />
                    },
                    {
                        path: "/settings/roles/create",
                        element: <AddRoles />
                    },
                    {
                        path: "/settings/roles/edit/:id",
                        element: <EditRole />
                    },
                    {
                        path: "/settings/roles/view/:id",
                        element: <ViewRole />
                    },
                ]
            },
        ]
    },
    {
        path: "/",
        element: <LayoutAuth />,
        children: [
            {
                path: "/authentication/login",
                element: <LoginCover />
            },
            {
                path: "/authentication/login/minimal",
                element: <LoginMinimal />
            },
            {
                path: "/authentication/login/creative",
                element: <LoginCreative />
            },
            {
                path: "/authentication/register/cover",
                element: <RegisterCover />
            },
            {
                path: "/authentication/register/minimal",
                element: <RegisterMinimal />
            },
            {
                path: "/authentication/register/creative",
                element: <RegisterCreative />
            },
            {
                path: "/authentication/reset/cover",
                element: <ResetCover />
            },
            {
                path: "/authentication/reset/minimal",
                element: <ResetMinimal />
            },
            {
                path: "/authentication/reset/creative",
                element: <ResetCreative />
            },
            {
                path: "/authentication/404/cover",
                element: <ErrorCover />
            },
            {
                path: "/authentication/404/minimal",
                element: <ErrorMinimal />
            },
            {
                path: "/authentication/404/creative",
                element: <ErrorCreative />
            },
            {
                path: "/authentication/verify/cover",
                element: <OtpCover />
            },
            {
                path: "/authentication/verify/minimal",
                element: <OtpMinimal />
            },
            {
                path: "/authentication/verify/creative",
                element: <OtpCreative />
            },
            {
                path: "/authentication/maintenance/cover",
                element: <MaintenanceCover />
            },
            {
                path: "/authentication/maintenance/minimal",
                element: <MaintenanceMinimal />
            },
            {
                path: "/authentication/maintenance/creative",
                element: <MaintenanceCreative />
            },
        ]
    }
])


// import { createBrowserRouter } from "react-router-dom";
// import RootLayout from "../layout/root";
// import Home from "../pages/home";
// // import Analytics from "../pages/analytics";
// import ReportsSales from "../pages/reports-sales";
// import ReportsLeads from "../pages/reports-leads";
// import ReportsProject from "../pages/reports-project";
// // import AppsChat from "../pages/apps-chat";
// import LayoutApplications from "../layout/layoutApplications";
// // import AppsEmail from "../pages/apps-email";
// import ReportsTimesheets from "../pages/reports-timesheets";
// import LoginCover from "../pages/login-cover";
// import AppsTasks from "../pages/apps-tasks";
// import AppsNotes from "../pages/apps-notes";
// import AppsCalender from "../pages/apps-calender";
// import AppsStorage from "../pages/apps-storage";
// import Proposalist from "../pages/proposal-list";
// import CustomersList from "../pages/customers-list";
// import ProposalView from "../pages/proposal-view";
// // import ProposalEdit from "../pages/proposal-edit";
// import LeadsList from "../pages/leadsList";
// import CustomersView from "../pages/customers-view";
// // import CustomersCreate from "../pages/customers-create";
// // import ProposalCreate from "../pages/proposal-create";
// import LeadsView from "../pages/leads-view";
// import LeadsCreate from "../pages/leads-create";
// // import PaymentList from "../pages/payment-list";
// // import PaymentView from "../pages/payment-view/";
// // import PaymentCreate from "../pages/payment-create";
// // // import ProjectsList from "../pages/projects-list";
// // // import ProjectsView from "../pages/projects-view";
// // // import ProjectsCreate from "../pages/projects-create";
// // // import SettingsGaneral from "../pages/settings-ganeral";
// // // import LayoutSetting from "../layout/layoutSetting";
// // // import SettingsSeo from "../pages/settings-seo";
// // // import SettingsTags from "../pages/settings-tags";
// // // import SettingsEmail from "../pages/settings-email";
// // // import SettingsTasks from "../pages/settings-tasks";
// // // import SettingsLeads from "../pages/settings-leads";
// // // import SettingsMiscellaneous from "../pages/settings-miscellaneous";
// // // import SettingsRecaptcha from "../pages/settings-recaptcha";
// // // import SettingsLocalization from "../pages/settings-localization";
// // // import SettingsCustomers from "../pages/settings-customers";
// // // import SettingsGateways from "../pages/settings-gateways";
// // // import SettingsFinance from "../pages/settings-finance";
// // // import SettingsSupport from "../pages/settings-support";
// // // import LayoutAuth from "../layout/layoutAuth";
// // // import LoginMinimal from "../pages/login-minimal";
// // // import LoginCreative from "../pages/login-creative";
// // // import RegisterCover from "../pages/register-cover";
// // // import RegisterMinimal from "../pages/register-minimal";
// // // import RegisterCreative from "../pages/register-creative";
// // // import ResetCover from "../pages/reset-cover";
// // // import ResetMinimal from "../pages/reset-minimal";
// // // import ResetCreative from "../pages/reset-creative";
// // // import ErrorCover from "../pages/error-cover";
// // // import ErrorCreative from "../pages/error-creative";
// // // import ErrorMinimal from "../pages/error-minimal";
// // // import OtpCover from "../pages/otp-cover";
// // // import OtpMinimal from "../pages/otp-minimal";
// // // import OtpCreative from "../pages/otp-creative";
// // // import MaintenanceCover from "../pages/maintenance-cover";
// // // import MaintenanceMinimal from "../pages/maintenance-minimal";
// // // import MaintenanceCreative from "../pages/maintenance-creative";
// // // import HelpKnowledgebase from "../pages/help-knowledgebase";
// // // // import WidgetsLists from "../pages/widgets-lists";
// // // import WidgetsTables from "../pages/widgets-tables";
// // // import WidgetsCharts from "../pages/widgets-charts";
// // // import WidgetsStatistics from "../pages/widgets-statistics";
// // // import WidgetsMiscellaneous from "../pages/widgets-miscellaneous";
// // // import AddRoles from "@/components/Roles/AddRoles";
// // // import RoleList from "@/components/Roles/RoleList";
// // // import EditRole from "@/components/Roles/EditRoles";
// // // import ViewRole from "@/components/Roles/View.Roles";
// // // import ClientsList from "../pages/clientsList";
// // // import ClientsView from "../pages/clients-view";
// // // import ClientsCreate from "../pages/clients-create";
// // // // import ReportsClients from "../pages/reports-clients";
// // // import ClientEdit from "../pages/clients-edit";
// // // import ProjectEdit from "../pages/project-edit";
// // // import ProjectMember from "../pages/project-member";
// // // // import Departments from "../pages/departments";
// // // import AddDepartments from "../pages/add-departments";
// // // import DepartmentsList from "../pages/departments-list";
// // // import DepartmentsView from "../pages/department-view";
// // // import DepartmentEdit from "../pages/edit-department";
// // // import TeamCreate from "../pages/team-create";
// // // import TeamsView from "../pages/team-view";
// // // import TeamEdit from "../pages/teams-edit";
// // // import TeamsList from "../pages/teams-list";
// export const router = createBrowserRouter([
// {
//   path: "/",
//   element: <RootLayout />,
//   children: [
//     {
//       path: "/",        // ❌ WRONG
//       element: <Home />
//     },
//     {
//       path: "/authentication/login",        // ❌ WRONG
//       element: <LoginCover/>
//     }
//   ]
// }

// ])
