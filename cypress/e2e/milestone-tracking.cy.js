// 里程碑与进度跟踪功能测试
describe('里程碑与进度跟踪功能测试', () => {
  // 在每个测试前模拟钱包连接
  beforeEach(() => {
    cy.window().then((win) => {
      win.ethereum = {
        isMetaMask: true,
        request: () => Promise.resolve(['0x123456789abcdef123456789abcdef123456789']),
        on: () => {},
        removeListener: () => {},
      }
    })
  })

  // 测试 1.1: 项目进度概览页面
  it('应正确显示项目进度概览', () => {
    cy.visit('/dashboard/progress')
    
    // 验证页面标题
    cy.get('h1').should('contain', '项目进度')
    
    // 验证三个项目阶段的显示
    cy.contains('基础设施与核心功能').should('be.visible')
    cy.contains('功能扩展').should('be.visible')
    cy.contains('生态系统与可扩展性').should('be.visible')
    
    // 验证里程碑显示
    cy.get('[data-cy=milestone-item]').should('have.length.at.least', 9)
    
    // 验证整体项目进度显示
    cy.get('[data-cy=overall-progress]').should('be.visible')
    cy.get('[data-cy=overall-progress-bar]').should('be.visible')
  })

  // 测试 1.2: 单个阶段详情页面
  it('应正确显示单个阶段的详情', () => {
    // 点击第一个阶段（基础设施与核心功能）
    cy.visit('/dashboard/progress')
    cy.contains('基础设施与核心功能').click()
    
    // 验证阶段详情页面
    cy.url().should('include', '/phase/')
    
    // 验证里程碑显示
    cy.contains('MS 1.1: 用户系统与认证').should('be.visible')
    cy.contains('MS 1.2: 数据管理').should('be.visible')
    cy.contains('MS 1.3: 智能合约').should('be.visible')
    
    // 验证 KPI 显示
    cy.contains('已连接钱包数量').should('be.visible')
    cy.contains('认证成功率').should('be.visible')
    cy.contains('上传成功率').should('be.visible')
    cy.contains('元数据字段数').should('be.visible')
    cy.contains('测试覆盖率').should('be.visible')
    cy.contains('gas 优化').should('be.visible')
    
    // 验证阶段整体进度
    cy.get('[data-cy=phase-progress]').should('be.visible')
  })

  // 测试 2.1: 更新里程碑进度 (仅项目管理员)
  it('项目管理员应能更新里程碑进度', () => {
    // 模拟项目管理员账户
    cy.window().then((win) => {
      win.ethereum.request = () => Promise.resolve(['0xprojectmanager123456789abcdef123456789abcdef'])
    })
    
    cy.visit('/dashboard/progress')
    cy.contains('基础设施与核心功能').click()
    
    // 验证更新按钮存在
    cy.get('[data-cy=update-progress-button]').should('be.visible')
    cy.get('[data-cy=update-progress-button]').click()
    
    // 验证更新表单
    cy.get('[data-cy=milestone-select]').select('MS 1.1: 用户系统与认证')
    cy.get('[data-cy=progress-input]').clear().type('75')
    cy.get('[data-cy=submit-progress-button]').click()
    
    // 模拟 MetaMask 确认
    cy.window().then((win) => {
      win.ethereum.request = () => Promise.resolve('0xtransactionhash')
    })
    
    // 验证成功消息
    cy.contains('进度更新成功').should('be.visible', { timeout: 10000 })
    
    // 验证进度已更新
    cy.contains('MS 1.1: 用户系统与认证').parent().contains('75%').should('be.visible')
  })

  // 测试 2.2: 更新里程碑 KPI (仅项目管理员)
  it('项目管理员应能更新里程碑 KPI', () => {
    // 模拟项目管理员账户
    cy.window().then((win) => {
      win.ethereum.request = () => Promise.resolve(['0xprojectmanager123456789abcdef123456789abcdef'])
    })
    
    cy.visit('/dashboard/progress')
    cy.contains('基础设施与核心功能').click()
    
    // 验证更新 KPI 按钮存在
    cy.get('[data-cy=update-kpi-button]').should('be.visible')
    cy.get('[data-cy=update-kpi-button]').click()
    
    // 验证更新表单
    cy.get('[data-cy=milestone-select]').select('MS 1.1: 用户系统与认证')
    cy.get('[data-cy=kpi-select]').select('已连接钱包数量')
    cy.get('[data-cy=kpi-value-input]').clear().type('2')
    cy.get('[data-cy=submit-kpi-button]').click()
    
    // 模拟 MetaMask 确认
    cy.window().then((win) => {
      win.ethereum.request = () => Promise.resolve('0xtransactionhash')
    })
    
    // 验证成功消息
    cy.contains('KPI 更新成功').should('be.visible', { timeout: 10000 })
    
    // 验证 KPI 已更新
    cy.contains('已连接钱包数量').parent().contains('2 / 3').should('be.visible')
  })

  // 测试 2.3: 权限控制测试
  it('非项目管理员不应能更新里程碑', () => {
    // 模拟普通用户账户
    cy.window().then((win) => {
      win.ethereum.request = () => Promise.resolve(['0xregularuser123456789abcdef123456789abcdef'])
    })
    
    cy.visit('/dashboard/progress')
    cy.contains('基础设施与核心功能').click()
    
    // 验证更新按钮不存在
    cy.get('[data-cy=update-progress-button]').should('not.exist')
    cy.get('[data-cy=update-kpi-button]').should('not.exist')
    
    // 尝试直接访问更新页面
    cy.visit('/dashboard/progress/update', { failOnStatusCode: false })
    
    // 验证权限错误消息
    cy.contains('权限不足').should('be.visible')
  })

  // 测试 3.1: 阶段进度自动计算
  it('阶段进度应正确计算为里程碑的平均进度', () => {
    // 模拟项目管理员账户并更新多个里程碑
    cy.window().then((win) => {
      win.ethereum.request = () => Promise.resolve(['0xprojectmanager123456789abcdef123456789abcdef'])
    })
    
    // 更新阶段 1 的三个里程碑
    const milestones = [
      { id: 'MS 1.1: 用户系统与认证', progress: 80 },
      { id: 'MS 1.2: 数据管理', progress: 60 },
      { id: 'MS 1.3: 智能合约', progress: 40 }
    ]
    
    cy.visit('/dashboard/progress')
    cy.contains('基础设施与核心功能').click()
    
    // 依次更新每个里程碑
    milestones.forEach(ms => {
      cy.get('[data-cy=update-progress-button]').click()
      cy.get('[data-cy=milestone-select]').select(ms.id)
      cy.get('[data-cy=progress-input]').clear().type(ms.progress)
      cy.get('[data-cy=submit-progress-button]').click()
      
      // 模拟 MetaMask 确认
      cy.window().then((win) => {
        win.ethereum.request = () => Promise.resolve('0xtransactionhash')
      })
      
      // 等待更新成功
      cy.contains('进度更新成功').should('be.visible', { timeout: 10000 })
    })
    
    // 验证阶段整体进度为 60%
    cy.get('[data-cy=phase-progress]').should('contain', '60%')
    cy.get('[data-cy=phase-progress-bar]')
      .should('have.attr', 'style')
      .and('include', 'width: 60%')
  })

  // 测试 4.1: 创建新里程碑
  it('项目管理员应能创建新的里程碑', () => {
    // 模拟项目管理员账户
    cy.window().then((win) => {
      win.ethereum.request = () => Promise.resolve(['0xprojectmanager123456789abcdef123456789abcdef'])
    })
    
    cy.visit('/dashboard/progress')
    
    // 点击创建里程碑按钮
    cy.get('[data-cy=create-milestone-button]').click()
    
    // 填写里程碑信息
    cy.get('[data-cy=milestone-id-input]').type('MS 4.1')
    cy.get('[data-cy=milestone-name-input]').type('社区参与')
    cy.get('[data-cy=milestone-description-input]').type('增加社区参与度和用户互动')
    cy.get('[data-cy=phase-select]').select('生态系统与可扩展性')
    
    // 添加 KPI
    cy.get('[data-cy=add-kpi-button]').click()
    cy.get('[data-cy=kpi-name-input]').type('社区成员数量')
    cy.get('[data-cy=kpi-target-input]').type('100')
    cy.get('[data-cy=kpi-current-input]').type('0')
    
    // 提交表单
    cy.get('[data-cy=submit-milestone-button]').click()
    
    // 模拟 MetaMask 确认
    cy.window().then((win) => {
      win.ethereum.request = () => Promise.resolve('0xtransactionhash')
    })
    
    // 验证成功消息
    cy.contains('里程碑创建成功').should('be.visible', { timeout: 10000 })
    
    // 验证新里程碑已添加
    cy.contains('生态系统与可扩展性').click()
    cy.contains('MS 4.1: 社区参与').should('be.visible')
  })

  // 测试 5.1: 进度可视化效果
  it('应有直观的进度可视化效果', () => {
    cy.visit('/dashboard/progress')
    
    // 验证进度条颜色编码
    cy.get('[data-cy=progress-bar-complete]').should('have.css', 'background-color', 'rgb(34, 197, 94)') // 绿色
    cy.get('[data-cy=progress-bar-in-progress]').should('have.css', 'background-color', 'rgb(234, 179, 8)') // 黄色
    cy.get('[data-cy=progress-bar-delayed]').should('have.css', 'background-color', 'rgb(239, 68, 68)') // 红色
    
    // 验证图表和标签
    cy.get('[data-cy=progress-chart]').should('be.visible')
    cy.get('[data-cy=chart-legend]').should('be.visible')
    
    // 验证里程碑状态图标
    cy.get('[data-cy=milestone-status-icon]').should('be.visible')
  })

  // 测试 6.1: 里程碑更新与项目状态集成
  it('里程碑完成应正确影响项目状态', () => {
    // 模拟项目管理员账户
    cy.window().then((win) => {
      win.ethereum.request = () => Promise.resolve(['0xprojectmanager123456789abcdef123456789abcdef'])
    })
    
    // 将众筹里程碑更新为 100%
    cy.visit('/dashboard/progress')
    cy.contains('生态系统与可扩展性').click()
    cy.get('[data-cy=update-progress-button]').click()
    cy.get('[data-cy=milestone-select]').select('MS 3.1: 众筹')
    cy.get('[data-cy=progress-input]').clear().type('100')
    cy.get('[data-cy=submit-progress-button]').click()
    
    // 模拟 MetaMask 确认
    cy.window().then((win) => {
      win.ethereum.request = () => Promise.resolve('0xtransactionhash')
    })
    
    // 验证成功消息
    cy.contains('进度更新成功').should('be.visible', { timeout: 10000 })
    
    // 验证众筹功能状态
    cy.visit('/crowdfunding')
    cy.contains('众筹功能已完全实现').should('be.visible')
    
    // 验证项目时间线
    cy.visit('/dashboard')
    cy.contains('MS 3.1: 众筹').parent().contains('已完成').should('be.visible')
  })
})
