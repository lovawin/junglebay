// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "../structs/Structs.sol";

interface ILetsBuyJungleBay {
    function createRound(uint256 floorPrice, bytes32 secretHash) external;
    function deposit() external payable;
    function revealWinner(string calldata secret) external;
    function openRefunds() external;
    function claimRefund(uint256 roundId) external;
    function ownerWithdraw() external;
    function withdrawFees() external;
    function markDelivered() external;
    function archiveRound() external;
    function cancelRound() external;
    function getParticipants(uint256 roundId) external view returns (address[] memory);
    function currentRound() external view returns (Structs.Round memory);
    function getContribution(uint256 roundId, address user) external view returns (uint256);
    function participantCount(uint256 roundId) external view returns (uint256);
    function getOddsBps(uint256 roundId, address user) external view returns (uint256);
    function timeRemaining(uint256 roundId) external view returns (uint256);
    function getWinner(uint256 roundId) external view returns (address);
    function currentPot() external view returns (uint256);
    function hashSecret(string calldata secret) external pure returns (bytes32);
}
