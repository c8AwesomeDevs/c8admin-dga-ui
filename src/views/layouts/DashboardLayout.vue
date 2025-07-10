<template>
  <div>
    <v-navigation-drawer v-model="drawer" dark src="@/assets/sidebar-bg.png" app> 
      <v-list-item>
        <v-list-item-content class="custom-content text-center mt-5 mb-2">
          <v-list-item-title>
            <img src="@/assets/logo.png" alt="" width="80" />
          </v-list-item-title>
          <v-list-item-subtitle> Admin Module </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>

      <!-- Welcome Section -->
      

      <v-divider></v-divider>

      <v-list dense nav>
        <v-list-item-group v-model="page">
          <v-list-item link v-for="(i, idx) in items" :key="idx" :to="{ name: i.link }" @click="title = i.title">
            <v-list-item-icon>
              <v-icon>{{ i.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ i.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>

        <!-- <v-list-item @click="signOut()">
          <v-list-item-icon>
            <v-icon>mdi-power</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Log-Out</v-list-item-title>
          </v-list-item-content>
        </v-list-item> -->
      </v-list>

      <template v-slot:append>
        <v-list dense nav>
          <!-- subscription plan -->
          

          <!-- light/dark mode toggle -->
          <v-list-item @click="darkmode()">
            <v-list-item-icon>
              <v-icon v-if="$vuetify.theme.dark">mdi-weather-sunny</v-icon>
              <v-icon v-if="!$vuetify.theme.dark">mdi-weather-night</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title v-if="!$vuetify.theme.dark">Dark</v-list-item-title>
              <v-list-item-title v-if="$vuetify.theme.dark">Light</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item @click="signOut()">
            <v-list-item-icon>
              <v-icon>mdi-power</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Log-Out</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </template>
    </v-navigation-drawer>

    <v-app-bar app dark dense class="red app-header">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>{{ pageTitle }}</v-toolbar-title>
    </v-app-bar>
    <v-main>
      <router-view></router-view>
    </v-main>

    <!-- Footer -->
    <!-- <v-footer absolute class="footer mt-10 mb-1" color="transparent">
      <span class="lighten-2"> {{ new Date().getFullYear() }} — &copy; Calibr8 Systems Inc.</span>
    </v-footer> -->
    <!-- <SubscriptionPlanDialog :dialog="subscriptionplan_dialog" @close="closeSubscriptionsDialog" :user="user"></SubscriptionPlanDialog> -->
    <!-- <FAQDialog @close="toggleHelpDialog" :user="user" :show="showFAQ" /> -->
  </div>
</template>

<style scoped>
/* Center the text in the footer */
.footer {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #999;
  font-size: 14px;
}


/* Center the text in the footer */
.welcome-container {
  color: white;
  padding: 10px;
  border-radius: 8px;
  margin: 10px;
}

.welcome-text {
  font-size: 16px;
  font-weight: bold;
}

.welcome-subtext {
  font-size: 12px;
  font-weight: normal;
}

.logo-container {
  position: relative;
  overflow: visible; /* Ensure no cutting happens */
}

.logo {
  transition: transform 0.3s ease; /* Smooth hover animation */
}

.logoSubtitle{
  color: #ff9800;
  font-weight: bold;
}
.logo:hover {
  transform: scale(1.1); /* Slight zoom on hover */
}

.nav-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}
/* Make the text lighter */
</style>
<script>
import { msalInstance } from "vue-msal-browser";
// import FAQDialog from "@/components/popups/FAQDialog.vue";
// import SubscriptionPlanDialog from "@/components/popups/SubscriptionPlanDialog.vue";

export default {
  // components: {
  //   SubscriptionPlanDialog,
  //   FAQDialog,
  // },
  data: () => ({
    drawer: null,
    page: 0,
    //pageTitle: "",
    user: {},
    user_role: "",
    items: [],
    showFAQ: false,
    subscriptionplan_dialog: false,
  }),
  computed: {
    pageTitle(){
      return this.$store.state.title;
    },
  },

  mounted() {
    this.user = JSON.parse(localStorage.getItem("user")).user;
    
    // color theme
    if (localStorage.getItem("dark-mode") === "true") {
      this.$vuetify.theme.dark = true;
    }

    this.items = [
      {
        title: "Companies",
        icon: "mdi-office-building-outline",
        link: "Company",
      },
      {
        title: "All Users",
        icon: "mdi-account",
        link: "all-users",
      },
      {
        title: "All Audits",
        icon: "mdi-receipt-text-arrow-right",
        link: "all-audits",
      },
    ]
    
    const store = JSON.parse(localStorage.getItem("user"));

    // // Safely extract role and level
    // if (this.user.role && this.user.role.name) {
    //   const roleParts = this.user.role.name.split(" ");
    //   this.user_level = roleParts[0];
    //   this.user_role = roleParts[1] || "";
    // } else {
    //   this.user_level = "";  // Default safe values
    //   this.user_role = "";
    // }

    // if (this.hasPermission('Company', ["Administrator"])) {
    //   this.items = [
    //     { title: "Companies", icon: "mdi-account", link: "Company" },
    //   ];
    // } else if (this.hasPermission(null, ["Administrator", "Manager"])) {
    //   this.items = [
    //     { title: "All Users", icon: "mdi-account", link: "Company" },
    //   ];
    // } else {
    //   // This will show only "Branches" if no permissions
    //   this.items = [
    //     { title: "All Users", icon: "mdi-account", link: "Company" },
    //   ];
    // }

    // this.showFAQ = store && store.user.is_new === "1";
  },
  watch: {
    "$vuetify.theme.dark": {
      handler: function (val) {
        localStorage.setItem("dark-mode", val);
      },
      deep: true,
    },
  },
  methods: {
    hasPermission(requiredLevel = null, requiredRoles = []) {
        const levelHierarchy = [
          "Company", 
          "Branch", 
          "Site", 
          "Substation", 
          "Transformer",
        ];

        // If no level is required, skip level check
        const userLevelIndex = levelHierarchy.indexOf(this.user_level);
        const requiredLevelIndex = requiredLevel ? levelHierarchy.indexOf(requiredLevel) : -1;
        const levelMatch = requiredLevel === null || userLevelIndex <= requiredLevelIndex;

        // If no roles are required, skip role check
        const roleMatch = requiredRoles.length === 0 || requiredRoles.includes(this.user_role);
        return levelMatch && roleMatch;
    },

    getInitials(name) {
      if (!name || typeof name !== "string") {
        return "N/A"; // Handle cases where name is undefined/null
      }
      
      return name
        .split(" ") // Split by space
        .map(word => word[0]) // Get first letter of each word
        .join("") // Join letters together
        .toUpperCase(); // Convert to uppercase
    },
    async signOut() {
      if(this.user.account_type == 'microsoft'){
         msalInstance.logoutRedirect();
         localStorage.removeItem("user");
          this.$router.push({ name: "Welcome" });
        }else{
          localStorage.removeItem("user");
          this.$router.push({ name: "Welcome" });
        }
    },
    closeSubscriptionsDialog() {
      this.subscriptionplan_dialog = false;
    },
    toggleHelpDialog() {
      // console.log("help");
      this.showFAQ = !this.showFAQ;
    },
    darkmode() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
    },
    showSubscription() {
      this.subscriptionplan_dialog = true;
    },
  },
  /*beforeRouteEnter(to, from, next) {
    next((vm) = {
      // set title based on the route name
      vm.title = to.name;
    });
  },*/
};
</script>
