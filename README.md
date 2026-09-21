# Alles Hockey Help (`help.alles-hockey.ch`)

Static Help pages for the Alles Hockey / HS closed beta.

| | |
|--|--|
| **Canonical URL** | https://help.alles-hockey.ch/ |
| **Source in monorepo** | `apps/hs/help-site/` |
| **Publish repo** | `kiwicustom/hs-help` (GitHub Pages) |

## Local preview

```bash
cd help-site && python3 -m http.server 8765
```

## Publish

```bash
./scripts/publish-help-site.sh
```

## DNS

`help.alles-hockey.ch` → CNAME `kiwicustom.github.io` (same pattern as `help.kcal.lol`).
Domain must stay verified under GitHub → Settings → Pages.
