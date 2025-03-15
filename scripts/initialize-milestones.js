const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Initializing milestones with account:", deployer.address);

  // Get the deployed contract
  const DeSciData = await ethers.getContractFactory("DeSciData");
  const desciData = await DeSciData.attach("YOUR_CONTRACT_ADDRESS"); // Replace with actual address

  // Project phases
  const phases = [
    {
      id: "phase1",
      name: "Infrastructure & Core Features",
      milestones: [
        {
          id: "ms1.1",
          name: "User System & Auth",
          targetProgress: 95,
          kpis: [
            { metric: "Web3 Wallet Integration Count", target: 3 },
            { metric: "Auth Success Rate", target: 95 }
          ]
        },
        {
          id: "ms1.2",
          name: "Data Management",
          targetProgress: 99,
          kpis: [
            { metric: "Upload Success Rate", target: 99 },
            { metric: "Metadata Fields Coverage", target: 10 }
          ]
        },
        {
          id: "ms1.3",
          name: "Smart Contracts",
          targetProgress: 90,
          kpis: [
            { metric: "Test Coverage", target: 90 },
            { metric: "Gas Optimization", target: 30 }
          ]
        }
      ]
    },
    {
      id: "phase2",
      name: "Feature Extension",
      milestones: [
        {
          id: "ms2.1",
          name: "NFT Features",
          targetProgress: 100,
          kpis: [
            { metric: "NFT Minting Success Rate", target: 100 },
            { metric: "Pricing Models Implemented", target: 3 }
          ]
        },
        {
          id: "ms2.2",
          name: "Citation System",
          targetProgress: 100,
          kpis: [
            { metric: "Citation Tracking Accuracy", target: 100 },
            { metric: "Citation Verification Speed (ms)", target: 1000 }
          ]
        },
        {
          id: "ms2.3",
          name: "UI/UX",
          targetProgress: 90,
          kpis: [
            { metric: "Load Time (ms)", target: 2000 },
            { metric: "UX Score", target: 90 }
          ]
        }
      ]
    },
    {
      id: "phase3",
      name: "Ecosystem & Scalability",
      milestones: [
        {
          id: "ms3.1",
          name: "Crowdfunding",
          targetProgress: 100,
          kpis: [
            { metric: "Funding Success Rate", target: 95 },
            { metric: "Project Evaluation Score", target: 90 }
          ]
        },
        {
          id: "ms3.2",
          name: "Data Validation",
          targetProgress: 95,
          kpis: [
            { metric: "Validation Accuracy", target: 95 },
            { metric: "Peer Review Completion Rate", target: 90 }
          ]
        },
        {
          id: "ms3.3",
          name: "API & Integration",
          targetProgress: 100,
          kpis: [
            { metric: "API Response Time (ms)", target: 100 },
            { metric: "SDK Integration Success Rate", target: 95 }
          ]
        }
      ]
    }
  ];

  console.log("Starting milestone initialization...");

  try {
    // Initialize each phase and its milestones
    for (const phase of phases) {
      console.log(`\nInitializing phase: ${phase.name}`);
      
      for (const milestone of phase.milestones) {
        console.log(`Creating milestone: ${milestone.name}`);
        
        const tx = await desciData.createMilestone(
          milestone.id,
          milestone.name,
          milestone.targetProgress,
          milestone.kpis,
          phase.id
        );
        
        await tx.wait();
        console.log(`✓ Created milestone ${milestone.id} in phase ${phase.id}`);
      }
    }

    console.log("\nMilestone initialization complete!");
  } catch (error) {
    console.error("Error initializing milestones:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
