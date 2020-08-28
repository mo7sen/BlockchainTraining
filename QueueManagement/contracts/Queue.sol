pragma solidity >=0.6.0 <0.7.0;

contract Queue {

  address[] addressAt;
  mapping (address => uint) private addressToPositon;

  mapping (address => bool) private admins;
  uint16 private adminCount;

  modifier onlyAdmins {
    require(admins[msg.sender], "Only admins are allowed to call this function");
    _;
  }

  uint currentPosition;

  constructor() public {
    admins[msg.sender] = true;
    adminCount = 1;
  }

  function enter() public {
    require(addressToPositon[msg.sender] == 0);
    addressAt.push(msg.sender);
    addressToPositon[msg.sender] = addressAt.length;
  }

  function next(bool personPresent) public onlyAdmins {
    if(personPresent) {
      addressToPositon[addressAt[currentPosition]] = 0;
      delete addressAt[currentPosition];
      currentPosition++;
    } else {
      // Not sure what to do exactly
    }
  }

  function addAdmin(address newAdmin) public onlyAdmins returns ( bool ){
    admins[newAdmin] = true;
    adminCount++;
    return true;
  }

  function removeAdmin(address exile) public onlyAdmins returns ( bool ){
    if(adminCount <= 1) return false;
    admins[exile] = false;
    return true;
  }

  function isAdmin(address potentialAdmin) public view returns (bool) {
  	return admins[potentialAdmin];
  }

  function getPersonAt(uint pos) public view returns ( address ) {
    return addressAt[pos + currentPosition - 1];
  }

  function getPosition() public view returns (uint) {
    return addressToPositon[ msg.sender ] - currentPosition;
  }

  function getAll() public view returns (address[] memory) {
    uint returnSize = addressAt.length - currentPosition;
    address[] memory result = new address[](returnSize);
    for(uint i = 0; i < returnSize; i++) 
    {
      result[i] = addressAt[i + currentPosition];
    }
    return result;
  }
}
