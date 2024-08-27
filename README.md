# Nuxt Wcferry

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle][bundle-src]][bundle-href]
[![JSDocs][jsdocs-src]][jsdocs-href]
[![License][license-src]][license-href]

适用于 Nuxt 的微信机器人框架，使用如下开源项目强力驱动：

- [🦾 wechaty-puppet-wcferry](https://github.com/mrrhq/wechaty-puppet-wcferry)
- [🤖 Wechaty](https://wechaty.js.org/)

## Features

<!-- Highlight some of the features your module provide here -->

- ⛰ 享用 Nuxt 的所有特性
- 🛠️ 全自动导入机器人技能
- 🔓 技能中间件和全局中间件
- 🌲 可编程的 Nitro Corn Task
- 🦾 内置 DLL，无需关心回调
- 💻 基于 wcferry 的 PC Hook
- 🔍 Wechaty API 可用

## Quick Setup

Install:

```bash
pnpx nuxi module add nuxt-wcferry
```

Skills:

```ts
// server/wcferry/skills/*.ts
/**
 * 在群里说：@机器人 ping
 * 机器人回复：pong
 */
export default defineBotCommandHandler({
  command: "ping",
  handler({ message, _command, _args }) {
    message.say("pong");
  },
});
```

Middleware:

```ts
// server/wcferry/middleware/*.ts
export default defineBotMiddleware({
  // 仅在 message 类事件中
  hook: "message",
  handler(message) {
    console.log(message.talker().name());
  },
});
```

然后在技能定义中使用 `middleware: '<小驼峰中间件文件名>'`即可应用。不要返回任何值，返回任何值即意味着技能被拦截，将立即中断剩余中间件和技能的执行。

还可以使用 `*.global.ts` 定义全局中间件，在所有技能执行前都会执行。

Tasks:

```ts
export default defineCronTask({
  pattern: "* * * * *",
  async run() {
    const bot = useBot();
    console.log(`Hi, I am ${bot.currentUser.name()}, now is ${new Date()}`);
    return {
      result: true,
    };
  },
});
```

Nitro 内置了 Task 功能，但不能在运行时编写定时任务，考虑到大多数机器人都会有定时任务，这个函数应该会有帮助。

Wechaty 和 Wcferry:

```ts
const bot = useBot(); // Wechaty 实例
const puppet = useBotPuppet(); // puppetWcferry 实例
const agent = useBotAgent(); // WcferryAgent 实例
```

That's it! You can now use Nuxt Ferry in your Nuxt app ✨

## Funding

<img src="./FUNDING.jpg" width="200" />

## Contribution

<details>
  <summary>Local development</summary>

```bash
# Install dependencies
npm install

# Generate type stubs
npm run dev:prepare

# Develop with the playground
npm run dev

# Build the playground
npm run dev:build

# Run ESLint
npm run lint

# Run Vitest
npm run test
npm run test:watch

# Release new version
npm run release
```

</details>

## License

[MIT](./LICENSE) License © 2024-PRESENT [mrrhq](https://github.com/mrrhq)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/nuxt-wcferry?style=flat&colorA=080f12&colorB=1fa669
[npm-version-href]: https://npmjs.com/package/nuxt-wcferry
[npm-downloads-src]: https://img.shields.io/npm/dm/nuxt-wcferry?style=flat&colorA=080f12&colorB=1fa669
[npm-downloads-href]: https://npmjs.com/package/nuxt-wcferry
[bundle-src]: https://img.shields.io/bundlephobia/minzip/nuxt-wcferry?style=flat&colorA=080f12&colorB=1fa669&label=minzip
[bundle-href]: https://bundlephobia.com/result?p=nuxt-wcferry
[license-src]: https://img.shields.io/github/license/mrrhq/nuxt-wcferry.svg?style=flat&colorA=080f12&colorB=1fa669
[license-href]: https://github.com/mrrhq/nuxt-wcferry/blob/main/LICENSE
[jsdocs-src]: https://img.shields.io/badge/jsdocs-reference-080f12?style=flat&colorA=080f12&colorB=1fa669
[jsdocs-href]: https://www.jsdocs.io/package/nuxt-wcferry
