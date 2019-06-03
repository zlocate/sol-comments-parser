pragma solidity ^0.5.6;

/**
 * @notice hello!
 */
contract Single {
    // @dev this is a single line comment
    function line() public pure returns(uint256) {
        return 0;
    }

    /// @dev this is a single corner comment
    function corner() public pure returns(uint256) {
        return 0;
    }
}
