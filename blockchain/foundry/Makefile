-include .env

.PHONY: install build all clean coverage-report deploy example help deploy-upgrade

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

NETWORK_ARGS := --rpc-url http://localhost:8545 --private-key $(ANVIL_PRIVATE_KEY) --broadcast

ifeq ($(findstring --network sepolia,$(ARGS)),--network sepolia) # ifeq (<value>,<value>)
	NETWORK_ARGS := --rpc-url $(SEPOLIA_RPC_URL) --private-key $(PRIVATE_KEY) --broadcast --verify --etherscan-api-key $(ETHERSCAN_API_KEY) -vvvv
endif

deploy:
	@forge script script/ProxyAndImplementation.s.sol:DeployProxyAndImplementation ${NETWORK_ARGS}

deploy-upgrade:
	@forge script script/upgrade.s.sol:Upgrade ${NETWORK_ARGS}

#awk: A text processing tool used for pattern matching and text manipulation.
help:
	@echo "Available targets:"
	@awk '/^[a-zA-Z0-9\-_]+:/ {print $$1}' Makefile | sed 's/://' 
