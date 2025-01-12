#Always use tabs for commands under a target in Makefiles
# @ at the start of the commads will make the command run without printing the command
-include .env

.PHONY: install build all clean coverage-report deploy example help deploy-upgrade update-addresses

example:
	echo "The value of MY_ENV is: $(MY_ENV)"

all: install build

install:
	forge install https://github.com/smartcontractkit/chainlink --no-commit
	forge install OpenZeppelin/openzeppelin-contracts-upgradeable --no-commit
	forge install OpenZeppelin/openzeppelin-contracts --no-commit

# Clean the repo
clean  :; forge clean

coverage-report :; forge coverage --report debug > coverage-report.txt

NETWORK_ARGS := --rpc-url http://localhost:8545 --private-key $(ANVIL_PRIVATE_KEY) --broadcast

ifeq ($(findstring --network sepolia,$(args)),--network sepolia) # ifeq (<value>,<value>)
	NETWORK_ARGS := --rpc-url $(SEPOLIA_RPC_URL) --account Real_account_private_key  --broadcast --verify --etherscan-api-key $(ETHERSCAN_API_KEY)
endif
ifeq ($(findstring --network zksync,${args}),--network zksync)
	NETWORK_ARGS := --zksync --rpc-url $(ZKSYNC_SEPOLIA_URL) --account Real_account_private_key  --broadcast --verify --etherscan-api-key $(ETHERSCAN_API_KEY) --slow
endif

deploy:
	forge script script/DeployProxyAndImplementation.s.sol:DeployProxyAndImplementation ${NETWORK_ARGS}

deploy-upgrade:
	forge script script/upgrade.s.sol:Upgrade ${NETWORK_ARGS}

create-zksync:
	forge create src/TwitterProxy.sol:TwitterProxy --constructor-args 0x038343D098114cB4294d46ffc66C2b4F3A498433 0x --private-key ${PRIVATE_KEY} --sender 0xE959A2c1c3F108697c244b98C71803b6DcD77764 --rpc-url https://sepolia.era.zksync.dev --chain 300 --verifier zksync --verifier-url https://explorer.sepolia.era.zksync.dev/contract_verification --verify --zksync --network sepolia --braodcast


ADD_NETWORK := -- --network localhost
ifeq ($(findstring --network sepolia,$(ARGS)),--network sepolia)
	ADD_NETWORK := -- --network sepolia
endif

update-addresses:
	forge script script/UpdateContractAddresses.sol --via-ir ${NETWORK_ARGS}

#awk: A text processing tool used for pattern matching and text manipulation.
help:
	echo "Available targets:"
	awk '/^[a-zA-Z0-9\-_]+:/ {print $$1}' Makefile | sed 's/://' 

# Define VERBOSE mode
ifndef VERBOSE
	SILENT := @
endif

target:
	$(SILENT) echo "Running target command..."

