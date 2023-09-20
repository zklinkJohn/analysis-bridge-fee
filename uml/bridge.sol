// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

contract ZKLinkGetway {
    struct BridgeInfo {
        address token;
        uint104 amount;
        address zklinkAddress;
        uint8 subAccountId;
        bool isMapping;
    }
    mapping(messageHash => BridgeInfo);

    function depositERC20() external {   }
}
