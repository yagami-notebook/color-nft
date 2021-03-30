pragma solidity >=0.7.0 <0.9.0;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract MNft is IERC721, ERC721, Ownable {

string[] public colors;

mapping(string => bool) _colorExists;

address payable public ownerAddress;

mapping(uint256 => string) public tokenIdToColor;


constructor() ERC721("Demo Color NFT Token", "NCLR") {
    ownerAddress = payable(msg.sender);
}

function getColor(uint256 _colorID) public view returns (string memory color){
        color = colors[_colorID];
    }

 // E.G. color = "#FFFFFF"
  function mint(string memory _color) public payable{
    require(msg.value >= 1 ether);
    //trasnfer funds to owner 
    ownerAddress.transfer(msg.value);
    uint256 id = uint256(keccak256(abi.encodePacked(_color))) % 10000000000;

    colors.push(_color);
    tokenIdToColor[id] = _color ;
    
    _safeMint(msg.sender, id);
    _colorExists[_color] = true;
  }

  receive() external payable {}

}