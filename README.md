# Cool Fun Guy League Dashboard

A private dynasty fantasy football league dashboard that displays team rosters, contracts, and salary cap information.

## Features

- 🏈 **Team Overview** - View all 14 teams organized by division
- 💰 **Salary Cap Tracking** - Monitor cap space with soft/hard cap visualization
- 📋 **Contract Management** - Track player salaries, years, and contract types
- 📊 **Buyout Calculator** - See dead cap implications before cutting players
- 🔒 **Password Protected** - Simple authentication for league members only

## Tech Stack

- **Next.js 14** - React framework with App Router
- **Tailwind CSS** - Utility-first styling
- **Sleeper API** - Live roster and player data
- **Vercel** - Hosting (free tier)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn

### Installation

1. Navigate to the dashboard directory:
   ```bash
   cd dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env.local
   ```

4. Edit `.env.local` and set your password:
   ```
   LEAGUE_PASSWORD=your-secret-password
   NEXT_PUBLIC_LEAGUE_ID=1257434648649146369
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

## Deployment to Vercel

### Option A: Deploy via Vercel Dashboard (Easiest)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub
3. Click "Add New Project" and import your repository
4. Set the **Root Directory** to `dashboard`
5. Add environment variable:
   - `LEAGUE_PASSWORD` = your chosen password
6. Click "Deploy"

### Option B: Deploy via CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   cd dashboard
   vercel
   ```

3. Add environment variable in Vercel dashboard or via CLI:
   ```bash
   vercel env add LEAGUE_PASSWORD
   ```

## Managing Contracts

Contract data is stored in `src/data/contracts.json`. Update this file after:
- Draft picks and signings
- Trades
- Arbitration decisions
- Buyouts

### Contract JSON Structure

```json
{
  "season": "2025",
  "lastUpdated": "2025-01-01",
  "contracts": {
    "PLAYER_ID": {
      "playerId": "PLAYER_ID",
      "salary": 25,
      "yearsTotal": 4,
      "yearsRemaining": 2,
      "type": "auction",
      "rosterId": 3,
      "notes": "Optional notes"
    }
  },
  "buyouts": {
    "PLAYER_ID": {
      "playerId": "PLAYER_ID",
      "amount": 3,
      "yearsRemaining": 2,
      "originalSalary": 15,
      "rosterId": 3
    }
  }
}
```

### Contract Types
- `auction` - Standard auction draft contract
- `elc` - Entry-Level Contract (practice squad, $1/year)
- `arbitration` - Arbitration-signed contract

### Finding Player IDs

Player IDs come from Sleeper. You can find them by:
1. Looking at roster data in the Sleeper API
2. Checking the network tab when viewing a player on sleeper.app

## Cap Rules (from Dynasty Rulebook)

- **Soft Cap**: $200
- **Hard Cap**: $220
- **Cap Fee**: $3 for every $1 over soft cap during active weeks
- **Buyout**: 40% of remaining contract value, spread over n+1 years
- **Contract Years**: 40 total years to allocate
- **Max Term**: 5 years per player
- **ELC**: 3 years at $1/year

## Project Structure

```
dashboard/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Login page
│   │   ├── dashboard/page.tsx    # Team overview
│   │   ├── team/[rosterId]/      # Team detail pages
│   │   └── api/auth/             # Authentication
│   ├── components/               # React components
│   ├── lib/                      # API clients & utilities
│   └── data/
│       └── contracts.json        # Contract data
├── package.json
└── README.md
```

## Updating Data

After making changes to `contracts.json`:

1. Commit and push to GitHub
2. Vercel will automatically redeploy

Or for local testing:
1. Edit `src/data/contracts.json`
2. The dev server will hot-reload

---

Built for the Cool Fun Guy League 🏆





