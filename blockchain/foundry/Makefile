-include .env

.PHONY: install build all clean coverage-report deploy example

DEFAULT_ANVIL_KEY := 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

example:
	echo "The value of MY_ENV is: $(MY_ENV)"

all: install build

install:
	@forge install https://github.com/smartcontractkit/chainlink --no-commit
	@forge install OpenZeppelin/openzeppelin-contracts-upgradeable --no-commit
	@forge install OpenZeppelin/openzeppelin-contracts --no-commit

# Clean the repo
clean  :; forge clean

coverage-report :; forge coverage --report debug > coverage-report.txt

NETWORK_ARGS := --rpc-url http://localhost:8545 --private-key $(DEFAULT_ANVIL_KEY) --broadcast

ifeq ($(findstring --network sepolia,$(ARGS)),--network sepolia) # ifeq (<value>,<value>)
	NETWORK_ARGS := --rpc-url $(SEPOLIA_RPC_URL) --private-key $(PRIVATE_KEY) --broadcast --verify --etherscan-api-key $(ETHERSCAN_API_KEY) -vvvv
endif

deploy: 
	@forge script script/Mocks.s.sol:DeployMocks ${NETWORK_ARGS}
	@forge script script/ProxyAndImplementation.s.sol:DeployProxyAndImplementation ${NETWORK_ARGS}
