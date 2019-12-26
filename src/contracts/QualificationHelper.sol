pragma solidity >=0.5.0 <0.6.0;

import "./QualificationFactory.sol";

contract QualificationHelper is QualificationFactory {

  modifier onlyOwnerOf(uint _qualificationId) {
    require(msg.sender == qualificationToTrgEstablishment[_qualificationId], "does not own qualification");
    _;
  }

  function changeQualificationName(uint _qualificationId, string calldata _newQualificationName) external onlyOwnerOf(_qualificationId) {
    nameToQualId[qualifications[_qualificationId].name] = 0;
    qualifications[_qualificationId].name = _newQualificationName;
    nameToQualId[qualifications[_qualificationId].name] = _qualificationId;
    
  }

  function changeQualificationCode(uint _qualificationId, string calldata _newQualificationCode) external onlyOwnerOf(_qualificationId) {
    codeToQualId[qualifications[_qualificationId].qualCode] = 0;
    qualifications[_qualificationId].qualCode = _newQualificationCode;
    codeToQualId[qualifications[_qualificationId].qualCode] = _qualificationId;
  }

  function changeQualificationCategory(uint _qualificationId, Category _newQualificationCategory) external onlyOwnerOf(_qualificationId) {
    qualifications[_qualificationId].category = _newQualificationCategory;
  }

  function changeQualificationExpiry(uint _qualificationId, uint32 _newQualificationExpiry) external onlyOwnerOf(_qualificationId) {
    qualifications[_qualificationId].expiryDays = _newQualificationExpiry;
  }

  function changeQualificationStatus(uint _qualificationId) external onlyOwnerOf(_qualificationId) {
    qualifications[_qualificationId].qualStatus = !qualifications[_qualificationId].qualStatus;
  }

  function getQualificationsByTrgEstablishment(address _owner) external view returns(uint[] memory) {
    uint[] memory result = new uint[](trgEstablishmentQualificationCount[_owner]);
    uint counter = 0;
    for (uint i = 0; i < qualifications.length; i++) {
      if (qualificationToTrgEstablishment[i] == _owner) {
        result[counter] = i;
        counter++;
      }
    }
    return result;
  }

}