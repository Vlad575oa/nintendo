# 🌍 GLOBAL_RULES.md
**Next.js 14 · Prisma 6 · BigTech Architecture Standard**

This document defines the **non-negotiable architectural laws** for the project. Any violation is considered a system-level defect and must be resolved before merging.

---

## 1. Rendering Strategy

### 1.1 Route Mandate
| Path Pattern | Strategy | Reason |
|--------------|----------|--------|
| `/` | `SSG` | Static marketing content |
| `/catalog` | `SSG` | SEO + low volatility |
| `/catalog/[category]` | `ISR (3600)` | Product updates |
| `/catalog/[category]/[product]` | `ISR (1800)` | Real-time Price/Stock |
| `/admin/*` | `force-dynamic` | Always fresh data |
| `/api/*` | `dynamic` | Stateless operations |
| `/search` | `force-dynamic` | Query-dependent |

> **Rule:** Forbidden to mix `force-dynamic` and `revalidate` on the same route.

### 1.2 Component Hierarchy (Leaves Only)
- Client Components (`"use client"`) must only be "leaves" of the component tree.
- **Server → Client** ✔️
- **Client → Server** ❌
- High JSX density: If a file exceeds **400 lines**, it must be decomposed into features/entities.

### 1.3 Mandatory Suspense
All async data components must be wrapped in `<Suspense fallback={<Skeleton />}>`.

---

## 2. Data Fetching & State

### 2.1 Server-Only Data
- Prisma queries are **forbidden** inline within `page.tsx`.
- All database access must go through `lib/queries.ts` and be wrapped in React's `cache()`.

### 2.2 ISR Budgets
- Product: `1800`
- Category: `3600`
- Home: `86400`

### 2.3 Filter Policy
Filters must live exclusively in the **URL Search Params** (`?minPrice=1000`). Internal React state for filters is forbidden.

---

## 3. SEO & Semantic Integrity

### 3.1 Metadata Truth
- All metadata must be generated via `generateMetadata`.
- No `next/head` or client-side SEO modifications.

### 3.2 Structured Data (Schema.org)
Mandatory Schema entities for indexable pages:
- `Product`, `Offer`, `BreadcrumbList`.

### 3.3 Heading Hierarchy
- Exactly **one `<h1>`** per page.
- Semantic HTML tags (`<main>`, `<article>`, `<section>`, `<nav>`) are mandatory.

---

## 4. Architecture & Security

### 4.1 Layer Responsibilities
| Layer | Responsibility |
|-------|----------------|
| `app/` | Routing & Rendering |
| `lib/queries/` | Read-only DB operations (cached) |
| `lib/actions/` | Write-only DB operations (Server Actions) |
| `components/` | Pure UI elements |
| `stores/` | Transient UI State (Zustand) |

### 4.2 Security Guards
- **Admin:** Protected via Middleware.
- **Uploads:** Max 10MB, `image/*` only, UUID-renamed server-side.
- **Rate Limit:** Search (10/sec), Upload (5/min).

---

## 5. Финансовые инварианты

### 5.1 Хранение денег
- Все цены хранятся как **Integer в копейках**: `45000` = `450.00 ₽`.
- Категорически запрещено хранить цены как Float (из-за потерь на округлении).

### 5.2 Снапшот цены в заказе
- При создании заказа цена товара должна быть зафиксирована в `OrderItem`.
- Это необходимо, так как цена товара в каталоге может измениться после покупки.
- Поле: `price_at_purchase: Int` в модели `OrderItem`.

### 5.3 Транзакции при покупке
Списание остатков и создание заказа происходят ТОЛЬКО внутри `prisma.$transaction`:
1. Проверить `stock > 0` (внутри TX).
2. Уменьшить `stock` на выбранное количество.
3. Создать `Order` + `OrderItem` со снапшотом цены.
> Если любой шаг левого взаимодействия упал — происходит откат всей транзакции.

---

## 6. Безопасность

### 6.1 Rate Limiting
- `/api/search`: не более 10 запросов/сек с одного IP.
- `/api/upload`: не более 5 загрузок/мин с одного IP.
- Реализация: `middleware` или `upstash/ratelimit`.

---

## 7. Архитектура слоев

### 7.5 Стандарт API ответов
Все `/api/*` роуты возвращают единый формат:
`{ success: boolean, data?: T, error?: string }`
> **Железное правило:** Никогда не возвращать сырую ошибку Prisma клиенту.

---

## 8. TypeScript & Качество кода
- `strict: true`, `any` запрещен.
- Обязательные файлы: `error.tsx`, `not-found.tsx`, `loading.tsx`.

---

**FINAL LAW:** If a page loads >2.5s, isn't indexable, or shows an inconsistent price, it is NOT ready for production.
