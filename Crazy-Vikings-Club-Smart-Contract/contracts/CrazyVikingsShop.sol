// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import "./ERC721A/IERC721A.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CrazyVikingsShop is Ownable {
    uint256 public priceLevelOne;
    uint256 public priceLevelTwo;
    uint256 public priceLevelThree;

    uint256 public constant EPICS_THRESHOLD = 30;
    uint256 public constant SPECIALS_THRESHOLD = 400;

    IERC721A public immutable CrazyVikingsClub;

    error NotOwner();
    error InvalidAmount();
    error FailedCall();

    constructor(address _crazyVikingsClub, uint256 _priceLevelOne, uint256 _priceLevelTwo, uint256 _priceLevelThree) {
        CrazyVikingsClub = IERC721A(_crazyVikingsClub);

        priceLevelOne = _priceLevelOne;
        priceLevelTwo = _priceLevelTwo;
        priceLevelThree = _priceLevelThree;
    }

    function purchase(uint256 tokenId) external payable ownToken(tokenId) {
        uint256 price = getPrice(tokenId);
        if (msg.value != price) revert InvalidAmount();

        CrazyVikingsClub.transferFrom(address(this), msg.sender, tokenId);
    }

    function transferNFT(address to, uint256 tokenId) external onlyOwner {
        CrazyVikingsClub.transferFrom(address(this), to, tokenId);
    }

    function getPrice(uint256 tokenId) public view returns (uint256) {
        return (
            tokenId < EPICS_THRESHOLD ? priceLevelThree : (tokenId < SPECIALS_THRESHOLD ? priceLevelTwo : priceLevelOne)
        );
    }

    function setPriceLevelOne(uint256 _newPrice) external onlyOwner {
        priceLevelOne = _newPrice;
    }

    function setPriceLevelTwo(uint256 _newPrice) external onlyOwner {
        priceLevelTwo = _newPrice;
    }

    function setPriceLevelThree(uint256 _newPrice) external onlyOwner {
        priceLevelThree = _newPrice;
    }

    function withdraw() public onlyOwner {
        (bool ok,) = payable(owner()).call{value: address(this).balance}("");
        if (!ok) revert FailedCall();
    }

    modifier ownToken(uint256 tokenId) {
        if (CrazyVikingsClub.ownerOf(tokenId) != address(this)) revert NotOwner();
        _;
    }
}
