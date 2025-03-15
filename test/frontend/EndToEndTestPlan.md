# DeSciData 前端端到端测试计划

本文档提供了对 DeSciData 平台前端进行全面测试的详细计划。测试覆盖了所有主要功能模块，确保用户体验流畅且符合预期。

## 测试环境准备

在开始测试之前，请确保您已完成以下准备工作：

1. **本地开发环境设置**
   ```bash
   # 启动本地区块链
   npx hardhat node
   
   # 部署智能合约
   npx hardhat run scripts/deploy.js --network localhost
   
   # 启动前端服务器
   cd frontend
   npm run dev
   ```

2. **测试账户准备**
   - 研究者账户（用于创建和管理实验）
   - 多个赞助商账户（用于资助实验）
   - 平台管理员账户（用于管理平台和分配收益）

3. **测试工具**
   - 浏览器开发者工具（用于监控网络请求和状态）
   - MetaMask 钱包（用于处理交易）
   - 屏幕录制工具（可选，用于记录测试过程）

## 测试模块概览

DeSciData 前端测试分为以下主要模块：

1. [用户认证与钱包集成](./modules/AuthWalletTest.md)
2. [实验管理功能](./modules/ExperimentManagementTest.md)
3. [数据管理功能](./modules/DataManagementTest.md)
4. [NFT 功能测试](./modules/NFTFeaturesTest.md)
5. [众筹与金融政策](./modules/CrowdfundingTest.md)
6. [引用系统](./modules/CitationSystemTest.md)
7. [里程碑与进度跟踪](./modules/MilestoneTrackingTest.md)
8. [管理员功能](./modules/AdminFeaturesTest.md)
9. [用户界面与体验](./modules/UIUXTest.md)

## 测试优先级

根据项目的里程碑进度，我们建议按以下优先级进行测试：

**高优先级**（当前阶段重点）：
- 众筹与金融政策
- 里程碑与进度跟踪
- 实验管理功能

**中优先级**：
- 用户认证与钱包集成
- 数据管理功能
- NFT 功能测试

**低优先级**：
- 引用系统
- 管理员功能
- 用户界面与体验（可以在其他测试过程中同时进行）

## 测试执行流程

1. 按照优先级顺序执行各模块测试
2. 对于每个测试用例：
   - 记录测试结果（通过/失败）
   - 如发现问题，记录详细步骤和截图
   - 完成测试后，确认所有功能是否按预期工作

3. 汇总测试结果，生成测试报告

## 自动化测试

除了手动测试外，我们还提供了一些自动化测试脚本：

```bash
# 运行所有前端集成测试
npm run test:frontend

# 运行特定模块测试
npm run test:frontend -- --module crowdfunding
```

## 测试报告模板

测试完成后，请使用以下模板生成测试报告：

```markdown
# DeSciData 前端测试报告

## 测试概述
- 测试日期：[日期]
- 测试人员：[姓名]
- 测试环境：[环境详情]

## 测试结果摘要
- 总测试用例数：XX
- 通过用例数：XX
- 失败用例数：XX
- 通过率：XX%

## 问题汇总
1. [问题描述]
   - 严重程度：[高/中/低]
   - 复现步骤：[步骤]
   - 预期结果：[预期]
   - 实际结果：[实际]

## 建议与改进
- [建议1]
- [建议2]

## 结论
[总体评价]
```

## 附录

- [测试数据准备指南](./data/TestDataPreparation.md)
- [常见问题排查](./troubleshooting/CommonIssues.md)
- [测试环境配置详情](./environment/TestEnvironmentSetup.md)
