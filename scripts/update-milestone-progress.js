// Script to update milestone progress for Phase 3.1: Crowdfunding
const { ethers } = require("hardhat");

async function main() {
  console.log("Initializing and updating milestone progress for Phase 3.1: Crowdfunding...");

  // For testing in local environment, deploy a new contract
  const DeSciData = await ethers.getContractFactory("DeSciData");
  const desciData = await DeSciData.deploy();
  await desciData.deployTransaction.wait();
  console.log(`DeSciData deployed to: ${desciData.address}`);

  // Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log(`Using account: ${deployer.address}`);
  
  // Initialize the milestone structure based on our 3-phase, 20-week project
  console.log("\nInitializing project milestones...");
  
  // Phase 1: Infrastructure & Core Features (6 weeks)
  console.log("Creating Phase 1 milestones...");
  
  // MS 1.1: User System & Auth
  await desciData.createMilestone(
    "User System & Auth",
    "Implement Web3 wallets and user profiles",
    1, // Phase 1
    [
      { name: "Wallet Integration", targetValue: 3, currentValue: 0 },
      { name: "Auth Success Rate", targetValue: 95, currentValue: 0 }
    ]
  );
  
  // MS 1.2: Data Management
  await desciData.createMilestone(
    "Data Management",
    "IPFS integration and metadata standards",
    1, // Phase 1
    [
      { name: "Upload Success Rate", targetValue: 99, currentValue: 0 },
      { name: "Metadata Fields", targetValue: 10, currentValue: 0 }
    ]
  );
  
  // MS 1.3: Smart Contracts
  await desciData.createMilestone(
    "Smart Contracts",
    "Core contract development and testing",
    1, // Phase 1
    [
      { name: "Test Coverage", targetValue: 90, currentValue: 0 },
      { name: "Gas Optimization", targetValue: 30, currentValue: 0 }
    ]
  );
  
  // Phase 2: Feature Extension (8 weeks)
  console.log("Creating Phase 2 milestones...");
  
  // MS 2.1: NFT Features
  await desciData.createMilestone(
    "NFT Features",
    "NFT minting and marketplace integration",
    2, // Phase 2
    [
      { name: "Minting Success Rate", targetValue: 100, currentValue: 0 },
      { name: "Pricing Models", targetValue: 3, currentValue: 0 }
    ]
  );
  
  // MS 2.2: Citation System
  await desciData.createMilestone(
    "Citation System",
    "On-chain citation tracking and verification",
    2, // Phase 2
    [
      { name: "Tracking Accuracy", targetValue: 100, currentValue: 0 },
      { name: "Verification Time (s)", targetValue: 1, currentValue: 0 }
    ]
  );
  
  // MS 2.3: UI/UX
  await desciData.createMilestone(
    "UI/UX",
    "Responsive design and user experience",
    2, // Phase 2
    [
      { name: "Load Time (s)", targetValue: 2, currentValue: 0 },
      { name: "UX Score", targetValue: 90, currentValue: 0 }
    ]
  );
  
  // Phase 3: Ecosystem & Scalability (6 weeks)
  console.log("Creating Phase 3 milestones...");
  
  // MS 3.1: Crowdfunding
  await desciData.createMilestone(
    "Crowdfunding",
    "Smart contract funding and project evaluation",
    3, // Phase 3
    [
      { name: "Funding Success Rate", targetValue: 95, currentValue: 0 },
      { name: "Evaluation Score", targetValue: 90, currentValue: 0 }
    ]
  );
  
  // MS 3.2: Data Validation
  await desciData.createMilestone(
    "Data Validation",
    "Automated validation and peer review",
    3, // Phase 3
    [
      { name: "Validation Accuracy", targetValue: 95, currentValue: 0 },
      { name: "Peer Review Completion", targetValue: 90, currentValue: 0 }
    ]
  );
  
  // MS 3.3: API & Integration
  await desciData.createMilestone(
    "API & Integration",
    "REST API and SDK support",
    3, // Phase 3
    [
      { name: "Response Time (ms)", targetValue: 100, currentValue: 0 },
      { name: "SDK Success Rate", targetValue: 95, currentValue: 0 }
    ]
  );
  
  console.log("All milestones created successfully!");
  
  // Phase 3, Milestone 1 (Crowdfunding) - ID 7 based on our initialization
  const milestoneId = 7;
  
  try {
    // Update overall milestone progress to 75% (3 out of 4 tasks completed)
    const progressTx = await desciData.updateMilestoneProgress(milestoneId, 75);
    await progressTx.wait();
    console.log(`Updated milestone ${milestoneId} progress to 75%`);

    // Update KPIs for the milestone
    // KPI 1: Funding success rate (target: 95%)
    // Current value: 90% (based on our tests showing successful funding mechanism)
    const kpi1Tx = await desciData.updateMilestoneKPI(milestoneId, 0, 90);
    await kpi1Tx.wait();
    console.log("Updated funding success rate KPI to 90%");

    // KPI 2: Evaluation score (target: 90)
    // Current value: 85 (based on our implementation of financial policy)
    const kpi2Tx = await desciData.updateMilestoneKPI(milestoneId, 1, 85);
    await kpi2Tx.wait();
    console.log("Updated evaluation score KPI to 85");

    // Get the updated milestone data to verify
    const milestone = await desciData.getMilestone(milestoneId);
    console.log("\nUpdated Milestone Data:");
    console.log(`Name: ${milestone.name}`);
    console.log(`Progress: ${milestone.currentProgress}%`);
    console.log(`KPIs: ${milestone.kpis.length}`);
    
    for (let i = 0; i < milestone.kpis.length; i++) {
      console.log(`  KPI ${i+1}: Target=${milestone.kpis[i].targetValue}, Current=${milestone.kpis[i].currentValue}`);
    }

    // Calculate phase progress
    const phaseProgress = await desciData.getPhaseProgress(3);
    console.log(`\nPhase 3 Overall Progress: ${phaseProgress}%`);

    console.log("\nMilestone progress update completed successfully!");
  } catch (error) {
    console.error("Error updating milestone progress:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
