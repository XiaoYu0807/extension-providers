ENVIRONMENT				?= dev

build:
ifeq ($(ENVIRONMENT), dev)
	@echo "Building in development mode"
	npx webpack --config ./webpack/webpack.provider.dev.js
else
	@echo "Building in production mode"
	npx webpack --config ./webpack/webpack.provider.js
endif