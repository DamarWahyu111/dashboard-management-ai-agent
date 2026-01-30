# ⚡ QUICKSTART - 30 Seconds to Demo Ready

## The 3 Commands You Need

```bash
# 1. Install all dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open in browser
http://localhost:3000
```

**That's it!** Everything works immediately.

---

## Quick Login

- **Email:** Any email (e.g., `test@example.com`)
- **Password:** Any password (auto-registers first login)
- **Takes:** 5 seconds

---

## 5-Minute Demo Flow

```
1. Show Dashboard (metrics + charts) → 1 min
   ✓ See 4 KPI cards
   ✓ Show charts

2. Go to "AI Orchestration" tab → 0.5 min
   ✓ Point out: "This is the star feature"

3. Process voice notes → 1 min
   ✓ Click "Process Voice Notes with watsonx AI"
   ✓ See action items extracted
   ✓ Point out: "85% AI confidence"

4. Show conflicts detection → 1.5 min
   ✓ Click "Conflicts" tab
   ✓ Show calendar conflicts
   ✓ Highlight AI suggestions
   ✓ Show AUTO vs SUGGEST difference

5. Auto-sync to systems → 1 min
   ✓ Select GSheets + GCalendar + Slack
   ✓ Click "Auto-Sync"
   ✓ Show success messages

6. Show insights → Optional
   ✓ Efficiency score
   ✓ Recommendations
```

---

## Star Features (Pitch These)

### 🎤 Voice Notes → Action Items
```
Input:  "Report due Friday urgent for client"
Output: ✓ Title: Prepare Report
        ✓ Priority: HIGH
        ✓ Due: Friday
        ✓ Confidence: 85%
```

### 🔄 Predictive Workload Balancing
```
AI detects: "Friday report conflicts with 2pm client call"
Suggests:   ✓ Reschedule call to 3:30pm
            ✓ Draft email to send
            ✓ Mark report as critical
```

### 🔗 Cross-System Sync
```
One click syncs to:
✓ Google Sheets
✓ Google Calendar
✓ Slack
```

### 📊 Productivity Narratives
```
AI analyzes workload and says:
"Team efficiency: 65%
 If meetings ↓20%, efficiency jumps to 85% (+20%)"
```

---

## Key Controls

| Action | Location |
|--------|----------|
| **Refresh data** | Top right button (500ms, no page reload!) |
| **Change timeframe** | Filter bar (This Week/Month/Custom) |
| **Filter by team** | Filter bar (Team selector) |
| **Create team** | Teams tab → "Create Team" button |
| **Process AI** | AI Orchestration tab → "Process Voice Notes" |

---

## Troubleshooting (99% of issues)

**Port 3000 in use?**
```bash
npm run dev -- -p 3001
```

**App won't load?**
```bash
npm cache clean --force
npm install
npm run dev
```

**Something broken?**
```bash
Ctrl+C  # Stop dev server
npm run dev  # Start again
```

---

## Core Tech (Why It Matters)

- **Next.js 16** - Latest React framework (fast)
- **React 19** - Latest UI library
- **TypeScript** - No runtime errors
- **Tailwind CSS v4** - Modern styling
- **Recharts** - Professional charts
- **Mock Data** - Works without APIs (PoC)

---

## Files You'll Touch

```
app/dashboard/page.tsx              ← Main dashboard
components/ai-integration-panel.tsx ← AI feature (STAR)
lib/ai-orchestration.ts             ← AI engine (CORE)
```

---

## Full Demo Checklist

Before showing judges:

- [ ] Server running: `npm run dev` ✓
- [ ] Can login (any email/password) ✓
- [ ] Dashboard metrics visible ✓
- [ ] AI Orchestration tab works ✓
- [ ] Voice notes process ✓
- [ ] Conflicts detected ✓
- [ ] Sync completes ✓
- [ ] Timeframe filter works ✓
- [ ] Team filter works ✓
- [ ] You're confident ✓

---

## Read Next

**Quick Overview:** `README_FIRST.md`  
**Full Demo Script:** `DEMO_SCRIPT.md`  
**All Commands:** `COMMANDS_REFERENCE.md`  
**AI Deep Dive:** `AI_FEATURES.md`

---

## One-Liner Pitch

> "WhatsApp voice note → AI extracts task → checks calendar for conflicts → auto-syncs to Sheets + Calendar. Zero manual work."

---

## Success = When Judges See

✅ Voice notes processed automatically  
✅ Conflicts detected with AI suggestions  
✅ Multiple systems synced with one click  
✅ Productivity insights (efficiency +20%)  
✅ Team filtering like Jira  
✅ Everything works without setup  

---

**Go build. Go demo. Go win! 🚀**
