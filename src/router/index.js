import Vue from "vue";
import VueRouter from "vue-router";
import DashboardLayout from "../views/layouts/DashboardLayout.vue";
import Home from "../views/Home.vue";
import Login from "@/views/LoginView.vue";
import Welcome from "@/views/misc/Welcome.vue";
import Subscription from "@/views/Subscriptions.vue";
import ManualLogger from "@/views/ManualLogger.vue";
import Assets from "@/views/Assets.vue";
import ThankYou from "@/views/ThankYou.vue";
import Users from "@/views/Users.vue";
import CDSConfig from "@/views/CDSConfig.vue";
import Branches from "@/views/Branches.vue";
import UserProfile from "@/views/UserProfile.vue";
import Company from "@/views/Company.vue";
import CompanyUsers from "@/views/CompanyUsers.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Welcome',
    component: Welcome,
    meta: { title: 'Welcome' },
  },
  {
    path: '/thank-you',
    name: 'ThankYou',
    component: ThankYou,
    meta: { title: 'ThankYou' },
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: DashboardLayout,
    children: [
      {
        path: "manual-logger",
        name: "ManualLogger",
        component: ManualLogger,
      },
      {
        path: 'branches',
        name: 'Branches',
        component: Branches,
        meta: { title: 'Branches' },
      },
      {
        path: 'assets',
        name: 'Assets',
        component: Assets,
        meta: { title: 'Assets' },
      },
      {
        path: 'subscriptions-dialog',
        name: 'SubscriptionsDialog',
        component: Assets,
        meta: { title: 'subscriptions-dialog'},
      },
      {
        path: 'users',
        name: 'Users',
        component: Users,
        meta: { title: 'Users' },
      },
      {
        path: 'cds-config',
        name: 'CDS Configurations',
        component: CDSConfig,
        meta: { title: 'CDS Configurations' },
      },
      {
        path: 'company',
        name: 'Company',
        component: Company,
        meta: { title: 'Company' },
      },
      {
        path: 'company-users/:id',
        name: 'Company Users',
        component: CompanyUsers,
        meta: { title: 'Company Users' },
      },      
      {
        path: 'user-profile',
        name: 'User Profile',
        component: UserProfile,
        meta: { title: 'User Profile'},
      }
    ]
  }
];

const router = new VueRouter({
  mode: 'history',
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = JSON.parse(localStorage.getItem("user"));

  // Check for user role access control
  if (to.matched.some(record => record.name === "Users")) {
    const userRole = isAuthenticated ? isAuthenticated.user.role.name : null;
  }

  // Authentication and access control
  if (!isAuthenticated && to.name !== 'Welcome' && to.name !== 'Login') {
    // Redirect to Welcome if not authenticated and trying to access other pages
    return next({ name: 'Welcome' });
  } else if (isAuthenticated && (to.name === 'Welcome' || to.name === 'Login')) {
    //Redirect authenticated users from Welcome or login to Branches
    return next({name: 'Branches'});
    
    // Redirect authenticated users from Welcome or Login to Assets
    //return next({ name: 'Assets' });
  }

  // Proceed with the navigation
  next();
});

export default router;
