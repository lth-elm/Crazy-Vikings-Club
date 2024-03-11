// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import "./ERC721A/ERC721A.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";

contract CrazyVikingsClub is ERC2981, ERC721A, Ownable {
    uint256 private constant MAX_SUPPLY = 10000;

    error maxSupplyReached();

    constructor(address receiver, uint96 feeNumerator) ERC721A("Crazy Vikings Club", "CVC") {
        _setDefaultRoyalty(receiver, feeNumerator);
    }

    function mint(address to, uint256 quantity) external onlyOwner {
        if (_totalMinted() + quantity > MAX_SUPPLY) revert maxSupplyReached();
        _mint(to, quantity);
    }

    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://bafybeicqhrnawqrxwzjysu67v2aphqoxp55xhwuftzmct7uw6hirqypcwm/";
    }

    // --------
    // EIP-2981
    // --------

    function setDefaultRoyalty(address receiver, uint96 feeNumerator) external onlyOwner {
        _setDefaultRoyalty(receiver, feeNumerator);
    }

    function setTokenRoyalty(uint256 tokenId, address receiver, uint96 feeNumerator) external onlyOwner {
        _setTokenRoyalty(tokenId, receiver, feeNumerator);
    }

    // -------
    // EIP-165
    // -------

    function supportsInterface(bytes4 interfaceId) public view override(ERC721A, ERC2981) returns (bool) {
        return ERC721A.supportsInterface(interfaceId) || ERC2981.supportsInterface(interfaceId);
    }
}
