const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DeSciData Financial Policy", function () {
  let desciData;
  let owner;
  let researcher;
  let contributor1;
  let contributor2;

  beforeEach(async function () {
    [owner, researcher, contributor1, contributor2] = await ethers.getSigners();
    
    const DeSciData = await ethers.getContractFactory("DeSciData");
    desciData = await DeSciData.deploy();
  });

  describe("Financial Policy Constants", function () {
    it("Should have correct financial policy constants", async function () {
      const policy = await desciData.getFinancialPolicy();
      expect(policy.platformFeePercent).to.equal(5);
      expect(policy.researcherProfitShare).to.equal(70);
      expect(policy.sponsorProfitShare).to.equal(20);
      expect(policy.platformReserveShare).to.equal(10);
    });
  });

  describe("Experiment Funding", function () {
    beforeEach(async function () {
      // Create an experiment
      await desciData.connect(researcher).createExperiment(
        "Test Experiment",
        "Testing financial policies",
        ethers.parseEther("1.0"), // 1 ETH funding goal
        7 // 7 days duration
      );
    });

    it("Should allow contributions and track them correctly", async function () {
      await desciData.connect(contributor1).fundExperiment(1, {
        value: ethers.parseEther("0.5")
      });
      
      const experiment = await desciData.getExperiment(1);
      expect(experiment.fundingRaised).to.equal(ethers.parseEther("0.5"));
    });

    it("Should mark funding as complete when goal is reached", async function () {
      await desciData.connect(contributor1).fundExperiment(1, {
        value: ethers.parseEther("1.0")
      });
      
      const experiment = await desciData.getExperiment(1);
      expect(experiment.fundingComplete).to.be.true;
    });

    it("Should process successful funding with correct fee deduction", async function () {
      // Fund the experiment to completion
      await desciData.connect(contributor1).fundExperiment(1, {
        value: ethers.parseEther("1.0")
      });
      
      // Process the successful funding
      await desciData.connect(owner).processFundingSuccess(1);
      
      // Check financial stats
      const stats = await desciData.getFinancialStats();
      
      // Platform fee should be 5% of 1 ETH = 0.05 ETH
      expect(stats.reserve).to.equal(ethers.parseEther("0.05"));
      
      // Invested funds should be 95% of 1 ETH = 0.95 ETH
      expect(stats.investedFunds).to.equal(ethers.parseEther("0.95"));
    });
  });

  describe("Refund Mechanism", function () {
    beforeEach(async function () {
      // Create an experiment with a short deadline
      await desciData.connect(researcher).createExperiment(
        "Test Experiment",
        "Testing refund mechanism",
        ethers.parseEther("1.0"), // 1 ETH funding goal
        1 // 1 day duration
      );
      
      // Contribute but don't meet the goal
      await desciData.connect(contributor1).fundExperiment(1, {
        value: ethers.parseEther("0.5")
      });
      
      // Advance time past the deadline
      await ethers.provider.send("evm_increaseTime", [2 * 24 * 60 * 60]); // 2 days
      await ethers.provider.send("evm_mine");
    });

    it("Should allow refunds after deadline if goal not met", async function () {
      // Request refund
      await desciData.connect(contributor1).refundContributions(1);
      
      // Test passes if no exceptions are thrown
      expect(true).to.be.true;
    });
  });

  describe("Yield Management", function () {
    it("Should record yield correctly", async function () {
      // Record some yield
      await desciData.connect(owner).recordYield(ethers.parseEther("0.1"));
      
      // Check financial stats
      const stats = await desciData.getFinancialStats();
      expect(stats.currentYield).to.equal(ethers.parseEther("0.1"));
    });

    it("Should distribute profits according to policy", async function () {
      // Record some yield
      await desciData.connect(owner).recordYield(ethers.parseEther("1.0"));
      
      // Distribute profits
      await desciData.connect(owner).distributeQuarterlyProfits();
      
      // Check financial stats
      const stats = await desciData.getFinancialStats();
      
      // Yield should be reset to 0
      expect(stats.currentYield).to.equal(0);
      
      // Platform reserve should have 10% of 1 ETH = 0.1 ETH
      expect(stats.reserve).to.equal(ethers.parseEther("0.1"));
    });
  });

  describe("Financial Transactions", function () {
    it("Should record financial transactions correctly", async function () {
      // Create and fund an experiment
      await desciData.connect(researcher).createExperiment(
        "Test Experiment",
        "Testing transaction recording",
        ethers.parseEther("1.0"),
        7
      );
      
      await desciData.connect(contributor1).fundExperiment(1, {
        value: ethers.parseEther("1.0")
      });
      
      // Process funding
      await desciData.connect(owner).processFundingSuccess(1);
      
      // Record yield
      await desciData.connect(owner).recordYield(ethers.parseEther("0.1"));
      
      // Get transaction history
      const transactions = await desciData.getFinancialTransactions(0, 10);
      
      // Should have at least 3 transactions (fee, investment, yield)
      expect(transactions.length).to.be.gte(3);
      
      // Check transaction types
      expect(transactions[0].transactionType).to.equal("fee");
      expect(transactions[1].transactionType).to.equal("investment");
      expect(transactions[2].transactionType).to.equal("yield");
    });
  });
});
