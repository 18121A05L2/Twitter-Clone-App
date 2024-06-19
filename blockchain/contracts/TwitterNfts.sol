// SPDX-License-Identifier: MIT
// ERC721 Contract
pragma solidity ^0.8.9;
import "./interfaces/IERC721Receiver.sol";

contract TwitterNfts {
    string public nftName;
    string public nftSymbol;

    uint256 public nextTokenIdToMint; // token ID numberr
    address public contractOwner;

    // token id => owner
    mapping(uint256 => address) internal _owners;
    // owner => token count
    mapping(address => uint256) internal _balances; // no of nfts owned by the specific address
    // token id => approved address
    mapping(uint256 => address) internal _tokenApprovals;
    // owner => (operator => yes/no)
    mapping(address => mapping(address => bool)) internal _operatorApprovals;
    // token id => token uri
    mapping(uint256 => string) _tokenUris;

    event TransferNft(
        address indexed _from,
        address indexed _to,
        uint256 indexed _tokenId
    );

    event ApprovalForNft(
        address indexed _owner,
        address indexed _approved,
        uint256 indexed _tokenId
    );

    event ApprovalForAllNfts(
        address indexed _owner,
        address indexed _operator,
        bool _approved
    );

    constructor(string memory _name, string memory _symbol) {
        nftName = _name;
        nftSymbol = _symbol;
        nextTokenIdToMint = 0;
        contractOwner = msg.sender;
    }

    function balanceOf(address _owner) public view returns (uint256) {
        require(_owner != address(0), "!Add0");
        return _balances[_owner];
    }

    function ownerOf(uint256 _tokenId) public view returns (address) {
        return _owners[_tokenId];
    }

    function safeTransferFrom(
        address _from,
        address _to,
        uint256 _tokenId
    ) public payable {
        safeTransferFrom(_from, _to, _tokenId, "");
    }

    function safeTransferFrom(
        address _from,
        address _to,
        uint256 _tokenId,
        bytes memory _data
    ) public payable {
        require(
            ownerOf(_tokenId) == msg.sender ||
                _tokenApprovals[_tokenId] == msg.sender ||
                _operatorApprovals[ownerOf(_tokenId)][msg.sender],
            "!Auth"
        );
        // trigger func check
        require(
            _checkOnERC721Received(_from, _to, _tokenId, _data),
            "!ERC721Implementer"
        );
        _transferNft(_from, _to, _tokenId);
    }

    function transferNftFrom(
        address _from,
        address _to,
        uint256 _tokenId
    ) public payable {
        // unsafe transfer without onERC721Received, used for contracts that dont implement
        require(
            ownerOf(_tokenId) == msg.sender ||
                _tokenApprovals[_tokenId] == msg.sender ||
                _operatorApprovals[ownerOf(_tokenId)][msg.sender],
            "!Auth"
        );
        _transferNft(_from, _to, _tokenId);
    }

    function approveNft(address _approved, uint256 _tokenId) public payable {
        require(ownerOf(_tokenId) == msg.sender, "!Owner");
        _tokenApprovals[_tokenId] = _approved;
        emit ApprovalForNft(ownerOf(_tokenId), _approved, _tokenId);
    }

    function setApprovalForAll(address _operator, bool _approved) public {
        _operatorApprovals[msg.sender][_operator] = _approved;
        emit ApprovalForAllNfts(msg.sender, _operator, _approved);
    }

    function getApproved(uint256 _tokenId) public view returns (address) {
        return _tokenApprovals[_tokenId];
    }

    function isApprovedForAll(
        address _owner,
        address _operator
    ) public view returns (bool) {
        return _operatorApprovals[_owner][_operator];
    }

    function mintTo(string memory _uri) public {
        // require(contractOwner == msg.sender, "!Auth");
        _owners[nextTokenIdToMint] = msg.sender;
        _balances[msg.sender] += 1;
        _tokenUris[nextTokenIdToMint] = _uri;
        // profiles[msg.sender] = _uri;
        emit TransferNft(address(0), msg.sender, nextTokenIdToMint);
        nextTokenIdToMint += 1;
    }

    function tokenURI(uint256 _tokenId) public view returns (string memory) {
        return _tokenUris[_tokenId];
    }

    function totalNftSupply() public view returns (uint256) {
        return nextTokenIdToMint;
    }

    // INTERNAL FUNCTIONS
    function _checkOnERC721Received(
        address from,
        address to,
        uint256 tokenId,
        bytes memory data
    ) private returns (bool) {
        // check if to is an contract, if yes, to.code.length will always > 0
        if (to.code.length > 0) {
            try
                IERC721Receiver(to).onERC721Received(
                    msg.sender,
                    from,
                    tokenId,
                    data
                )
            returns (bytes4 retval) {
                return retval == IERC721Receiver.onERC721Received.selector;
            } catch (bytes memory reason) {
                if (reason.length == 0) {
                    revert(
                        "ERC721: transfer to non ERC721Receiver implementer"
                    );
                } else {
                    /// @solidity memory-safe-assembly
                    assembly {
                        revert(add(32, reason), mload(reason))
                    }
                }
            }
        } else {
            return true;
        }
    }

    // unsafe transfer
    function _transferNft(
        address _from,
        address _to,
        uint256 _tokenId
    ) internal {
        require(ownerOf(_tokenId) == _from, "!Owner");
        require(_to != address(0), "!ToAdd0");

        delete _tokenApprovals[_tokenId];
        // if (
        //     keccak256(abi.encodePacked(profiles[_from])) ==
        //     keccak256(abi.encodePacked(_tokenUris[_tokenId]))
        // ) {
        //     delete profiles[_from];
        // }
        _balances[_from] -= 1;
        _balances[_to] += 1;
        _owners[_tokenId] = _to;

        emit TransferNft(_from, _to, _tokenId);
    }

    // fetch all the nfts owned
    function getMyNfts() public view returns (uint256[] memory _ids) {
        _ids = new uint256[](balanceOf(msg.sender));
        uint256 currentIndex;
        uint256 tokenCount = nextTokenIdToMint;
        for (uint256 i = 0; i < tokenCount; i++) {
            if (ownerOf(i) == msg.sender) {
                _ids[currentIndex] = i;
                currentIndex++;
            }
        }
        return _ids;
    }

    function getNftSymbol() public view returns (string memory) {
        return nftSymbol;
    }
}
