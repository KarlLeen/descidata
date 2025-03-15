// 众筹与金融政策功能测试
describe('众筹与金融政策功能测试', () => {
  // 在每个测试前访问众筹页面
  beforeEach(() => {
    cy.visit('/crowdfunding')
    // 模拟钱包连接
    cy.window().then((win) => {
      win.ethereum = {
        isMetaMask: true,
        request: () => Promise.resolve(['0x123456789abcdef123456789abcdef123456789']),
        on: () => {},
        removeListener: () => {},
      }
    })
  })

  // 测试 1.1: 众筹页面内容验证
  it('应正确显示金融政策信息', () => {
    // 验证页面标题
    cy.get('h1').should('contain', '众筹')
    
    // 验证金融政策信息
    cy.contains('全额退款保证').should('be.visible')
    cy.contains('5%').should('be.visible')
    cy.contains('平台费用').should('be.visible')
    cy.contains('国债').should('be.visible')
    cy.contains('季度收益分配').should('be.visible')
    
    // 验证行动号召按钮
    cy.contains('浏览项目').should('be.visible')
  })

  // 测试 1.2: 众筹项目列表
  it('应显示可资助的实验项目列表', () => {
    // 验证项目列表存在
    cy.get('[data-cy=experiment-list]').should('exist')
    
    // 检查项目卡片内容
    cy.get('[data-cy=experiment-card]').each(($card) => {
      cy.wrap($card).within(() => {
        cy.get('[data-cy=experiment-title]').should('be.visible')
        cy.get('[data-cy=experiment-description]').should('be.visible')
        cy.get('[data-cy=funding-progress]').should('be.visible')
        cy.get('[data-cy=view-details-button]').should('be.visible')
      })
    })
    
    // 如果没有项目，应显示空状态
    cy.get('body').then(($body) => {
      if ($body.find('[data-cy=experiment-card]').length === 0) {
        cy.contains('暂无可资助的项目').should('be.visible')
      }
    })
  })

  // 测试 2.2: 资助实验流程
  it('应能成功资助实验', () => {
    // 点击第一个实验的详情按钮
    cy.get('[data-cy=view-details-button]').first().click()
    
    // 验证实验详情页面加载
    cy.url().should('include', '/experiment/')
    
    // 点击支持此研究按钮
    cy.get('[data-cy=fund-experiment-button]').click()
    
    // 验证资助模态框
    cy.get('[data-cy=fund-modal]').should('be.visible')
    cy.get('[data-cy=fund-modal]').within(() => {
      cy.contains('平台费用').should('be.visible')
      cy.get('[data-cy=fund-amount-input]').type('2')
      cy.get('[data-cy=confirm-fund-button]').click()
    })
    
    // 模拟 MetaMask 确认
    cy.window().then((win) => {
      // 这里只是模拟，实际测试需要使用真实的钱包或模拟库
      win.ethereum.request = () => Promise.resolve('0xtransactionhash')
    })
    
    // 验证成功消息
    cy.contains('资助成功').should('be.visible', { timeout: 10000 })
    
    // 验证进度条更新
    cy.get('[data-cy=funding-progress]').should('be.visible')
  })

  // 测试 3.1: 未达资金目标的退款测试
  it('应允许在实验未达资金目标时申请退款', () => {
    // 访问一个未达资金目标且已过期的实验
    cy.visit('/experiment/expired-underfunded')
    
    // 验证退款按钮存在
    cy.get('[data-cy=refund-button]').should('be.visible')
    
    // 点击退款按钮
    cy.get('[data-cy=refund-button]').click()
    
    // 模拟 MetaMask 确认
    cy.window().then((win) => {
      win.ethereum.request = () => Promise.resolve('0xtransactionhash')
    })
    
    // 验证成功消息
    cy.contains('退款成功').should('be.visible', { timeout: 10000 })
  })

  // 测试 4.1: 成功资助后的资金处理
  it('研究者应能处理成功资助的实验资金', () => {
    // 切换到研究者账户
    cy.window().then((win) => {
      win.ethereum.request = () => Promise.resolve(['0xresearcher123456789abcdef123456789abcdef'])
    })
    
    // 访问一个成功资助的实验
    cy.visit('/experiment/funded-success')
    
    // 验证处理资金按钮存在
    cy.get('[data-cy=process-funds-button]').should('be.visible')
    
    // 点击处理资金按钮
    cy.get('[data-cy=process-funds-button]').click()
    
    // 模拟 MetaMask 确认
    cy.window().then((win) => {
      win.ethereum.request = () => Promise.resolve('0xtransactionhash')
    })
    
    // 验证成功消息
    cy.contains('资金处理成功').should('be.visible', { timeout: 10000 })
    
    // 验证平台费用和研究者资金显示
    cy.contains('平台费用: 5%').should('be.visible')
    cy.contains('研究者资金: 95%').should('be.visible')
  })

  // 测试 6.1: 资金进度显示
  it('应正确显示资金进度', () => {
    // 访问多个不同资金状态的实验
    const experiments = [
      { id: 'exp1', funded: '0', goal: '10', expected: '0%' },
      { id: 'exp2', funded: '5', goal: '10', expected: '50%' },
      { id: 'exp3', funded: '10', goal: '10', expected: '100%' }
    ]
    
    experiments.forEach(exp => {
      cy.visit(`/experiment/${exp.id}`)
      
      // 验证进度条显示
      cy.get('[data-cy=funding-progress-bar]')
        .should('have.attr', 'style')
        .and('include', `width: ${exp.expected}`)
      
      // 验证百分比显示
      cy.get('[data-cy=funding-percentage]').should('contain', exp.expected)
    })
  })
})
