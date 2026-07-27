# Smart Pump Controller — screenshots & diagrams

Drop files here to replace placeholders on the case study page automatically.

## App screens

| File | Screen |
|------|--------|
| `login.png` | Welcome Back / sign-in |
| `dashboard.png` | Schedules list |
| `control.png` | Start / stop pump |
| `schedule.png` | Add / edit schedule |

## Flow diagrams

| File | Content |
|------|---------|
| `architecture.png` | End-to-end request path (app → Kong → Django → device) |
| `kong-gateway.png` | Kong Ingress / routing / plugins |
| `auth-plugin-flow.png` | Custom auth plugin: first login vs DB session reuse |
| `auth-performance.png` | Before/after performance story |

Export diagrams as PNG (or JPEG with the same names). The page swaps them in when present — no code changes needed.
