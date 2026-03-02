# Chatterbot: daily discussion prompt bot

# Post today's prompt. Use --channel to override the target channel.
post *args:
    bun run src/cli.ts post {{args}}

# Type-check the project
check:
    bun run check
