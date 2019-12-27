pragma solidity ^0.5.0;

import "@openzeppelin/contracts/ownership/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "./helpers/safemath.sol";

contract QualificationFactory is Ownable {

  using SafeMath for uint256;
  using SafeMath32 for uint32;
  using SafeMath16 for uint16;

  event NewQualificationCreated(
      uint qualificationId,
      string qualificationName,
      string qualificationCode,
      address trgEstablishment,
      bool qualStatus);

  struct Qualification {
    uint id;
    string name;
    string qualCode;
    address trgEstablishment;
    uint32 created;
    bool qualStatus;
  }

  uint nextId = 1;

  Qualification[] public qualifications;

  mapping (uint => address) public qualificationToTrgEstablishment;
  mapping (address => uint) trgEstablishmentQualificationCount;

  function _createQualification(
      string memory _name,
      string memory _qualCode
      ) internal {
    qualifications.push(Qualification(nextId, _name, _qualCode, msg.sender, uint32(now), true));
    qualificationToTrgEstablishment[nextId] = msg.sender;
    trgEstablishmentQualificationCount[msg.sender] = trgEstablishmentQualificationCount[msg.sender].add(1);
    emit NewQualificationCreated(nextId, _name, _qualCode, msg.sender, true);
    nextId = nextId.add(1);
  }

  function createQualification(
      string memory _name,
      string memory _qualCode
  ) public {
    _createQualification(_name, _qualCode);
  }

}