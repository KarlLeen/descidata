const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("DeSciData Financial Policy Frontend Integration Tests", function () {
  // 部署合约和设置测试环境的固定装置
  async function deployContractFixture() {
    // 获取签名者账户
    const [owner, researcher, sponsor1, sponsor2, sponsor3] = await ethers.getSigners();

    // 部署 DeSciData 合约
    const DeSciData = await ethers.getContractFactory("DeSciData");
    const desciData = await DeSciData.deploy();

    // 创建一个测试实验
    const experimentId = 1;
    const experimentTitle = "Quantum Algorithm Research";
    const experimentDescription = "Research on new quantum algorithms for drug discovery";
    const fundingGoal = ethers.utils.parseEther("10.0"); // 10 ETH
    const deadline = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60; // 30天后

    await desciData.connect(researcher).createExperiment(
      experimentId,
      experimentTitle,
      experimentDescription,
      fundingGoal,
      deadline
    );

    return { desciData, owner, researcher, sponsor1, sponsor2, sponsor3, experimentId, fundingGoal };
  }

  // 模拟前端调用的测试函数
  async function simulateFrontendFundingCall(contract, experimentId, amount, signer) {
    // 模拟前端的 fundExperiment 函数调用
    const tx = await contract.connect(signer).fundExperiment(experimentId, {
      value: amount,
    });
    await tx.wait();
    return tx;
  }

  describe("资助实验功能测试", function () {
    it("前端应该能够成功资助实验", async function () {
      const { desciData, sponsor1, experimentId } = await loadFixture(deployContractFixture);
      
      // 模拟前端资助调用
      const fundingAmount = ethers.utils.parseEther("2.0");
      await simulateFrontendFundingCall(desciData, experimentId, fundingAmount, sponsor1);
      
      // 验证实验的资金是否增加
      const experiment = await desciData.experiments(experimentId);
      expect(experiment.fundingRaised).to.equal(fundingAmount);
      
      // 验证赞助商的贡献是否记录
      const contribution = await desciData.contributions(experimentId, sponsor1.address);
      expect(contribution).to.equal(fundingAmount);
    });

    it("多个赞助商应该能够资助同一个实验", async function () {
      const { desciData, sponsor1, sponsor2, sponsor3, experimentId } = await loadFixture(deployContractFixture);
      
      // 模拟多个前端资助调用
      const amount1 = ethers.utils.parseEther("2.0");
      const amount2 = ethers.utils.parseEther("3.0");
      const amount3 = ethers.utils.parseEther("1.5");
      
      await simulateFrontendFundingCall(desciData, experimentId, amount1, sponsor1);
      await simulateFrontendFundingCall(desciData, experimentId, amount2, sponsor2);
      await simulateFrontendFundingCall(desciData, experimentId, amount3, sponsor3);
      
      // 验证实验的总资金
      const experiment = await desciData.experiments(experimentId);
      expect(experiment.fundingRaised).to.equal(amount1.add(amount2).add(amount3));
      
      // 验证各个赞助商的贡献
      expect(await desciData.contributions(experimentId, sponsor1.address)).to.equal(amount1);
      expect(await desciData.contributions(experimentId, sponsor2.address)).to.equal(amount2);
      expect(await desciData.contributions(experimentId, sponsor3.address)).to.equal(amount3);
    });
  });

  describe("退款机制测试", function () {
    it("当实验未达到资金目标时，前端应该能够请求退款", async function () {
      const { desciData, sponsor1, experimentId, fundingGoal } = await loadFixture(deployContractFixture);
      
      // 资助金额小于目标
      const fundingAmount = ethers.utils.parseEther("2.0"); // 小于10 ETH的目标
      await simulateFrontendFundingCall(desciData, experimentId, fundingAmount, sponsor1);
      
      // 确认资金已记录
      expect(await desciData.contributions(experimentId, sponsor1.address)).to.equal(fundingAmount);
      
      // 快进时间超过截止日期
      await ethers.provider.send("evm_increaseTime", [31 * 24 * 60 * 60]); // 31天
      await ethers.provider.send("evm_mine");
      
      // 记录退款前的余额
      const balanceBefore = await ethers.provider.getBalance(sponsor1.address);
      
      // 模拟前端退款调用
      const tx = await desciData.connect(sponsor1).refundContributions(experimentId);
      const receipt = await tx.wait();
      
      // 计算gas成本
      const gasUsed = receipt.gasUsed;
      const gasPrice = receipt.effectiveGasPrice;
      const gasCost = gasUsed.mul(gasPrice);
      
      // 验证退款后的余额增加（减去gas成本）
      const balanceAfter = await ethers.provider.getBalance(sponsor1.address);
      expect(balanceAfter).to.equal(balanceBefore.add(fundingAmount).sub(gasCost));
      
      // 验证贡献记录已重置
      expect(await desciData.contributions(experimentId, sponsor1.address)).to.equal(0);
    });

    it("当实验达到资金目标时，前端不应该能够请求退款", async function () {
      const { desciData, sponsor1, sponsor2, experimentId, fundingGoal } = await loadFixture(deployContractFixture);
      
      // 完全资助实验
      await simulateFrontendFundingCall(desciData, experimentId, fundingGoal, sponsor1);
      
      // 快进时间超过截止日期
      await ethers.provider.send("evm_increaseTime", [31 * 24 * 60 * 60]);
      await ethers.provider.send("evm_mine");
      
      // 尝试退款应该失败
      await expect(
        desciData.connect(sponsor1).refundContributions(experimentId)
      ).to.be.revertedWith("Funding goal met, refund not available");
    });
  });

  describe("收益分配测试", function () {
    it("前端应该能够显示正确的收益分配百分比", async function () {
      const { desciData, owner } = await loadFixture(deployContractFixture);
      
      // 获取合约中的收益分配常量
      const researcherPercentage = await desciData.RESEARCHER_PERCENTAGE();
      const sponsorPercentage = await desciData.SPONSOR_PERCENTAGE();
      const platformPercentage = await desciData.PLATFORM_PERCENTAGE();
      
      // 验证百分比是否与前端显示一致
      expect(researcherPercentage).to.equal(70);
      expect(sponsorPercentage).to.equal(20);
      expect(platformPercentage).to.equal(10);
      
      // 验证百分比总和为100
      expect(researcherPercentage.add(sponsorPercentage).add(platformPercentage)).to.equal(100);
    });

    it("管理员应该能够分配季度收益", async function () {
      const { desciData, owner, researcher, sponsor1 } = await loadFixture(deployContractFixture);
      
      // 记录初始余额
      const initialResearcherBalance = await ethers.provider.getBalance(researcher.address);
      const initialSponsorBalance = await ethers.provider.getBalance(sponsor1.address);
      const initialPlatformBalance = await ethers.provider.getBalance(owner.address);
      
      // 模拟收益（直接发送到合约）
      const yield = ethers.utils.parseEther("1.0"); // 1 ETH的收益
      await owner.sendTransaction({
        to: desciData.address,
        value: yield
      });
      
      // 记录收益
      await desciData.connect(owner).recordYield(yield);
      
      // 分配收益
      await desciData.connect(owner).distributeQuarterlyProfits();
      
      // 验证余额变化
      const researcherPercentage = await desciData.RESEARCHER_PERCENTAGE();
      const sponsorPercentage = await desciData.SPONSOR_PERCENTAGE();
      const platformPercentage = await desciData.PLATFORM_PERCENTAGE();
      
      const expectedResearcherAmount = yield.mul(researcherPercentage).div(100);
      const expectedSponsorAmount = yield.mul(sponsorPercentage).div(100);
      const expectedPlatformAmount = yield.mul(platformPercentage).div(100);
      
      // 注意：这里我们简化了测试，实际上需要考虑gas成本和其他因素
      // 在真实环境中，我们需要监听事件来验证分配是否正确
      const event = (await desciData.queryFilter(desciData.filters.ProfitDistributed()))[0];
      expect(event.args.researcherAmount).to.equal(expectedResearcherAmount);
      expect(event.args.sponsorAmount).to.equal(expectedSponsorAmount);
      expect(event.args.platformAmount).to.equal(expectedPlatformAmount);
    });
  });

  describe("平台费用测试", function () {
    it("成功资助的实验应该收取正确的平台费用", async function () {
      const { desciData, researcher, sponsor1, experimentId, fundingGoal } = await loadFixture(deployContractFixture);
      
      // 完全资助实验
      await simulateFrontendFundingCall(desciData, experimentId, fundingGoal, sponsor1);
      
      // 快进时间超过截止日期
      await ethers.provider.send("evm_increaseTime", [31 * 24 * 60 * 60]);
      await ethers.provider.send("evm_mine");
      
      // 处理成功资助
      await desciData.connect(researcher).processFundingSuccess(experimentId);
      
      // 获取平台费率
      const platformFeePercentage = await desciData.PLATFORM_FEE_PERCENTAGE();
      
      // 计算预期的平台费用
      const expectedPlatformFee = fundingGoal.mul(platformFeePercentage).div(100);
      
      // 验证平台费用是否正确记录
      const platformFees = await desciData.platformFees();
      expect(platformFees).to.equal(expectedPlatformFee);
      
      // 验证研究者收到的资金是否正确（总资金减去平台费用）
      const researcherFunds = await desciData.researcherFunds(researcher.address);
      expect(researcherFunds).to.equal(fundingGoal.sub(expectedPlatformFee));
    });
  });

  describe("前端显示测试", function () {
    it("前端应该能够正确显示实验的资金状态", async function () {
      const { desciData, sponsor1, experimentId, fundingGoal } = await loadFixture(deployContractFixture);
      
      // 部分资助实验
      const fundingAmount = ethers.utils.parseEther("4.0"); // 40% 的目标
      await simulateFrontendFundingCall(desciData, experimentId, fundingAmount, sponsor1);
      
      // 获取实验数据（模拟前端获取数据）
      const experiment = await desciData.experiments(experimentId);
      
      // 验证前端显示数据
      expect(experiment.fundingRaised).to.equal(fundingAmount);
      expect(experiment.fundingGoal).to.equal(fundingGoal);
      
      // 计算百分比（模拟前端计算）
      const percentFunded = fundingAmount.mul(100).div(fundingGoal);
      expect(percentFunded).to.equal(40); // 应该是40%
    });

    it("前端应该能够显示是否可以请求退款", async function () {
      const { desciData, sponsor1, experimentId, fundingGoal } = await loadFixture(deployContractFixture);
      
      // 部分资助实验
      const fundingAmount = ethers.utils.parseEther("4.0");
      await simulateFrontendFundingCall(desciData, experimentId, fundingAmount, sponsor1);
      
      // 获取实验数据
      const experiment = await desciData.experiments(experimentId);
      const deadline = experiment.deadline;
      const currentTime = Math.floor(Date.now() / 1000);
      
      // 检查是否可以退款（模拟前端逻辑）
      const canRefund = currentTime > deadline.toNumber() && 
                        experiment.fundingRaised.lt(experiment.fundingGoal) && 
                        await desciData.contributions(experimentId, sponsor1.address) > 0;
      
      // 快进时间超过截止日期
      await ethers.provider.send("evm_increaseTime", [31 * 24 * 60 * 60]);
      await ethers.provider.send("evm_mine");
      
      // 现在应该可以退款
      const contribution = await desciData.contributions(experimentId, sponsor1.address);
      expect(contribution).to.be.gt(0);
      
      // 验证可以成功退款
      const tx = await desciData.connect(sponsor1).refundContributions(experimentId);
      await tx.wait();
      
      // 验证贡献已重置
      expect(await desciData.contributions(experimentId, sponsor1.address)).to.equal(0);
    });
  });
});
