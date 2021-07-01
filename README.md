# File Sharing API
This is a basic file sharing API.

## Installing and running the API
- Install dependencies
```
npm install
```

- Create .env file
```
PORT=3000
FOLDER=files

MONGODB_URL=

# SIZE IN MB
UPLOAD_LIMIT=1
DOWNLOAD_LIMIT=0.2

# IN HRS
INACTIVITY_PERIOD=0.03
# CRON PATTERN
CHECK_INACTIVITY_INTERVAL=*/10 * * * * *
```
__Copy MONGODB_URL value from the zipped file I sent.__

- Run the api
```
npm start
```