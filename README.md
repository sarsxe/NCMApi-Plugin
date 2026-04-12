<div align=center>

# NeteaseCloudMusicApi

**Self-Hosted Edition**

[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18-green?logo=node.js&logoColor=white)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

*A third-party music API died for this repo to exist.*

[Getting Started](#getting-started) · [Usage](#usage) · [Deploy](#deploy-with-pm2)

</div>

---

## Why This Exists

Let me paint you a picture:

- It is 3 AM
- Your bot cannot play music
- The third-party API you relied on has returned a DNS error
- You stare into the void, and the void stares back

This repo is the result of that existential crisis.
A self-hosted [NeteaseCloudMusicApi](https://github.com/Binaryify/NeteaseCloudMusicApi) that you control, you maintain, and you trust (hopefully).

## Features

- Zero reliance on third-party API servers
- All NeteaseCloudMusicApi endpoints supported
- Runs locally on 127.0.0.1:3000 -- secure and fast
- pm2 managed with auto-restart
- Survives reboots, unlike your motivation

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) >= 18
- npm

### Install

Clone the repo and install dependencies:

    git clone https://github.com/sarsxe/NeteaseCloudMusicApi.git
    cd NeteaseCloudMusicApi
    npm install

### Run

    node start.js

The API is now live at http://127.0.0.1:3000

Quick health check:

    curl http://127.0.0.1:3000/search?keywords=hello

## Usage

This service supports all endpoints from NeteaseCloudMusicApi.

| Endpoint | Description |
|----------|-------------|
| /search?keywords=xxx | Search songs by keyword |
| /song/url/v1?id=xxx&level=standard | Get song playback URL |
| /song/detail?ids=xxx | Get song details |
| /song/wiki/summary?id=xxx | Get song wiki summary |
| /login/status | Check login status |
| /cloudsearch?keywords=xxx | Advanced search |

### Audio Quality Levels

| Level | Description |
|-------|-------------|
| standard | Standard quality |
| higher | Higher quality |
| exhigh | Extremely high quality |
| lossless | Lossless (FLAC) |
| hires | Hi-Res audio |

### Configuration

Edit **start.js** to customize:

- **port** -- API port (default: 3000)
- **host** -- Bind address (default: 127.0.0.1)

To use with Yunzai-Bot rconsole-plugin, update your **tools.yaml**:

    useLocalNeteaseAPI: true
    neteaseCloudAPIServer: http://127.0.0.1:3000

## Deploy with pm2

For production use with auto-restart and boot persistence:

    pm2 start start.js --name NeteaseCloudMusicApi
    pm2 save
    pm2 startup

Useful commands:

    pm2 logs NeteaseCloudMusicApi    # View logs
    pm2 restart NeteaseCloudMusicApi # Restart service
    pm2 stop NeteaseCloudMusicApi    # Stop service
    pm2 monit                        # Real-time monitor

## Project Structure

    NeteaseCloudMusicApi/
    |-- start.js            # Entry point
    |-- package.json        # Dependencies
    |-- package-lock.json   # Lock file
    |-- .gitignore          # Git ignore rules
    |-- README.md           # You are here
    |-- node_modules/       # Dependencies (generated)

## Tech Stack

| Tech | Purpose |
|------|---------|
| Node.js | Runtime |
| Express | Web framework |
| NeteaseCloudMusicApi v4.30.0 | Core API module |
| pm2 | Process management |
| Your sanity | Troubleshooting at 3 AM |

## Acknowledgements

- [NeteaseCloudMusicApi](https://github.com/Binaryify/NeteaseCloudMusicApi) -- The OG project that made this possible
- [pm2](https://pm2.keymetrics.io/) -- For keeping things alive

## License

[MIT](LICENSE) -- Do whatever you want, just do not blame me.

---

<div align=center>

*If this repo saved your bot, consider giving it a star.*

*Made with love and frustration from expired third-party APIs.*

</div>
