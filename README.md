## Installation

```bash
$ npm install
```

## env

Please add `ELEVENLABS_API_KEY` to your local `.env` file.

## Running the app

```bash
$ npm run start
```

## Files

As soon as you start an app, requests to Elevenlabs API are made one by one. 

Received audio files are saved to `/tmp/{sessionId}` directory on your local machine.

Please check console logs to see the details and folder path.

Audio file names are `audio_{index}.mp3`, there will be 8 files.

