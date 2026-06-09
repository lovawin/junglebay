// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

library Structs {
    enum RoundState {
        NONE,
        OPEN,
        TARGET_REACHED,
        WINNER_SELECTED,
        FUNDS_WITHDRAWN,
        REFUNDS_OPEN,
        DELIVERED,
        ARCHIVED,
        CANCELLED
    }

    struct Round {
        uint256 id;
        uint256 floorPrice;
        uint256 targetAmount;
        uint256 totalRaised;
        uint256 startTime;
        uint256 endTime;
        bytes32 secretHash;
        address winner;
        bool revealed;
        bool withdrawn;
        bool delivered;
        RoundState state;
    }

    struct Participant {
        uint256 contribution;
        bool refunded;
    }
}
