import { Wallet } from "zksync-web3";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";

const USDC_ADDRESS = "0xd35cceead182dcee0f148ebac9447da2c4d449c4";
const USDC_DECIMALS = 6;

// An example of a deploy script that will deploy and call a simple contract.
export default async function (hre: HardhatRuntimeEnvironment) {
  console.log(`Running deploy script for the Greeter contract`);

  // Initialize the wallet.
  const wallet = new Wallet("0x3bd087dbbda0a3efca29c42f22f581c7404894439466a0680bbe70f2eaebb4d6");

  // Create deployer object and load the artifact of the contract we want to deploy.
  const deployer = new Deployer(hre, wallet);
  const artifact = await deployer.loadArtifact("Greeter");

  const greeting = "Hi there!";
  const deploymentFee = await deployer.estimateDeployFee(artifact, [greeting], USDC_ADDRESS);

  // Deposit funds to L2
  const depositHandle = await deployer.zkWallet.deposit({
    to: deployer.zkWallet.address,
    token: USDC_ADDRESS,
    amount: deploymentFee.mul(2),
    approveERC20: true,
  });
  // Wait until the deposit is processed on zkSync
  await depositHandle.wait();

  // Deploy this contract. The returned object will be of a `Contract` type, similarly to ones in `ethers`.
  // `greeting` is an argument for contract constructor.
  const parsedFee = ethers.utils.formatUnits(deploymentFee.toString(), USDC_DECIMALS);
  console.log(`The deployment will cost ${parsedFee} USDC`);

  const greeterContract = await deployer.deploy(artifact, [greeting], USDC_ADDRESS);

  // Show the contract info.
  const contractAddress = greeterContract.address;
  console.log(`${artifact.contractName} was deployed to ${contractAddress}`);
}