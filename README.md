# Cat Expenses

An app for tracking your cat's expenses.

## Features

### Expense management

- Add, edit, duplicate, and delete expenses
- Each expense has a name, category (Food, Furniture, Accessory), and amount
- Multi-select rows to bulk delete with a confirmation modal listing the selected items

### Currency support

- Dropdown in the action bar lists all ISO currencies in `USD ($)` format.
- Currency is auto-detected from the browser locale on first visit.
- Selected currency persists across page reloads via a cookie.
- All formatted amounts across the app update instantly when the currency is changed.

### Expense insights

- Highlights the highest-spending category displayed above the expense table.
- Top-category rows are visually distinguished in the table.
- Running total shown below the page title.

### Accessibility

- Full keyboard navigation throughout.
- ARIA labels and roles on all interactive elements.
- Focus management when modals open and close.

## Tech stack

- **React 19** with TypeScript.
- **Tailwind CSS** for styling.
- **Vite** for bundling.
- **Vitest** + **Testing Library** for unit tests.
- **Playwright** for end-to-end tests.

## Getting started

```bash
npm install
npm run dev
```

## Scripts

| Command             | Description                 |
| ------------------- | --------------------------- |
| `npm run dev`       | Start the dev server        |
| `npm run build`     | Production build            |
| `npm run lint`      | Run ESLint                  |
| `npm run typecheck` | Type-check without emitting |
| `npm run test:unit` | Run unit tests              |
| `npm run test:e2e`  | Run Playwright e2e tests    |
| `npm test`          | Run all tests               |
