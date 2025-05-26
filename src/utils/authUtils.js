  import { jwtDecode } from 'jwt-decode';
  import axios from "axios";
  import store from "@/store";

  //Initializing of user in local storage, returns a token.
  export async function initializeUsers() {
    console.log("Initializing User...");
    const storage = JSON.parse(localStorage.getItem("user"));
    
    if (!storage || !storage.user) return;

    const tokenExp = JSON.parse(localStorage.getItem("token_expiry"));
  
    if (storage.user.account_type === 'microsoft') {
      return await handleMicrosoftToken(storage, tokenExp);
    } else if (storage.user.account_type === 'google') {
      return await handleGoogleToken(storage, tokenExp);
    }
  }

  async function handleMicrosoftToken(storage, tokenExp) {
    //console.log("handleMicrosoftToken");
    if (isTokenValid(tokenExp.tokenExpiry)) {
      return storage.token;
    } else {
      return await refreshToken('microsoft');
    }
  }

  async function handleGoogleToken(storage, tokenExp) {
    //console.log("handleGoogleToken");
    if (isTokenValid(tokenExp.tokenExpiry)) {
      return storage.token;
    } else {
      // console.log(tokenExp.tokenExpiry)
      return await refreshToken('google');
    }
  }

  function isTokenValid(expiry) {
    return new Date(expiry) > new Date()
  }

  async function refreshToken(accountType) {
    try {
      if (accountType === 'google') {
        await refreshGoogleTokenHelper();
      } else if (accountType === 'microsoft') {
        await refreshMicrosoftTokenHelper();
      }

      const storage = JSON.parse(localStorage.getItem("user"))
      if (storage && storage.token) {
        return storage.token;
      }
    } catch (error) {
      console.error('Error refreshing tokens:', error);
    }
  }

  async function refreshGoogleTokenHelper() {
  
    // const storage = JSON.parse(localStorage.getItem("user"));
    // const { id_token } = await refreshGoogleToken(storage.user.refresh_token);
    // console.log(id_token)
    // let user = JSON.parse(localStorage.getItem("user"));
    // user.token = id_token;
    // localStorage.setItem("user", JSON.stringify(user));

    // const decodedToken = jwtDecode(id_token);
    // const tokenExpiry = new Date(decodedToken.exp * 1000).toISOString();
    // localStorage.setItem("token_expiry", JSON.stringify({ tokenExpiry }));

    const google_refresh_token = JSON.parse(localStorage.getItem("google_refresh_token"));
    const { id_token } = await refreshGoogleToken(google_refresh_token);
    let user = JSON.parse(localStorage.getItem("user"));
    user.token = id_token;
    localStorage.setItem("user", JSON.stringify(user));

    const decodedToken = jwtDecode(id_token);
    const tokenExpiry = new Date(decodedToken.exp * 1000).toISOString();
    localStorage.setItem("token_expiry", JSON.stringify({ tokenExpiry }));
  }

  async function refreshMicrosoftTokenHelper() {
    try {
      const account = msalInstance.getAllAccounts()[0];
      const response = await msalInstance.acquireTokenSilent({
        scopes: ["user.read", "offline_access"],
        account
      });

      const tokenExpiry = response.expiresOn.toISOString();
      let user = JSON.parse(localStorage.getItem("user"));
      user.token = response.accessToken;
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token_expiry", JSON.stringify({ tokenExpiry }));
    } catch (error) {
      console.error('Error acquiring tokens:', error);
      await msalInstance.loginRedirect({ scopes: ["user.read", "offline_access"] });
    }
  }

  export async function refreshGoogleToken(refreshToken) {
    const clientId = process.env.VUE_APP_GOOGLE_CLIENT_ID;
    const clientSecret = process.env.VUE_APP_GOOGLE_CLIENT_SECRET;

    const data = {
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token'
    };

    try {
      const response = await axios.post('https://oauth2.googleapis.com/token', new URLSearchParams(data));
      const { access_token, id_token} = response.data;

      // Decode the ID token to get the expiration time
      const decodedToken = jwtDecode(id_token);
      const tokenExpiry = new Date(decodedToken.exp * 1000); // Convert to milliseconds
      const token_expiry = tokenExpiry.toISOString();
      // Update local storage
      let user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        user.token_expiry = token_expiry
        user.token = id_token;
        localStorage.setItem("user", JSON.stringify(user));
      }

      console.log('Google token refreshed successfully');
      return { access_token, id_token, token_expiry };

    } catch (error) {
      console.error('Error refreshing Google token:', error);
      throw error;
    }
  }

  //Refreshes token manually 
  export function startTokenRefreshChecker() {
    console.log("Starting token refresh checker...");
    
    const storage = JSON.parse(localStorage.getItem("user"));
    const tokenExp = JSON.parse(localStorage.getItem("token_expiry"));

    if (storage && storage.user && tokenExp){
      if(!isTokenValid(tokenExp.tokenExpiry)) {
        return refreshToken(storage.user.account_type);
      }
    }
  }
