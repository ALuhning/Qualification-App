pragma solidity ^0.5.0;

import "@openzeppelin/contracts/ownership/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Roles.sol";
import "./helpers/safemath.sol";

contract QualificationFactory is Ownable {

    using Roles for Roles.Role;
    using SafeMath for uint256;
    using SafeMath32 for uint32;
    using SafeMath16 for uint16;

    Roles.Role private _soldier;
    Roles.Role private _jumpMaster;
    Roles.Role private _trainingEstablishment;
    Roles.Role private _master;
  
    // Events
    event SoldierEnlisted(uint soldierId, address soldierAddress);
    event SoldierDelisted(address soldierAddress);
    event JumpMasterAuthorized(address soldierAddress);
    event TrainingEstablishmentIdentified(uint establishmentId, address establishmentAddress);
    event WingsIssued(address soldierAddress);
    event WingsRevoked(address soldierAddress);
    event NewQualificationCreated(
        uint qualificationId,
        string qualificationName,
        string qualificationCode,
        address trgEstablishment,
        bool qualStatus,
        string imageFileName);
    
  struct Soldier {
      uint soldierId;
      address soldierAddress;
  }

  struct TrainingEstablishment {
      uint establishmentId;
      address establishmentAddress;
  }
  
  struct Qualification {
    uint id;
    string name;
    string qualCode;
    address trgEstablishment;
    uint32 created;
    bool qualStatus;
    string imageFileName;
  }

  uint nextId = 1;

  Qualification[] public qualifications;
  Soldier[] public soldiers;
  TrainingEstablishment[] public trainingEstablishments;

  mapping(address=>bool) public jumpMaster;
  mapping(address=>bool) public enlisted;
  mapping(address=>bool) public wings;
  mapping(address=>bool) public trainingEstablishment;

  mapping (uint => address) public qualificationToTrgEstablishment;
  mapping (address => uint) trgEstablishmentQualificationCount;

  function _createQualification(
      string memory _name,
      string memory _qualCode,
      string memory _imageFileName
      ) internal {
    qualifications.push(Qualification(nextId, _name, _qualCode, msg.sender, uint32(now), true, _imageFileName));
    qualificationToTrgEstablishment[nextId] = msg.sender;
    trgEstablishmentQualificationCount[msg.sender] = trgEstablishmentQualificationCount[msg.sender].add(1);
    emit NewQualificationCreated(nextId, _name, _qualCode, msg.sender, true, _imageFileName);
    nextId = nextId.add(1);
  }

  function createQualification(
      string memory _name,
      string memory _qualCode,
      string memory _imageFileName
  ) public {
   // require(_master.has(msg.sender), "DOES_NOT_HAVE_TRAINING_ESTABLISHMENT_OR_MASTER_ROLE");
    _createQualification(_name, _qualCode, _imageFileName);
  }

    function assignMasterRole(address _masterAddress) public onlyOwner {
        _assignMasterRole(_masterAddress);
    }

    function isMaster(address account) public view returns (bool) {
        return _master.has(account);
    }


     // kill the contract
    function terminateQualificationRoles() public onlyOwner {
        selfdestruct(msg.sender);
    }

     // Enlist Soldier
    function enlistSoldier(address soldierAddress) public {
        require(enlisted[soldierAddress] != true, "Already Enlisted");
        uint256 soldierId = soldiers.length; // generates unique soldierId
        soldiers.push(Soldier(soldierId, soldierAddress));
        _assignSoldierRole(soldierAddress);
        enlisted[soldierAddress] = true;
        emit SoldierEnlisted(soldierId, soldierAddress);
    }

    // Delist Soldier
    function delistSoldier(address soldierAddress) public {
        require(enlisted[soldierAddress] == true, "Already Delisted");
        _removeSoldierRole(soldierAddress);
        enlisted[soldierAddress] = false;
        emit SoldierDelisted(soldierAddress);
    }

    function issueWings(address soldierAddress) public {
        require(wings[soldierAddress] != true, 'Already Been Issued Wings');
        require(_jumpMaster.has(msg.sender), "Is_Not_A_JumpMaster");
        wings[soldierAddress] = true;
        emit WingsIssued(soldierAddress);
    }

    function revokeWings(address soldierAddress) public {
        require(wings[soldierAddress] == true, 'Does Not Have Wings');
        require(_trainingEstablishment.has(msg.sender), "Is_Not_A_Training_Authority");
        wings[soldierAddress] = false;
        emit WingsRevoked(soldierAddress);
    }

    // Identify Training Establisment
    function identifyTrainingEstablishment(address establishmentAddress) public {
     //   require((!_master.has(msg.sender)), "DOES_NOT_HAVE_MASTER_ROLE");
        uint256 establishmentId = trainingEstablishments.length; // generates unique establishmentId
        trainingEstablishments.push(TrainingEstablishment(establishmentId, establishmentAddress));
        _assignTrainingEstablishmentRole(establishmentAddress);
        trainingEstablishment[establishmentAddress] = true;
        emit TrainingEstablishmentIdentified(establishmentId, establishmentAddress);
    }

    function assignJumpMaster(address soldierAddress) public {
     //   require((!_trainingEstablishment.has(msg.sender)), "DOES_NOT_HAVE_TRAINING_ESTABLISHMENT_ROLE");
        _assignJumpMasterRole(soldierAddress);
        jumpMaster[soldierAddress] = true;
        emit JumpMasterAuthorized(soldierAddress);
    }

    // Roles Setup
    

    function _assignMasterRole(address masterAddress) internal {
        _master.add(masterAddress);
    }
    
    function _assignSoldierRole(address soldierAddress) internal {
                _soldier.add(soldierAddress);
    }

    function _removeSoldierRole(address soldierAddress) internal {
                _soldier.remove(soldierAddress);
    }

    // assign training establishment role
    function _assignTrainingEstablishmentRole(address establishmentAddress) internal {
                _trainingEstablishment.add(establishmentAddress);
    }

    function _removeTrainingEstablishmentRole(address establishmentAddress) internal {
                _trainingEstablishment.remove(establishmentAddress);
    }

    // assign jump master role
    function _assignJumpMasterRole(address soldierAddress) internal {
                _jumpMaster.add(soldierAddress);
    }

    function _removeJumpMasterRole(address soldierAddress) internal {
                _jumpMaster.remove(soldierAddress);
    }
}