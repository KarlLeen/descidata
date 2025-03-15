const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ProjectProgress", function () {
  let desciData;
  let owner;
  let projectManager;
  let researcher;

  const phase1 = {
    id: "phase1",
    name: "基础设施与核心功能",
    milestones: [
      {
        id: "ms1.1",
        name: "用户系统与认证",
        targetProgress: 95,
        kpis: [
          { metric: "钱包集成数量", target: 3 },
          { metric: "认证流程成功率", target: 95 }
        ]
      },
      {
        id: "ms1.2",
        name: "数据管理基础",
        targetProgress: 99,
        kpis: [
          { metric: "文件上传成功率", target: 99 },
          { metric: "元数据字段覆盖", target: 10 }
        ]
      },
      {
        id: "ms1.3",
        name: "智能合约部署",
        targetProgress: 90,
        kpis: [
          { metric: "测试覆盖率", target: 90 },
          { metric: "Gas优化比例", target: 30 }
        ]
      }
    ]
  };

  beforeEach(async function () {
    [owner, projectManager, researcher] = await ethers.getSigners();

    // Deploy contract
    const DeSciData = await ethers.getContractFactory("DeSciData");
    desciData = await DeSciData.deploy();
    
    // Add project manager role
    await desciData.addProjectManager(projectManager.address);
  });

  describe("Milestone Management", function () {
    it("Should create a new milestone", async function () {
      const milestone = phase1.milestones[0];
      
      await desciData.connect(projectManager).createMilestone(
        milestone.id,
        milestone.name,
        milestone.targetProgress,
        milestone.kpis.map(kpi => ({
          metric: kpi.metric,
          target: kpi.target,
          current: 0
        })),
        ""
      );

      const createdMilestone = await desciData.getMilestone(milestone.id);
      expect(createdMilestone.name).to.equal(milestone.name);
      expect(createdMilestone.targetProgress).to.equal(milestone.targetProgress);
      expect(createdMilestone.currentProgress).to.equal(0);
    });

    it("Should update milestone progress", async function () {
      const milestone = phase1.milestones[0];
      
      // Create milestone
      await desciData.connect(projectManager).createMilestone(
        milestone.id,
        milestone.name,
        milestone.targetProgress,
        milestone.kpis.map(kpi => ({
          metric: kpi.metric,
          target: kpi.target,
          current: 0
        })),
        ""
      );

      // Update progress
      const newProgress = 50;
      await desciData.connect(projectManager).updateMilestoneProgress(
        milestone.id,
        newProgress
      );

      const updatedMilestone = await desciData.getMilestone(milestone.id);
      expect(updatedMilestone.currentProgress).to.equal(newProgress);
    });

    it("Should update KPI values", async function () {
      const milestone = phase1.milestones[0];
      
      // Create milestone
      await desciData.connect(projectManager).createMilestone(
        milestone.id,
        milestone.name,
        milestone.targetProgress,
        milestone.kpis.map(kpi => ({
          metric: kpi.metric,
          target: kpi.target,
          current: 0
        })),
        ""
      );

      // Update first KPI
      const kpiIndex = 0;
      const newValue = 2; // 2 out of 3 wallets integrated
      await desciData.connect(projectManager).updateMilestoneKPI(
        milestone.id,
        kpiIndex,
        newValue
      );

      const updatedMilestone = await desciData.getMilestone(milestone.id);
      expect(updatedMilestone.kpis[kpiIndex].current).to.equal(newValue);
    });

    it("Should emit MilestoneProgressUpdated event", async function () {
      const milestone = phase1.milestones[0];
      
      // Create milestone
      await desciData.connect(projectManager).createMilestone(
        milestone.id,
        milestone.name,
        milestone.targetProgress,
        milestone.kpis.map(kpi => ({
          metric: kpi.metric,
          target: kpi.target,
          current: 0
        })),
        ""
      );

      // Update progress and expect event
      const newProgress = 75;
      await expect(
        desciData.connect(projectManager).updateMilestoneProgress(milestone.id, newProgress)
      )
        .to.emit(desciData, "MilestoneProgressUpdated")
        .withArgs(milestone.id, newProgress);
    });

    it("Should calculate overall phase progress", async function () {
      // Create all milestones in phase 1
      for (const milestone of phase1.milestones) {
        await desciData.connect(projectManager).createMilestone(
          milestone.id,
          milestone.name,
          milestone.targetProgress,
          milestone.kpis.map(kpi => ({
            metric: kpi.metric,
            target: kpi.target,
            current: 0
          })),
          phase1.id
        );
      }

      // Update progress for each milestone
      await desciData.connect(projectManager).updateMilestoneProgress("ms1.1", 90);
      await desciData.connect(projectManager).updateMilestoneProgress("ms1.2", 60);
      await desciData.connect(projectManager).updateMilestoneProgress("ms1.3", 30);

      // Calculate expected average progress
      const expectedProgress = Math.floor((90 + 60 + 30) / 3);
      
      const phaseProgress = await desciData.getPhaseProgress(phase1.id);
      expect(phaseProgress).to.equal(expectedProgress);
    });

    it("Should enforce access control on milestone updates", async function () {
      const milestone = phase1.milestones[0];
      
      // Create milestone as project manager
      await desciData.connect(projectManager).createMilestone(
        milestone.id,
        milestone.name,
        milestone.targetProgress,
        milestone.kpis.map(kpi => ({
          metric: kpi.metric,
          target: kpi.target,
          current: 0
        })),
        ""
      );

      // Try to update progress as researcher (should fail)
      await expect(
        desciData.connect(researcher).updateMilestoneProgress(milestone.id, 50)
      ).to.be.revertedWith("Not authorized");

      // Try to update KPI as researcher (should fail)
      await expect(
        desciData.connect(researcher).updateMilestoneKPI(milestone.id, 0, 1)
      ).to.be.revertedWith("Not authorized");
    });
  });
});
