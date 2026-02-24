# ArtRoom — Pendientes e Incompletos

## Páginas Mock (datos falsos)
1. **`/gallery`** — usa `MOCK_DESIGNS` hardcodeados, no conecta a Supabase
2. **`/skills` (Skill Vault)** — datos falsos, no hay tabla en DB
3. **`/portfolio/[id]`** — tiene un `// TODO`, datos hardcodeados, botón de compra no funciona

## Features Faltantes
4. **Messaging** — el chat en `/artist/[handle]` solo guarda en React state, no hay tabla `messages`, el destinatario nunca ve nada
5. **Forgot password / reset** — no existe
6. **Email verification UI** — no hay página de confirmación
7. **OAuth** (Google, GitHub) — no implementado
8. **Cambiar rol** (buyer → creator/company) — no hay UI para esto
9. **Editar/eliminar diseños** publicados — solo se pueden crear, no modificar ni borrar
10. **"Save Draft"** en upload — el botón ejecuta `handlePublish`, siempre publica

## Seguridad
11. **Circle webhook sin verificación de firma** — cualquiera puede POST un evento falso
12. **Solana sin verificación on-chain** — acepta cualquier string como `txSignature`
13. **Like count con race condition** — incremento manual client-side, no atómico
14. **SOL/USD rate hardcodeado** (`0.01`) — no hay oracle de precio
15. **Recipient Solana default** es la dirección del system program (fondos se queman si no se configura env var)

## Otros Gaps
16. **Multi-creator cart split** — si el carrito tiene items de distintos creators, no divide los fondos por creator
17. **No hay admin panel** — tabla `reports` existe pero nadie puede revisar/resolver reportes
18. **Notificaciones de follow/like** — no se envían, solo las de pagos
19. **Social links, cover image, skills** en perfil — campos existen en DB pero sin UI para editarlos
20. **Service Worker** — manifest PWA existe pero no hay offline support real
