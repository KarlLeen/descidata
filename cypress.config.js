const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3030',
    viewportWidth: 1280,
    viewportHeight: 800,
    defaultCommandTimeout: 10000,
    setupNodeEvents(on, config) {
      // 实现节点事件监听器
    },
  },
  env: {
    // 测试环境变量
    testWalletPrivateKey: process.env.TEST_WALLET_PRIVATE_KEY,
    contractAddress: process.env.NEXT_PUBLIC_EXPERIMENT_CONTRACT_ADDRESS,
  }
})
