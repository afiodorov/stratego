GAME := $(shell find test/game -name \*.js -print)

test: game

game:
	mocha --reporter list $(GAME)

.PHONY: test
