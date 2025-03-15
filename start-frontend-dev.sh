#!/bin/bash

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}DeSciData 前端开发服务器${NC}"
echo "==============================="

# 创建模拟服务器目录（如果不存在）
mkdir -p ./cypress/mock-server

# 创建模拟服务器
echo -e "${YELLOW}创建模拟服务器...${NC}"
cat > ./cypress/mock-server/server.js << 'EOF'
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3030;

// 基本的实验数据
const experiments = [
  {
    id: '1',
    title: '气候变化对海洋生物多样性的影响',
    description: '研究全球气候变化如何影响海洋生态系统和生物多样性',
    fundingGoal: 100000,
    currentFunding: 75000,
    creator: '0x1234567890123456789012345678901234567890',
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    status: 'active',
    category: 'environmental',
    imageUrl: 'https://example.com/image1.jpg'
  },
  {
    id: '2',
    title: '量子计算在药物研发中的应用',
    description: '探索量子计算如何加速药物发现和开发过程',
    fundingGoal: 200000,
    currentFunding: 150000,
    creator: '0x2345678901234567890123456789012345678901',
    startDate: '2025-02-01',
    endDate: '2026-01-31',
    status: 'active',
    category: 'medical',
    imageUrl: 'https://example.com/image2.jpg'
  },
  {
    id: '3',
    title: '人工智能辅助癌症诊断',
    description: '开发基于AI的工具来提高癌症早期检测的准确性',
    fundingGoal: 300000,
    currentFunding: 100000,
    creator: '0x3456789012345678901234567890123456789012',
    startDate: '2025-03-01',
    endDate: '2026-02-28',
    status: 'active',
    category: 'medical',
    imageUrl: 'https://example.com/image3.jpg'
  }
];

// 里程碑数据
const milestones = [
  // 第一阶段：基础设施与核心功能（6周）
  {
    id: '1.1',
    name: '用户系统与认证',
    phaseId: '1',
    phaseName: '基础设施与核心功能',
    targetProgress: 100,
    currentProgress: 80,
    kpis: [
      { name: '钱包连接数', target: 3, current: 2 },
      { name: '认证成功率', target: 95, current: 92, unit: '%' }
    ]
  },
  {
    id: '1.2',
    name: '数据管理',
    phaseId: '1',
    phaseName: '基础设施与核心功能',
    targetProgress: 100,
    currentProgress: 70,
    kpis: [
      { name: '上传成功率', target: 99, current: 95, unit: '%' },
      { name: '元数据字段数', target: 10, current: 8 }
    ]
  },
  {
    id: '1.3',
    name: '智能合约',
    phaseId: '1',
    phaseName: '基础设施与核心功能',
    targetProgress: 100,
    currentProgress: 90,
    kpis: [
      { name: '测试覆盖率', target: 90, current: 85, unit: '%' },
      { name: '燃气优化', target: 30, current: 25, unit: '%' }
    ]
  },
  
  // 第二阶段：功能扩展（8周）
  {
    id: '2.1',
    name: 'NFT功能',
    phaseId: '2',
    phaseName: '功能扩展',
    targetProgress: 100,
    currentProgress: 60,
    kpis: [
      { name: '铸造成功率', target: 100, current: 95, unit: '%' },
      { name: '定价模型数', target: 3, current: 2 }
    ]
  },
  {
    id: '2.2',
    name: '引用系统',
    phaseId: '2',
    phaseName: '功能扩展',
    targetProgress: 100,
    currentProgress: 50,
    kpis: [
      { name: '跟踪准确率', target: 100, current: 90, unit: '%' },
      { name: '验证时间', target: 1, current: 1.5, unit: '秒' }
    ]
  },
  {
    id: '2.3',
    name: 'UI/UX',
    phaseId: '2',
    phaseName: '功能扩展',
    targetProgress: 100,
    currentProgress: 75,
    kpis: [
      { name: '加载时间', target: 2, current: 2.5, unit: '秒' },
      { name: 'UX评分', target: 90, current: 85 }
    ]
  },
  
  // 第三阶段：生态系统与可扩展性（6周）
  {
    id: '3.1',
    name: '众筹',
    phaseId: '3',
    phaseName: '生态系统与可扩展性',
    targetProgress: 100,
    currentProgress: 40,
    kpis: [
      { name: '资金成功率', target: 95, current: 85, unit: '%' },
      { name: '评估分数', target: 90, current: 80 }
    ]
  },
  {
    id: '3.2',
    name: '数据验证',
    phaseId: '3',
    phaseName: '生态系统与可扩展性',
    targetProgress: 100,
    currentProgress: 30,
    kpis: [
      { name: '准确率', target: 95, current: 90, unit: '%' },
      { name: '同行评审完成率', target: 90, current: 80, unit: '%' }
    ]
  },
  {
    id: '3.3',
    name: 'API与集成',
    phaseId: '3',
    phaseName: '生态系统与可扩展性',
    targetProgress: 100,
    currentProgress: 20,
    kpis: [
      { name: '响应时间', target: 100, current: 150, unit: '毫秒' },
      { name: 'SDK成功率', target: 95, current: 85, unit: '%' }
    ]
  }
];

// 计算每个阶段的进度
const phaseProgress = {
  '1': {
    id: '1',
    name: '基础设施与核心功能',
    duration: '6周',
    progress: 80
  },
  '2': {
    id: '2',
    name: '功能扩展',
    duration: '8周',
    progress: 62
  },
  '3': {
    id: '3',
    name: '生态系统与可扩展性',
    duration: '6周',
    progress: 30
  }
};

// 创建服务器
const server = http.createServer((req, res) => {
  // 设置CORS头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // 处理预检请求
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  // 解析URL
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = url.pathname;
  
  console.log(`${req.method} ${pathname}`);
  
  // 路由处理
  if (pathname === '/api/experiments' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(experiments));
  } 
  else if (pathname.match(/^\/api\/experiments\/\d+$/) && req.method === 'GET') {
    const id = pathname.split('/').pop();
    const experiment = experiments.find(exp => exp.id === id);
    
    if (experiment) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(experiment));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Experiment not found' }));
    }
  }
  else if (pathname === '/api/milestones' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(milestones));
  }
  else if (pathname.match(/^\/api\/milestones\/[\d\.]+$/) && req.method === 'GET') {
    const id = pathname.split('/').pop();
    const milestone = milestones.find(ms => ms.id === id);
    
    if (milestone) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(milestone));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Milestone not found' }));
    }
  }
  else if (pathname === '/api/phases' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(Object.values(phaseProgress)));
  }
  else if (pathname.match(/^\/api\/phases\/\d+$/) && req.method === 'GET') {
    const id = pathname.split('/').pop();
    const phase = phaseProgress[id];
    
    if (phase) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(phase));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Phase not found' }));
    }
  }
  else if (pathname.match(/^\/api\/phases\/\d+\/milestones$/) && req.method === 'GET') {
    const phaseId = pathname.split('/')[3];
    const phaseMilestones = milestones.filter(ms => ms.phaseId === phaseId);
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(phaseMilestones));
  }
  else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

// 启动服务器
server.listen(PORT, () => {
  console.log(`模拟服务器运行在 http://localhost:${PORT}`);
});

// 导出服务器实例以便可以在其他地方关闭
module.exports = server;
EOF

# 启动模拟服务器
echo -e "${YELLOW}启动模拟服务器...${NC}"
node ./cypress/mock-server/server.js &
MOCK_SERVER_PID=$!
echo -e "${GREEN}模拟服务器已启动在 http://localhost:3030${NC}"

# 等待服务器启动
sleep 2

# 启动前端开发服务器
echo -e "${YELLOW}启动前端开发服务器...${NC}"
cd frontend && npm run dev &
FRONTEND_PID=$!

# 等待前端服务器启动
sleep 5
echo -e "${GREEN}前端开发服务器已启动${NC}"
echo -e "${GREEN}请在浏览器中访问: http://localhost:3000${NC}"
echo ""
echo "按 Ctrl+C 停止服务器"

# 等待用户按下Ctrl+C
trap "echo -e '${YELLOW}正在关闭服务器...${NC}'; kill $MOCK_SERVER_PID; kill $FRONTEND_PID; echo -e '${GREEN}服务器已关闭${NC}'; exit" INT
wait
