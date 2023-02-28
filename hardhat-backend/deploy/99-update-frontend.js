const { network, ethers } = require("hardhat")
const fs = require("fs")

const frontendContractFile = "../../nextjs-frontend/constants/contractAddresses.json"

module.exports = async () => {
    if (process.env.UPDATE_FRONTEND) {
        console.log("updating frontend ......")
        await updateContractAddresses()
    }
}

async function updateContractAddresses() {
    const nftMarketplace = await ethers.getContract("NftMarketplace")
    const mockNft = await ethers.getContract("MockNft")
    const chainId = network.config.chainId.toString()
    const contractAddresses = JSON.parse(fs.readFileSync(frontendContractFile, "utf8"))
    if (chainId in contractAddresses) {
        if (!contractAddresses[chainId]["NftMarketplace"].includes(nftMarketplace.address)) {
            contractAddresses[chainId]["NftMarketplace"].push(nftMarketplace.address)
        }
    } else {
        contractAddresses[chainId] = { NftMarketplace: [nftMarketplace.address] }
    }
    fs.writeFileSync(frontendContractFile, JSON.stringify(contractAddresses))
}
module.exports.tags = ["all", "frontend"]
