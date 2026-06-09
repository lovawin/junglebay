// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

library Events {
    event RoundCreated(
        uint256 indexed roundId,
        uint256 floorPrice,
        uint256 targetAmount,
        uint256 startTime,
        uint256 endTime,
        bytes32 secretHash
    );

    event DepositReceived(
        uint256 indexed roundId,
        address indexed user,
        uint256 grossAmount,
        uint256 feeAmount,
        uint256 netAmount
    );

    event TargetReached(uint256 indexed roundId, uint256 totalRaised);

    event WinnerSelected(
        uint256 indexed roundId,
        address indexed winner,
        uint256 winningContribution,
        uint256 totalRaised,
        uint256 randomValue
    );

    event RefundsOpened(uint256 indexed roundId);
    event RefundClaimed(uint256 indexed roundId, address indexed user, uint256 amount);
    event FundsWithdrawn(uint256 indexed roundId, uint256 amount);
    event FeesWithdrawn(address indexed to, uint256 amount);
    event NFTDelivered(uint256 indexed roundId);
    event RoundArchived(uint256 indexed roundId);
    event RoundCancelled(uint256 indexed roundId);
}
