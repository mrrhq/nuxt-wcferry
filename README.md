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
- 🚠 定义路由就是机器人的技能
- 🌲 可编程的 Nitro Corn Task
- 🦾 内置 DLL，无需关心回调
- 💻 基于 wcferry 的 PC Hook

## Quick Setup

Install:

```bash
pnpx nuxi module add nuxt-wcferry
```

Command:

```ts
// server/routes/*.ts
/**
 * 在群里说：@机器人 ping
 * 机器人回复：pong
 */
export default defineBotCommandEventHandler({
  command: "ping",
  handler({ message }) {
    message.say("pong");
  },
});
```

Message:

```ts
// server/routes/*.ts
/**
 * 私聊机器人
 * 机器人说：hi
 */
export default defineBotEventHandler({
  hooks: "ferry:message:contact",
  handler({ message }) {
    message.say("hi!");
  },
});
```

Tasks:

```ts
// server/tasks/*.ts
/**
 * 每晚 11 点对自己说 hi!
 */
export default defineCronTask({
  pattern: "0 23 * * *",
  run({ message }) {
    useBot().say("hi!");
  },
});
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

[MIT](./LICENSE) License © 2024-PRESENT [mrrhq](https://github.com/mrrhqmao)

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
