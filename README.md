# @asadullokhn/teztun-mcp

Official [TezTun](https://teztun.uz) MCP server, as a single-install npm package for Claude Desktop / Claude Code / Cursor / Zed / Windsurf / any [Model Context Protocol](https://modelcontextprotocol.io) client.

Lets your AI editor manage your TezTun infrastructure through chat:

- *"What's my current webhook URL?"* → `list_tunnels`
- *"Reserve a subdomain called demo"* → `reserve_subdomain`
- *"Mint a service token for prod-docker, never expires"* → `create_service_token`
- *"Revoke the staging-ci token"* → `revoke_service_token`

## Install & configure

You don't install this manually — MCP clients run it via `npx`. Pick your client:

### Claude Desktop

Edit `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "teztun": {
      "command": "npx",
      "args": ["-y", "@asadullokhn/teztun-mcp"],
      "env": { "TEZTUN_TOKEN": "tzt_your-token-here" }
    }
  }
}
```

### Claude Code

```bash
claude mcp add --scope user teztun \
  -e TEZTUN_TOKEN=tzt_your-token-here \
  -- npx -y @asadullokhn/teztun-mcp
```

### Cursor / Zed / Windsurf

Each editor has an MCP config file (`~/.cursor/mcp.json`, etc.). The block shape is the same as the Claude Desktop example above.

## Get a service token

Sign up at [app.teztun.uz](https://app.teztun.uz), then [mint a service token](https://app.teztun.uz/tokens). On the Max plan ($10/year) tokens never expire — recommended for AI editor use.

## How the package works

This package is a thin launcher. It tries, in order:

1. If the TezTun CLI (`teztun`) is installed, it runs `teztun mcp`.
2. If Docker is available, it runs `docker run --rm -i -e TEZTUN_TOKEN asadullokhn/teztun:latest mcp`.
3. Otherwise it errors with install instructions.

No bundled binaries, no postinstall side effects. The MCP server itself is the Go binary from [teztun.uz/download](https://teztun.uz/download), or the `asadullokhn/teztun` image on Docker Hub.

## Exposed tools

| Tool | What it does |
|---|---|
| `get_account` | Current user (plan, status) |
| `list_tunnels` | Active tunnels with their public URLs |
| `list_subdomains` | Reserved subdomains |
| `reserve_subdomain(name)` | Reserve a new subdomain (plan-gated) |
| `release_subdomain(id)` | Release a reserved subdomain (destructive) |
| `list_custom_domains` | Custom domains on the Max plan |
| `list_service_tokens` | Service tokens the user has minted |
| `create_service_token(name, expiry_seconds?, expire_never?)` | Mint a token |
| `revoke_service_token(id)` | Revoke a service token (destructive) |

## Links

- Product: https://teztun.uz
- Dashboard: https://app.teztun.uz
- Docs: https://teztun.uz/docs/mcp-server
- API reference: https://teztun.uz/docs/api
- Docker image: [asadullokhn/teztun](https://hub.docker.com/r/asadullokhn/teztun)
- Support: support@teztun.uz

## License

MIT. Launcher only — the MCP server binary it spawns is the official TezTun client.
