Steps :


1:
install dependencies and packages

2: create '.env' file in root directory to link backend service in variable :
# if application created by create react app
# REACT_APP_APPWRITE_URL = "test environment"
# or 
# REACT_APP_APPWRITE_URL = test-environment


# we have created our application using vite so using VITE_  its compulsory ..!
VITE_APPWRITE_ENDPOINT = "https://fra.cloud.appwrite.io/v1"
VITE_APPWRITE_PROJECT_ID="673476b20022c85353e6"
VITE_APPWRITE_DATABASE_ID="685bc9a90001ea7f50b6"
VITE_APPWRITE_COLLECTION_ID="685bc9ea001db5f98c37"
VITE_APPWRITE_BUCKET_ID="6734794f002ae8d96053"



3:
create conf->config.js







4: app.jsx
    i> check user is logged in or not 
    ii> if loggedin show posts else login request message or anything..
    iii>  create loading to handle wait
    iv> now need dispatch, as to bring current user 
    v> now we need auth service (ServiceAuth.js)
    vi> at app loading we should call useEffect to check user is logged in or not along with conditional rendering..

