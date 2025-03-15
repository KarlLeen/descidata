const { expect } = require("chai");
const { ethers } = require("hardhat");
const { parseEther } = ethers;

// Mock frontend component for testing
const mockFrontendConfig = {
  platformFeePercent: 5,
  researcherProfitShare: 70,
  sponsorProfitShare: 20,
  platformReserveShare: 10,
  annualYieldRange: {
    min: 2,
    max: 4
  }
};

describe("DeSciData Financial Policy Integration", function () {
  let desciData;
  let owner;
  let researcher;
  let contributor;

  beforeEach(async function () {
    [owner, researcher, contributor] = await ethers.getSigners();
    
    const DeSciData = await ethers.getContractFactory("DeSciData");
    desciData = await DeSciData.deploy();
  });

  describe("Frontend-Contract Policy Alignment", function () {
    it("Should have matching financial policy constants between frontend and contract", async function () {
      // Get financial policy from contract
      const contractPolicy = await desciData.getFinancialPolicy();
      
      // Compare with frontend configuration
      expect(contractPolicy.platformFeePercent).to.equal(mockFrontendConfig.platformFeePercent);
      expect(contractPolicy.researcherProfitShare).to.equal(mockFrontendConfig.researcherProfitShare);
      expect(contractPolicy.sponsorProfitShare).to.equal(mockFrontendConfig.sponsorProfitShare);
      expect(contractPolicy.platformReserveShare).to.equal(mockFrontendConfig.platformReserveShare);
    });
  });

  describe("End-to-End Funding Flow", function () {
    it("Should correctly process funding with fee deduction as displayed in frontend", async function () {
      // 1. Create experiment
      await desciData.connect(researcher).createExperiment(
        "Integration Test Experiment",
        "Testing frontend-contract integration",
        parseEther("100"), // 100 ETH (representing $100k in our example)
        7 // 7 days duration
      );
      
      // 2. Fund experiment to completion
      await desciData.connect(contributor).fundExperiment(1, {
        value: parseEther("100")
      });
      
      // 3. Process successful funding
      await desciData.connect(owner).processFundingSuccess(1);
      
      // 4. Check financial stats
      const stats = await desciData.getFinancialStats();
      
      // 5. Verify platform fee is 5% as shown in frontend
      // From 100 ETH, 5 ETH (5%) should go to platform fee
      expect(stats.reserve).to.equal(parseEther("5"));
      
      // 6. Verify remaining 95% is allocated to research as shown in frontend
      expect(stats.investedFunds).to.equal(parseEther("95"));
    });
  });

  describe("Yield Distribution Verification", function () {
    it("Should distribute profits according to percentages shown in frontend", async function () {
      // 1. Setup: Create and fund an experiment
      await desciData.connect(researcher).createExperiment(
        "Yield Test Experiment",
        "Testing yield distribution",
        parseEther("100"),
        7
      );
      
      await desciData.connect(contributor).fundExperiment(1, {
        value: parseEther("100")
      });
      
      await desciData.connect(owner).processFundingSuccess(1);
      
      // 2. Record a yield of 10 ETH (representing a 10% return for simplicity)
      await desciData.connect(owner).recordYield(parseEther("10"));
      
      // 3. Get initial financial stats
      const initialStats = await desciData.getFinancialStats();
      expect(initialStats.currentYield).to.equal(parseEther("10"));
      
      // 4. Distribute profits and check for events
      await expect(desciData.connect(owner).distributeQuarterlyProfits())
        .to.emit(desciData, 'ProfitDistributed')
        .withArgs(
          parseEther("7"),  // 70% of 10 ETH for researchers
          parseEther("2"),  // 20% of 10 ETH for sponsors
          parseEther("1")   // 10% of 10 ETH for platform
        );
      
      // 5. Get updated financial stats
      const updatedStats = await desciData.getFinancialStats();
      
      // 6. Verify yield is reset
      expect(updatedStats.currentYield).to.equal(0);
      
      // 7. Verify distribution matches frontend percentages:
      // - 70% to researchers: 7 ETH should be distributed
      // - 20% to sponsors: 2 ETH should be distributed
      // - 10% to platform: 1 ETH should be added to reserve (which already had 5 ETH)
      expect(updatedStats.reserve).to.equal(parseEther("6")); // 5 ETH initial + 1 ETH from yield
    });
  });
});
