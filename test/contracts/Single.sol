pragma solidity ^0.5.6;

/**
 * @notice hello!
 */
contract Single {
    //TODO: is comment without any notation and spaces (needs ignore)
    // this is comment without any notation (needs ignore)
    // @dev this is a single line comment
    function line() public pure returns(uint256) {
        return 0; // this is inline comment without notation (needs ignore)
    }

    /// @dev this is a single corner comment
    function corner() public pure returns(uint256) {
        return 0;  // @dev this is inline comment with notation
    }
}
