// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @notice Educational escrow. NOT audited. Do not use with real funds.
contract SafeEscrow {
    enum Status { Created, Funded, Disputed, Released, Refunded }
    address payable public immutable buyer;
    address payable public immutable seller;
    address public immutable arbiter;
    uint256 public immutable amount;
    uint256 public immutable deadline;
    Status public status;
    bool private entered;
    event Changed(Status indexed status, address indexed actor);

    modifier nonReentrant() {
        require(!entered, "Reentrancy blocked");
        entered = true;
        _;
        entered = false;
    }

    constructor(address payable _seller, address _arbiter, uint256 _deadline) payable {
        require(_seller != address(0) && _arbiter != address(0), "Zero address");
        require(_seller != msg.sender && _arbiter != msg.sender && _arbiter != _seller, "Roles must differ");
        require(msg.value > 0, "Deposit required");
        require(_deadline > block.timestamp, "Invalid deadline");
        buyer = payable(msg.sender);
        seller = _seller;
        arbiter = _arbiter;
        amount = msg.value;
        deadline = _deadline;
        status = Status.Funded;
        emit Changed(status, msg.sender);
    }

    function confirmDelivery() external nonReentrant {
        require(msg.sender == buyer, "Only buyer");
        require(status == Status.Funded, "Not funded");
        require(block.timestamp < deadline, "Expired");
        status = Status.Released;
        emit Changed(status, msg.sender);
        (bool ok,) = seller.call{value: amount}("");
        require(ok, "Transfer failed");
    }

    function dispute() external {
        require(msg.sender == buyer || msg.sender == seller, "Not party");
        require(status == Status.Funded, "Not funded");
        require(block.timestamp < deadline, "Expired");
        status = Status.Disputed;
        emit Changed(status, msg.sender);
    }

    function refundAfterTimeout() external nonReentrant {
        require(msg.sender == buyer, "Only buyer");
        require(status == Status.Funded, "Not funded");
        require(block.timestamp >= deadline, "Not expired");
        status = Status.Refunded;
        emit Changed(status, msg.sender);
        (bool ok,) = buyer.call{value: amount}("");
        require(ok, "Transfer failed");
    }

    function resolve(bool releaseToSeller) external nonReentrant {
        require(msg.sender == arbiter, "Only arbiter");
        require(status == Status.Disputed, "No dispute");
        status = releaseToSeller ? Status.Released : Status.Refunded;
        emit Changed(status, msg.sender);
        (bool ok,) = (releaseToSeller ? seller : buyer).call{value: amount}("");
        require(ok, "Transfer failed");
    }
}
