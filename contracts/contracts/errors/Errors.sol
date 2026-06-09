// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

library Errors {
    error ZeroAddress();
    error ZeroAmount();
    error InvalidFloorPrice();
    error InvalidSecretHash();
    error NoActiveRound();
    error RoundAlreadyActive();
    error RoundClosed();
    error RoundExpired();
    error RoundStillActive();
    error BelowMinimumEntry();
    error InvalidState();
    error TargetNotReached();
    error TargetAlreadyReached();
    error WinnerAlreadySelected();
    error WinnerNotSelected();
    error InvalidSecret();
    error NoContribution();
    error AlreadyRefunded();
    error RefundNotAvailable();
    error AlreadyWithdrawn();
    error AlreadyDelivered();
    error NothingToWithdraw();
    error TransferFailed();
    error CommitAlreadySet();
}
