pragma solidity >=0.5.0 <0.6.0;

import "./QualificationFactory.sol";

contract QualificationHelper is QualificationFactory {

  modifier onlyOwnerOf(uint _qualificationId) {
    require(msg.sender == qualificationToTrgEstablishment[_qualificationId], "does not own qualification");
    _;
  }

  function changeQualificationName(uint _qualificationId, string calldata _newQualificationName) external onlyOwnerOf(_qualificationId) {
    qualifications[_qualificationId].name = _newQualificationName;
  }

  function changeQualificationCode(uint _qualificationId, string calldata _newQualificationCode) external onlyOwnerOf(_qualificationId) {
    qualifications[_qualificationId].qualCode = _newQualificationCode;
  }

  function changeQualificationStatus(uint _qualificationId) external onlyOwnerOf(_qualificationId) {
    qualifications[_qualificationId].qualStatus = !qualifications[_qualificationId].qualStatus;
  }

  function getQualificationsByTrgEstablishment(address _trgEstablishment) external view returns(uint[] memory) {
    uint[] memory result = new uint[](trgEstablishmentQualificationCount[_trgEstablishment]);
    uint counter = 0;
    for (uint i = 0; i < qualifications.length; i++) {
      if (qualificationToTrgEstablishment[i] == _trgEstablishment) {
        result[counter] = i;
        counter++;
      }
    }
    return result;
  }

}