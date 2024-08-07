## Installation & Running the app

```bash
$ npm install
```

## Running the app

```bash
$ npm run start
```

## Files

As soon as you start an app, requests to Elevenlabs API are made one by one. 

Received audio files are saved to `/tmp/{sessionId}` directory on your local machine.

Please check console logs to see the details and folder path.

File names are `audio_{index}.mp3`.

