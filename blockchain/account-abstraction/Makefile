-include .env

.PHONY: install 

install:
	forge install https://github.com/Cyfrin/foundry-era-contracts.git --no-commit 
	forge install https://github.com/OpenZeppelin/openzeppelin-contracts.git --no-commit 
	forge install https://github.com/eth-infinitism/account-abstraction.git --no-commit
	forge install https://github.com/foundry-rs/forge-std.git --no-commit
	forge install cyfrin/foundry-devops --no-commit

NETWORK_ARGS := --rpc-url http://localhost:8545 --account one_anvil --broadcast

ifeq ($(findstring --network sepolia,$(args)),--network sepolia) # ifeq (<value>,<value>)
	NETWORK_ARGS := --rpc-url $(SEPOLIA_RPC_URL) --account Real_account_private_key  --broadcast --verify --etherscan-api-key $(ETHERSCAN_API_KEY)
endif
ifeq ($(findstring --network zksync,${args}),--network zksync)
	NETWORK_ARGS := --zksync --rpc-url $(ZKSYNC_SEPOLIA_URL) --account Real_account_private_key  --broadcast --verify --etherscan-api-key $(ETHERSCAN_API_KEY) --slow
endif
deploy:
	forge script script/DeploySmartWallet.sol ${NETWORK_ARGS}