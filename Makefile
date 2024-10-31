ENVIRONMENT				?= dev

build:
ifeq ($(ENVIRONMENT), dev)
	@echo "Building in development mode"
	npx webpack --config ./webpack/webpack.provider.dev.js
	npx webpack --config ./webpack/webpack.content.dev.js
else
	@echo "Building in production mode"
	npx webpack --config ./webpack/webpack.provider.js
	npx webpack --config ./webpack/webpack.content.js
endif