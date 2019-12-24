pragma solidity ^0.5.0;

import "@openzeppelin/contracts/token/ERC721/ERC721Full.sol";
import "@openzeppelin/contracts/ownership/Ownable.sol";
import "./Metadata.sol";

contract QualificationCoin is ERC721Full, Ownable {

    address public metadata;

    constructor(string memory name, string memory symbol, address _metadata) public
        ERC721Full(name, symbol) {
            metadata = _metadata;
        }

    function mint(address recipient) public onlyOwner {
        _mint(recipient, totalSupply() + 1);
    }

    function updateMetadata(address _metadata) public onlyOwner {
        metadata = _metadata;
    }

    function tokenURI(uint _tokenId) external view returns (string memory _infoUrl) {
        return Metadata(metadata).tokenURI(_tokenId);
    }
}