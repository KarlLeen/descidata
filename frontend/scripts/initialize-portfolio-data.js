// 初始化投资组合数据脚本
// 运行此脚本以在本地存储中设置示例项目和投资

// 不同阶段的项目数据
const projects = [
  // 第一阶段项目 - 筹资阶段
  {
    id: "project_phase1_1",
    title: "基于区块链的科研数据共享平台",
    fundingGoal: 100000,
    fundingRaised: 65000,
    status: "funding",
    nextMilestone: {
      title: "用户系统与认证",
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
      title: "NFT功能实现",
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
      title: "系统部署与优化",
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
  // 早期投资 - 刚开始的项目
  {
    id: "investment_early_1",
    title: "量子计算在药物发现中的应用",
    investmentAmount: 10000,
    accessUntil: "2026-03-15",
    citations: 5,
    earnings: 200,
    updates: [
      {
        date: "2025-03-01",
        title: "项目启动会议记录",
      },
      {
        date: "2025-03-10",
        title: "初步研究方案",
      }
    ],
    rights: [
      "访问所有研究数据",
      "使用权用于衍生研究",
      "引用收益分成",
      "获取未来更新"
    ]
  },
  
  // 中期投资 - 进行中的项目
  {
    id: "investment_mid_1",
    title: "人工智能辅助蛋白质结构预测",
    investmentAmount: 15000,
    accessUntil: "2025-09-30",
    citations: 18,
    earnings: 650,
    updates: [
      {
        date: "2025-02-15",
        title: "算法优化进展报告",
      },
      {
        date: "2025-03-05",
        title: "新数据集添加",
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
  
  // 后期投资 - 接近完成的项目
  {
    id: "investment_late_1",
    title: "基因编辑技术在农作物抗病性中的应用",
    investmentAmount: 20000,
    accessUntil: "2025-12-31",
    citations: 32,
    earnings: 1200,
    updates: [
      {
        date: "2025-01-20",
        title: "最终实验结果",
      },
      {
        date: "2025-02-28",
        title: "论文发表准备",
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
