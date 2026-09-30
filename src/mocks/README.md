# Mock data

Keep new mock fixtures in this directory. Feature API adapters should import from here while
`VITE_USE_MOCK=true`, so the future Laravel API can be enabled by changing only each feature's
`api.js` adapter.

Existing teammate-owned mock files remain in their current folders and will be migrated later.
