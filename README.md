> [!TIP]
> 如果这个项目帮助到了你，请给我们一个 Star！

> [!WARNING]
> 本项目仅供学习交流使用，请勿用于商业及非法用途，如有侵权请联系删除。

<div align=center>

# NCMApi-plugin

网易云音乐 Node.js API 自建部署服务 / Yunzai-Bot 插件

![Nodejs](https://img.shields.io/badge/-Node.js-3C873A?style=flat&logo=Node.js&logoColor=white)
![JavaScript](https://img.shields.io/badge/-JavaScript-eed718?style=flat&logo=javascript&logoColor=ffffff)
[![license](https://img.shields.io/github/license/sarsxe/NCMApi-plugin.svg?style=flat)](https://github.com/sarsxe/NCMApi-plugin/blob/main/LICENSE)
![version](https://img.shields.io/badge/version-1.0.0-blue)

</div>

---

## 简介

当第三方网易云 API 不稳定时，机器人点歌、搜歌、取链接等功能也会一起受影响。
本插件基于 NeteaseCloudMusicApi 提供本地自建服务，并以 Yunzai 插件方式接入，减少额外维护成本。

## 当前版本优化点

- 随 Yunzai 启动自动加载本地 NCM API
- 无需再单独维护 pm2 start start.js
- 内置单例启动保护，避免重复拉起
- 若 127.0.0.1:3000 已有可用服务，会自动复用
- 保留 node start.js 独立启动方式，方便调试
- 插件更新后改为提示“重启 Yunzai 生效”

## 安装教程

1. 克隆插件

    git clone --depth=1 https://github.com/sarsxe/NCMApi-plugin.git ./plugins/NCMApi-plugin

2. 进入插件目录并安装依赖

    cd /root/Yunzai/plugins/NCMApi-plugin
    npm install

3. 重启或启动 Yunzai

插件会在 Yunzai 加载时自动启动本地 NeteaseCloudMusicApi 服务。

4. 验证服务

    curl http://127.0.0.1:3000/search?keywords=hello

## 启动方式

### 方式一：随 Yunzai 自动启动（推荐）

当前默认方式，无需再为本插件单独配置 pm2 进程。
只要 Yunzai 正常启动，本插件就会在加载时自动尝试启动本地 API 服务。

### 方式二：独立启动（兼容模式）

如需单独调试，可执行：

    cd /root/Yunzai/plugins/NCMApi-plugin
    node start.js

默认监听：127.0.0.1:3000

## 更新与版本管理

插件内支持以下命令：

| 命令 | 说明 |
| ---- | ---- |
| #NCM版本 | 查看插件版本信息 |
| #NCM更新 | 更新插件并安装依赖 |
| #NCM强制更新 | 放弃本地修改后强制更新 |

说明：

- 更新命令会执行 git pull --no-rebase 和 npm install
- 更新完成后，请重启 Yunzai，使插件代码与内置 NCM API 服务一起生效
- 不再依赖单独的 pm2 restart NeteaseCloudMusicApi

## 对接配置示例

如需在其他插件或配置中显式指定本地网易云 API 地址，可使用：

    useLocalNeteaseAPI: true
    neteaseCloudAPIServer: http://127.0.0.1:3000

## 常用接口示例

| 接口 | 说明 |
| ---- | ---- |
| /search?keywords=xxx | 搜索歌曲 |
| /cloudsearch?keywords=xxx | 高级搜索 |
| /song/url/v1?id=xxx | 获取歌曲播放链接 |
| /song/detail?ids=xxx | 获取歌曲详情 |
| /lyric?id=xxx | 获取歌词 |
| /playlist/detail?id=xxx | 获取歌单详情 |
| /artist/songs?id=xxx | 获取歌手歌曲 |
| /album?id=xxx | 获取专辑内容 |
| /comment/music?id=xxx | 获取歌曲评论 |
| /banner | 首页轮播图 |
| /personalized | 推荐歌单 |
| /toplist | 排行榜 |
| /login/status | 检查登录状态 |
| /user/cloud | 云盘歌曲列表 |

完整接口文档：
- https://binaryify.github.io/NeteaseCloudMusicApi

## 项目结构

    NCMApi-plugin/
    |-- apps/
    |-- service.js           # 本地 NCM API 启动封装与单例保护
    |-- index.js             # Yunzai 插件入口，随 Yunzai 自动启动服务
    |-- start.js             # 兼容独立启动入口
    |-- package.json         # 项目配置及依赖
    |-- package-lock.json    # 依赖锁定文件
    |-- README.md            # 项目文档

## 技术栈

- Node.js
- NeteaseCloudMusicApi
- Yunzai-Bot Plugin
- Git

## 致谢

- https://github.com/Binaryify/NeteaseCloudMusicApi
- https://github.com/Le-niao/Yunzai-Bot

## License

MIT
