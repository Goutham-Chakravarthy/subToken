import hre from "hardhat";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { promises as fs } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
  console.log("Deploying Tokenized Subscription contracts...");
  
  // Get deployer/signer
  const [deployer] = await hre.ethers.getSigners();
  console.log(`Deploying contracts with account: ${deployer.address}`);
  
  // Deploy SubscriptionToken
  console.log("Deploying SubscriptionToken...");
  const SubscriptionToken = await hre.ethers.getContractFactory("SubscriptionToken");
  const token = await SubscriptionToken.deploy(
    "Tokenized Subscription", // name
    "TSUB",                   // symbol
    "https://api.tokensub.io/tokens/", // base URI
    deployer.address          // initial owner
  );
  await token.deployed();
  const tokenAddress = await token.address;
  console.log(`SubscriptionToken deployed to: ${tokenAddress}`);
  
  // Deploy LendingEscrow
  console.log("Deploying LendingEscrow...");
  const LendingEscrow = await hre.ethers.getContractFactory("LendingEscrow");
  const lendingEscrow = await LendingEscrow.deploy(
    tokenAddress,           // subscription token address
    deployer.address,       // platform wallet
    500                     // platform fee (5% in basis points)
  );
  await lendingEscrow.deployed();
  const lendingEscrowAddress = await lendingEscrow.address;
  console.log(`LendingEscrow deployed to: ${lendingEscrowAddress}`);
  
  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    deployer: deployer.address,
    subscriptionToken: tokenAddress,
    lendingEscrow: lendingEscrowAddress,
    timestamp: new Date().toISOString()
  };
  
  try {
    // Create deployments directory if it doesn't exist
    const deploymentsDir = join(process.cwd(), 'deployments');
    await fs.mkdir(deploymentsDir, { recursive: true });
    
    // Save deployment info to file
    const deploymentFile = join(deploymentsDir, `${hre.network.name}.json`);
    await fs.writeFile(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
    
    console.log("Deployment info saved to:", deploymentFile);
  } catch (error) {
    console.warn("Could not save deployment info:", error.message);
  }
  
  // Verify contracts on block explorer (if not localhost)
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("Waiting for block confirmations before verification...");
    await token.deployTransaction.wait(6);
    await lendingEscrow.deployTransaction.wait(6);
    
    console.log("Verifying SubscriptionToken...");
    try {
      await hre.run("verify:verify", {
        address: tokenAddress,
        constructorArguments: [
          "Tokenized Subscription",
          "TSUB",
          "https://api.tokensub.io/tokens/",
          deployer.address
        ]
      });
    } catch (error) {
      console.log("Verification failed for SubscriptionToken:", error.message);
    }
    
    console.log("Verifying LendingEscrow...");
    try {
      await hre.run("verify:verify", {
        address: lendingEscrowAddress,
        constructorArguments: [
          tokenAddress,
          deployer.address,
          500
        ]
      });
    } catch (error) {
      console.log("Verification failed for LendingEscrow:", error.message);
    }
  }
  
  return deploymentInfo;
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
try {
  await main();
  process.exit(0);
} catch (error) {
  console.error(error);
  process.exit(1);
}
