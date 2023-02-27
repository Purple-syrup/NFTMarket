const { expect, assert } = require("chai")
const { network, ethers, deployments } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config");

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("NFT Marktplace Unit Tests", () => {
    
          let nftMarketPlace, mockNft,price,deployer,player
         
          beforeEach(async () => {
            const accounts=await ethers.getSigners()
         deployer = accounts[0];player=accounts[1];
            
              await deployments.fixture(["all"])
              nftMarketplace = await ethers.getContract("NftMarketplace",deployer)
              mockNft= await ethers.getContract("MockNft",deployer)
              
              price =await  ethers.utils.parseEther("0.1")
            await mockNft.mint()
          })
      
          describe("listItem",()=>{
            it("should revert if marketplace not approved",async()=>{
              await expect(nftMarketplace.listItem(mockNft.address,0,price)).to.be.revertedWith("NftMarketplace__NotApprovedForMarketPlace");
            })
            it("to emit ItemListed",async()=>{
              await mockNft.approve(nftMarketplace.address,0)
              await expect(nftMarketplace.listItem(mockNft.address,0,price)).to.emit(nftMarketplace,"ItemListed")
            })
            
          })
      
      describe("buyItem",()=>{
        beforeEach(async()=>{
          await mockNft.mint()
          await mockNft.approve(nftMarketplace.address,0)
          await nftMarketplace.listItem(mockNft.address,0,price)
          
        })

        it("should fail if not a listed nft",async()=>{
          await expect(nftMarketplace.buyItem(mockNft.address,2,{value:price})).to.be.revertedWith(`NftMarketplace__NotListed`).withArgs(mockNft.address, 2)
        })

        it("should fail if value is less then price",async()=>{
          await expect(nftMarketplace.buyItem(mockNft.address,0,{value:"100000000"})).to.be.revertedWith("NftMarketplace__PriceNotMet")
        })

  it("should emit Item bought if successfull ",async()=>{
    await expect(nftMarketplace.connect(player).buyItem(mockNft.address,0,{value:price})).to.emit(nftMarketplace,"ItemBought")
  })
      })
      describe("cancelListing",()=>{
         beforeEach(async()=>{
          await mockNft.mint()
          await mockNft.approve(nftMarketplace.address,0)
          await nftMarketplace.listItem(mockNft.address,0,price)
          
        })
        it("should revert if not owner",async()=>{
          await expect(nftMarketplace.connect(player).cancelListing(mockNft.address,0)).to.be.revertedWith("NftMarketplace__NotOwner")
        })

       it("should delete listing when cancelled by owner",async()=>{
         await expect(nftMarketplace.cancelListing(mockNft.address,0)).to.emit(nftMarketplace,"ItemCancelled")
         

         const listing=await nftMarketplace.getListing(mockNft.address,0)
         
         assert.equal(listing.price.toString(),0)
         
       })
      })
      
})