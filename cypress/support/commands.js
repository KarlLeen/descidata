// 导入 Cypress 文件上传插件
import 'cypress-file-upload';

// 添加自定义命令
Cypress.Commands.add('login', (address) => {
  cy.window().then((win) => {
    win.ethereum = {
      isMetaMask: true,
      request: () => Promise.resolve([address || '0x123456789abcdef123456789abcdef123456789']),
      on: () => {},
      removeListener: () => {},
    }
  })
})
