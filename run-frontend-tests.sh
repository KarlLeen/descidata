#!/bin/bash

# DeSciData 前端测试运行脚本
# 此脚本用于运行 Cypress 端到端测试

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # 无颜色

echo -e "${YELLOW}DeSciData 前端测试运行工具${NC}"
echo "==============================="

# 检查依赖
echo -e "${YELLOW}检查依赖...${NC}"
if ! command -v npm &> /dev/null; then
    echo -e "${RED}错误: npm 未安装. 请先安装 Node.js 和 npm.${NC}"
    exit 1
fi

# 安装 Cypress 和其他依赖
echo -e "${YELLOW}安装测试依赖...${NC}"
npm install --save-dev cypress cypress-file-upload

# 添加 Cypress 文件上传插件支持
echo -e "${YELLOW}配置 Cypress 插件...${NC}"
if [ ! -f ./cypress/support/commands.js ]; then
    mkdir -p ./cypress/support
    echo "// 导入 Cypress 文件上传插件
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
})" > ./cypress/support/commands.js
fi

if [ ! -f ./cypress/support/e2e.js ]; then
    echo "// 导入命令和其他支持文件
import './commands'" > ./cypress/support/e2e.js
fi

# 创建模拟服务器目录
mkdir -p ./cypress/mock-server

# 创建模拟服务器
echo -e "${YELLOW}创建模拟服务器...${NC}"
cat > ./cypress/mock-server/server.js << 'EOL'
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3030;

// 基本的实验数据
const experiments = [
  { id: 'exp1', title: '基因组数据分析方法', description: '使用机器学习技术分析人类基因组数据的新方法', funded: 0, goal: 10 },
  { id: 'exp2', title: '量子计算在药物发现中的应用', description: '研究量子算法如何加速药物分子筛选过程', funded: 5, goal: 10 },
  { id: 'exp3', title: '匿名化基因组数据分析', description: '基于匿名化基因组数据的疾病预测模型', funded: 10, goal: 10 },
  { id: 'expired-underfunded', title: '已过期未达资金目标实验', description: '用于测试退款功能', funded: 2, goal: 10, expired: true },
  { id: 'funded-success', title: '成功资助的实验', description: '用于测试资金处理', funded: 10, goal: 10 }
];

// 基本的里程碑数据
const milestones = [
  { id: 'MS 1.1', name: '用户系统与认证', progress: 70, phase: '基础设施与核心功能', kpis: [
    { name: '已连接钱包数量', target: 3, current: 2 },
    { name: '认证成功率', target: 95, current: 90 }
  ]},
  { id: 'MS 1.2', name: '数据管理', progress: 60, phase: '基础设施与核心功能', kpis: [
    { name: '上传成功率', target: 99, current: 95 },
    { name: '元数据字段数', target: 10, current: 8 }
  ]},
  { id: 'MS 1.3', name: '智能合约', progress: 50, phase: '基础设施与核心功能', kpis: [
    { name: '测试覆盖率', target: 90, current: 75 },
    { name: 'gas 优化', target: 30, current: 20 }
  ]},
  { id: 'MS 2.1', name: 'NFT 功能', progress: 40, phase: '功能扩展', kpis: [
    { name: '铸造成功率', target: 100, current: 90 },
    { name: '定价模型数量', target: 3, current: 2 }
  ]},
  { id: 'MS 2.2', name: '引用系统', progress: 30, phase: '功能扩展', kpis: [
    { name: '追踪准确率', target: 100, current: 95 },
    { name: '验证时间', target: 1, current: 1.5 }
  ]},
  { id: 'MS 2.3', name: 'UI/UX', progress: 20, phase: '功能扩展', kpis: [
    { name: '加载时间', target: 2, current: 3.5 },
    { name: 'UX 评分', target: 90, current: 75 }
  ]},
  { id: 'MS 3.1', name: '众筹', progress: 10, phase: '生态系统与可扩展性', kpis: [
    { name: '资助成功率', target: 95, current: 80 },
    { name: '评估评分', target: 90, current: 70 }
  ]},
  { id: 'MS 3.2', name: '数据验证', progress: 5, phase: '生态系统与可扩展性', kpis: [
    { name: '准确率', target: 95, current: 85 },
    { name: '同行评审完成率', target: 90, current: 60 }
  ]},
  { id: 'MS 3.3', name: 'API 与集成', progress: 0, phase: '生态系统与可扩展性', kpis: [
    { name: '响应时间', target: 100, current: 200 },
    { name: 'SDK 成功率', target: 95, current: 80 }
  ]}
];

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);
  
  // 设置 CORS 头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  // 路由处理
  if (req.url === '/' || req.url.startsWith('/?')) {
    // 首页
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<html><body><h1>DeSciData 测试服务器</h1><p>这是一个用于 Cypress 测试的模拟服务器</p></body></html>');
  } 
  else if (req.url === '/api/experiments') {
    // 实验列表
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(experiments));
  }
  else if (req.url.startsWith('/api/experiment/')) {
    // 单个实验
    const id = req.url.split('/').pop();
    const experiment = experiments.find(e => e.id === id);
    
    if (experiment) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(experiment));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Experiment not found' }));
    }
  }
  else if (req.url === '/api/milestones') {
    // 里程碑列表
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(milestones));
  }
  else if (req.url.startsWith('/api/milestone/')) {
    // 单个里程碑
    const id = req.url.split('/').pop();
    const milestone = milestones.find(m => m.id === id);
    
    if (milestone) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(milestone));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Milestone not found' }));
    }
  }
  else if (req.url.startsWith('/crowdfunding') || 
           req.url.startsWith('/experiment/') || 
           req.url.startsWith('/dashboard') || 
           req.url.startsWith('/experiments') || 
           req.url.startsWith('/portfolio')) {
    // 前端路由
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<html><body><h1>DeSciData 前端页面</h1><p>这是一个模拟的前端页面</p><div id="root"></div></body></html>');
  }
  else {
    // 404
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`模拟服务器运行在 http://localhost:${PORT}`);
  // 将 PID 写入文件，以便后续关闭
  fs.writeFileSync(path.join(__dirname, 'server.pid'), process.pid.toString());
});

// 处理关闭
process.on('SIGINT', () => {
  console.log('关闭服务器...');
  server.close();
  process.exit();
});
EOL

# 启动模拟服务器
echo -e "${YELLOW}启动模拟服务器...${NC}"
node ./cypress/mock-server/server.js &
echo -e "${GREEN}模拟服务器已启动在 http://localhost:3030${NC}"

# 等待服务器启动
sleep 3

# 运行测试
echo -e "${YELLOW}请选择要运行的测试:${NC}"
echo "1) 众筹与金融政策测试"
echo "2) 里程碑与进度跟踪测试"
echo "3) 实验管理测试"
echo "4) 运行所有测试"
echo "5) 在浏览器中打开 Cypress (交互模式)"
echo "6) 退出"

read -r test_choice

case $test_choice in
    1)
        echo -e "${YELLOW}运行众筹与金融政策测试...${NC}"
        npx cypress run --spec "cypress/e2e/crowdfunding.cy.js"
        ;;
    2)
        echo -e "${YELLOW}运行里程碑与进度跟踪测试...${NC}"
        npx cypress run --spec "cypress/e2e/milestone-tracking.cy.js"
        ;;
    3)
        echo -e "${YELLOW}运行实验管理测试...${NC}"
        npx cypress run --spec "cypress/e2e/experiment-management.cy.js"
        ;;
    4)
        echo -e "${YELLOW}运行所有测试...${NC}"
        npx cypress run
        ;;
    5)
        echo -e "${YELLOW}在浏览器中打开 Cypress (交互模式)...${NC}"
        npx cypress open
        ;;
    6)
        echo -e "${YELLOW}退出测试.${NC}"
        exit 0
        ;;
    *)
        echo -e "${RED}无效选择.${NC}"
        exit 1
        ;;
esac

# 关闭模拟服务器
if [ -f ./cypress/mock-server/server.pid ]; then
    MOCK_SERVER_PID=$(cat ./cypress/mock-server/server.pid)
    echo -e "${YELLOW}关闭模拟服务器 (PID: $MOCK_SERVER_PID)...${NC}"
    kill $MOCK_SERVER_PID 2>/dev/null || true
    rm ./cypress/mock-server/server.pid
    echo -e "${GREEN}模拟服务器已关闭.${NC}"
fi

echo -e "${GREEN}测试完成!${NC}"
