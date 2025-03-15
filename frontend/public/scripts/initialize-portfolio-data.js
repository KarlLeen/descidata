// 初始化投资组合数据脚本
// 运行此脚本以在本地存储中设置示例项目和投资

// 基于智能合约中的3阶段20周项目结构创建示例项目
const projects = [
  // 第一阶段项目 - 筹资阶段
  {
    id: "project_phase1_1",
    title: "基于区块链的科研数据共享平台",
    fundingGoal: 100000,
    fundingRaised: 65000,
    status: "funding",
    nextMilestone: {
      title: "MS 1.1: 用户系统与认证",
      deadline: "2025-04-30",
      fundingLocked: 20000
    },
    progress: 0,
    dataUploads: []
  },
  
  // 第二阶段项目 - 进行中
  {
    id: "project_phase2_1",
    title: "去中心化科学数据验证系统",
    fundingGoal: 150000,
    fundingRaised: 150000,
    status: "in_progress",
    nextMilestone: {
      title: "MS 2.1: NFT功能实现",
      deadline: "2025-05-15",
      fundingLocked: 30000
    },
    progress: 45,
    dataUploads: [
      {
        date: "2025-02-20",
        title: "用户认证系统测试数据",
        status: "completed"
      },
      {
        date: "2025-03-01",
        title: "数据管理模块架构文档",
        status: "completed"
      }
    ]
  },
  
  // 第三阶段项目 - 已完成
  {
    id: "project_phase3_1",
    title: "科研数据引用追踪系统",
    fundingGoal: 80000,
    fundingRaised: 80000,
    status: "completed",
    nextMilestone: {
      title: "MS 3.2: 数据验证",
      deadline: "2025-01-30",
      fundingLocked: 0
    },
    progress: 100,
    dataUploads: [
      {
        date: "2024-12-15",
        title: "引用追踪算法源代码",
        status: "completed"
      },
      {
        date: "2025-01-10",
        title: "系统性能测试报告",
        status: "completed"
      },
      {
        date: "2025-01-25",
        title: "用户反馈与改进建议",
        status: "completed"
      }
    ]
  }
];

// 不同阶段的投资数据
const investments = [
  // 早期投资 - 第一阶段项目
  {
    id: "investment_phase1_1",
    title: "基础设施与核心功能开发",
    investmentAmount: 10000,
    accessUntil: "2026-03-15",
    citations: 5,
    earnings: 200,
    updates: [
      {
        date: "2025-03-01",
        title: "用户系统与认证 - KPI: 3个钱包, 95%认证成功率",
      },
      {
        date: "2025-03-10",
        title: "数据管理 - KPI: 99%上传成功率, 10个元数据字段",
      }
    ],
    rights: [
      "访问所有研究数据",
      "使用权用于衍生研究",
      "引用收益分成",
      "获取未来更新"
    ]
  },
  
  // 中期投资 - 第二阶段项目
  {
    id: "investment_phase2_1",
    title: "功能扩展阶段",
    investmentAmount: 15000,
    accessUntil: "2025-09-30",
    citations: 18,
    earnings: 650,
    updates: [
      {
        date: "2025-02-15",
        title: "NFT功能 - KPI: 100%铸造成功率, 3种定价模型",
      },
      {
        date: "2025-03-05",
        title: "引用系统 - KPI: 100%追踪精度, 1秒验证",
      }
    ],
    rights: [
      "访问所有研究数据",
      "使用权用于衍生研究",
      "引用收益分成",
      "获取未来更新",
      "参与研究方向决策"
    ]
  },
  
  // 后期投资 - 第三阶段项目
  {
    id: "investment_phase3_1",
    title: "生态系统与可扩展性",
    investmentAmount: 20000,
    accessUntil: "2025-12-31",
    citations: 32,
    earnings: 1200,
    updates: [
      {
        date: "2025-01-20",
        title: "众筹功能 - KPI: 95%资金成功率, 90评估分数",
      },
      {
        date: "2025-02-28",
        title: "数据验证 - KPI: 95%准确率, 90%同行评审完成率",
      }
    ],
    rights: [
      "访问所有研究数据",
      "使用权用于衍生研究",
      "引用收益分成",
      "获取未来更新",
      "参与研究方向决策",
      "技术专利共享"
    ]
  }
];

// 将数据保存到本地存储
localStorage.setItem('projects', JSON.stringify(projects));
localStorage.setItem('investments', JSON.stringify(investments));

console.log('投资组合数据已初始化!');
console.log(`添加了 ${projects.length} 个项目和 ${investments.length} 个投资`);

// 显示提示信息
alert(`成功初始化投资组合数据!\n- 添加了 ${projects.length} 个不同阶段的项目\n- 添加了 ${investments.length} 个不同阶段的投资\n\n请刷新页面查看。`);
