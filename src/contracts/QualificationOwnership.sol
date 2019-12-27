pragma solidity ^0.5.0;

import "@openzeppelin/contracts/token/ERC721/ERC721Full.sol";
import "./Metadata.sol";
import "./QualificationHelper.sol";

contract QualificationOwnership is QualificationHelper, ERC721Full {

    using SafeMath for uint256;

    address public metadata;
    mapping (uint => address) qualificationApprovals;

    constructor(string memory _qualName, string memory _qualCode, address _metadata) public
        ERC721Full(_qualName, _qualCode) {
            metadata = _metadata;
        }

    function mint(address recipient, uint qualId) public onlyOwner {
        _mint(recipient, qualId);
    }

    function updateMetadata(address _metadata) public onlyOwner {
        metadata = _metadata;
    }

    function tokenURI(uint _tokenId) external view returns (string memory _infoUrl) {
        return Metadata(metadata).tokenURI(_tokenId);
    }

    function balanceOf(address _owner) public view returns (uint256) {
        return trgEstablishmentQualificationCount[_owner];
    }

    //function ownerOf(uint256 _tokenId) public view returns (address) {
    //    return qualificationToTrgEstablishment[_tokenId];
    //}

    function _transfer(address _from, address _to, uint256 _tokenId) private {
        trgEstablishmentQualificationCount[_to] = trgEstablishmentQualificationCount[_to].add(1);
        trgEstablishmentQualificationCount[msg.sender] = trgEstablishmentQualificationCount[msg.sender].sub(1);
        qualificationToTrgEstablishment[_tokenId] = _to;
        emit Transfer(_from, _to, _tokenId);
    }

    function transferFrom(address _from, address _to, uint256 _tokenId) public {
        require (qualificationToTrgEstablishment[_tokenId] == msg.sender || qualificationApprovals[_tokenId] == msg.sender, "not authorized");
        _transfer(_from, _to, _tokenId);
        }

    function approve(address _approved, uint256 _tokenId) public onlyOwnerOf(_tokenId) {
        qualificationApprovals[_tokenId] = _approved;
        emit Approval(msg.sender, _approved, _tokenId);
        }
}