# 🎯 EXACT COMMANDS TO RUN FOR HACKATHON

## Step 1: Download & Setup (First Time Only)

```bash
# Make sure you have Node.js installed
node --version  # Should be 18.17 or higher

# Navigate to project folder
cd watsonx-mindshare

# Install ALL dependencies (this downloads packages from npm)
npm install

# This command downloads:
# - Next.js 16 (React framework)
# - React 19 (UI library)
# - TypeScript (type safety)
# - Tailwind CSS (styling)
# - Recharts (charting)
# - shadcn/ui (components)
# - All other dependencies listed below
```

**Wait time:** 2-3 minutes first time

**What gets installed:** ~500MB in node_modules folder

---

## Step 2: Run the Development Server

```bash
# Start dev server
npm run dev

# Output should show:
# ▲ Next.js 16.0.0
# - Local:        http://localhost:3000
# - Environments: .env.local
```

**Keep this running.** It auto-reloads when you edit code.

**Open in browser:** `http://localhost:3000`

---

## Step 3: Login to Dashboard

**URL:** `http://localhost:3000/login`

**Auto-Register:**
- Email: `any@email.com` (can be fake)
- Password: `anything` (literally any password)
- Click "Login" → Auto-creates account

**Boom!** You're in the dashboard.

---

## Step 4: Explore Features

### In Dashboard:
1. **Overview Tab** - See metrics & charts
2. **AI Orchestration Tab** - Show the AI magic
   - Process voice notes
   - Show extracted actions
   - Detect conflicts
   - Generate insights
3. **Teams Tab** - Create & manage teams

### Controls:
- **Refresh Button** (top right) - Fast data refresh (no page reload!)
- **Timeframe Filter** - Switch between This Week/Month/Custom
- **Team Filter** - Filter by team

---

## Common Commands

### Rebuild if Something Breaks
```bash
npm run build
```
Takes 30-60 seconds, then run `npm run dev` again.

### Check for TypeScript Errors
```bash
npm run type-check
```

### Format Code (Optional)
```bash
npm run format
```

### Check Bundle Size (Optional)
```bash
npm run build
# Shows size of final app
```

---

## File Structure (What You Have)

```
watsonx-mindshare/
│
├── package.json              ← Lists all dependencies
├── node_modules/             ← Downloaded packages (don't edit)
│
├── app/
│   ├── page.tsx              ← Home (redirects)
│   ├── layout.tsx            ← Root layout
│   ├── login/page.tsx        ← Login page
│   ├── dashboard/page.tsx    ← Main dashboard ⭐
│   └── globals.css           ← Global styles
│
├── components/
│   ├── ai-integration-panel.tsx     ← AI feature ⭐
│   ├── sidebar.tsx
│   ├── teams-manager.tsx
│   ├── dashboard-charts.tsx
│   └── ui/                   ← shadcn components
│
├── lib/
│   ├── ai-orchestration.ts         ← AI engine ⭐
│   ├── auth.ts
│   ├── teams.ts
│   └── dashboard.ts
│
├── INSTALLATION.md           ← Setup guide
├── AI_FEATURES.md            ← AI details
├── COMMANDS_REFERENCE.md     ← This file
├── DEMO_SCRIPT.md            ← Demo walkthrough
└── QUICKSTART.md             ← Quick ref
```

---

## Troubleshooting Commands

### Port 3000 in Use?
```bash
npm run dev -- -p 3001
# Uses port 3001 instead
# Open: http://localhost:3001
```

### Clear Cache & Reinstall
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### See Errors in Console
```bash
# Terminal where you ran npm run dev
# Scroll up to see error messages
```

### Check Node Version
```bash
node --version
# Need: v18.17.0 or higher
# Update from: nodejs.org
```

---

## NPM vs YARN vs PNPM

### If you're using NPM (default):
```bash
npm install
npm run dev
```

### If you prefer YARN:
```bash
yarn install
yarn dev
```

### If you prefer PNPM:
```bash
pnpm install
pnpm dev
```

**Recommendation:** Use NPM (included with Node.js)

---

## Deployment Commands (After Hackathon)

### Build for Production
```bash
npm run build
npm run start
# Runs optimized version
```

### Deploy to Vercel (Free)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow prompts, gets live URL
```

### Deploy to Other Platforms
```bash
# Build first
npm run build

# Then deploy the .next folder to:
# - Netlify
# - AWS Amplify
# - GitHub Pages
# - Heroku
# etc.
```

---

## Environment Variables (Not Needed for PoC)

**Currently:** None required!

**If adding real APIs later:**

1. Create `.env.local` file:
```
GOOGLE_SHEETS_API_KEY=your_key_here
GOOGLE_CALENDAR_API_KEY=your_key_here
WHATSAPP_API_KEY=your_key_here
```

2. Access in code:
```typescript
const apiKey = process.env.GOOGLE_SHEETS_API_KEY;
```

**For now:** Leave this alone, all features work with mock data!

---

## Dependencies Explained

### Essential
- **next** - React framework
- **react** - UI library
- **typescript** - Type safety

### Styling
- **tailwindcss** - CSS utility classes
- **lucide-react** - SVG icons

### Components
- **@radix-ui/* - Accessible UI primitives
- **shadcn/ui** - Pre-built components

### Data & Charts
- **recharts** - Charting library
- **swr** - Data fetching

### Utilities
- **clsx** - className utility
- **date-fns** - Date formatting

**No heavyweight dependencies!** App is fast & light.

---

## Performance Tips

### During Development
```bash
# Your dev server should rebuild in <1 second
# If slower, restart: npm run dev
```

### For Demo
```bash
# Use Chrome DevTools Lighthouse to check
# Should score 90+ for Performance
```

### For Production
```bash
npm run build

# Check optimizations:
# - Image optimization ✓
# - Code splitting ✓
# - Compression ✓
```

---

## What Happens When You Run These Commands

### `npm install`
1. Reads `package.json`
2. Downloads all packages from npm registry
3. Creates `package-lock.json` (lock file)
4. Creates `node_modules/` folder
5. ✅ Ready to develop!

### `npm run dev`
1. Starts Next.js dev server
2. Watches file changes
3. Auto-reloads browser
4. Shows TypeScript errors
5. ✅ Live development!

### `npm run build`
1. Optimizes code
2. Bundles JS/CSS
3. Creates `.next/` folder
4. ✅ Production-ready!

### `npm run start`
1. Runs optimized build
2. Much faster than dev mode
3. Close to production speed
4. ✅ Test before deploying!

---

## Git Commands (If Using Version Control)

```bash
# Initialize git
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit: watsonx MindShare dashboard"

# Create GitHub repo and push
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
git branch -M main
git push -u origin main
```

---

## Docker (Optional - Not Needed)

If you want to run in Docker (advanced):

```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD npm run start
```

```bash
# Build image
docker build -t watsonx-mindshare .

# Run container
docker run -p 3000:3000 watsonx-mindshare
```

**Skip this for hackathon - use regular npm!**

---

## Keyboard Shortcuts in Dev Mode

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + S` | Auto-save (in editor) |
| `Cmd/Ctrl + Shift + L` | Toggle dark mode (browser) |
| `F12` | Open DevTools |
| `Cmd/Ctrl + Shift + C` | Inspect element |

---

## Testing Commands (Optional)

```bash
# If you add Jest tests later:
npm test
npm test:watch
npm test:coverage
```

**Not needed for PoC!**

---

## Final Checklist Before Demo

```bash
# 1. Install dependencies (first time)
npm install

# 2. Start dev server
npm run dev

# 3. Open browser
# → http://localhost:3000

# 4. Test all features
# → Login
# → Dashboard
# → AI Orchestration
# → Teams
# → Refresh & Timeframe
# → Charts

# 5. Check responsive
# → Open DevTools (F12)
# → Toggle mobile view

# ✅ You're ready to demo!
```

---

## Emergency Restart

If something breaks and won't fix:

```bash
# Nuclear option (complete reset)
npm cache clean --force
rm -rf node_modules package-lock.json .next
npm install
npm run dev

# This usually fixes 99% of issues
```

---

## What NOT to Do

❌ **Don't edit** `node_modules/` folder
❌ **Don't delete** `package-lock.json`
❌ **Don't run** `npm install` while dev server is running
❌ **Don't push** `node_modules/` to GitHub
❌ **Don't use** `sudo npm install`

---

## Quick Reference

| Goal | Command |
|------|---------|
| Setup | `npm install` |
| Develop | `npm run dev` |
| Check errors | `npm run type-check` |
| Build | `npm run build` |
| Run production | `npm run start` |
| Open app | `http://localhost:3000` |
| Login | Email: any@email.com, Password: anything |

---

## Support / Issues

### If commands don't work:

1. **Check Node version:** `node --version` (need 18+)
2. **Check npm version:** `npm --version` (need 9+)
3. **Check internet:** Make sure you can access npm.js.org
4. **Restart terminal:** Close and reopen terminal window
5. **Clear cache:** `npm cache clean --force`
6. **Reinstall:** `rm -rf node_modules && npm install`

---

**You're all set! Good luck with your hackathon demo! 🚀**
