# watsonx MindShare - INSTALLATION & SETUP GUIDE

## ⚡ Quick Start (60 Seconds)

```bash
# 1. Clone/Download the project
cd watsonx-mindshare

# 2. Install dependencies
npm install

# 3. Run the dev server
npm run dev

# 4. Open browser
http://localhost:3000

# 5. Login dengan:
# Email: any@email.com
# Password: anypassword (auto-register)
```

✅ **That's it! Everything works out of the box.**

---

## 📦 Dependencies Already Installed

Semua dependencies sudah ada di `package.json`. Berikut apa yang sudah included:

### Frontend Framework
- **next**: ^16.0.0 (React Server Components, App Router)
- **react**: ^19.0.0
- **react-dom**: ^19.0.0
- **typescript**: ^5.0.0

### UI & Design
- **tailwindcss**: ^4.0.0 (Utility-first CSS)
- **shadcn/ui**: Pre-built accessible components
  - Button, Card, Dialog, Tabs, Badges, etc.
- **lucide-react**: Beautiful SVG icons

### Data Visualization (untuk Charts)
- **recharts**: ^2.12.0 (React charting library)
- **@radix-ui/react-primitive**: Foundation components

### State Management
- **swr**: ^2.2.0 (Data fetching & caching)

### Utilities
- **clsx**: className utility
- **date-fns**: Date manipulation

---

## 🎯 SEMUA FITUR SUDAH JALAN!

### ✅ Yang Sudah Implemented:

**1. Authentication System**
- ✓ Login/Register (auto-register on first login)
- ✓ User session management
- ✓ Protected routes

**2. Dashboard**
- ✓ 4 KPI metrics cards (Efficiency, Tasks, Views, Revenue)
- ✓ Real-time refresh (500ms, data only - no full page reload)
- ✓ Responsive design (mobile, tablet, desktop)

**3. Timeframe Selector**
- ✓ This Week
- ✓ This Month
- ✓ Custom Date Range
- ✓ Auto-update metrics when timeframe changes

**4. Teams Management (Like Jira)**
- ✓ Create new teams
- ✓ Add/remove members
- ✓ Assign members to teams
- ✓ View team structure
- ✓ Filter dashboard by team

**5. AI Orchestration Engine** (NEW - CORE FEATURE)
- ✓ Process WhatsApp voice notes
- ✓ Extract action items using AI (mock watsonx)
- ✓ Detect calendar conflicts (Predictive Workload Balancing)
- ✓ Auto-generate conflict resolutions
- ✓ Generate productivity narratives with insights
- ✓ Auto-sync to Google Sheets & Google Calendar (mock)
- ✓ Send Slack notifications (mock)

**6. Advanced Charts**
- ✓ Bar charts (workload distribution)
- ✓ Line charts (trends)
- ✓ Pie charts (breakdown)
- ✓ Scatter plots (correlation)
- ✓ Doughnut charts (proportions)

**7. Data & Insights**
- ✓ Team efficiency metrics
- ✓ Task completion rates
- ✓ Calendar integration overview
- ✓ AI-powered suggestions

---

## 🔧 NO EXTERNAL API KEYS NEEDED!

**Why?** Semua data adalah MOCK DATA untuk demonstration purpose. Ini PoC (Proof of Concept) untuk hackathon.

**Jika nanti mau real integration:**
- Google Sheets API → Ganti mock di `ai-orchestration.ts`
- Google Calendar API → Ganti mock calendar events
- WhatsApp Business API → Real voice note processing
- watsonx API → Real AI processing

---

## 📂 Project Structure

```
watsonx-mindshare/
├── app/
│   ├── page.tsx                 # Landing page (redirects to login/dashboard)
│   ├── login/page.tsx           # Login & auto-register
│   ├── dashboard/
│   │   ├── page.tsx             # Main dashboard
│   │   └── loading.tsx          # Loading state
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Tailwind styles
│
├── components/
│   ├── sidebar.tsx              # Navigation sidebar
│   ├── metric-card.tsx          # KPI card component
│   ├── dashboard-charts.tsx     # All 5 chart types
│   ├── timeframe-selector.tsx   # Week/Month/Custom filter
│   ├── teams-manager.tsx        # Team CRUD operations
│   ├── ai-integration-panel.tsx # ⭐ NEW: Voice notes → AI → Sync
│   ├── ai-suggestions.tsx       # AI recommendations
│   └── ui/                      # shadcn/ui components (Button, Card, Dialog, etc.)
│
├── lib/
│   ├── auth.ts                  # Authentication logic
│   ├── teams.ts                 # Team management
│   ├── dashboard.ts             # Metrics generation
│   └── ai-orchestration.ts      # ⭐ NEW: AI engine + WA processing
│
├── package.json                 # All dependencies
├── tsconfig.json                # TypeScript config
├── next.config.mjs              # Next.js config
├── tailwind.config.ts           # Tailwind config
│
├── INSTALLATION.md              # This file
├── AI_FEATURES.md               # AI integration details
├── DEMO_SCRIPT.md               # Full demo walkthrough
└── QUICKSTART.md                # Quick reference
```

---

## 🚀 How to Run

### Development Mode
```bash
npm run dev
# Opens on http://localhost:3000
```

### Production Build
```bash
npm run build
npm run start
```

### Build Size
```bash
npm run build
# Shows optimized bundle size
```

---

## 🎨 Design System

**Colors** (Dark theme for hackathon vibes):
- Primary: Slate (900-800-700 backgrounds)
- Accent: Orange, Purple, Cyan, Pink (for metrics)
- Warnings: Red, Yellow (for alerts)

**Typography**:
- Headlines: Bold sans-serif
- Body: Regular sans-serif
- Icons: Lucide React 24px

**Layout**:
- Sidebar: Fixed 256px (md+)
- Mobile: Drawer/hamburger menu
- Responsive: Mobile → Tablet → Desktop

---

## 📝 File Roles

| File | Purpose | Lines |
|------|---------|-------|
| `ai-orchestration.ts` | AI engine + mock WA/GSheet/Calendar | 313 |
| `ai-integration-panel.tsx` | Voice notes UI + orchestration | 425 |
| `dashboard/page.tsx` | Main dashboard view | 210 |
| `teams-manager.tsx` | Team CRUD interface | 181 |
| `dashboard-charts.tsx` | 5 different chart types | 202 |
| `auth.ts` | Login/register system | 57 |

---

## ✨ Key Features Explained

### 1. Fast Refresh (No Page Reload)
```typescript
// Click "Refresh" button
// ✓ Only fetches new data (500ms)
// ✓ Updates metrics in place
// ✗ Does NOT reload entire page
```

### 2. AI Orchestration Flow
```
Voice Note (WA)
    ↓
watsonx AI Processing
    ↓
Extract Action Items
    ↓
Check Calendar Conflicts
    ↓
Generate Suggestions
    ↓
Sync to GSheet + GCalendar
```

### 3. Predictive Workload Balancing
```
New Action: "Report due Friday"
Check: Friday sudah ada 5 meetings?
YES → Alert: "Potential conflict!"
     Suggest: Reschedule meeting OR
             Mark report as high priority
```

### 4. Productivity Narratives
```
AI analyzes:
- Tasks completed
- Meeting hours
- Focus time
- Admin work

Generate:
"Team focused 65% time. 
 5 overdue tasks.
 If meetings reduced 20%,
 efficiency can jump to 85%."
```

---

## 🐛 Troubleshooting

### Issue: Port 3000 already in use
```bash
npm run dev -- -p 3001
# Use different port
```

### Issue: TypeScript errors
```bash
npm run type-check
# See all type errors

npm install
# Reinstall dependencies
```

### Issue: Styles not loading
```bash
npm run build
npm run dev
# Rebuild Tailwind cache
```

### Issue: Can't login
```
Email: test@example.com
Password: anything (auto-register works)
```

---

## 🎯 Hackathon Demo Flow (5-10 Minutes)

```
1. Show login screen (auto-register demo)
2. Display dashboard metrics
3. Click "Refresh" (instant, no reload)
4. Switch timeframes (This Week → This Month)
5. Go to "AI Orchestration" tab
6. Show incoming voice notes
7. Click "Process Voice Notes"
8. Show extracted action items
9. Show calendar conflicts & suggestions
10. Click "Auto-Sync" to GSheet + GCalendar
11. Show productivity narrative with insights
12. Create a team & add members
13. Filter dashboard by team
14. Show advanced charts
15. Boom! 🎉
```

---

## 📚 Documentation Files

- **INSTALLATION.md** (This file) - Setup & dependencies
- **AI_FEATURES.md** - Detailed AI/orchestration features
- **DEMO_SCRIPT.md** - Word-for-word demo walkthrough
- **QUICKSTART.md** - 30-second reference

---

## ✅ What's NOT Included (PoC)

These would be real API integrations for production:
- ❌ Real Google Sheets API (using mock)
- ❌ Real Google Calendar API (using mock)
- ❌ Real WhatsApp Business API (using mock)
- ❌ Real watsonx API (using mock ML)
- ❌ Real Slack API (using mock)
- ❌ Real database (using localStorage for this PoC)

**For production, you'd add:** Neon/Supabase + actual API credentials.

---

## 🎓 Learning Resources

### Next.js 16
- Official: https://nextjs.org/docs
- App Router: https://nextjs.org/docs/app

### Tailwind CSS v4
- Official: https://tailwindcss.com/docs
- Components: https://ui.shadcn.com

### TypeScript
- Official: https://www.typescriptlang.org/docs

### React 19
- Official: https://react.dev

---

## 📞 Support

If something breaks:
1. Check the console for errors: `npm run dev` (watch terminal)
2. Ensure Node.js version: `node --version` (needs 18+)
3. Clear cache: `rm -rf node_modules package-lock.json && npm install`
4. Rebuild: `npm run build`

---

## 🏆 Ready for Hackathon!

Everything is production-grade for a PoC. Features are complete, UI is polished, and documentation is thorough.

Good luck with your pitch! 🚀

---

**Built with ❤️ using Next.js 16, React 19, TypeScript, Tailwind CSS, and shadcn/ui**
