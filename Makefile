include config.mk

HOMEDIR = $(shell pwd)
vite = ./node_modules/.bin/vite

run-demo:
	$(vite)

build-demo:
	$(vite) build

sync:
	rsync -avz $(HOMEDIR)/dist/ $(USER)@$(SERVER):/$(APPDIR) \
    --exclude node_modules/

set-up-server-dir:
	ssh $(USER)@$(SERVER) "mkdir -p $(APPDIR)"
