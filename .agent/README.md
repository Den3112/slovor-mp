# 📁 Slovor MP - Agent Documentation

## 📂 Structure

```
.agent/
├── README.md           ← ВЫ ЗДЕСЬ (главный файл)
├── MEMORY.md           ← Контекст проекта
├── task.md             ← Текущие задачи
│
├── plans/              ← 📋 Все планы архитектуры
│   ├── ARCHITECTURE_BLUEPRINT.md   (41 страница, layouts)
│   ├── UX_FUNCTIONALITY_GUIDE.md   (UX паттерны)
│   ├── ADVANCED_FEATURES_GUIDE.md  (Trust, Safety, SEO)
│   └── REDESIGN_INSTRUCTIONS.md    (Step-by-step guide)
│
├── design-system/      ← 🎨 Дизайн-система
│   ├── DESIGN_TOKENS.md
│   ├── COMPONENT_STYLES.md
│   └── THEME_SWITCHING.md
│
└── workflows/          ← 🔄 Процессы
```

---

## 🎯 Execution Order (8 Phases + 1 Optional)

### Phase 1: URL Restructure ⚡ CRITICAL
- [ ] Rename `/profile/*` → `/dashboard/*`
- [ ] Move `/messages`, `/favorites` to top-level
- [ ] Add redirects in `next.config.ts`
- [ ] Update all internal links

### Phase 2: Mobile Navigation
- [ ] Create `BottomTabBar` component
- [ ] Add to main layout (visible on md:hidden)

### Phase 3: Sidebar Restructure
- [ ] Add group titles (MAIN, ACTIVITY, QUICK ACCESS)
- [ ] Add dividers between groups

### Phase 4: Header Redesign
- [ ] Integrate search bar (desktop)
- [ ] Add quick action icons (favorites, messages)

### Phase 5: All 41 Pages
- [ ] Follow specs in `plans/ARCHITECTURE_BLUEPRINT.md`
- [ ] Apply UX patterns from `plans/UX_FUNCTIONALITY_GUIDE.md`

### Phase 6: Trust & Safety
- [ ] Seller verification badges
- [ ] Report system with categories
- [ ] Moderation queue

### Phase 7: Monetization
- [ ] Promote listing page
- [ ] Wallet integration
- [ ] Subscription tiers

### Phase 8: Final Verification
- [ ] `npm run verify`
- [ ] E2E tests
- [ ] Mobile responsiveness check (375px)
- [ ] Dark mode check

### Phase 9: Theme Switching System (Not Urgent)
- [ ] Create CSS token system
- [ ] Implement switchable themes (CRM, SaaS, Minimal)
- [ ] See `design-system/THEME_SWITCHING.md`

---

## 🎨 Current Design

**Style**: Customer Support CRM (Solid, Clean, Data-Dense)
**Source**: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
**Demo**: https://ui-ux-pro-max-skill.nextlevelbuilder.io/demo/customer-support-crm

---

## ⚠️ Critical Rules

1. **NO backdrop-blur** anywhere
2. **NO gradients** on backgrounds
3. **NO rounded-3xl** - max is rounded-xl
4. **Solid backgrounds** only
5. **Touch targets** min 44x44px on mobile
6. Run `npm run verify` after every change

---

## 📝 For Next AI Agent

1. READ `MEMORY.md` first
2. READ `plans/ARCHITECTURE_BLUEPRINT.md`
3. Follow phases in order (1 → 9)
4. Run `npm run verify` after each phase
5. Update `task.md` as you progress
