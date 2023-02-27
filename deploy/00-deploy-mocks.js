const { network, ethers } = require("hardhat")
const { developmentChains, networkConfig } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAcoounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    log("--------------------")
  const mockNft=await deploy("MockNft",{
    from:deployer,
    log:true,
    waitConfirmations:network.config.blockConfirmations || 1
  })

  log("-------------------")

  
}
module.exports.tags=["all","mocknft","mocks"]