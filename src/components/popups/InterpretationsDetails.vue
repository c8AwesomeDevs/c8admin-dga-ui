<template>
    <v-dialog v-model="show" max-width="740" persistent>
        <template v-slot:default="dialog">
            <v-card>
                <v-card-actions>
                    <v-card-title>Interpretations</v-card-title>
                    <v-spacer></v-spacer>
                    <v-btn @click="closePopup()" text><v-icon>mdi-close</v-icon></v-btn>
                </v-card-actions>
                <v-card-text>
                    <v-row>
                        <v-col cols="12">
                            <v-card outlined>
                                <v-tabs color="red" centered v-model="tab">
                                    <v-tab key="duvals">
                                        Duvals Interpretation
                                    </v-tab>
                                    <v-tab key="comments" @click="getDetails()">
                                        Comments
                                    </v-tab>
                                </v-tabs>
                                <v-divider></v-divider>
                                <v-tabs-items v-model="tab">
                                    <v-tab-item key="duvals">
                                        <v-simple-table dense>
                                            <template v-slot:default>
                                                <tbody>
                                                    <tr v-if="shouldShow('t1', details.oil_type)">
                                                        <td>Triangle 1</td>
                                                        <td>
                                                            <v-chip small class="white--text"
                                                                :color="details.t1 == 'Normal' ? 'green' : 'red'">
                                                                {{ getFaultDescription(0, details.t1) }}
                                                            </v-chip>
                                                        </td>

                                                    </tr>
                                                    <tr v-if="shouldShow('t2', details.oil_type)">
                                                        <td>Triangle 2</td>
                                                        <td>
                                                            <v-chip small class="white--text"
                                                                :color="details.t2 == 'Normal' ? 'green' : 'red'">
                                                                {{ getFaultDescription(1, details.t2) }}
                                                            </v-chip>
                                                        </td>
                                                    </tr>
                                                    <tr v-if="shouldShow('t3', details.oil_type)"> 
                                                        <td>Triangle 3 (Biotemp)</td>
                                                        <td>
                                                            <v-chip small class="white--text"
                                                                :color="details.t3 == 'Normal' ? 'green' : 'red'">
                                                                {{ getFaultDescription(2, details.t3) }}
                                                            </v-chip>
                                                        </td>
                                                    </tr>
                                                    <tr v-if="shouldShow('t4', details.oil_type)">
                                                        <td>Triangle 4</td>
                                                        <td>
                                                            <v-chip small class="white--text"
                                                                :color="details.t4 == 'Normal' ? 'green' : 'red'">
                                                                {{ getFaultDescription(3, details.t4) }}
                                                            </v-chip>
                                                        </td>
                                                    </tr>
                                                    <tr v-if="shouldShow('t5', details.oil_type)">
                                                        <td>Triangle 5</td>
                                                        <td>
                                                            <v-chip small class="white--text"
                                                                :color="details.t5 == 'Normal' ? 'green' : 'red'">
                                                                {{ getFaultDescription(4, details.t5) }}
                                                            </v-chip>
                                                        </td>
                                                    </tr>
                                                    <tr v-if="shouldShow('t6', details.oil_type)">
                                                        <td>Triangle 6</td>
                                                        <td>
                                                            <v-chip small class="white--text"
                                                                :color="details.t6 == 'Normal' ? 'green' : 'red'">
                                                                {{ getFaultDescription(5, details.t6) }}
                                                            </v-chip>
                                                        </td>
                                                    </tr>
                                                    <tr v-if="shouldShow('t7', details.oil_type)">
                                                        <td>Triangle 7</td>
                                                        <td>
                                                            <v-chip small class="white--text"
                                                                :color="details.t7 == 'Normal' ? 'green' : 'red'">
                                                                {{ getFaultDescription(6, details.t7) }}
                                                            </v-chip>
                                                        </td>
                                                    </tr>
                                                    <tr v-if="shouldShow('p1', details.oil_type)">
                                                        <td>Pentagon 1</td>
                                                        <td>
                                                            <v-chip small class="white--text"
                                                                :color="details.p1 == 'Normal' ? 'green' : 'red'">
                                                                {{ getFaultDescription(7, details.p1) }}
                                                            </v-chip>
                                                        </td>
                                                    </tr>
                                                    <tr v-if="shouldShow('p2', details.oil_type)">
                                                        <td>Pentagon 2</td>
                                                        <td>
                                                            <v-chip small class="white--text"
                                                                :color="details.p2 == 'Normal' ? 'green' : 'red'">
                                                                {{ getFaultDescription(8, details.p2) }}
                                                            </v-chip>
                                                        </td>
                                                    </tr>
                                                    <tr v-if="shouldShow('uni_penta', details.oil_type)">
                                                        <td>Unified Pentagon</td>
                                                        <td>
                                                            <v-chip small class="white--text"
                                                                :color="details.uni_penta == 'Normal' ? 'green' : 'red'">
                                                                {{ getFaultDescription(9, details.uni_penta) }}
                                                            </v-chip>
                                                        </td>
                                                    </tr>
                                                    <tr v-if="shouldShow('cigre_p1', details.oil_type)">
                                                        <td>Cigre Unified Pentagon</td>
                                                        <td>
                                                            <v-chip small class="white--text"
                                                                :color="details.uni_penta == 'Normal' ? 'green' : 'red'">
                                                                {{ getFaultDescription(10, details.cigre_p1) }}
                                                            </v-chip>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </template>
                                        </v-simple-table>
                                    </v-tab-item>
                                    <v-tab-item key="comments">
                                        <v-container>
                                            <v-list>
                                                <v-card-text>

                                                    <v-row v-if="filteredComments.length != 0"
                                                        v-for="(comment, index) in filteredComments" :key="comment.id">
                                                        <v-col cols="12" sm="12">
                                                            <v-alert class="mx-auto comment-container" dense outlined text
                                                                color="white darken-3">
                                                                <v-list-item>
                                                                    <v-list-item-content>
                                                                        <div class="margin-bottom">
                                                                            <div class="comment-name">{{ comment.user_name
                                                                            }}</div>
                                                                            <div class="text-sm timestamp-text">({{
                                                                                comment.formattedCreatedAt }})</div>
                                                                        </div>
                                                                        <div class="comment-text">{{ comment.comment }}
                                                                        </div>

                                                                    </v-list-item-content>
                                                                    <v-list-item-action>
                                                                        <v-layout justify-space-between>
                                                                            <v-btn x-small text
                                                                                @click="editComments(comment)">

                                                                                <v-icon small>
                                                                                    mdi-square-edit-outline
                                                                                </v-icon>
                                                                            </v-btn>
                                                                            <v-btn :disabled="loading" color="red" x-small
                                                                                text @click="removeComment(comment)">
                                                                                <v-icon small>
                                                                                    mdi-delete-empty-outline
                                                                                </v-icon>
                                                                            </v-btn>
                                                                        </v-layout>
                                                                    </v-list-item-action>
                                                                </v-list-item>
                                                            </v-alert>
                                                        </v-col>
                                                    </v-row>
                                                    <span class="center-message pa-2" v-if="filteredComments.length == 0">No
                                                        comments available.</span>
                                                </v-card-text>
                                            </v-list>

                                        </v-container>
                                    </v-tab-item>
                                </v-tabs-items>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn v-if="tab == 1" depressed color="blue" text apend-icon="mdi-content-save-plus-outline"
                        elevation="3" small @click="addComments()">Add Comment<v-icon right
                            dark>mdi-content-save-plus-outline</v-icon></v-btn>
                </v-card-actions>
            </v-card>
            <v-dialog v-model="validation_dialog" max-width="350" min-width="300">
                <template>
                    <v-card>
                        <div>
                            <span>
                                <v-icon color="orange" class="icon ml-3 mt-3">
                                    mdi-alert-circle-outline
                                </v-icon>
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
            <v-dialog v-model="editComment" min-width="300" max-width="650">
                <template>
                    <v-card min-height="180" max-height="500">
                        <v-col cols="12">
                            <v-textarea counter="500" auto-grow class="overflow-visible" v-model="updateComment.comment"
                                label="Edit Comment" dense color="red" outlined
                                @keyup.enter="updateComments(), editComment = false">
                            </v-textarea>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn depressed :disabled="loading" color="blue" text
                                    apend-icon="mdi-content-save-plus-outline" elevation="3" small
                                    @click="updateComments()">{{ loading ? 'Updating...' : 'Update' }}<v-icon v-if="!loading"
                                        right dark>mdi-content-save-plus-outline</v-icon></v-btn>
                            </v-card-actions>
                        </v-col>
                    </v-card>
                </template>
            </v-dialog>
            <v-dialog v-model="addComment" min-width="300" max-width="650">
                <template>
                    <v-card min-height="180" max-height="500">
                        <v-col cols="12">
                            <v-textarea counter="500" auto-grow min-height="180" max-height="500" class="overflow-visible"
                                v-model="newComment.comment" label="Add Comment" dense color="red" outlined
                                @keyup.enter="saveComments(), addComment = false">
                            </v-textarea>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn v-if="tab == 1" :disabled="loading" depressed color="blue" text
                                    apend-icon="mdi-content-save-plus-outline" elevation="3" small
                                    @click="saveComments()">{{ loading ? 'Adding...' : 'Add' }}<v-icon v-if="!loading" right
                                        dark>mdi-content-save-plus-outline</v-icon></v-btn>
                            </v-card-actions>
                        </v-col>
                    </v-card>

                </template>
            </v-dialog>
            <v-dialog v-model="delComment" min-width="200" max-width="350">
                <template>
                    <v-card>
                        <v-card-title> </v-card-title>
                        <v-card-text>
                            Are you sure you want to delete this comment?
                            <br />
                            <span class="font-italic text-sm">Note : This action cannot be undone.</span>
                        </v-card-text>

                        <v-card-actions>
                            <v-spacer></v-spacer>

                            <v-btn text @click="delComment = false"> No </v-btn>

                            <v-btn color="red" :disabled="loading" text @click="deleteComment()"> {{ loading ? 'Deleting' :
                                'Yes' }} </v-btn>
                        </v-card-actions>
                    </v-card>
                </template>
            </v-dialog>
        </template>
    </v-dialog>
</template>
<style scoped>
.gray-text {
    color: gray;
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

.center-message {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    /* Optional: Set the height to make it occupy the full height of its parent */
}

.text-sm {
    font-size: 12px;
    margin-bottom: 0px;
}

/* Define custom styles for the comment container and timestamp text */
.comment-container {
    background-color: #f5f5f5;
    /* Set your desired background color */
    border: 1px solid #e0e0e0;
    /* Set your desired outline color */
    padding: 8px;
    /* Set the padding for the comment container */
    margin-bottom: 8px;
    /* Set the margin between comments */
}

.comment-text {
    font-size: 14px;
    text-align: justify;
    width: 100px
        /* Set the font size for the comment text */
        /* Add any additional styles for the comment text */
}

.comment-name {
    font-size: 14px;
    font-weight: bold;
    text-align: justify;
    width: 100px;
}

.margin-bottom {
    margin-bottom: 1em;
}

.overflow-visible input {
    overflow: visible;
}

.timestamp-text {
    font-size: 10px;
    /* Set the font size for the timestamp text */
    /* Add any additional styles for the timestamp text */
}
</style>
<script>
import { symbolMixin } from '@/mixins/symbolMixin.js';
import axios from 'axios';
export default {
    name: 'InterpretationsDetails',
    props: ['show', 'details'],
    mixins: [symbolMixin],
    data() {
        return {
            headerMapping: {
            "Mineral Oil": ["t1", "t4", "t5"],
            "LTC": ["t2"],
            "BioTemp": ["t3"],
            "FR3": ["t3"],
            "Midel": ["t3"],
            "LTF FR3": ["t6", "t7"],
            "All Oils": ["p1", "p2", "uni_penta", "cigre_p1"],
            },
            tab: 'duvals',
            validation_dialog: true,
            newComment: {},
            commentsDetails: [],
            validation_dialog: false,
            dialogMessage: "",
            editComment: false,
            updateComment: {},
            addComment: false,
            loading: false,
            delComment: false,
            user: [],
        }
    },

    computed: {
        filteredComments() {
            const targetTimestamp = this.details.timestamp;
            const targetelementId = this.details.element_id;
            const formattedTimestamp = this.formatTimestamp(targetTimestamp);

            const filtered = this.commentsDetails.filter((comment) => {
                return (
                    comment.timestamp == formattedTimestamp &&
                    comment.element_id == targetelementId
                );
            });

            
            // console.log(formattedTimestamp); // Output: "2024-09-30 22:30:00.000"

            // console.log('Filtered Comments:', targetTimestamp, targetelementId);

            filtered.forEach((comment) => {
                comment.formattedCreatedAt = new Date(comment.created_at).toLocaleString('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true,
                });
            });

            return filtered;
        },

    },
    mounted() {
      
        axios({
            url: process.env.VUE_APP_BASEURL + '/users',
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token
            }
        }).then(res => {
            this.user = res.data[0].name

            // console.log(this.user)
        }).catch(err => {
            // alert(err);
        })
    },


    methods: {
        shouldShow(column, oilType) {
            return this.headerMapping[oilType]?.includes(column) || this.headerMapping["All Oils"].includes(column);
        },
        closePopup() {
            this.$emit('close');
        },
        getFaultDescription(idx, interpretation) {
            // console.log(this.details)
            if (interpretation != 'Normal') {
                // console.log(idx, interpretation);
                return interpretation + ' : ' + this.symbols[idx].legends[interpretation]['description'];
            }
            return 'Normal';
        },

        formatTimestamp(isoString) {
            const date = new Date(isoString);

            // Get individual components in UTC
            const year = date.getUTCFullYear();
            const month = String(date.getUTCMonth() + 1).padStart(2, '0');
            const day = String(date.getUTCDate()).padStart(2, '0');
            const hours = String(date.getUTCHours()).padStart(2, '0');
            const minutes = String(date.getUTCMinutes()).padStart(2, '0');
            const seconds = String(date.getUTCSeconds()).padStart(2, '0');
            const milliseconds = String(date.getUTCMilliseconds()).padStart(3, '0');

            // Return formatted string
            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
        },



        getDetails() {
            // console.log(this.details);
            axios({
                url: process.env.VUE_APP_BASEURL + "/elements/" + this.details.element_id,
                method: "GET",
                headers: {
                    Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token,
                },
            }).then((response) => {
                this.commentsDetails = response.data.comment;
                console.log(this.commentsDetails[1].timestamp, this.commentsDetails[1].element_id)
            })
                .catch((err) => {
                    console.log(err);
                });
        },
        addComments() {
            this.addComment = true;
        },
        saveComments() {
            this.loading = true;
            if (!this.newComment.comment) {
                this.validation_dialog = true;
                this.dialogMessage = 'Please add a comment.';
                this.loading = false;
                return;
            }
            this.newComment.timestamp = this.details.timestamp;
            this.newComment.username = this.user;
            axios({
                url: process.env.VUE_APP_BASEURL + '/elements/' + this.details.element_id + '/comments',
                method: 'POST',
                data: this.newComment,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('user')).token
                }
            }).then(response => {
                this.getDetails();
                this.newComment = {};
                this.loading = false;
                this.addComment = false;
            }).catch(err => {
                // console.log(err)
                if (err.response.status == 404 || err.response.status == 500) {
                    this.validation_dialog = true;
                    this.dialogMessage = 'The comment exceeds the maximum \n              allowed character limit.';
                    this.loading = false;
                }
                this.loading = false;
            });
        },
        editComments(comment) {
            this.editComment = true;
            this.updateComment = comment;
        },
        updateComments() {
            this.loading = true;
            const commentId = this.updateComment.id; // Assuming 'id' is the unique identifier of the comment
            const data = {
                timestamp: this.updateComment.timestamp,
                comment: this.updateComment.comment,
            };
            axios({
                url: process.env.VUE_APP_BASEURL + '/comments/' + commentId,
                method: "PUT",
                data: data,
                headers: {
                    Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token,
                },
            }).then((response) => {
                this.getDetails();
                this.loading = false;
                this.editComment = false;
            })
                .catch((err) => {
                    // console.log(err.response);
                    // console.log(err.response.error);
                    // console.log(err.response.status);
                    if (err.response.status == 404 || err.response.status == 500) {
                        this.validation_dialog = true;
                        this.dialogMessage = 'The comment exceeds the maximum \n              allowed character limit.';
                        this.loading = false;
                    }
                    this.loading = false;
                });
        },
        removeComment(comment) {
            this.delComment = true;
            this.remComment = comment;
        },
        deleteComment() {
            this.loading = true;
            const commentId = this.remComment.id; // Assuming 'id' is the unique identifier of the comment
            axios({
                url: process.env.VUE_APP_BASEURL + '/comments/' + commentId,
                method: "DELETE",
                headers: {
                    Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token,
                },
            }).then((response) => {
                this.getDetails();
                this.loading = false;
                this.delComment = false;
            })
                .catch((err) => {
                    console.log(err);
                    alert(err.response);
                });
        }

    }


}
</script>