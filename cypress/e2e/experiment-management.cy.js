// 实验管理功能测试
describe('实验管理功能测试', () => {
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

  // 测试 1.1: 基本实验创建
  it('研究者应能创建基本实验', () => {
    // 模拟研究者账户
    cy.window().then((win) => {
      win.ethereum.request = () => Promise.resolve(['0xresearcher123456789abcdef123456789abcdef'])
    })
    
    cy.visit('/dashboard')
    
    // 点击创建实验按钮
    cy.get('[data-cy=create-experiment-button]').click()
    
    // 填写实验基本信息
    cy.get('[data-cy=experiment-title-input]').type('基因组数据分析方法')
    cy.get('[data-cy=experiment-description-input]').type('使用机器学习技术分析人类基因组数据的新方法')
    cy.get('[data-cy=experiment-tags-input]').type('基因组学{enter}机器学习{enter}数据分析{enter}')
    
    // 上传封面图片
    cy.get('[data-cy=cover-image-upload]').attachFile('test-image.jpg')
    
    // 提交表单
    cy.get('[data-cy=submit-experiment-button]').click()
    
    // 模拟 MetaMask 确认
    cy.window().then((win) => {
      win.ethereum.request = () => Promise.resolve('0xtransactionhash')
    })
    
    // 验证成功消息
    cy.contains('实验创建成功').should('be.visible', { timeout: 10000 })
    
    // 验证实验已添加到列表
    cy.visit('/dashboard/projects')
    cy.contains('基因组数据分析方法').should('be.visible')
  })

  // 测试 1.2: 带资金目标的实验创建
  it('研究者应能创建带资金目标的实验', () => {
    // 模拟研究者账户
    cy.window().then((win) => {
      win.ethereum.request = () => Promise.resolve(['0xresearcher123456789abcdef123456789abcdef'])
    })
    
    cy.visit('/dashboard')
    cy.get('[data-cy=create-experiment-button]').click()
    
    // 填写实验基本信息
    cy.get('[data-cy=experiment-title-input]').type('量子计算在药物发现中的应用')
    cy.get('[data-cy=experiment-description-input]').type('研究量子算法如何加速药物分子筛选过程')
    cy.get('[data-cy=experiment-tags-input]').type('量子计算{enter}药物发现{enter}算法{enter}')
    
    // 启用资金目标
    cy.get('[data-cy=enable-funding-toggle]').click()
    
    // 填写资金信息
    cy.get('[data-cy=funding-goal-input]').type('5')
    
    // 设置截止日期（当前日期 + 30 天）
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 30)
    const formattedDate = futureDate.toISOString().split('T')[0]
    cy.get('[data-cy=funding-deadline-input]').type(formattedDate)
    
    cy.get('[data-cy=funding-purpose-input]').type('资金将用于购买计算资源和数据存储')
    
    // 提交表单
    cy.get('[data-cy=submit-experiment-button]').click()
    
    // 模拟 MetaMask 确认
    cy.window().then((win) => {
      win.ethereum.request = () => Promise.resolve('0xtransactionhash')
    })
    
    // 验证成功消息
    cy.contains('实验创建成功').should('be.visible', { timeout: 10000 })
    
    // 验证实验已添加到众筹页面
    cy.visit('/crowdfunding')
    cy.contains('量子计算在药物发现中的应用').should('be.visible')
    
    // 验证资金信息显示
    cy.contains('量子计算在药物发现中的应用').click()
    cy.get('[data-cy=funding-goal]').should('contain', '5 ETH')
    cy.get('[data-cy=funding-deadline]').should('be.visible')
    cy.get('[data-cy=funding-progress-bar]').should('be.visible')
  })

  // 测试 1.3: 带数据集的实验创建
  it('研究者应能创建包含数据集的实验', () => {
    // 模拟研究者账户
    cy.window().then((win) => {
      win.ethereum.request = () => Promise.resolve(['0xresearcher123456789abcdef123456789abcdef'])
    })
    
    cy.visit('/dashboard')
    cy.get('[data-cy=create-experiment-button]').click()
    
    // 填写实验基本信息
    cy.get('[data-cy=experiment-title-input]').type('匿名化基因组数据分析')
    cy.get('[data-cy=experiment-description-input]').type('基于匿名化基因组数据的疾病预测模型')
    
    // 添加数据集
    cy.get('[data-cy=add-dataset-button]').click()
    
    // 填写数据集信息
    cy.get('[data-cy=dataset-name-input]').type('匿名化基因组数据集')
    cy.get('[data-cy=dataset-description-input]').type('包含 1000 个匿名化的人类基因组样本')
    cy.get('[data-cy=dataset-file-upload]').attachFile('test-data.csv')
    cy.get('[data-cy=dataset-format-input]').type('CSV, JSON')
    cy.get('[data-cy=dataset-size-input]').type('2.5 GB')
    cy.get('[data-cy=dataset-price-input]').type('0.1')
    
    // 提交表单
    cy.get('[data-cy=submit-experiment-button]').click()
    
    // 模拟 MetaMask 确认
    cy.window().then((win) => {
      win.ethereum.request = () => Promise.resolve('0xtransactionhash')
    })
    
    // 验证成功消息
    cy.contains('实验创建成功').should('be.visible', { timeout: 10000 })
    
    // 验证数据集信息显示
    cy.visit('/dashboard/projects')
    cy.contains('匿名化基因组数据分析').click()
    cy.get('[data-cy=dataset-section]').should('be.visible')
    cy.contains('匿名化基因组数据集').should('be.visible')
    cy.get('[data-cy=dataset-price]').should('contain', '0.1 ETH')
  })

  // 测试 2.1: 编辑实验信息
  it('研究者应能编辑已创建的实验信息', () => {
    // 模拟研究者账户
    cy.window().then((win) => {
      win.ethereum.request = () => Promise.resolve(['0xresearcher123456789abcdef123456789abcdef'])
    })
    
    cy.visit('/dashboard/projects')
    
    // 选择一个实验并点击编辑
    cy.contains('基因组数据分析方法').parent().find('[data-cy=edit-experiment-button]').click()
    
    // 修改描述和标签
    cy.get('[data-cy=experiment-description-input]').clear().type('使用机器学习和深度学习技术分析人类基因组数据的新方法')
    cy.get('[data-cy=experiment-tags-input]').type('健康信息学{enter}')
    
    // 提交更改
    cy.get('[data-cy=submit-experiment-button]').click()
    
    // 模拟 MetaMask 确认
    cy.window().then((win) => {
      win.ethereum.request = () => Promise.resolve('0xtransactionhash')
    })
    
    // 验证成功消息
    cy.contains('实验更新成功').should('be.visible', { timeout: 10000 })
    
    // 验证更新后的信息
    cy.visit('/dashboard/projects')
    cy.contains('基因组数据分析方法').click()
    cy.get('[data-cy=experiment-description]').should('contain', '深度学习')
    cy.get('[data-cy=experiment-tags]').should('contain', '健康信息学')
  })

  // 测试 2.2: 添加实验结果
  it('研究者应能向实验添加研究结果', () => {
    // 模拟研究者账户
    cy.window().then((win) => {
      win.ethereum.request = () => Promise.resolve(['0xresearcher123456789abcdef123456789abcdef'])
    })
    
    cy.visit('/dashboard/projects')
    cy.contains('基因组数据分析方法').click()
    
    // 点击添加研究结果
    cy.get('[data-cy=add-result-button]').click()
    
    // 填写结果信息
    cy.get('[data-cy=result-title-input]').type('初步数据分析结果')
    cy.get('[data-cy=result-description-input]').type('使用聚类算法对基因组数据进行的初步分析')
    cy.get('[data-cy=result-file-upload]').attachFile('test-result.png')
    
    // 设置结果日期
    const today = new Date().toISOString().split('T')[0]
    cy.get('[data-cy=result-date-input]').type(today)
    
    // 提交表单
    cy.get('[data-cy=submit-result-button]').click()
    
    // 模拟 MetaMask 确认
    cy.window().then((win) => {
      win.ethereum.request = () => Promise.resolve('0xtransactionhash')
    })
    
    // 验证成功消息
    cy.contains('研究结果添加成功').should('be.visible', { timeout: 10000 })
    
    // 验证结果显示
    cy.get('[data-cy=results-section]').should('be.visible')
    cy.contains('初步数据分析结果').should('be.visible')
    cy.get('[data-cy=result-image]').should('be.visible')
  })

  // 测试 3.1: 实验列表浏览
  it('用户应能浏览所有公开的实验', () => {
    cy.visit('/experiments')
    
    // 验证实验列表
    cy.get('[data-cy=experiment-list]').should('be.visible')
    cy.get('[data-cy=experiment-card]').should('have.length.at.least', 1)
    
    // 测试筛选功能
    cy.get('[data-cy=filter-by-tag]').select('机器学习')
    cy.get('[data-cy=experiment-card]').should('contain', '机器学习')
    
    // 测试排序功能
    cy.get('[data-cy=sort-by]').select('newest')
    cy.get('[data-cy=experiment-card]').first().should('contain', '匿名化基因组数据分析')
    
    // 测试资金状态筛选
    cy.get('[data-cy=filter-by-funding]').select('seeking')
    cy.get('[data-cy=experiment-card]').should('contain', '量子计算在药物发现中的应用')
  })

  // 测试 3.2: 实验搜索功能
  it('用户应能搜索实验', () => {
    cy.visit('/experiments')
    
    // 搜索关键词
    cy.get('[data-cy=search-input]').type('基因组{enter}')
    
    // 验证搜索结果
    cy.get('[data-cy=search-results]').should('be.visible')
    cy.get('[data-cy=experiment-card]').should('contain', '基因组')
    
    // 搜索无结果的情况
    cy.get('[data-cy=search-input]').clear().type('不存在的实验{enter}')
    cy.contains('未找到匹配的实验').should('be.visible')
  })

  // 测试 4.1: 购买数据访问权
  it('用户应能购买实验数据的访问权', () => {
    // 模拟普通用户账户
    cy.window().then((win) => {
      win.ethereum.request = () => Promise.resolve(['0xuser123456789abcdef123456789abcdef'])
    })
    
    cy.visit('/experiments')
    cy.contains('匿名化基因组数据分析').click()
    
    // 点击购买数据访问权
    cy.get('[data-cy=purchase-data-button]').click()
    
    // 验证购买模态框
    cy.get('[data-cy=purchase-modal]').should('be.visible')
    cy.get('[data-cy=purchase-modal]').within(() => {
      cy.contains('匿名化基因组数据集').should('be.visible')
      cy.contains('0.1 ETH').should('be.visible')
      cy.get('[data-cy=confirm-purchase-button]').click()
    })
    
    // 模拟 MetaMask 确认
    cy.window().then((win) => {
      win.ethereum.request = () => Promise.resolve('0xtransactionhash')
    })
    
    // 验证成功消息
    cy.contains('购买成功').should('be.visible', { timeout: 10000 })
    
    // 验证用户已添加到访问列表
    cy.get('[data-cy=data-access-button]').should('be.visible')
  })

  // 测试 4.2: 访问已购买的数据
  it('用户应能访问已购买的数据集', () => {
    // 模拟已购买数据的用户账户
    cy.window().then((win) => {
      win.ethereum.request = () => Promise.resolve(['0xuser123456789abcdef123456789abcdef'])
    })
    
    cy.visit('/portfolio')
    
    // 验证投资组合中显示已购买的数据集
    cy.get('[data-cy=owned-datasets]').should('be.visible')
    cy.contains('匿名化基因组数据集').should('be.visible')
    
    // 点击查看数据
    cy.contains('匿名化基因组数据集').click()
    
    // 验证数据访问
    cy.get('[data-cy=download-data-button]').should('be.visible')
    cy.get('[data-cy=download-data-button]').click()
    
    // 验证下载开始
    cy.contains('下载已开始').should('be.visible')
  })

  // 测试 4.3: 数据 NFT 验证
  it('购买数据后应正确铸造数据 NFT', () => {
    // 模拟已购买数据的用户账户
    cy.window().then((win) => {
      win.ethereum.request = () => Promise.resolve(['0xuser123456789abcdef123456789abcdef'])
    })
    
    cy.visit('/portfolio')
    
    // 查看 NFT 部分
    cy.get('[data-cy=nft-section]').should('be.visible')
    cy.contains('匿名化基因组数据集 NFT').should('be.visible')
    
    // 验证 NFT 元数据
    cy.get('[data-cy=view-nft-details]').click()
    cy.get('[data-cy=nft-metadata]').should('be.visible')
    cy.get('[data-cy=nft-metadata]').should('contain', '匿名化基因组数据集')
    
    // 验证区块链浏览器链接
    cy.get('[data-cy=view-on-blockchain]').should('have.attr', 'href').and('include', 'etherscan.io')
  })

  // 测试 5.1: 研究者仪表板统计
  it('研究者应能查看其实验的统计数据', () => {
    // 模拟研究者账户
    cy.window().then((win) => {
      win.ethereum.request = () => Promise.resolve(['0xresearcher123456789abcdef123456789abcdef'])
    })
    
    cy.visit('/dashboard')
    
    // 验证统计部分
    cy.get('[data-cy=stats-section]').should('be.visible')
    cy.get('[data-cy=total-experiments]').should('be.visible')
    cy.get('[data-cy=total-funding]').should('be.visible')
    cy.get('[data-cy=dataset-sales]').should('be.visible')
    cy.get('[data-cy=visitors-stats]').should('be.visible')
    
    // 验证图表
    cy.get('[data-cy=funding-chart]').should('be.visible')
    cy.get('[data-cy=sales-chart]').should('be.visible')
  })

  // 测试 6.1: 实验创建表单的用户体验
  it('实验创建表单应有良好的用户体验', () => {
    // 模拟研究者账户
    cy.window().then((win) => {
      win.ethereum.request = () => Promise.resolve(['0xresearcher123456789abcdef123456789abcdef'])
    })
    
    cy.visit('/dashboard')
    cy.get('[data-cy=create-experiment-button]').click()
    
    // 验证表单分步指引
    cy.get('[data-cy=form-stepper]').should('be.visible')
    
    // 验证必填字段标记
    cy.get('[data-cy=experiment-title-input]').should('have.attr', 'required')
    
    // 验证输入验证
    cy.get('[data-cy=submit-experiment-button]').click()
    cy.get('[data-cy=title-error]').should('be.visible')
    
    // 验证文件上传预览
    cy.get('[data-cy=cover-image-upload]').attachFile('test-image.jpg')
    cy.get('[data-cy=image-preview]').should('be.visible')
    
    // 验证保存草稿功能
    cy.get('[data-cy=save-draft-button]').should('be.visible')
    cy.get('[data-cy=experiment-title-input]').type('测试草稿')
    cy.get('[data-cy=save-draft-button]').click()
    cy.contains('草稿已保存').should('be.visible')
  })

  // 测试 6.2: 实验详情页面的响应式设计
  it('实验详情页面应在不同设备上正常显示', () => {
    cy.visit('/experiment/1')
    
    // 桌面视图测试
    cy.viewport(1280, 800)
    cy.get('[data-cy=experiment-details]').should('be.visible')
    
    // 平板视图测试
    cy.viewport(768, 1024)
    cy.get('[data-cy=experiment-details]').should('be.visible')
    
    // 移动视图测试
    cy.viewport(375, 667)
    cy.get('[data-cy=experiment-details]').should('be.visible')
    
    // 验证图片适应性
    cy.get('[data-cy=experiment-image]').should('be.visible')
    
    // 验证操作按钮大小
    cy.get('[data-cy=action-button]').should('have.css', 'min-height', '44px')
  })
})
