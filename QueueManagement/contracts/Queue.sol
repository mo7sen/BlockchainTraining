pragma solidity >=0.6.0 <0.7.0;

contract Queue {

  address[] addressAt;
  mapping (address => uint) private addressToPositon;

  uint currentPosition;

  function enter() public {
    //require(addressToPositon[msg.sender] == 0);
    addressAt.push(msg.sender);
    addressToPositon[msg.sender] = addressAt.length;
  }

  function next(bool personPresent) public {
    if(personPresent) {
      delete addressAt[currentPosition];
      currentPosition++;
    } else {
      // Not sure what to do exactly
    }
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
