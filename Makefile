.PHONY: serve serve-python serve-node open clean

PORT ?= 8080

# Default: run with Python (most common)
serve: serve-python

# Python 3 http.server
serve-python:
	@echo "Starting server at http://localhost:$(PORT)"
	python3 -m http.server $(PORT)

# Node http-server (install with: npm install -g http-server)
serve-node:
	@echo "Starting server at http://localhost:$(PORT)"
	npx http-server -p $(PORT) -c-1

# Open in default browser
open:
	open http://localhost:$(PORT)

# Start server and open browser
dev:
	@echo "Starting server at http://localhost:$(PORT)"
	@open http://localhost:$(PORT) &
	python3 -m http.server $(PORT)

clean:
	@echo "Nothing to clean for static site"
