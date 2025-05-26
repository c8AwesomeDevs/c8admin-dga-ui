<template>
  <div>
    <div class="pa-3">
      <loading-overlay :visible="page_load" />

      <template>
      <v-card>
        <v-sheet class="pa-3 d-flex align-center justify-space-between" dark color="red darken-2" style="color: white;">
          <div class="d-flex align-center" style="gap: 10px;">
            <v-select
              v-model="selectView"
              :items="['Show All Users', 'Show By Assets']"
              class="mx-2"
              return-object
              single-line
              hide-details
              style="max-width: 160px;"
              @change="refreshSearch"
            ></v-select>
          </div>

          <v-btn v-if="hasPermission(null, ['Administrator']) && subscription != 'demo'" small color="success" @click="addUsersDialog()">
            <v-icon>mdi-plus</v-icon>
            Add User
          </v-btn>
          
          <v-btn v-if="hasPermission(null, ['Manager']) && subscription != 'demo'" small color="success" @click="assignUserDialog()">
            <v-icon>mdi-plus</v-icon>
            Assign a user
          </v-btn>
        </v-sheet>

        <v-card-text>
          <div v-if="selectView === 'Show All Users'">
          <div class="d-flex flex-grow-1" style="gap: 10px;">
            <v-select
              v-model="selectSearch"
              :items="searchOptions"
              label="Search by"
              dense
              outlined
              class="mx-2"
              style="max-width: 150px;"
            ></v-select>

            <v-text-field
              v-model="tableSearch"
              label="Search for"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              clearable
              hide-details
              single-line
              dense
              class="mx-2"
            ></v-text-field>
          </div>

          <!-- Show all users table -->
          <v-data-table
            :headers="headers" 
            :items="filteredUsers"
            :search="tableSearch"
            item-key="name" 
          >
            <template v-slot:item="{ item }">
              <tr>
                <td>
                  <v-avatar size="30" color="red">
                    <span style="color: white; user-select: none">{{ getInitials(item.name) }}</span>
                  </v-avatar>
                </td>
                <td class="font-sm">{{ item.name }}</td>
                <td class="font-sm">{{ item.email }}</td>
                <td class="font-sm">{{ item.account_type }}</td>
                <td class="font-sm">{{ item.created_at }}</td>
                <!--td class="font-sm">
                  {{ item.account_level }}
                </td-->
                <td class="font-sm">
                  <span v-if="item.role">{{ item.role_name }}</span>
                  <span v-else>Not Assigned</span>
                </td>
                <!--td class="font-sm">
                  <v-btn :disabled="item.account_level == 'company_admin'" block small @click="viewAssets(item)" depressed>Assets</v-btn>
                </td-->
                <td class="font-sm">
                  <v-btn v-if="hasPermission(null, ['Administrator', 'Manager'])" icon @click="goToProfile(item)" depressed>
                    <v-icon small> mdi-eye </v-icon>
                  </v-btn>
                  <v-btn v-if="assetPermission(item) && item.id != authUser.id" icon @click="updateUserDialog(item)" depressed>
                    <v-icon small> mdi-square-edit-outline </v-icon>
                  </v-btn>
                  <v-btn v-if="assetPermission(item) && item.id != authUser.id" icon @click="updateAssetDialog(item)" depressed>
                    <v-icon small> mdi-cube-send </v-icon>
                  </v-btn>
                  <v-btn v-if="assetPermission(item) && item.id != authUser.id" icon color="red" @click="deleteUserDialog(item)" depressed>
                    <v-icon small> mdi-delete-empty-outline </v-icon>
                  </v-btn>
                </td>
              </tr>
            </template>
          </v-data-table>
          </div>

          <!--Show by assets view-->
          <v-row v-if="selectView === 'Show By Assets'">
            <v-col cols="12" sm="2">
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
 
              <v-treeview
                ref="assetTree"
                class="pointer"
                :items="treeDataFiltered"
                item-text="name"  
                item-key="custom_id"
                selection-type="independent"
                hoverable
                activatable
                dense
                return-object
                @update:active="checkAsset"
              >

                <template v-slot:prepend="{ item }">
                  <v-icon> mdi-cube </v-icon>
                </template>
                <template v-slot:label="{ item }">
                  <v-tooltip 
                    right
                    open-delay="500"  
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <span v-bind="attrs" v-on="on">{{ item.name }}</span>
                    </template>
                    <span>{{ item.custom_id }}</span>
                  </v-tooltip>
                </template>
              </v-treeview>
            </v-col>

            <v-divider vertical></v-divider>

            <v-col cols="12" sm="10">
              <div class="d-flex flex-grow-1" style="gap: 10px;">
                <v-select
                  v-model="selectSearch"
                  :items="searchOptions"
                  label="Search by"
                  dense
                  outlined
                  class="mx-2"
                  style="max-width: 150px;"
                ></v-select>

                <v-text-field
                  v-model="tableSearch"
                  label="Search for"
                  prepend-inner-icon="mdi-magnify"
                  variant="outlined"
                  clearable
                  hide-details
                  single-line
                  dense
                  class="mx-2"
                ></v-text-field>
              </div>
            
              <v-data-table 
                :headers="headers" 
                :items="filteredUsersByAsset" 
                :search="tableSearch"
              >
                <template v-slot:item="{ item }">
                  <tr>
                    <td>
                      <v-avatar size="30" color="red">
                        <span style="color: white;">{{ getInitials(item.name) }}</span>
                      </v-avatar>
                    </td>
                    <td class="font-sm">{{ item.name }}</td>
                    <td class="font-sm">{{ item.email }}</td>
                    <td class="font-sm">{{ item.account_type }}</td>
                    <td class="font-sm">{{ item.created_at }}</td>
                    <td class="font-sm">{{ item.role_name }}</td>
                    <td class="font-sm">
                      <v-btn v-if="hasPermission(null, ['Administrator', 'Manager'])" icon @click="goToProfile(item)" depressed>
                        <v-icon small> mdi-eye </v-icon>
                      </v-btn>
                      <v-btn v-if="assetPermission(item) && item.id != authUser.id" icon @click="updateUserDialog(item)" depressed>
                        <v-icon small> mdi-square-edit-outline </v-icon>
                      </v-btn>
                      <v-btn v-if="assetPermission(item) && item.id != authUser.id" icon @click="updateAssetDialog(item)" depressed>
                        <v-icon small> mdi-cube-send </v-icon>
                      </v-btn>
                      <v-btn v-if="assetPermission(item) && item.id != authUser.id" icon color="red" @click="deleteUserDialog(item)" depressed>
                        <v-icon small> mdi-delete-empty-outline </v-icon>
                      </v-btn>
                    </td>
                  </tr>
                </template>
              </v-data-table>
            </v-col>  
          </v-row>
        </v-card-text>
      </v-card>
      </template>
    </div>



    <!-- possible assets -->
    <v-dialog width="80%" persistent v-model="test">
      <v-card>
        <!-- <v-progress-linear v-if="saving" indeterminate color="red darken-2"> </v-progress-linear> -->
        <v-row no-gutters>
          <v-col>
            <v-card-actions>
              <h3 class="pa-2">
                Select Assets for <span class="red--text uppercase"> {{ user.name }}</span>
              </h3>
              <v-spacer></v-spacer>
              <v-btn @click="test = false" text><v-icon>mdi-close</v-icon></v-btn>
            </v-card-actions>

            <v-list dense>
              <!-- <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="text-h6">
                  Select Assets for <span class="red--text uppercase">{{ user.name }}</span>
                  <v-spacer></v-spacer>
          <v-btn @click="updUserDialog = false" text><v-icon>mdi-close</v-icon></v-btn>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item> -->
              <v-divider></v-divider>
              <!-- list elements -->
              <!-- <v-list-item v-for="e in elements" :key="e.id" @click="toggleUserAsset(e.id)">
              <v-btn :color="user_elements.indexOf(e.id) >= 0 ? 'red' : 'grey'" small icon>
                <v-icon>mdi-check-circle</v-icon>
              </v-btn>
              &nbsp;
              <v-list-item-content>
                {{ e.path }}
              </v-list-item-content>
            </v-list-item> -->

              <v-list-item>
                <v-treeview class="pointer" v-if="hierarchy.length > 0" v-model="tree" selected-color="red" :items="hierarchy" selectable item-key="id">
                  <template v-slot:prepend="{ item }">
                    <v-icon class="pointer"> mdi-cube </v-icon>
                  </template>
                </v-treeview>
                <!-- <v-treeview :items="elements" selectable></v-treeview> -->
              </v-list-item>

              <v-divider></v-divider>
              <v-list-item class="pa-2 pb-1">
                <v-spacer></v-spacer>
                <!-- <v-btn class="mx-1" small @click="sendUpdatedAssets" depressed>Save</v-btn> -->
                <v-btn :disabled="loading" depressed color="blue" text apend-icon="mdi-content-save-plus-outline" elevation="3" small @click="sendUpdatedAssets()"
                  >{{ loading ? "Saving..." : "Save" }}<v-icon v-if="!loading" right dark>mdi-content-save-plus-outline</v-icon></v-btn
                >
                <!-- <v-btn class="mx-1" small @click="assets_dialog = false" depressed>Close</v-btn> -->
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>

    <!-- validation-->
    <v-dialog v-model="validation_dialog" max-width="350" min-width="300">
      <template>
        <v-card>
          <div>
            <span>
              <v-icon color="orange" class="icon ml-3 mt-3"> mdi-alert-circle-outline </v-icon>
              <span class="demo-check">
                {{ dialogMessage }}
              </span>
            </span>
          </div>
          <v-card-actions class="justify-end">
            <v-btn dark small color="red" text @click="validation_dialog = false">OK</v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>

    <!-- Add new user dialog >
    <v-dialog v-model="UsersDialog" persistent max-width="500px">
      <v-card>
        <v-card-actions>
          <v-card-title>New User Profile</v-card-title>
          <v-spacer></v-spacer>
          <v-btn @click="closeUserdialog()" text><v-icon>mdi-close</v-icon></v-btn>
        </v-card-actions>

        <v-card-text>
          <v-row dense>
            <v-col cols="12" sm="6">
              <v-text-field v-model="newUser.firstName" color="red darken-2" label="First Name" dense outlined hide-details></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field v-model="newUser.lastName" color="red darken-2" label="Last Name" dense outlined hide-details></v-text-field>
            </v-col>
            <v-col cols="12" sm="12">
              <v-text-field v-model="newUser.email" color="red darken-2" label="Work Email" dense outlined hide-details></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn :disabled="loading" depressed color="blue" text apend-icon="mdi-content-save-plus-outline" elevation="3" small @click="addUser()"
            >{{ loading ? "Saving..." : "Save" }}<v-icon v-if="!loading" right dark>mdi-content-save-plus-outline</v-icon></v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog-->
    
    <!-- Add new user dialog (revised)-->
    <v-dialog v-model="UsersDialog" persistent width="70%" scrollable>
      <v-card>
        <v-toolbar dark dense color="red">
          <v-card-title>New User Profile</v-card-title>
          <v-spacer></v-spacer>
          <v-btn @click="closeUserdialog()" text><v-icon>mdi-close</v-icon></v-btn>
        </v-toolbar>
        
        <v-progress-linear v-if="loading" indeterminate color="#60ab91"></v-progress-linear>

        <v-card-text>
          <v-form ref="createProfileForm" v-model="createProfileValid">
          <v-row style="padding:30px">
            <v-col cols="12" sm="4" style="text-align: center; padding: 30px;">
              <v-avatar color="red" size="150" class="mb-3">
                <v-img v-if="profilePicture" :src="profilePicture" alt="Profile Picture"></v-img>
                <span v-else style="color: white; user-select: none; font-size: 60px">{{ getInitials(user.name) }}</span>
              </v-avatar>

              <!-- File Input-->
              <v-file-input
                v-model="newUser.profile_picture"
                accept="image/*"
                label="Upload Profile Picture (Optional)"
                truncate-length="50"
                dense
                outlined
                class="mt-3"
                @change="onFileChange"
              ></v-file-input>
            </v-col>
            <v-divider vertical></v-divider>
            <v-col cols="12" sm="8" style="text-align: center; padding: 30px;">
              <v-row>
                <v-col cols="12" sm="6" class="pb-0">
                  <v-text-field 
                    :rules="firstNameRules" 
                    v-model="newUser.firstName" 
                    color="red darken-2" 
                    label="First Name (Required)" 
                    dense 
                    outlined
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" class="pb-0">
                  <v-text-field 
                    :rules="lastNameRules" 
                    v-model="newUser.lastName" 
                    color="red darken-2" 
                    label="Last Name (Required)" 
                    hide-details="auto"
                    dense  
                    outlined
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="12"  class="pb-0">
                  <v-text-field 
                    :rules="emailRules"
                    v-model="newUser.email" 
                    color="red darken-2" 
                    label="Work Email (Required)" 
                    dense 
                    outlined
                    required
                  ></v-text-field>
                </v-col>
                <v-select
                  color = "red darken-2"
                  v-model="selectedRole"
                  :items="user_roles"
                  item-key="name"
                  item-text="name"
                  label="Select Role (Optional)"
                  data-vv-name="select"
                  return-object
                >
                </v-select>
                
              </v-row>
              <!--v-row>
                <pre>{{ selectedRole }}</pre>
              </v-row-->
            </v-col>
          </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn :disabled="loading" depressed color="success" light apend-icon="mdi-content-save-plus-outline" elevation="3"  @click="addUser()"
            >{{ loading ? "Adding..." : "Add" }}<v-icon v-if="!loading" right>mdi-content-save-plus-outline</v-icon></v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="nextStepDialog" max-width="350" min-width="300" persistent>
      <v-card>
        <v-card-text class = "pb-0 py-5">  
          <v-row>
            <v-col cols="2">
              <v-icon color="info" class="icon ml-3 mt-3"> mdi-information-outline </v-icon>
            </v-col>
            <v-col>
              <span>
                Would you like to assign assets for this user?
              </span>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions class="justify-end">
          <v-btn @click="nextStepDialog = false" color="red" text> No </v-btn>
          <v-btn @click="nextStepDialog = false; assets_dialog = true" color="success" text> Yes </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
    <!-- Update User dialog 
    <v-dialog v-model="updUserDialog" persistent max-width="500px">
      <v-card>
        <v-card-actions>
          <v-card-title>Update User Details</v-card-title>
          <v-spacer></v-spacer>
          <v-btn @click="updUserDialog = false" text><v-icon>mdi-close</v-icon></v-btn>
        </v-card-actions>

        <v-card-text>
          <v-row dense>
            <v-col cols="12" sm="12">
              <v-text-field v-model="user.name" color="red darken-2" label="Name" dense outlined hide-details></v-text-field>
            </v-col>
            <v-col cols="12" sm="12">
              <v-text-field v-model="user.email" color="red darken-2" label="Work Email" dense outlined hide-details></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider></v-divider>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn :disabled="loading" elevation="1" color="red" text apend-icon="mdi-content-save-plus-outline" small @click="updateUser(user.id)">
            {{ loading ? "Loading..." : "Update" }}
            <v-icon v-if="!loading" right dark>mdi-content-save-plus-outline</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    -->

    <!-- Update User dialog (revised)-->
    <v-dialog v-model="updUserDialog" persistent width="70%" scrollable>
      <v-card>
        <v-toolbar dark dense color="red">
          <v-card-title>User Profile for {{ user.name }}</v-card-title>
          <v-spacer></v-spacer>
          <v-btn @click="closeUpdUserDialog()" text><v-icon>mdi-close</v-icon></v-btn>
        </v-toolbar>

        <v-progress-linear v-if="loading" indeterminate color="#60ab91"></v-progress-linear>

        <v-card-text>
          <v-form ref="createProfileForm" v-model="createProfileValid">
          <v-row class="px-8 pt-8">
            <v-col cols="12" sm="4" style="text-align: center; padding: 30px;">
              <v-avatar color="red" size="150" class="mb-3">
                <v-img v-if="profilePicture" :src="profilePicture" alt="Profile Picture"></v-img>
                <span v-else style="color: white; user-select: none; font-size: 60px">{{ getInitials(user.name) }}</span>
              </v-avatar>

              <!-- File Input-->
              <v-file-input
                v-model="newUser.profile_picture"
                accept="image/*"
                label="Upload Profile Picture (Optional)"
                truncate-length="50"
                dense
                outlined
                class="mt-3"
                @change="onFileChange"
              ></v-file-input>
            </v-col>
            <v-divider vertical></v-divider>
            <v-col cols="12" sm="8" style="text-align: center; padding: 30px;">
              <v-row>
                <v-col cols="12" sm="6" class="pb-0">
                  <v-text-field 
                    :rules="firstNameRules" 
                    v-model="user.firstName" 
                    color="red darken-2" 
                    label="First Name (Required)" 
                    dense 
                    outlined
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" class="pb-0">
                  <v-text-field 
                    :rules="lastNameRules" 
                    v-model="user.lastName" 
                    color="red darken-2" 
                    label="Last Name (Required)" 
                    hide-details="auto"
                    dense  
                    outlined
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="12"  class="pb-0">
                  <v-text-field 
                    :rules="emailRules"
                    v-model="user.email" 
                    color="red darken-2" 
                    label="Work Email (Required)" 
                    dense 
                    outlined
                    required
                  ></v-text-field>
                </v-col>
                <v-select
                  color = "red darken-2"
                  v-model="selectedRole"
                  :items="filteredRolesForUpdate"
                  item-key="name"
                  item-text="name"
                  label="Select Role (Optional)"
                  data-vv-name="select"
                  return-object
                >
                </v-select>
                
              </v-row>
              <!--v-row>
                <pre>{{ selectedRole }}</pre>
              </v-row-->
            </v-col>
          </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn :disabled="loading" depressed color="info" light apend-icon="mdi-content-save-edit-outline" elevation="3"  @click="updateUser()"
            >{{ loading ? "Updating..." : "Update" }}<v-icon v-if="!loading" right>mdi-content-save-edit-outline</v-icon></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="assignDialog" persistent width="80%">
      <v-card>
        <v-toolbar dense dark color="red">
          <h3 class="pa-2">
            Assign Role and Assets for User
          </h3>
          <v-spacer></v-spacer>
          <v-btn @click="assignDialog = false" text><v-icon>mdi-close</v-icon></v-btn>
        </v-toolbar>

          <v-card-text>
            <v-row class="pa-8">
              <div style="width: 100%;">
                <v-form
                  class="d-flex align-center" style="gap: 10px;"
                  ref="searchUserForm"
                  v-model="searchUserValid"
                  @submit.prevent="searchForUser"
                >
                  <v-text-field
                    v-model="searchUser"
                    :rules="userSearchRules"
                    required
                    label="Search for user to assign under your asset"
                  ></v-text-field>
                  <v-btn :disabled="loading" depressed color="info" light apend-icon="mdi-content-save-plus-outline" elevation="3"  @click="searchForUser()"
                  >{{ loading ? "Searching..." : "Search" }}<v-icon v-if="!loading" right>mdi-magnify</v-icon></v-btn> 
                </v-form>
              </div>

              <v-container v-if="userFound">
                <v-row>
                  <v-select
                    color = "red darken-2"
                    v-model="user.role"
                    :items="filteredRoles"
                    item-key="name"
                    item-text="name"
                    label="Select Role (Required)"
                    data-vv-name="select"
                    return-object
                  >
                  </v-select>
                </v-row>
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
                      :items="filteredAssets"
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
                      {{ selection.name }} <v-btn color="error" icon small fab @click="tree.splice(i,1)"><v-icon>mdi-close</v-icon></v-btn>
                    </v-chip>
                  </v-col>
                  
                  <v-card-actions class="pa-4">
                    <v-spacer></v-spacer>
                    <v-btn :disabled="loading" depressed color="info" light apend-icon="mdi-content-save-plus-outline" elevation="3"  @click="assignUser()"
                      >{{ loading ? "Updating..." : "Update" }}<v-icon v-if="!loading" right>mdi-content-save-plus-outline</v-icon></v-btn
                    > 
                  </v-card-actions>
                  <!--pre 
                    v-for="(selection,i) in tree"
                    :key="i"
                  >
                    {{ selection }}
                  </pre-->
                </v-row>
              </v-container>
            </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
    
    <v-dialog v-model="assets_dialog" persistent max-width="70%" scrollable>
      <v-card>
        <v-toolbar dense dark color="red">
          <v-card-title>Assign Assets for {{ user.name }}</v-card-title>
          <v-spacer></v-spacer>
          <v-btn @click="assets_dialog = false; refreshInputs()" text><v-icon>mdi-close</v-icon></v-btn>
        </v-toolbar>

        <v-progress-linear v-if="loading" indeterminate color="#60ab91"></v-progress-linear>  

        <v-card-text class="pa-8">
          <v-row>
            <v-text-field 
              v-model="selectedRole"
              disabled
              outlined
              label="User Role"
            ></v-text-field>
          </v-row>
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
                ref="assetTree"
                v-model="tree" 
                :items="filteredAssets"
                item-key="custom_id"
                item-text="name"
                selected-color="red" 
                selectable
                :selection-type="'independent'"
                :search="assetSearch"
                return-object
                open-all
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
                {{ selection.name }} <v-btn color="error" icon small fab @click="tree.splice(i,1)"><v-icon>mdi-close</v-icon></v-btn>
              </v-chip>
            </v-col>
            
            <!--pre 
              v-for="(selection,i) in tree"
              :key="i"
            >
              {{ selection }}
            </pre-->
          </v-row>
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn :disabled="loading" depressed color="info" light apend-icon="mdi-content-save-plus-outline" elevation="3"  @click="sendUpdatedAssets()"
            >{{ loading ? "Updating..." : "Update" }}<v-icon v-if="!loading" right>mdi-content-save-plus-outline</v-icon></v-btn
          > 
        </v-card-actions>
      </v-card>

      <!--v-card>
        <v-sheet class="pa-3 d-flex align-center white" dark color="red darken-2">
          <h3 class="pa-2">
            Assigning Assets
          </h3>
        </v-sheet>
        <v-card-text>
            <v-container 
              v-if="!selectedRole.id"  
              class="d-flex justify-center align-center"
            >
              <p>Please select a role first to proceed assigning assets.</p>
            </v-container>

            <v-container v-if="!assignDialog && selectedRole.id">
              <v-btn @click="assignDialog = true" color="info" block depressed>
                Assign an asset for user <v-icon>mdi-plus</v-icon>
              </v-btn>
            </v-container>
            
            <v-row v-if="assignDialog && selectedRole.id">
            <v-col class="pa-3">
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
                :items="filteredAssets"
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
            
            <pre 
              v-for="(selection,i) in tree"
              :key="i"
            >
              {{ selection }}
            </pre>
          </v-row>
        </v-card-text>
      </v-card-->
    </v-dialog>

    <!-- Delete User dialog -->
    <v-dialog v-model="delUserDialog" persistent max-width="500px">
      <v-card>
        <v-card-actions>
          <v-card-title>Delete User</v-card-title>
          <v-spacer></v-spacer>
          <v-btn @click="delUserDialog = false" text><v-icon>mdi-close</v-icon></v-btn>
        </v-card-actions>

        <v-card-text> You are about to delete User: {{ user.name }} ({{ user.email }}) </v-card-text>
        <v-card-text> Clicking confirm will delete this user's login credentials and access to the company's assets. </v-card-text>
        <v-card-text>Note : This action cannot be undone.</v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn :disabled="loading" x-small depressed color="red" text apend-icon="mdi-content-save-plus-outline" small @click="deleteUser(user.id)">
            {{ loading ? "Loading..." : "Confirm" }}
            <v-icon v-if="!loading" small right dark>mdi-content-save-plus-outline</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!--User Profile dialog-->
    <v-dialog v-model="profileDialog" persistent :scrollable=false max-width="70%">
    <v-card>
      <v-toolbar dark dense color="red">
        <v-card-title>User Profile</v-card-title>
        <v-spacer></v-spacer>
        <v-btn @click="profileDialog = false; refreshInputs()" text><v-icon>mdi-close</v-icon></v-btn>
      </v-toolbar>
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

      <v-container v-if="loading" fill-height class="pa-5">
        <v-layout column justify-center align-center>
          <v-progress-circular
            indeterminate             
            size="70"
            width="7"
            color="#60ab91"
          />
        </v-layout>
      </v-container>

      <v-container v-if="loading === false" class="pa-8">
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

              <!-- <v-treeview 
                v-if="hierarchy.length > 0"
                v-model="tree" 
                :items="filteredAssets"
                item-key="custom_id"
                item-text="name"
                selected-color="red" 
                selectable
                :selection-type="'independent'"
                :search="assetSearch"
                disable-per-node
                return-object
              >
              </v-treeview> -->
              <!-- <v-treeview 
                class="view-only-tree"
                v-if="hierarchy.length > 0"
                :items="filteredAssets"
                item-key="custom_id"
                item-text="name"
                :search="assetSearch"
                hoverable
                open-on-click
              >
                <template v-slot:label="{ item }">
                  <span :style="{ fontWeight: isAssetSelected(item) ? 'bold' : 'normal', color: isAssetSelected(item) ? 'green' : 'inherit' }">
                    {{ item.name }}
                  </span>
                </template>
              </v-treeview> -->
              <v-treeview 
                ref="assetTree"
                class="view-only-tree"
                v-if="hierarchy.length > 0"
                :items="filteredAssets"
                item-key="custom_id"
                item-text="name"
                :search="assetSearch"
                hoverable
                open-on-click
                open-all
              >
              <template v-slot:label="{ item }">
                <span
                  :style="{
                    fontWeight: isAssetSelected(item) ? 'bold' : 'normal',
                    color: isAssetSelected(item) ? 'green' : 'inherit',
                    backgroundColor: isAssetSelected(item) ? 'rgba(0, 128, 0, 0.2)' : 'transparent',
                    display: 'inline-block',
                    width: '100%',
                    padding: '4px 8px',
                    borderRadius: '4px'
                  }"
                >
                  {{ item.name }}
                </span>
              </template>

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
            
            <!--pre 
              v-for="(selection,i) in tree"
              :key="i"
            >
              {{ selection }}
            </pre-->
          </v-row>
        </v-container>

      </v-card-text>
  </v-card>
  </v-dialog>

    <v-snackbar v-model="success_dialog" light>
      <v-icon color="green">mdi-check</v-icon>
      {{ successMessage }}
    </v-snackbar>

  </div>
</template>

<style scoped>

.uppercase {
  text-transform: uppercase;
}

.v-application .grey--text {
  color: #d9d9d9 !important;
}

.text-h6 {
  font-size: 16px !important;
}

.demo-check {
  font-size: 13px;
  white-space: pre;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 1em;
  margin-right: 1em;
}

.icon {
  font-size: 25px;
}

.pointer {
  cursor: pointer;
}
</style>
<script>
import LoadingOverlay from "@/components/LoadingOverlay.vue";
import axios from "axios";
import { initializeUsers, startTokenRefreshChecker } from "@/utils/authUtils.js";
import { msalInstance } from "vue-msal-browser"
import { refreshGoogleToken } from '@/utils/authUtils';
import { jwtDecode } from 'jwt-decode'; // Ensure jwt-decode is installed
import { f } from "vue-phone-number-input/dist/vue-phone-number-input.common";
import { isDOMElement, time } from "highcharts";
import { thresholdScott } from "d3";
import { nextTick } from 'vue';

export default {
  beforeRouteEnter(to, from, next) {
    document.title = `C8 Vortex - ${to.meta.title || ''}`;
    next();
  },
  beforeRouteUpdate(to, from, next) {
    document.title = `C8 Vortex - ${to.meta.title || ''}`;
    next();
  },
  name: "Users",
  components: {
    LoadingOverlay,
  },
  data() {
    return {
      loading: false,
      selectedAsset: [],
      assetTree: [],
      page_load: true,
      searchUserValid: false,
      profileDialog: false,
      userFound: false,
      searchUser: "",
      assignDialog: false,
      authUser: "",
      user_full_role: "",
      user_level: "",
      user_role: "",
      test: false,
      treeElement: [],
      createProfileValid: false,
      updateProfileValid: false,
      openNodes: [],

      /*-----Rules-----*/
      firstNameRules: [
        v => !!v || 'First Name is required',
      ],
      lastNameRules: [
        v => !!v || 'Last Name is required',
      ],
      emailRules: [
        v => !!v || 'Email is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
      roleRules: [
        v => !!v || '',
      ],
      userSearchRules: [
        v => !!v || 'User is required',
      ],

      /*-----Search Data-----*/
      tableSearch: '',
      assetSearch: '',

      /*-----Select Data-----*/
      selectedRole: 'No Role',

      selectSearch: 'Name',
      selectView: 'Show All Users',

      searchOptions: [
        "Name", 
        "Email", 
        "Created At",
        "Account Type", 
        "User Role"
      ],
      fieldMap: {
        "Name": "name",
        "Email": "email",
        "Created At": "created_at",
        "Account Type": "account_type",
        "User Role": "role_name",
      },

      loading: false,

      /*-----API Data-----*/
      newUser: {},
      selected_user: {},
      user_roles: [],
      initHierarchy: [],
      hierarchy: [],
      users: [],
      elements: [],
      branches: [],
      user_elements: [],
      
      nextStepDialog: false,

      // Message to display for successes
      success_dialog: false,
      successMessage: "",

      // Message to display for errors
      validation_dialog: false,
      dialogMessage: "",
      
      /*-----Dialog Elements-----*/
      assets_dialog: false,
      UsersDialog: false,
      delUserDialog: false,
      updUserDialog: false,
      profilePicture: null,
      assignDialog: false,
      
      usersByAsset: [],

      user: {
        name: "",
        role: {
          id: "",
        }
      },

      saving: false, 
      subscription: "",
      
      headers: [
        {
          text: "Image",
          align: "start",
          sotable: false,
        },
        {
          text: "Name",
          align: "start",
          sortable: true,
          value: "name",
        },
        {
          text: "Email",
          align: "start",
          sortable: true,
          value: "email",
        },
        {
          text: "Account Type",
          align: "start",
          sortable: true,
          value: "account_type",
        },
        {
          text: "Created At",
          align: "start",
          sortable: true,
          value: "created_at",
        },
        {
          text: "User Role",
          align: "start",
          sortable: true,
          value: "role_name",
        },
        {
          text: "Quick Actions",
          align: "start",
          sortable: false,
        },
      ],
      tree: [],
      selectedNodes: [],
    };
  },
  async mounted() {
    const token = await initializeUsers();
    this.subscription = JSON.parse(localStorage.getItem("user")).user.subscription.subscription_type;
    // console.log(this.subscription);
    await this.makeAuthenticatedRequest(token);

    this.page_load = false;
  },
  beforeDestroy() {
    clearInterval(this.tokenRefreshInterval); // Clear interval when component is destroyed
  },

  computed: {
    filteredRoles(){
      // console.log(this.user_level);
      if (this.user_level === "Site") {
        return this.user_roles.filter(role => 
          role.name && ["Substation", "Transformer"].some(keyword => role.name.includes(keyword))
        );
      } 
      else if (this.user_level === "Substation") {
        return this.user_roles.filter(role => 
          role.name && ["Transformer Logger", "Transformer Viewer"].some(keyword => role.name.includes(keyword))
        );
      }
    },

    filteredAssets() {
      return this.filterAssets(this.hierarchy);
    },

    filteredUsers() {
      if (!this.tableSearch) return this.users;
      const actualField = this.fieldMap[this.selectSearch];

      return this.users.filter((user) => {
        return user[actualField]?.toString().toLowerCase().includes(this.tableSearch.toLowerCase());
      });
    },
    
    filteredUsersByAsset() {
      if (!this.tableSearch) return this.usersByAsset;
      const actualField = this.fieldMap[this.selectSearch];

      return this.usersByAsset.filter((user) => {
        return user[actualField]?.toString().toLowerCase().includes(this.tableSearch.toLowerCase());
      });
    },

    filteredRolesForUpdate() {
      const levelHierarchy = ["Company", "Branch", "Site", "Substation", "Transformer"];
      const currentLevelIndex = levelHierarchy.indexOf(this.user_level);

      const result = [];
      let tempGroup = [];
      let includeGroup = false;

      for (let i = 0; i < this.user_roles.length; i++) {
        const item = this.user_roles[i];

        if (item.header || item.divider) {
          // If a new header/divider starts, check if previous group had valid roles
          if (includeGroup) {
            result.push(...tempGroup);
          }
          // Reset buffer and flags
          tempGroup = [item];
          includeGroup = false;
        } else {
          const roleLevel = item.name?.split(" ")[0];
          const roleLevelIndex = levelHierarchy.indexOf(roleLevel);

          if (roleLevelIndex > currentLevelIndex) {
            tempGroup.push(item);
            includeGroup = true;
          }
        }
      }

      // Push final group if valid
      if (includeGroup) {
        result.push(...tempGroup);
      }

      const noRole = [
        { divider: true},
        { header: "No Role" },
        { name: "No Role", id: null },
      ]

      result.push(...noRole);
      return result;
    },

    filteredByType() {
      if (!this.assetSearch) return this.hierarchy;

      const search = this.assetSearch.toLowerCase();

      const filterByType = (nodes) => {
        return nodes
          .map(node => {
            const children = node.children ? filterByType(node.children) : [];
            const isMatch = node.type && node.type.toLowerCase().includes(search);

            if (isMatch || children.length) {
              return { ...node, children };
            }
            return null;
          })
          .filter(Boolean);
      };

      return filterByType(this.hierarchy);
    },

    treeDataFiltered() {
      if (!this.assetSearch) return this.initHierarchy;

      const search = this.assetSearch.toLowerCase();

      const filterTree = (nodes) => {
        return nodes
          .map(node => {
            const matchesName = (node.name || '').toLowerCase().includes(search);
            const matchesType = (node.type || '').toLowerCase().includes(search);

            if (matchesName || matchesType) {
              // Return node with *original children* if parent matches
              return {
                ...node,
                children: node.children ? [...node.children] : [],
              };
            }

            // Otherwise, filter children recursively
            const children = node.children ? filterTree(node.children) : [];

            if (children.length > 0) {
              return {
                ...node,
                children,
              };
            }

            return null;
          })
          .filter(Boolean);
      };

      return filterTree(this.initHierarchy);
    },
  },

  watch: {
    assetSearch(val) {
      if (!val) {
        this.openNodes = [];
        return;
      }

      // Open all nodes manually after DOM updates
      this.$nextTick(() => {
        const toggles = this.$refs.assetTree?.$el?.querySelectorAll(
          '.v-treeview-node__toggle:not(.v-treeview-node__toggle--open)'
        );
        toggles?.forEach((btn) => btn.click());
      });
    },

    selectView(newValue) {
      if(newValue === 'Show By Assets') {
        this.getUserElements;
      }
    },

    selectedRole(val) {
        this.tree = [];
        this.assetSearch = '';
        if(!val.id){
          this.assignDialog = false;
        }
    },
  },
  created () {
    this.$store.commit("setTitle", "Users");
  },
  methods: {
    getAllUsers() {
      axios({
        url: process.env.VUE_APP_BASEURL + "/users",
        method: "GET",
        headers: {
          Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token,
        },
      }).then((res) => {
        this.users = res.data;
      });
    },

    assignUser() {
      let user = {
        id: this.user.id,
        email: this.user.email,
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        role_id: this.user.role.id,
      };

      const selectedIds = this.tree.map(item => item.id);
      let elements = { assets: selectedIds };

      this.loading = true;

      axios({
        url: process.env.VUE_APP_BASEURL + "/updateUser",
        method: "PATCH",
        data: user,
        headers: { Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token },
      }).then(() => {
        axios({
          url: process.env.VUE_APP_BASEURL + `/users/${this.user.id}/elements`,
          method: "POST",
          data: elements,
          headers: { Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token },
        }).then(() => {
          this.assignDialog = false;
          this.success_dialog = true;
          this.successMessage = "User assigned successfully.";

          if(selectView === "Show By Assets"){
            this.getUsersByElement();

          }else{
            this.refreshUserTable();
          }
          this.loading = false;
        }).catch(() => { this.loading = false; });
      }).catch(() => { this.loading = false; });
    },

    searchForUser(){
      
      if(!this.$refs.searchUserForm.validate()){
        console.log("Form validation failed.");
        return;
      }

      axios({
          url: process.env.VUE_APP_BASEURL + "/searchUser/" + this.searchUser,
          method: "GET",
          headers: { Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token },
        }).then((res) => {
          let user = res.data.user;
          
          const firstName = user.name.split(" ")[0];
          const lastName = user.name.split(" ")[1];

          user.created_at = new Date(user.created_at).toLocaleDateString();
          user.firstName = firstName;
          user.lastName = lastName;

          if (user.role != null) { 
            user.role_name = user.role.name;
          } else {
            // Assign a default role object
            user.role = { 
              id: null,
              name: "No Role",
            };
            user.role_name = "No Role";
          }

          this.user = user;
          this.userFound = true;
          
        }).catch((err) => {
          this.validation_dialog = true;
          this.dialogMessage = err.response.data.message;
          this.userFound = false;
          this.loading = false;
        });
    },

    assignUserDialog(){
      this.assignDialog = true;
    },
    assetPermission(item){
      const item_role = item.role.name.split(" ")[1];
      const item_level = item.role.name.split(" ")[0];

      if(item_level === "Transformer"){
        return this.hasPermission("Substation", ["Administrator", "Manager"]);
      }else if(item_level === "Substation"){
        if(item_role === "Manager"){
          return this.hasPermission("Substation", ["Administrator"]);
        }
        else{
          return this.hasPermission("Substation", ["Administrator", "Manager"]);
        }
        return this.hasPermission("Substation", ["Administrator", "Manager"]);
      }else if(item_level === "Site"){        
        if(item_role === "Manager"){
          return this.hasPermission("Site", ["Administrator"]);
        }
        else{
          return this.hasPermission("Site", ["Administrator", "Manager"]);
        }
      }else if(item_level === "Branch"){
        return this.hasPermission("Company", ["Administrator", "Manager"]);
      }else if(item_level === "Company"){
        return false;
      }else{
        return this.hasPermission(this.user_level, ["Administrator", "Manager"]);
      }
    },
    hasPermission(requiredLevel = null, requiredRoles = []) {
        const levelHierarchy = [
          "Company", 
          "Branch", 
          "Site", 
          "Substation", 
          "Transformer"
        ];

        // If no level is required, skip level check
        const userLevelIndex = levelHierarchy.indexOf(this.user_level);
        const requiredLevelIndex = requiredLevel ? levelHierarchy.indexOf(requiredLevel) : -1;
        const levelMatch = requiredLevel === null || userLevelIndex <= requiredLevelIndex;

        // If no roles are required, skip role check
        const roleMatch = requiredRoles.length === 0 || requiredRoles.includes(this.user_role);

        return levelMatch && roleMatch;
    },

    filterAssets(items) {
      if (!Array.isArray(items)) return [];
      
      return items.map(item => ({
        ...item,
        disabled: this.isSelectable(item.type),
        children: item.children ? this.filterAssets(item.children) : []
      }));
    },

    isSelectable(type) {
      const role = this.user?.role?.name;
      const roleMapping = {
        "Branch": ["Branch Administrator"],
        "Site": ["Site Manager", "Site Logger", "Site Viewer"],
        "Substation": ["Substation Manager", "Substation Logger", "Substation Viewer"],
        "Transformer": ["Transformer Logger", "Transformer Viewer"]
      };
      
      return roleMapping[type] 
        ? !roleMapping[type].includes(role) 
        : true;
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

    refreshSearch() {
      this.tableSearch = '';
      this.selectSearch = 'Name';
      this.assetSearch = '';
    },
    /*
    getUsersByElement(element) {
      const matchingUserNames = this.user_elements
      .filter(userElement => userElement.element_id.includes(element[0]))
      .map(userElement => userElement.user_name);

      const matchingUsers = this.users.filter(user => matchingUserNames.includes(user.name));

      this.usersByAsset = matchingUsers;
    },
    */

    collectOpenNodes(currentlyOpenNodes) {
      // Remove nodes that were in openNodes but are now closed
      this.assetTree = this.assetTree.filter(id => currentlyOpenNodes.includes(id));

      // Add new nodes that are now opened
      currentlyOpenNodes.forEach(id => {
        if (!this.assetTree.includes(id)) {
          this.assetTree.push(id);
        }
      });

      console.log("Open nodes: ", this.assetTree);
    },


    checkAsset(asset) {
      this.selectedAsset = asset;
      this.usersByAsset = [];

      if (Array.isArray(asset) && asset[0] && asset[0].type) {
        if (asset[0].type === 'Branch') {
          this.getUsersByBranch(asset);
        } else if (
          asset[0].type === 'Site' ||
          asset[0].type === 'Substation' ||
          asset[0].type === 'Transformer'
        ) {
          this.getUsersByElement(asset);
        }
      } else {
        console.log('checkAsset called with:', asset);
      }
    },

    getUsersByBranch(branch) {
      axios({
        url: process.env.VUE_APP_BASEURL + "/users/" + branch[0].id + "/by-branch",
        method: "GET",
        headers: { Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token },
      }).then((res) => {
        // console.log("Users from branch: ", res);

        this.usersByAsset = this.modifyUserData(res.data);
      }).catch((err) => {
        this.loading = false;
      });
    },

    getUsersByElement(element) {
      axios({
        url: process.env.VUE_APP_BASEURL + "/users/" + element[0].id + "/by-elements",
        method: "GET",
        headers: { Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token },
      }).then((res) => {
        // console.log("Users from element: ", res);

        this.usersByAsset = this.modifyUserData(res.data);
        
      }).catch((err) => {
        this.loading = false;
      });
    },

    modifyUserData(users){
      const temp = users.map((u) => {
          const firstName = u.name.split(" ")[0];
          const lastName = u.name.split(" ")[1];

          u.created_at = new Date(u.created_at).toLocaleDateString();
          u.firstName = firstName;
          u.lastName = lastName;

          if(u.role){ 
            u.role_name = u.role.name;
          }
          else{
            u.role_name = "No Role";
          }
          
          return u;
      });
      // console.log(temp);
      return temp;
    },
    goToProfile(user) {
      this.user = user;
      this.profileDialog = true;
      this.viewAssets(user);
    },

    onFileChange(event) {
      // console.log(event);
      const file = event;
      if (file) {
        this.profilePicture = URL.createObjectURL(file);
      }
    },

    getInitials(name) {
      if (!name || typeof name !== "string") {
        return "N/A"; // Handle cases where name is undefined/null
      }
      
      return name
        .split(" ")
        .map(word => word[0]) 
        .join("")
        .toUpperCase();
    },

    splitNames(name) {
      // console.log(name);
      if (!name || typeof name !== "string") {
        return { first_name: "N/A", last_name: "N/A" };
      }

      const names = name.trim().split(" ");
      const firstName = names[0]; 
      const lastName = names.length > 1 ? names.slice(1).join(" ") : ""; 

      return { first_name: firstName, last_name: lastName };
    },

    async makeAuthenticatedRequest(token) {
      if(token != null){
        this.authUser =  JSON.parse(localStorage.getItem("user")).user;
        // console.log("User: ", this.authUser);

        //Getting user roles
        this.user_full_role = this.authUser.role.name;
        const split_role = this.user_full_role.split(" ")
        this.user_level = split_role[0];
        this.user_role = split_role[1];

        //API calls
        await this.refreshUserTable();
        await this.getRoles();
        await this.getHierarchy();


      }else{
        this.showUnauthorizedDialog();
      }
    },

      showUnauthorizedDialog() {
      this.validation_dialog = true;
      this.dialogMessage = 'Unauthorized';
    },

    addUsersDialog() {
      this.getHierarchy();
      this.UsersDialog = true;
    },
    closeUserdialog() {
      this.UsersDialog = false; 
      this.newUser = {};
      this.$refs.createProfileForm.reset();
      this.refreshInputs();
    },
    updateUserDialog(user) {
      this.user = { ...user };
      this.selectedRole = user.role;

      // console.log(user);
      if(!this.user.role){
        this.user = { 
          ...user, 
          role: { 
            id: null,
            name: "No Role",
          }
        };
      }
      this.updUserDialog = true;
    },
    updateAssetDialog(user){
      if(user?.role?.id){
        this.user = { ...user };
        this.selectedRole = user.role.name;
        this.hierarchy = [];
        this.assets_dialog = true;
        this.viewAssets(user);
      }else{
        this.validation_dialog = true;
        this.dialogMessage = "Please select a role for this user first.";
      }
    },
    /*
    getUserElements(user) {
      const selectedIds = this.user_elements
        .filter(userElement => userElement.user_name === user.name)
        .map(userElement => userElement.element_id).flat();

      console.log('selectedIds: ', selectedIds);
      this.tree = selectedIds;
    },
    */
    closeUpdUserDialog() {
      this.selectedRole = null;
      this.updUserDialog = false;
      this.refreshInputs();
    },
    refreshInputs() {
      this.selectedRole = {};
      this.tree = [];
      this.assetSearch = '';
    },
    deleteUserDialog(user) {
      this.user = user;
      // console.log(this.user.name);
      this.delUserDialog = true;
    },

    // 
    async viewAssets(user) {
      //this.startTokenRefreshChecker();
      //startTokenRefreshChecker();
      this.user = user;
      this.loading = true;

      await this.getHierarchy(); // Wait for hierarchy to be loaded
      
      const res = await axios({
        url: process.env.VUE_APP_BASEURL + "/users/" + this.user.id + "/elements",
        method: "GET",
        headers: {
          Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token,
        },
      });

      if (res.data.user_elements.length > 0) {
        this.tree = res.data.user_elements.map(item => {
          if (!item.path) return { ...item, type: "unknown" };
          const levels = item.path.split("\\");
          const depth = levels.length;

          let type;
          switch (depth) {
            case 1: type = "Site"; break;
            case 2: type = "Substation"; break;
            case 3: type = "Transformer"; break;
            default: type = "unknown";
          }

          return {
            ...item,
            type,
            custom_id: `${type}-${item.id}`
          };
        });
      } else if (res.data.user_branches.length > 0) {
        this.tree = res.data.user_branches.map(item => ({
          ...item,
          custom_id: `Branch-${item.id}`
        }));
      }

      //Generate open nodes with up-to-date hierarchy and tree
      this.openNodes = this.generateOpenNodesFromSelection(this.hierarchy, this.tree);
      this.loading = false;
    },

    // getHierarchy() {
    //   //this.startTokenRefreshChecker();

    //   return axios({
    //     url: process.env.VUE_APP_BASEURL + '/hierarchyBranch',
    //     method: "GET",
    //     headers: { 
    //       Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token 
    //     },
    //   }).then((res) => {
    //     this.hierarchy = this.modifyHierarchy(res.data, "Branch");
    //   }).catch((err) => {
    //     this.loading = false;
    //     console.log(err);
    //   });
    // },

    generateOpenNodesFromSelection(hierarchy, selectedItems) {
      const openSet = new Set();

      function traverse(items, parents = []) {
        for (const item of items) {
          const isSelected = selectedItems.some(sel => sel.custom_id === item.custom_id);
          if (isSelected) {
            parents.forEach(parent => openSet.add(parent.custom_id));
          }

          if (item.children && item.children.length) {
            traverse(item.children, [...parents, item]);
          }
        }
      }

      traverse(hierarchy);
      return Array.from(openSet);
    },
    
    addUser() { 
      let isValid = this.$refs.createProfileForm.validate();
      if (!isValid) {
          console.log("Form validation failed.");
          return; // Stop execution if form is invalid
      }

      startTokenRefreshChecker();
      this.loading = true;

      // Retrieve the JSON data from localStorage
      const userDataJSON = localStorage.getItem("user");
      // Parse the JSON data into a JavaScript object
      const userData = JSON.parse(userDataJSON);

      // Now you can access properties within the userData object
      const accountType = userData.user.account_type;
      const companyId = userData.user.company_id;

      this.newUser.company_id = companyId;
      this.newUser.account_type = accountType;

      if(this.selectedRole){
        this.newUser.role_id = this.selectedRole.id;
      }else{
        this.newUser.role_id = null;
      }
      
      // console.log(this.newUser);

      axios({
        url: process.env.VUE_APP_BASEURL + "/addUser",
        method: "POST",
        data: this.newUser,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token,
        },
      })
        .then((response) => {
          // Convert the created_at date to a localized date string
          const createdAt = new Date(response.data.user.created_at).toLocaleDateString();
          // Create a copy of the response data with the converted date
          const responseDataWithLocalizedDate = {
            ...response.data.user,
            firstName: response.data.user.name.split(" ")[0] || "",
            lastName: response.data.user.name.split(" ")[1] || "",
            created_at: createdAt,
          };

          // Handle the role conditionally
          if (responseDataWithLocalizedDate.role != null) {
            responseDataWithLocalizedDate.role_name = responseDataWithLocalizedDate.role.name;
          } else {
            // Assign a default role object
            responseDataWithLocalizedDate.role = { 
              id: null,
              name: "No Role",
            };
            responseDataWithLocalizedDate.role_name = "No Role";
          }
          // console.log(responseDataWithLocalizedDate);

          // Push the modified response data into the this.users array
          this.users.push(responseDataWithLocalizedDate);
          // console.log(this.users);
          
          this.loading = false;
          this.closeUserdialog();
          
          this.user = responseDataWithLocalizedDate;

          if(this.user.role.name != "No Role"){
            this.selectedRole = this.user.role.name;
            this.nextStepDialog = true;
          }

          this.success_dialog = true;
          this.successMessage = "User created successfully.";
        }).catch((err) => {
          
          this.loading = false;
          this.validation_dialog = true;
          this.dialogMessage = err.response.data.error || "An error occurred while creating the user.";
        });
        
    },
    // toggleUserAsset(id) {
    //   this.saving = true;
    //   let idx = this.user_elements.indexOf(id);
    //   console.log("idx =", idx);
    //   if (idx == -1) {
    //     //Add Element
    //     axios({
    //       url: process.env.VUE_APP_BASEURL + "/users/" + this.user.id + "/elements",
    //       method: "POST",
    //       data: {
    //         element_id: id,
    //         action: "add",
    //       },
    //       headers: {
    //         Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token,
    //       },
    //     })
    //       .then((res) => {
    //         const response = res.data;
    //         console.log("response =", response);
    //         this.user_elements.push(id);
    //         this.saving = false;
    //       })
    //       .catch((err) => {
    //         alert(JSON.stringify(err.response));
    //         this.saving = false;
    //       });
    //   } else {
    //     //Delete Element
    //     axios({
    //       url: process.env.VUE_APP_BASEURL + "/users/" + this.user.id + "/elements",
    //       method: "POST",
    //       data: {
    //         element_id: id,
    //         action: "delete",
    //       },
    //       headers: {
    //         Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token,
    //       },
    //     })
    //       .then((res) => {
    //         this.user_elements.splice(idx, 1);
    //         this.saving = false;
    //       })
    //       .catch((err) => {
    //         alert(JSON.stringify(err.response));
    //         this.saving = false;
    //       });
    //   }
    // },

    sendUpdatedAssets() {
      startTokenRefreshChecker();
      this.loading = true;

      // console.log(this.elements);
      if (this.hierarchy.length == 0) {
        this.validation_dialog = true;
        this.dialogMessage = "There is no available assets.";
        return;
      }
      
      const selectedIds = this.tree.map(item => item.id);

      if(this.user.role.name == "Branch Administrator"){
        axios({
          url: process.env.VUE_APP_BASEURL + "/users/" + this.user.id + "/branches",
          method: "POST",
          data: {
            assets: selectedIds,
          },
          headers: {
            Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token,
          },
        }).then((res) => {
          if(res.status === 201){
            this.tree = [];
            this.element = [];
            this.loading = false;
            this.assets_dialog = false;
            this.success_dialog = true;
            this.successMessage = "User details updated successfully.";
          }
        }).catch((err) => {
          alert(JSON.stringify(err.response));
          this.loading = false;
        });
      }else{
        axios({
          url: process.env.VUE_APP_BASEURL + "/users/" + this.user.id + "/elements",
          method: "POST",
          data: {
            assets: selectedIds,
          },
          headers: {
            Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token,
          },
        }).then((res) => {
            // console.log(res.data);
            if (res.status === 201) {
              this.tree = [];
              this.element = [];
              this.loading = false;

              this.refreshUserTable();

              this.assets_dialog = false;
              this.success_dialog = true;
              this.successMessage = "User details updated successfully.";
            }
          }).catch((err) => {
            alert(JSON.stringify(err.response));
            this.loading = false;
          });
      }
      // this.success_dialog = true;
      // this.successMessage = "User details updated successfully.";
    },
    
    async getUsers() {
      startTokenRefreshChecker();

      await axios({
        url: process.env.VUE_APP_BASEURL + '/users',
        method: "GET",
        headers: { Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token },
      }).then((res) => {

        this.users = res.data.users.map((u) => {
          const firstName = u.name.split(" ")[0];
          const lastName = u.name.split(" ")[1];

          u.created_at = new Date(u.created_at).toLocaleDateString();
          u.firstName = firstName;
          u.lastName = lastName;

          if (u.role != null) { 
            u.role_name = u.role.name;
          } else {
            // Assign a default role object
            u.role = { 
              id: null,
              name: "No Role",
            };
            u.role_name = "No Role";
          }

          return u;
        });

        // console.log("User Response: ", this.users);
      }).catch((err) => {
        this.loading = false;
        console.log(err)
      });  
    },
    async getHierarchy(){ 
      startTokenRefreshChecker();

      await axios({
        url: process.env.VUE_APP_BASEURL + '/hierarchyBranch',
        method: "GET",
        headers: { 
          Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token 
        },
      }).then((res) => {
        this.hierarchy = this.modifyHierarchy(res.data, "Branch");
        
        if(this.initHierarchy.length === 0){
          this.initHierarchy = [...this.hierarchy];
          console.log("Initial Hierarchy: ", this.initHierarchy);
        }
        
        console.log("Hierarchy: ", this.hierarchy);  
      }).catch((err) => {
        this.loading = false;
        console.log(err);
      });

    },
    
    async getRoles(token){
      await axios({
        url: process.env.VUE_APP_BASEURL + '/roles',
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => {
        // console.log("Role Response: ", res);
        const roles = res.data.roles;

        
        this.user_roles = [
          { header: "Branch Roles" },
          ...roles.filter(role => role.name === "Branch Administrator"),

          { divider: true },
          { header: "Site Roles" },
          ...roles.filter(role => ["Site Manager", "Site Logger", "Site Viewer"].includes(role.name)),

          { divider: true },
          { header: "Substation Roles" },
          ...roles.filter(role => ["Substation Manager", "Substation Logger", "Substation Viewer"].includes(role.name)),

          { divider: true },
          { header: "Transformer Roles" },
          ...roles.filter(role => ["Transformer Logger", "Transformer Viewer"].includes(role.name)),

          { divider: true},
          { name: "No Role", id: null },
        ];
        
      }).catch((err) => {
        console.log(err);
      })
    },

    // deleteUser(userID) {
    //   this.startTokenRefreshChecker();
    //   this.loading = true;
    //   axios({
    //     url: process.env.VUE_APP_BASEURL + "/deleteUser",
    //     method: "POST",
    //     data: {
    //       delete_user: this.user.id,
    //     },
    //     headers: {
    //       Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token,
    //     },
    //   }).then((res) => {
    //     // console.log(res);
    //     if (res.status === 200) {
    //       // hide the modal if successful
    //       this.delUserDialog = false;
    //       // remove the deleted user from the list using splice
    //       let copy = this.users;
    //       copy.splice(
    //         copy.findIndex((el) => el.id === userID),
    //         1
    //       );
    //       this.users = copy;
    //       this.loading = false;
    //     }
    //     this.success_dialog = true;
    //     this.successMessage = "User deleted successfully.";
    //   });
    // }

    deleteUser(userID) {
      startTokenRefreshChecker();
      this.loading = true;

      axios({
        url: process.env.VUE_APP_BASEURL + "/deleteUser",
        method: "POST",
        data: {
          delete_user: userID,
        },
        headers: {
          Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token,
        },
      }).then((res) => {
        if (res.status === 200) {
          this.delUserDialog = false;

          // Remove from general list
          this.users = this.users.filter(user => user.id !== userID);

          // Also remove from filtered by asset list
          this.usersByAsset = this.usersByAsset.filter(user => user.id !== userID);

          this.loading = false;
          this.success_dialog = true;
          this.successMessage = "User deleted successfully.";
        }
      }).catch((err) => {
        this.loading = false;
        console.error("Error deleting user:", err);
      });
    },

    async updateUser() {
      startTokenRefreshChecker();
      this.loading = true;

      let payload = {
        id: this.user.id,
        email: this.user.email,
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        role_id: this.selectedRole.id,
      };

      try {
        const res = await axios({
          url: process.env.VUE_APP_BASEURL + "/updateUser",
          method: "PATCH",
          data: payload,
          headers: {
            Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token,
          },
        });

        if(res.status === 200){
          const updatedUser = this.modifyUserData([res.data])[0];
          this.updUserDialog = false;
          this.loading = false;

          //If user role is not "No Role"
          if(this.selectedRole.name != "No Role"){
            //If user role is changed, unassign their elements and ask if they want to reassign
            if(this.user.role.name != this.selectedRole.name){
              await this.unassignAllElements(this.user.id);
              await this.updateAssetDialog(updatedUser);  
            }else{
              this.refreshUserTable();
            }
          }
          else{
            await this.unassignAllElements(this.user.id);
            this.refreshUserTable();
          }

          this.assignDialog = false;
          this.success_dialog = true;
          this.successMessage = "User details updated successfuly.";
        }
      }catch(err){
        this.loading = false;
        this.updUserDialog = false;

        this.validation_dialog = true

        if (err.response && err.response.status === 409) {
          this.dialogMessage = err.response.data.error || 'Something went wrong, please try again'; // "Email address is already in use."
        } else {
          this.dialogMessage = 'Something went wrong. Please try again.';
        }
      }
    },
    unassignAllElements(user_id) {
      axios({
        url: process.env.VUE_APP_BASEURL + "/users/" + user_id + "/unassign-all-elements",
        method: "POST",
        headers: {
          Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token,
        },
      }).then((res) => {
        // console.log(res);
      });
    },

    click() {
      console.log("click");
    },

    isAssetSelected(item) {
      return this.tree.some(selected => selected.custom_id === item.custom_id);
    },

    customTreeFilter(item, search, textKey) {
      const text = (item[textKey] || '').toString().toLowerCase();
      const type = (item.type || '').toLowerCase();
      return text.includes(search.toLowerCase()) || type.includes(search.toLowerCase());
    },

    refreshUserTable(){
      if(this.selectView === "Show By Assets"){
        this.getUsersByElement(this.selectedAsset);
      }else{
        this.getUsers();
      }
    }
  },
};

</script>
