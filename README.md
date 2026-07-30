# Bosodance · Demo systemu rezerwacji

Demo technologiczne systemu rezerwacji i płatności dla **Bosodance** (Sopot).

> **Wersja demonstracyjna.** Gotowy system szyjemy na miarę — pod Państwa studio, procesy i branding.

## Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS 4

## Lokalnie

```bash
cd bosodance
npm install
npm run dev
```

→ [http://localhost:3000](http://localhost:3000)

## Co jest w środku

### Widok klienta
- Strona główna studia (oferta, grafik, cennik)
- Flow rezerwacji + płatność testowa
- Panel admina (`/admin`)

### Panel admina
- Pulpit, rezerwacje, klienci, grafik, frekwencja
- Płatności, karnety, raporty z wykresami
- Nauczyciele, wiadomości, ustawienia

Dane demo: `localStorage` + przykładowe KPI w raportach.

## Deploy (Vercel)

```bash
npx vercel
```

Framework: Next.js · bez wymaganych env vars.

## Edycja treści

`src/data/classes.ts` — studio, zajęcia, cennik, grafik  
`src/data/analytics.ts` — dane demo raportów
