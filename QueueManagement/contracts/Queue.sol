pragma solidity >=0.6.0 <0.7.0;

contract Queue {

  // address[] addressAt;
  mapping (uint => address) private addressAt;
  mapping (address => uint) private addressToPositon;
  uint private queueSize = 0;

  mapping (address => bool) private admins;
  uint16 private adminCount;

  modifier onlyAdmins {
    require(admins[msg.sender], "Only admins are allowed to call this function");
    _;
  }

  uint currentPosition = 1;

  constructor() public {
    admins[msg.sender] = true;
    adminCount = 1;
  }

  function enter() public {
    require(addressToPositon[msg.sender] == 0);

    queueSize = queueSize + 1;

    addressAt[queueSize] = msg.sender;
    addressToPositon[msg.sender] = queueSize;
  }

  function next(bool personPresent) public onlyAdmins {
    if(personPresent) {
      addressToPositon[addressAt[currentPosition]] = 0;
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
    adminCount--;
    return true;
  }

  function isAdmin(address potentialAdmin) public view returns (bool) {
  	return admins[potentialAdmin];
  }

//  function getAdmins() public view returns (address[] memory){
//	uint returnSize = admins.length;
//	address[] memory result = new address[](returnSize);
//	for(uint i = 0; i < returnSize; i++)
//	{
//	result[i] = admins
//	}
//	return admins;
//  }


  function getPersonAt(uint pos) public view returns ( address ) {
    return addressAt[pos + currentPosition];
  }

  function getPosition() public view returns (uint) {
    if(addressAt[addressToPositon[msg.sender]] == msg.sender) {
      return addressToPositon[ msg.sender ] - currentPosition + 1;
    }
    return 0;
  }

  function getQueueSize() public view returns (uint) {
	  return queueSize - currentPosition + 1;
  }

  function getAll() public view returns (address[] memory) {
    uint returnSize = queueSize - currentPosition;
    address[] memory result = new address[](returnSize);
    for(uint i = 0; i < returnSize; i++) 
    {
      result[i] = addressAt[i + currentPosition];
    }
    return result;
  }
}
