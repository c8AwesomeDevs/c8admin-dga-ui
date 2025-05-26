<template>
    <div>
        <div class="pa-3">
            <loading-overlay :visible="page_load" />
            <v-card>
                <v-card-text>
                    <v-row style="padding:30px">
                        <v-col cols="12" sm="4" style="text-align: center; padding: 30px;">
                            <v-avatar color="red" size="150" class="mb-3">
                                <!--v-img v-if="profilePicture" :src="profilePicture" alt="Profile Picture"></v-img-->
                                <span style="color: white; user-select: none; font-size: 60px">{{ getInitials(user.name) }}</span>
                            </v-avatar>

                            <!-- File Input-->
                            <v-file-input
                                v-model="user.profile_picture"
                                accept="image/*"
                                label="Upload Profile Picture (Optional)"
                                truncate-length="50"
                                dense
                                outlined
                                class="mt-3"
                            ></v-file-input>
                        </v-col>
                        <v-divider vertical></v-divider>
                        <v-col cols="12" sm="8" style="text-align: center; padding: 30px;">
                            <v-row>
                                <v-col cols="12" sm="12">
                                    <v-text-field v-model="user.name" color="red darken-2" label="Full Name" dense outlined hide-details readonly></v-text-field>
                                </v-col>

                                <v-col cols="12" sm="12">
                                    <v-text-field v-model="user.email" color="red darken-2" label="Work Email" dense outlined hide-details readonly></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <v-text-field v-model="user.account_type" color="red darken-2" label="Account Type" dense outlined hide-details readonly></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <v-text-field v-model="user.created_at" color="red darken-2" label="Created At" dense outlined hide-details readonly></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="12">
                                    <v-text-field
                                        color = "red darken-2"
                                        v-model="user.role.name"
                                        label="Selected Role"
                                        data-vv-name="select"
                                        required
                                        readonly
                                    ></v-text-field>
                                </v-col>
                            </v-row>    
                        </v-col>
                        </v-row>

                    <v-toolbar dark dense color="red darken-2">
                        <v-toolbar-title>Assigned Assets</v-toolbar-title>
                        <v-spacer></v-spacer>
                    </v-toolbar>

                    
                    <v-container class="pa-8" v-if="hierarchy.length > 0">
                        <v-row>
                            <v-col class="pa-5">
                                <v-sheet class="mb-3">
                                <v-text-field
                                    v-model="assetSearch"
                                    label='Search for Branch/Site/Substation/Transformer ...'
                                    prepend-inner-icon="mdi-magnify"
                                    variant="outlined"
                                    clearable
                                    hide-details
                                    single-line
                                    dense
                                ></v-text-field>
                                </v-sheet>

                                <v-treeview 
                                    v-if="hierarchy.length > 0"
                                    v-model="tree" 
                                    :items="hierarchy"
                                    item-key="custom_id"
                                    item-text="name"
                                    selected-color="red" 
                                    selectable
                                    :selection-type="'independent'"
                                    :search="assetSearch"
                                    disable-per-node
                                    return-object
                                >
                                </v-treeview>
                            </v-col>

                            <v-divider vertical></v-divider>

                            <v-col class="pa-5" cols="6">
                                <p class="font-weight-medium"> Selected Assets: </p>

                                <p v-if="!tree.length">No selections found!</p>
                                <v-chip
                                    v-for="(selection,i) in tree"
                                    :key="i"
                                    color="green"
                                    dark
                                    class="ma-1"
                                >
                                    {{ selection.name }}
                                </v-chip>
                            </v-col>
                        </v-row>
                    </v-container>
                    <v-container v-else class="d-flex justify-center align-center pa-10" style="height: 100%;">
                        <p class="font-weight-medium pa-0">You have no assets assigned to you yet.</p>
                    </v-container>
                </v-card-text>
            </v-card>
        </div>
    </div>
</template>

<style scoped>
.treeview-item {
    background-color: #4caf50 !important; /* Green background */
    color: white !important; /* White text */
    font-weight: bold;
    border-radius: 5px;
}
</style>

<script>
import LoadingOverlay from "@/components/LoadingOverlay.vue";
import axios from "axios";
import { initializeUsers } from "@/utils/authUtils.js";

export default {
    components: {
        LoadingOverlay,
    },
    data() {
        return {
            page_load: true,

            assetSearch: "",
            tree: [],
            user: {},
            selected_role: null,
            roles: [
                { header: "Branch Roles"},
                "Branch Manager",
                { header: "Site Roles" },
                "Site Manager",
                "Site View/Edit",
                "Site View",
                { divider: true },
                { header: "Substation Managers" },
                "Substation Manager",
                "Substation View/Edit",
                "Substation View",
                { divider: true },
                { header: "Transformer Managers" },
                "Transformer View/Edit",
                "Transformer View",
            ],
            hierarchy: []
        };
    },  
    created() {
        this.$store.commit("setTitle", "User Profile");
    },
    async mounted() {
        this.user = JSON.parse(localStorage.getItem("user")).user;
        if(this.user.created_at){
            this.user.created_at = new Date(this.user.created_at).toLocaleDateString();
        }

        if(!this.user.role){
            this.user.role = {name: "No Role"};
        }

        const token = await initializeUsers();
        await this.makeAuthenticatedRequest(token);

        this.page_load = false;
        // this.startTokenRefreshChecker();
    },
    beforeDestroy() {
        clearInterval(this.tokenRefreshInterval); // Clear interval when component is destroyed
    },
    methods: {
        async makeAuthenticatedRequest(token) {
            if (token != null) {
                await this.getHierarchy();
                await this.viewAssets();
            } else {
                this.showUnauthorizedDialog();
            }
            this.authUser =  JSON.parse(localStorage.getItem("user")).user;
            // console.log("User: ", this.authUser);
        },

        showUnauthorizedDialog() {
        this.validation_dialog = true;
        this.dialogMessage = 'Unauthorized';
        },
            
        getHierarchy(){ 
            axios({
                url: process.env.VUE_APP_BASEURL + '/hierarchyBranch',
                method: "GET",
                headers: { 
                    Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token 
                },
            }).then((res) => {
                this.hierarchy = this.modifyHierarchy(res.data, "Branch");
                // console.log("Hierarchy: ", this.hierarchy);
            }).catch((err) => {
                this.loading = false;
                console.log(err);
            });
        },

        viewAssets() {
            const user = JSON.parse(localStorage.getItem("user"));

            const id = user.user.id;
            console.log()
            const token = user.token;

            axios({
                url: process.env.VUE_APP_BASEURL + "/users/" + id + "/elements",
                method: "GET",
                headers: {
                Authorization: "Bearer " + token,
                },
            }).then((res) => {
                if (res.data.user_elements.length > 0) {
                    this.tree = res.data.user_elements.map(item => {
                        if (!item.path) return { ...item, type: "unknown" };

                        const levels = item.path.split("\\");
                        const depth = levels.length;

                        let type;
                        switch (depth) {
                            case 1:
                                type = "Site";
                                break;
                            case 2:
                                type = "Substation";
                                break;
                            case 3:
                                type = "Transformer";
                                break;
                            default:
                                type = "unknown";
                        }

                        return {
                            ...item,
                            type, 
                            custom_id: `${type}-${item.id}`
                        };
                    });
                }          
                else if(res.data.user_branches.length > 0){
                    this.tree = res.data.user_branches;

                    this.tree = this.tree.map(item => ({
                    ...item,
                    custom_id: `${'Branch'}-${item.id}`
                }));
                }
                
                    console.log("TREE: ", this.tree);
            })
        },

        modifyHierarchy(items, type) {
            if (!Array.isArray(items)) {
                return []; // Ensure `items` is an array
            }

            return items.map(item => {
                const children = item.elements?.length ? item.elements 
                            : item.children?.length ? item.children 
                            : []; // Get children from `elements` or fallback to `children`

                return {
                id: item.id,
                name: item.branch_name ?? item.name, // Use `branch_name`, else fallback to `name`
                custom_id: `${type}-${item.id}`, // Custom ID for treeview
                type: type,
                children: this.modifyHierarchy(children, this.getNextType(type)) // Recursively process children
                };
            });
        },
        getNextType(currentType) {
            const typeMap = {
                Branch: "Site",
                Site: "Substation",
                Substation: "Transformer"
            };
            
            return typeMap[currentType] || "unknown"; // Default type if unknown
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
        customItemClass(item) {    
            // console.log("Checking:", item.name, this.selectedIds.includes(item.id)); 
            return this.selectedIds.includes(item.id) ? "selected-item" : "";
        },
    }
};
</script>