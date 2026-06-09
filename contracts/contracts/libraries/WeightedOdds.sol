// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

library WeightedOdds {
    function selectWeightedWinner(
        address[] storage users,
        mapping(address => uint256) storage weights,
        uint256 totalWeight,
        uint256 randomValue
    ) internal view returns (address) {
        require(users.length > 0, "NO_USERS");
        require(totalWeight > 0, "NO_WEIGHT");

        uint256 winningPoint = randomValue % totalWeight;
        uint256 cumulative;

        for (uint256 i = 0; i < users.length; ) {
            address user = users[i];
            cumulative += weights[user];

            if (winningPoint < cumulative) {
                return user;
            }

            unchecked {
                ++i;
            }
        }

        return users[users.length - 1];
    }
}
