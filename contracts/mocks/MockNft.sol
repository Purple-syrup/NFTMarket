// SPDX-License-Identifier:MIT

pragma solidity 0.8.12;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MockNft is ERC721{
uint256 private tokenCounter;

  constructor()ERC721("MockNft","MNT"){}
  
  function mint()external {
    _safeMint(msg.sender,tokenCounter);
    tokenCounter+=1;
  }

  function getTokenCounter()external view returns(uint256){
    return  tokenCounter;
  }
}