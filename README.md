# Rock Paper Scissors Management Application

A web application for managing Rock Paper Scissors tournaments between students. Built with React, TypeScript, Vite, and Firebase.

## Features

- **Student Import**: Import students from a newline-separated text format.
- **Player Management**: A comprehensive list of all players with their match counts, status (active/eliminated), and other details. Players can be sorted by name, match count, or status, and filtered by name.
- **Match Recording**: Interface to record Rock Paper Scissors match results between two students, including their choices (Rock, Paper, or Scissors).
- **Match History**: View and manage all recorded matches with results history.
- **Match Deletion**: Ability to delete recorded matches, which also reverts the elimination of the losing player.
- **Match Statistics**: View statistics on wins, losses, and ties for each choice (Rock, Paper, Scissors).
- **Tournament Overview**: A banner that shows the current status of the tournament, including the number of active and eliminated players, and the tournament winner.
- **Responsive Design**: The application is designed to work on both desktop and mobile devices.
- **Real-time Data**: Uses Firebase Firestore for real-time data synchronization.
- **Tournament Bracket (Disabled)**: A visual representation of the tournament bracket is implemented but currently disabled. The README includes instructions on how to re-enable it.

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Firebase (Firestore Database)
- **Deployment**: Firebase Hosting
- **CI/CD**: GitHub Actions

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase CLI
- A Firebase project

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd rock-paper-scissors
```

2. Install dependencies:
```bash
npm install
```

3. Set up Firebase:
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Firestore Database
   - Enable Firebase Hosting
   - Update `.firebaserc` with your project ID
   - Update GitHub Actions workflow files with your project ID

4. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Fill in your Firebase configuration values

5. Deploy Firestore rules:
```bash
firebase deploy --only firestore:rules
```

### Development

Run the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

### Deployment

The application is configured for automatic deployment using GitHub Actions:

- **Pull Requests**: Creates preview deployments
- **Main Branch**: Deploys to production

Manual deployment:
```bash
firebase deploy
```

## Usage

### 1. Import Students
- Navigate to the "Import Students" tab
- Paste student names in the textarea (one name per line)
- Click "Import Students"

### 2. Record Matches
- Navigate to the "Record Match" tab
- Search and select Player 1
- Search and select Player 2
- Choose each player's choice (Rock, Paper, or Scissors)
- Click "Record Match"

### 3. View Results
- Navigate to the "View Results" tab
- See all recorded matches with:
  - Player names
  - Their choices
  - Match result (winner or tie)
  - Timestamp

## Firebase Configuration

### Firestore Collections

The application uses two main collections:

#### `students`
```typescript
{
  id: string;
  name: string;
  createdAt: Timestamp;
}
```

#### `matches`
```typescript
{
  id: string;
  player1Id: string;
  player1Name: string;
  player1Choice: 'rock' | 'paper' | 'scissors';
  player2Id: string;
  player2Name: string;
  player2Choice: 'rock' | 'paper' | 'scissors';
  result: 'win' | 'lose' | 'tie';
  winner?: string;
  createdAt: Timestamp;
}
```

### Security Rules

The application includes basic Firestore security rules in `firestore.rules`. For production, consider implementing proper authentication and more restrictive rules.

## GitHub Actions Setup

To enable automatic deployment:

1. Add the following secrets to your GitHub repository:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBAE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `FIREBASE_SERVICE_ACCOUNT_KEY` (JSON key from Firebase project settings)

2. Update the `projectId` in the GitHub Actions workflow files

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## How to re-enable the tournament bracket

The tournament bracket has been commented out from the UI. To re-enable it, you need to uncomment the following parts in `src/App.tsx`:

1.  **Mobile navigation button:**

    Remove the ` {/* ` and ` */}`
    ```tsx
    {/*<button 
        className={`w-full text-left px-4 py-3 rounded-lg font-semibold text-sm transition-all duration-200 ${
        activeTab === 'flowchart' 
            ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md' 
            : 'text-gray-700 hover:bg-gray-50'
        }`}
        onClick={() => handleTabChange('flowchart')}
    >
        🏆 Tournament Bracket
    </button>*/}
    ```

2.  **Desktop navigation button:**

    Remove the ` {/* ` and ` */}`
    ```tsx
    {/*<button 
        className={`flex-1 px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-semibold text-sm transition-all duration-200 ${
        activeTab === 'flowchart' 
            ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md border-2 border-cyan-500' 
            : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300 shadow-sm'
        }`}
        onClick={() => handleTabChange('flowchart')}
    >
        🏆 Tournament Bracket
    </button>*/}
    ```

3.  **Component rendering:**
    Remove the ` {/* ` and ` */}`
    ```tsx
    {/*{activeTab === 'flowchart' && (
        <MatchFlowChart key={refreshKey} />
    )}*/}
    ```
## License

This project is licensed under the MIT License.