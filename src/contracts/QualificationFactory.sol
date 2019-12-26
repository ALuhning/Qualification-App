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
      Category category,
      uint32 expiryDays,
      bool qualStatus);

  enum Category { Parachuting }

  struct Qualification {
    uint id;
    string name;
    string qualCode;
    address trgEstablishment;
    Category category;
    uint32 expiryDays;
    uint32 created;
    bool qualStatus;
  }

  uint nextId = 1;

  Qualification[] public qualifications;

  mapping (uint => address) public qualificationToTrgEstablishment;
  mapping (address => uint) trgEstablishmentQualificationCount;
  mapping (string => uint) codeToQualId;
  mapping (string => uint) nameToQualId;

  function _createQualification(
      string memory _name,
      string memory _qualCode,
      Category _category,
      uint32 _expiryDays
      ) internal {
    require(codeToQualId[_qualCode]==0, "qualification code already exists");
    require(nameToQualId[_name]==0, "name already exists");
    qualifications.push(Qualification(nextId, _name, _qualCode, msg.sender, _category, _expiryDays, uint32(now), true));
    codeToQualId[_qualCode] = nextId;
    nameToQualId[_name] = nextId;
    qualificationToTrgEstablishment[nextId] = msg.sender;
    trgEstablishmentQualificationCount[msg.sender] = trgEstablishmentQualificationCount[msg.sender].add(1);
    emit NewQualificationCreated(nextId, _name, _qualCode, msg.sender, _category, _expiryDays, true);
    nextId = nextId.add(1);
  }

  function createQualification(
      string memory _name,
      string memory _qualCode,
      Category _category,
      uint32 _expiryDays
  ) public {
    _createQualification(_name, _qualCode, _category, _expiryDays);
  }

}