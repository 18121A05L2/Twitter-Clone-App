-include .env

.PHONY: install build all clean coverage-report

DEFAULT_ANVIL_KEY := 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

all: install build

install:
	@forge install https://github.com/smartcontractkit/chainlink --no-commit
	@forge install OpenZeppelin/openzeppelin-contracts-upgradeable --no-commit
	@forge install OpenZeppelin/openzeppelin-contracts --no-commit

# Clean the repo
clean  :; forge clean

coverage-report :; forge coverage --report debug > coverage-report.txt
