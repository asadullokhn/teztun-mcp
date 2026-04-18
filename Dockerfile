# Dockerfile for the Glama MCP registry check.
#
# Glama's crawler needs a Dockerfile in the launcher repo so it can build
# the server and confirm it responds to MCP introspection. The actual
# binary lives in the pre-built asadullokhn/teztun image — this just
# re-exports it with `mcp` as the default CMD so `docker run <image>`
# starts the stdio MCP server without extra arguments.
#
# For production use, pull asadullokhn/teztun directly and pass `mcp`
# or any other subcommand on the command line.

FROM asadullokhn/teztun:latest

LABEL org.opencontainers.image.title="TezTun MCP server"
LABEL org.opencontainers.image.description="Manage TezTun tunnels, subdomains, and service tokens from any MCP-compatible AI client."
LABEL org.opencontainers.image.source="https://github.com/asadullokhn/teztun-mcp"
LABEL org.opencontainers.image.licenses="MIT"

CMD ["mcp"]
