// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "./SubscriptionToken.sol";

/**
 * @title LendingEscrow
 * @dev A secure escrow contract for lending and borrowing subscription tokens
 * @notice This contract allows users to lend their subscription tokens to others for a fee,
 * while maintaining control over their tokens through a secure escrow mechanism.
 */
contract LendingEscrow is Ownable, ReentrancyGuard, Pausable, IERC1155Receiver, ERC165 {
    // Reference to the SubscriptionToken contract
    SubscriptionToken public subscriptionToken;
    
    // Constants
    uint256 public constant BASIS_POINTS = 10000; // 100% in basis points
    
    // Lending listing structure
    struct Listing {
        address lender;
        uint256 tokenId;
        uint256 pricePerUnit; // in wei per second
        uint256 availableUnits;
        uint256 totalUnits;
        uint256 minDuration; // in seconds
        uint256 maxDuration; // in seconds
        uint256 createdAt;
        bool isActive;
    }
    
    // Lending session structure
    struct Session {
        address borrower;
        uint256 listingId;
        uint256 units;
        uint256 startTime;
        uint256 endTime;
        uint256 totalPaid;
        bool isActive;
    }
    
    // Contract state
    uint256 public listingCounter;
    uint256 public sessionCounter;
    uint256 public platformFee; // in basis points (1% = 100)
    uint256 public minRentalDuration = 1 days; // Minimum rental duration
    uint256 public maxRentalDuration = 365 days; // Maximum rental duration
    address public platformWallet;
    
    // Mappings
    mapping(uint256 => Listing) public listings;
    mapping(uint256 => Session) public sessions;
    mapping(address => uint256[]) public userListings;
    mapping(address => uint256[]) public userSessions;
    mapping(address => bool) public whitelistedTokens;
    
    // Events
    event ListingCreated(
        uint256 indexed listingId,
        address indexed lender,
        uint256 indexed tokenId,
        uint256 pricePerUnit,
        uint256 availableUnits,
        uint256 minDuration,
        uint256 maxDuration
    );
    
    event ListingUpdated(
        uint256 indexed listingId,
        uint256 newPricePerUnit,
        uint256 newAvailableUnits,
        uint256 newMinDuration,
        uint256 newMaxDuration
    );
    
    event ListingCancelled(uint256 indexed listingId);
    
    event SessionStarted(
        uint256 indexed sessionId,
        uint256 indexed listingId,
        address indexed borrower,
        uint256 units,
        uint256 startTime,
        uint256 endTime,
        uint256 totalPayment
    );
    
    event SessionEnded(
        uint256 indexed sessionId,
        uint256 indexed listingId,
        address indexed borrower,
        uint256 unitsReturned
    );
    
    event PlatformFeeUpdated(uint256 newFee);
    event PlatformWalletUpdated(address newWallet);
    event RentalDurationLimitsUpdated(uint256 minDuration, uint256 maxDuration);
    event TokenWhitelisted(address token, bool whitelisted);
    
    // Modifiers
    modifier onlyLender(uint256 listingId) {
        require(listings[listingId].lender == msg.sender, "Not the lender");
        _;
    }
    
    modifier onlyActiveListing(uint256 listingId) {
        require(listings[listingId].isActive, "Listing not active");
        _;
    }
    
    modifier onlyActiveSession(uint256 sessionId) {
        require(sessions[sessionId].isActive, "Session not active");
        _;
    }
    
    /**
     * @dev Constructor
     * @param _subscriptionToken Address of the SubscriptionToken contract
     * @param _platformWallet Address to receive platform fees
     * @param _platformFee Platform fee in basis points (1% = 100)
     */
    constructor(
        address _subscriptionToken,
        address _platformWallet,
        uint256 _platformFee
    ) {
        require(_subscriptionToken != address(0), "Invalid token address");
        require(_platformWallet != address(0), "Invalid platform wallet");
        require(_platformFee < BASIS_POINTS, "Fee too high");
        
        subscriptionToken = SubscriptionToken(_subscriptionToken);
        platformWallet = _platformWallet;
        platformFee = _platformFee;
        whitelistedTokens[_subscriptionToken] = true;
        _transferOwnership(msg.sender);
    }
    
    /**
     * @dev Creates a new lending listing
     * @param tokenId ID of the subscription token to lend
     * @param pricePerUnit Price per unit per second in wei
     * @param units Number of units to list
     * @param minDuration Minimum rental duration in seconds
     * @param maxDuration Maximum rental duration in seconds
     */
    function createListing(
        uint256 tokenId,
        uint256 pricePerUnit,
        uint256 units,
        uint256 minDuration,
        uint256 maxDuration
    ) external whenNotPaused {
        require(units > 0, "Must list at least one unit");
        require(pricePerUnit > 0, "Price must be greater than 0");
        require(minDuration >= minRentalDuration, "Duration below minimum");
        require(maxDuration <= maxRentalDuration, "Duration exceeds maximum");
        require(minDuration <= maxDuration, "Invalid duration range");
        
        // Transfer tokens to this contract
        subscriptionToken.safeTransferFrom(
            msg.sender,
            address(this),
            tokenId,
            units,
            ""
        );
        
        // Create new listing
        uint256 listingId = ++listingCounter;
        listings[listingId] = Listing({
            lender: msg.sender,
            tokenId: tokenId,
            pricePerUnit: pricePerUnit,
            availableUnits: units,
            totalUnits: units,
            minDuration: minDuration,
            maxDuration: maxDuration,
            createdAt: block.timestamp,
            isActive: true
        });
        
        userListings[msg.sender].push(listingId);
        
        emit ListingCreated(
            listingId,
            msg.sender,
            tokenId,
            pricePerUnit,
            units,
            minDuration,
            maxDuration
        );
    }
    
    /**
     * @dev Updates an existing listing
     * @param listingId ID of the listing to update
     * @param newPricePerUnit New price per unit
     * @param newAvailableUnits New available units
     * @param newMinDuration New minimum duration
     * @param newMaxDuration New maximum duration
     */
    function updateListing(
        uint256 listingId,
        uint256 newPricePerUnit,
        uint256 newAvailableUnits,
        uint256 newMinDuration,
        uint256 newMaxDuration
    ) external onlyLender(listingId) onlyActiveListing(listingId) whenNotPaused {
        Listing storage listing = listings[listingId];
        
        require(newMinDuration <= newMaxDuration, "Invalid duration range");
        require(newMinDuration >= minRentalDuration, "Duration below minimum");
        require(newMaxDuration <= maxRentalDuration, "Duration exceeds maximum");
        
        // If reducing available units, ensure we don't go below currently rented units
        uint256 currentRented = listing.totalUnits - listing.availableUnits;
        require(newAvailableUnits >= currentRented, "Cannot reduce below rented units");
        
        // Update the listing
        listing.pricePerUnit = newPricePerUnit;
        listing.availableUnits = newAvailableUnits;
        listing.minDuration = newMinDuration;
        listing.maxDuration = newMaxDuration;
        
        emit ListingUpdated(
            listingId,
            newPricePerUnit,
            newAvailableUnits,
            newMinDuration,
            newMaxDuration
        );
    }
    
    /**
     * @dev Cancels a lending listing
     * @param listingId ID of the listing to cancel
     */
    function cancelListing(uint256 listingId) external onlyLender(listingId) onlyActiveListing(listingId) {
        Listing storage listing = listings[listingId];
        
        // Mark as inactive
        listing.isActive = false;
        
        // Return any remaining tokens to the lender
        if (listing.availableUnits > 0) {
            subscriptionToken.safeTransferFrom(
                address(this),
                listing.lender,
                listing.tokenId,
                listing.availableUnits,
                ""
            );
        }
        
        emit ListingCancelled(listingId);
    }
    
    /**
     * @dev Starts a new borrowing session
     * @param listingId ID of the listing to borrow from
     * @param units Number of units to borrow
     * @param duration Duration in seconds
     */
    function startSession(
        uint256 listingId,
        uint256 units,
        uint256 duration
    ) external payable nonReentrant whenNotPaused onlyActiveListing(listingId) {
        Listing storage listing = listings[listingId];
        
        // Validate inputs
        require(units > 0, "Must rent at least one unit");
        require(units <= listing.availableUnits, "Not enough units available");
        require(duration >= listing.minDuration, "Duration below minimum");
        require(duration <= listing.maxDuration, "Duration exceeds maximum");
        
        // Calculate total price
        uint256 totalPrice = listing.pricePerUnit * units * duration;
        require(msg.value >= totalPrice, "Insufficient payment");
        
        // Update listing
        listing.availableUnits -= units;
        
        // Create session
        uint256 sessionId = ++sessionCounter;
        sessions[sessionId] = Session({
            borrower: msg.sender,
            listingId: listingId,
            units: units,
            startTime: block.timestamp,
            endTime: block.timestamp + duration,
            totalPaid: totalPrice,
            isActive: true
        });
        
        userSessions[msg.sender].push(sessionId);
        
        // Distribute payment (platform fee + lender payment)
        _distributePayment(listing.lender, totalPrice);
        
        // Refund any excess payment
        if (msg.value > totalPrice) {
            payable(msg.sender).transfer(msg.value - totalPrice);
        }
        
        emit SessionStarted(
            sessionId,
            listingId,
            msg.sender,
            units,
            block.timestamp,
            block.timestamp + duration,
            totalPrice
        );
    }
    
    /**
     * @dev Ends a borrowing session
     * @param sessionId ID of the session to end
     */
    function endSession(uint256 sessionId) external nonReentrant {
        Session storage session = sessions[sessionId];
        require(session.isActive, "Session is not active");
        require(
            msg.sender == session.borrower || msg.sender == owner(),
            "Not authorized to end session"
        );
        
        Listing storage listing = listings[session.listingId];
        
        // Mark session as inactive
        session.isActive = false;
        
        // Return tokens to the lender
        subscriptionToken.safeTransferFrom(
            address(this),
            listing.lender,
            listing.tokenId,
            session.units,
            ""
        );
        
        // Update available units in the listing
        listing.availableUnits += session.units;
        
        emit SessionEnded(
            sessionId,
            session.listingId,
            session.borrower,
            session.units
        );
    }
    
    /**
     * @dev Internal function to distribute payment between platform and lender
     * @param lender Address of the lender
     * @param amount Total payment amount
     */
    function _distributePayment(address lender, uint256 amount) internal {
        uint256 platformCut = (amount * platformFee) / BASIS_POINTS;
        uint256 lenderCut = amount - platformCut;
        
        // Transfer platform fee
        if (platformCut > 0) {
            payable(platformWallet).transfer(platformCut);
        }
        
        // Transfer remaining to lender
        if (lenderCut > 0) {
            payable(lender).transfer(lenderCut);
        }
    }
    
    /**
     * @dev Updates the platform fee
     * @param newFee New platform fee in basis points (1% = 100)
     */
    function updatePlatformFee(uint256 newFee) external onlyOwner {
        require(newFee < BASIS_POINTS, "Fee too high");
        platformFee = newFee;
        emit PlatformFeeUpdated(newFee);
    }
    
    /**
     * @dev Updates the platform wallet address
     * @param newWallet New platform wallet address
     */
    function updatePlatformWallet(address newWallet) external onlyOwner {
        require(newWallet != address(0), "Invalid wallet address");
        platformWallet = newWallet;
        emit PlatformWalletUpdated(newWallet);
    }
    
    /**
     * @dev Updates the rental duration limits
     * @param min New minimum rental duration in seconds
     * @param max New maximum rental duration in seconds
     */
    function updateRentalDurationLimits(uint256 min, uint256 max) external onlyOwner {
        require(min > 0, "Minimum duration must be greater than 0");
        require(max > min, "Max must be greater than min");
        
        minRentalDuration = min;
        maxRentalDuration = max;
        
        emit RentalDurationLimitsUpdated(min, max);
    }
    
    /**
     * @dev Whitelists or unwhitelists a token
     * @param token Address of the token
     * @param whitelisted Whether to whitelist or not
     */
    function setWhitelistedToken(address token, bool whitelisted) external onlyOwner {
        require(token != address(0), "Invalid token address");
        whitelistedTokens[token] = whitelisted;
        emit TokenWhitelisted(token, whitelisted);
    }
    
    /**
     * @dev Emergency withdrawal of ERC20 tokens
     * @param token Token address
     * @param to Recipient address
     * @param amount Amount to withdraw
     */
    function withdrawERC20(
        IERC20 token,
        address to,
        uint256 amount
    ) external onlyOwner {
        require(to != address(0), "Cannot withdraw to zero address");
        require(
            address(token) != address(subscriptionToken) || 
            !whitelistedTokens[address(token)], 
            "Cannot withdraw whitelisted tokens"
        );
        token.transfer(to, amount);
    }
    
    /**
     * @dev Emergency withdrawal of ERC1155 tokens
     * @param token Token address
     * @param to Recipient address
     * @param id Token ID
     * @param amount Amount to withdraw
     * @param data Additional data
     */
    function withdrawERC1155(
        IERC1155 token,
        address to,
        uint256 id,
        uint256 amount,
        bytes calldata data
    ) external onlyOwner {
        require(to != address(0), "Cannot withdraw to zero address");
        require(
            address(token) != address(subscriptionToken) || 
            !whitelistedTokens[address(token)], 
            "Cannot withdraw whitelisted tokens"
        );
        token.safeTransferFrom(address(this), to, id, amount, data);
    }
    
    /**
     * @dev Pauses the contract
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpauses the contract
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Returns all listings for a user
     * @param user User address
     * @return Array of listing IDs
     */
    function getUserListings(address user) external view returns (uint256[] memory) {
        return userListings[user];
    }
    
    /**
     * @dev Returns all sessions for a user
     * @param user User address
     * @return Array of session IDs
     */
    function getUserSessions(address user) external view returns (uint256[] memory) {
        return userSessions[user];
    }
    
    /**
     * @dev Returns active sessions for a user
     * @param user User address
     * @return Array of active session IDs
     */
    function getActiveUserSessions(address user) external view returns (uint256[] memory) {
        uint256[] storage sessionIds = userSessions[user];
        uint256 count = 0;
        
        // Count active sessions
        for (uint256 i = 0; i < sessionIds.length; i++) {
            if (sessions[sessionIds[i]].isActive) {
                count++;
            }
        }
        
        // Create and populate result array
        uint256[] memory result = new uint256[](count);
        uint256 index = 0;
        
        for (uint256 i = 0; i < sessionIds.length; i++) {
            if (sessions[sessionIds[i]].isActive) {
                result[index] = sessionIds[i];
                index++;
            }
        }
        
        return result;
    }
    
    // IERC1155Receiver implementation
    function onERC1155Received(
        address operator,
        address from,
        uint256 id,
        uint256 value,
        bytes calldata data
    ) external override returns (bytes4) {
        return this.onERC1155Received.selector;
    }
    
    function onERC1155BatchReceived(
        address operator,
        address from,
        uint256[] calldata ids,
        uint256[] calldata values,
        bytes calldata data
    ) external override returns (bytes4) {
        return this.onERC1155BatchReceived.selector;
    }
    
    // Fallback function to receive ETH
    receive() external payable {}
    
    // Function to get contract version
    function version() external pure returns (string memory) {
        return "1.0.0";
    }
    
    // IERC165 interface support
    function supportsInterface(bytes4 interfaceId) public view override(ERC165, IERC165) returns (bool) {
        return 
            interfaceId == type(IERC1155Receiver).interfaceId || 
            super.supportsInterface(interfaceId);
    }
}
