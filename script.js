// Client ID and API key from the Google Developers Console
const CLIENT_ID = '140900903503-msbqcf6acnqdsv2n6pd0rnsnfmg4hssn.apps.googleusercontent.comD';
const API_KEY = 'AIzaSyCFNR0rFC5FDmkVmyD6votJi-hJQQK3k7w';

// ID of the shared folder in Google Drive
const FOLDER_ID = '1Zr0gWERsX6YUer4V8TiGBkryofnSdwCl';

// Array of API discovery doc URLs for the Google Drive API
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];

// Authorization scopes required by the API
const SCOPES = 'https://www.googleapis.com/auth/drive.file';

let authorizeButton;
let fileInput;

function handleClientLoad() {
    // Load the API client and auth2 library
    gapi.load('client:auth2', initClient);
}

function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    }).then(() => {
        // Listen for sign-in state changes
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        // Get the elements from the DOM
        authorizeButton = document.getElementById('authorizeButton');
        fileInput = document.getElementById('fileInput');

        // Handle the initial sign-in state
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    });
}

function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        authorizeButton.style.display = 'none';
        fileInput.style.display = 'block';
    } else {
        authorizeButton.style.display = 'block';
        fileInput.style.display = 'none';
    }
}

// ... (existing code)

function uploadFile() {
  const file = fileInput.files[0];
  const metadata = {
      name: file.name,
      parents: [FOLDER_ID]
  };

  const reader = new FileReader();
  reader.onload = (event) => {
      const fileData = event.target.result;
      const requestData = new Blob([fileData], { type: file.type });

      const accessToken = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;
      const xhr = new XMLHttpRequest();
      xhr.open('POST', 'https://www.googleapis.com/upload/drive/v3/files?uploadType=media', true);
      xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.setRequestHeader('Content-Length', file.size);
      xhr.send(requestData);
      xhr.onreadystatechange = () => {
          if (xhr.readyState === 4 && xhr.status === 200) {
              displayUploadedFile(file.name);
              alert('File uploaded successfully!');
          } else if (xhr.readyState === 4) {
              alert('Failed to upload file.');
          }
      };
  };

  reader.readAsBinaryString(file);
}

function displayUploadedFile(fileName) {
  const uploadedFileDiv = document.getElementById('uploadedFile');
  uploadedFileDiv.innerHTML = `<p>${fileName}</p>`;
}

// ... (existing code)


// Initialize Google Drive API client
handleClientLoad();
