> [!TIP]
> 如果这个项目帮助到了你，请给我们一个星星（Starred）！谢谢！

> [!WARNING]
> 本项目仅供学习交流使用，请勿用于商业及非法用途，如有侵权请联系删除

<div align=center>

# NeteaseCloudMusicApi

**网易云音乐 Node.js API 自建部署服务**

<br>

![Nodejs](https://img.shields.io/badge/-Node.js-3C873A?style=flat&logo=Node.js&logoColor=white)
![JavaScript](https://img.shields.io/badge/-JavaScript-eed718?style=flat&logo=javascript&logoColor=ffffff)
[![license](https://img.shields.io/github/license/sarsxe/NeteaseCloudMusicApi.svg?style=flat)](https://github.com/sarsxe/NeteaseCloudMusicApi/blob/main/LICENSE)
![version](https://img.shields.io/badge/version-1.0.0-blue)

</div>

---

## 为何会有这个项目📖

让我来给您描绘一下吧：

- 现在是凌晨 3 点
- 你的机器人不能播放音乐
- 你凝视虚空，虚空也凝视着你
- 果然你依赖的第三方 API 挂了，而你对此无能为力

这个仓库正是那场存在午夜危机的结果。基于 NeteaseCloudMusicApi 的自建部署方案，在本地里你能控制、维护并信任它（希望如此）。

## 免责声明 ❗

- 本项目的功能仅限于内部交流与小范围使用，请勿将 本项目 用于任何以盈利为目的的场景。
- 仅供交流学习使用。如有侵权，请联系我们，我们会立即删除相关内容。

## 特性✨

- 完全不依赖第三方 API 服务器
- 支持全部 NeteaseCloudMusicApi 接口
- 本地运行于 127.0.0.1:3000，安全且快速
- pm2 托管，自动重启，开机自启
<details><summary>彩蛋🤔</summary>

<details><summary>- You can still survive after restarting, unlike your will to learn</summary></details>

- 重启后依然能存活，不像你的学习意志

</details>

## 安装教程😊

1. 推荐使用 git 进行安装，以方便后续升级

使用 GitHub:

    git clone --depth=1 https://github.com/sarsxe/NeteaseCloudMusicApi.git

2. 进入项目

    cd /root/NeteaseCloudMusicApi

3. 安装依赖

    npm install

4. 启动服务

    node start.js

服务默认运行在 http://127.0.0.1:3000

快速验证:

    curl http://127.0.0.1:3000/search?keywords=hello

## 功能介绍

<details>
<summary>支持的 API 接口（点击展开）</summary>

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

完整接口文档请参考：[NeteaseCloudMusicApi 文档](https://binaryify.github.io/NeteaseCloudMusicApi)

</details>

### 音质等级

| 等级 | 说明 |
| ---- | ---- |
| standard | 标准音质 |
| higher | 较高音质 |
| exhigh | 极高音质 |
| lossless | 无损音质（FLAC） |
| hires | Hi-Res 高解析度 |

## 部署方式

### 使用 pm2 托管（推荐）

    pm2 start start.js --name NeteaseCloudMusicApi
    pm2 save
    pm2 startup

常用命令:

| 命令 | 说明 |
| ---- | ---- |
| pm2 logs NeteaseCloudMusicApi | 查看日志 |
| pm2 restart NeteaseCloudMusicApi | 重启服务 |
| pm2 stop NeteaseCloudMusicApi | 停止服务 |
| pm2 monit | 实时监控 |

### 配置 Yunzai-Bot rconsole-plugin 对接

编辑 tools.yaml 配置文件:

    useLocalNeteaseAPI: true
    neteaseCloudAPIServer: http://127.0.0.1:3000

## 项目结构

    NeteaseCloudMusicApi/
    |-- start.js            # 启动入口
    |-- package.json        # 项目配置及依赖
    |-- package-lock.json   # 依赖锁定文件
    |-- .gitignore          # Git 忽略规则
    |-- README.md           # 项目文档
    |-- node_modules/       # 依赖包（自动生成）

## Tech Stack 技术栈

| 技术 | 用途 |
| ---- | ---- |
| Node.js | 运行环境 |
| Express | Web 框架 |
| NeteaseCloudMusicApi v4.30.0 | 核心 API 模块 |
| pm2 | 进程管理 |
| Your sanity | Troubleshooting at 3 AM |

## Acknowledgements 致谢

- [NeteaseCloudMusicApi](https://github.com/Binaryify/NeteaseCloudMusicApi) ——让这一切成为可能的起源项目
- [pm2](https://pm2.keymetrics.io/) -- 让服务永远活下去

## License 许可证

<details><summary>MIT -- Do whatever you want, just do not blame me.</summary>

麻省理工 -- 爱干什么就干什么吧,别来怪我。

</details>

---

<div align=center>

<details><summary>If this repo saved your bot, consider giving it a star.</summary>

如果这个仓库拯救了你的机器人,请考虑给它点个星。

</details>

<details><summary>Made with love and frustration from expired third-party APIs.</summary>

怀着爱与无奈,用过期的第三方API制作而成。

</details>

</div>
