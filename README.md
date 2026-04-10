# NeteaseCloudMusicApi Self-Hosted

> *Music is the shorthand of emotion. — Tolstoy*
>
> *But first, you need an API that actually works.*

---

## What is this?

A self-hosted [NeteaseCloudMusicApi](https://github.com/Binaryify/NeteaseCloudMusicApi) service.

Because relying on someone else's server and then watching it go down at 3 AM is... a learning experience.

## Why self-host?

- Because third-party music APIs have the lifespan of a mayfly
- Because DNS errors at midnight hit different
- Because we can

## Quick Start

    # Install dependencies
    npm install

    # Start the service
    node start.js

The API will be running at http://127.0.0.1:3000

## Keep it alive with pm2

    pm2 start start.js --name NeteaseCloudMusicApi
    pm2 save
    pm2 startup

Now it survives reboots. Unlike your willpower to study.

## API Endpoints

All endpoints from NeteaseCloudMusicApi are supported:

- /search?keywords=your-song — Search songs
- /song/url/v1?id=123&level=hires — Get song URL
- /song/detail?ids=123 — Song details
- /login/status — Check login status

Full docs: [NeteaseCloudMusicApi Documentation](https://binaryify.github.io/NeteaseCloudMusicApi)

## Tech Stack

- Node.js
- Express
- NeteaseCloudMusicApi v4.30.0
- Pure determination

## License

MIT

---

*Made with love and frustration from expired third-party APIs.*
