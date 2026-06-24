### Task 17: Theming System

**Files:**
- Modify: `tailwind.config.ts` (extend with CSS variable-based theming)
- Create: `src/lib/theme.ts`
- Create: `src/app/admin/settings/page.tsx`

- [ ] **Step 1: Create theme lib src/lib/theme.ts**

```ts
export interface Theme {
  primaryColor: string;
  logo?: string;
  storeName: string;
}

const defaultTheme: Theme = {
  primaryColor: "#3b82f6",
  storeName: "Store",
};

export function getTheme(): Theme {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("store-theme");
    if (stored) return JSON.parse(stored);
  }
  return defaultTheme;
}
```

- [ ] **Step 2: Commit**

```bash
git add . && git commit -m "feat: add theming system foundation"
```

---


