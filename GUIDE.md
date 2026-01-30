# watsonx MindShare Dashboard - Hackathon Edition

## 🚀 Quick Start

### Features Implemented

✅ **User Authentication**
- Login/Register system with auto-registration on first login
- Session management with localStorage
- User profile display

✅ **Team Management**
- Create teams and assign members
- Add/remove team members
- Team-based filtering
- Member roles (Lead, Member)

✅ **Dashboard Overview**
- Real-time metrics (Efficiency, Tasks, Views, Revenue)
- Trend indicators for each metric
- Responsive grid layout

✅ **Advanced Charts & Analytics**
- Workload distribution (Bar chart)
- Input sources timeline (Line chart)
- Activity distribution (Bar chart)
- Doughnut/Pie charts
- Metrics matrix (Scatter chart)

✅ **Timeframe Filtering**
- This Week
- This Month
- Custom Range
- Auto-refresh metrics based on selected timeframe

✅ **Fast Data Refresh**
- SWR pattern for quick data updates
- Only data refresh, not full page reload
- 500ms simulated API latency for realistic UX

✅ **Data Sources Integration Panel**
- Google Calendar connection status
- Email, Slack, Cloud Storage, Database integrations
- Calendar event preview
- Connection status indicator

✅ **AI Suggestions Engine**
- Smart recommendations based on metrics
- Priority-based suggestions (High/Medium/Low)
- Action buttons for quick navigation

✅ **Responsive Sidebar**
- Mobile-friendly navigation
- User profile section
- Settings and support links
- Logout functionality

---

## 📁 Project Structure

```
/
├── app/
│   ├── page.tsx                 # Landing redirect
│   ├── login/
│   │   └── page.tsx             # Login/Register page
│   ├── dashboard/
│   │   ├── page.tsx             # Main dashboard
│   │   └── loading.tsx          # Loading fallback
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Global styles
├── components/
│   ├── sidebar.tsx              # Navigation sidebar
│   ├── metric-card.tsx          # Metric display card
│   ├── dashboard-charts.tsx     # All chart visualizations
│   ├── timeframe-selector.tsx   # Timeframe filter
│   ├── teams-manager.tsx        # Team CRUD operations
│   ├── data-sources-panel.tsx   # Data source connections
│   ├── ai-suggestions.tsx       # AI recommendations
│   └── ui/                      # shadcn/ui components
├── lib/
│   ├── auth.ts                  # Authentication logic
│   ├── teams.ts                 # Team management
│   └── dashboard.ts             # Data generation & helpers
└── package.json
```

---

## 🔑 Key Features Explained

### 1. **Authentication System** (`/lib/auth.ts`)
```typescript
// Auto-register on first login
const user = authenticateUser(email, password);

// Session persists across refreshes
setCurrentUser(user);

// Get current user anywhere
const user = getCurrentUser();
```

### 2. **Team Management** (`/lib/teams.ts`)
```typescript
// Create a team
createTeam('Team A', 'Description', userId, userName);

// Add members to teams
addMemberToTeam(teamId, member);

// Remove members
removeMemberFromTeam(teamId, memberId);
```

### 3. **Dynamic Dashboard Metrics** (`/lib/dashboard.ts`)
```typescript
// Generate random metrics
generateDashboardMetrics(timeframe);

// Get timeframe label
getTimeframeLabel('thisWeek'); // "1/26/2025 - 2/1/2025"
```

### 4. **Fast Refresh Pattern**
```typescript
const handleRefresh = async () => {
  setIsRefreshing(true);
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API
  loadData(); // Only refresh data, not page
  setIsRefreshing(false);
};
```

---

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#3B82F6)
- **Secondary**: Purple (#A855F7)
- **Accent**: Cyan (#06B6D4), Orange (#F97316), Pink (#EC4899)
- **Background**: Slate-900, Slate-800, Slate-700
- **Text**: White, Slate-300, Slate-400

### Typography
- **Headings**: Geist Bold
- **Body**: Geist Regular
- **Mono**: Geist Mono (for code)

### Responsive Design
- Mobile-first approach
- Sidebar toggles on mobile
- Grid layouts adapt to screen size
- Touch-friendly buttons (44px minimum)

---

## 🔄 Data Flow

### Authentication Flow
```
[Login Page] 
    ↓
[Authenticate/Auto-Register]
    ↓
[Set Current User in localStorage]
    ↓
[Redirect to Dashboard]
```

### Dashboard Data Flow
```
[User Loads Dashboard]
    ↓
[Get Current User from localStorage]
    ↓
[Generate Metrics (random data)]
    ↓
[Load Teams from localStorage]
    ↓
[Display Charts & Cards]
    ↓
[User Clicks Refresh]
    ↓
[Generate New Metrics (500ms delay)]
    ↓
[Update UI (SWR pattern)]
```

### Team Management Flow
```
[Create Team Dialog]
    ↓
[Add Team to localStorage]
    ↓
[Display in Teams Grid]
    ↓
[Add Members via Email]
    ↓
[Display Team Members List]
    ↓
[Remove Members - Auto Save]
```

---

## 📊 Metrics Explained

### Efficiency (%)
- Range: 85-98%
- Represents team productivity level
- Green trend indicator shows improvement

### Active Tasks (Number)
- Range: 2000-2500 tasks
- Count of ongoing tasks
- Trend shows increase/decrease

### Total Views (Number)
- Range: 30000-32000 views
- Dashboard/content engagement metrics
- Purple gradient indicator

### Revenue ($)
- Range: $2000-$3200
- Revenue metrics
- Pink gradient card
- Uses currency formatting

---

## 🎯 Testing Checklist

- [ ] Login with new email (auto-registers)
- [ ] Login again with same email (authenticates)
- [ ] Create a team
- [ ] Add multiple members to team
- [ ] Remove a member
- [ ] Change timeframe (metrics update)
- [ ] Click refresh button (see loading state)
- [ ] Switch between Overview/Teams/Sources tabs
- [ ] Connect/disconnect data sources
- [ ] View AI suggestions
- [ ] Check all charts render correctly
- [ ] Logout and verify redirect to login
- [ ] Test on mobile (sidebar toggle)

---

## 🚀 Deployment

### Build
```bash
npm run build
```

### Deploy to Vercel
```bash
# Using Vercel CLI
vercel

# Or push to GitHub and connect to Vercel
```

### Environment
- No external env vars required
- Data stored in browser's localStorage
- Works offline (data persists)

---

## 🔮 Future Enhancements

1. **Database Integration**
   - Replace localStorage with Neon PostgreSQL
   - Implement real authentication with bcrypt
   - Add RLS policies for security

2. **Real AI Integration**
   - Connect to Groq or OpenAI for actual suggestions
   - Implement natural language processing
   - Add predictive analytics

3. **Calendar Integration**
   - Connect to Google Calendar API
   - Fetch real calendar events
   - Schedule team meetings

4. **Slack Integration**
   - Send notifications to Slack
   - Receive metrics updates
   - Slack commands for dashboard access

5. **Export Features**
   - Download metrics as PDF
   - Export team reports
   - Schedule email reports

6. **Collaboration**
   - Real-time updates with WebSocket
   - Comments on metrics
   - Team comments feed

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Components**: shadcn/ui
- **Charts**: Recharts
- **Icons**: Lucide React
- **Storage**: Browser localStorage
- **Authentication**: Custom (JWT-like tokens)

---

## 📝 Notes

- All data is stored in browser's localStorage
- Metrics are randomly generated for demo purposes
- No backend API calls (works completely client-side)
- Refresh is instant (500ms simulated delay for realism)
- Teams and members persist across sessions
- Login state is preserved until logout

---

## 🤝 Contributing

This is a hackathon project. Feel free to fork and extend with:
- Real database integration
- Live API connections
- Advanced ML features
- Mobile app version

---

**Built for hackathons. Powered by Next.js + React.**
