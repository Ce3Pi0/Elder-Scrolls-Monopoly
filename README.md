# Elder-Scrolls-Monopoly
A stylized version of the classic Monopoly game with some additional rules changes to suit my preferences.

Folder Structure:
```
Elder-Scrolls-Monopoly/
├── public/
├── package.json
├── src/
│   ├── index.css
│   ├── main.tsx
│
│   ├── assets/
│   │   ├── icons/
│   │   ├── images/
│   │   └── music/
│
│   ├── classes/
│   │   └── classes.ts/	
│ 
│   ├── context/
│   │   ├── GameContext.tsx
│   │   └── GameReducer.ts
│
│   ├── interfaces/
│   │   └── interfaces.ts/
│
│   ├── data/
│   │   ├── chanceCards.json
│   │   ├── communityChestCards.json
│   │   └── rules.json
│
│   ├── utils/
│   │   └── utils.ts
│
│   └── pages/
│       ├── shared/
│       │   ├── css/
│       │   │   └── styles.css
│       │   │
│       │   ├── footer/
│       │   │   ├── components/
│       │   │   │   └── mainMenuButton.tsx
│       │   │   └── footer.tsx
│       │   └── header/
│       │       └── header.tsx
│
│       ├── home/
│       │   ├── css/
│       │   │   └── styles.css
│       │   ├── components/
│       │   │   └── body/
│       │   │       ├── leaderboardsButton.tsx
│       │   │       ├── playButton.tsx
│       │   │       └── body.tsx
│       │   └── home.tsx
│
│       ├── leaderboards/
│       │   ├── css/
│       │   │   └── styles.css
│       │   ├── components/
│       │   │   └── body/
│       │   │       ├── body.tsx
│       │   │       └── leaderboard.tsx
│       │   └── leaderboards.tsx
│
│       ├── gameSetup/
│       │   ├── css/
│       │   │   └── styles.css
│       │   ├── components/
│       │   │   └── body/
│       │   │       ├── body.tsx
│       │   │       ├── numberOfPlayersSection.tsx
│       │   │       ├── playerSection.tsx
│       │   │       ├── playerCompoent.tsx
│       │   │       └── startButton.tsx
│       │   └── gameSetup.tsx
│
│       ├── gameRules/
│       │   ├── css/
│       │   │   └── styles.css
│       │   ├── components/
│       │   │   ├── body.tsx
│       │   │   ├── page1.tsx
│       │   │   └── page2.tsx
│       │   └── gameRules.tsx
│
│       ├── game/
│       │   ├── css/
│       │   │   └── styles.css
│       │   ├── components/
│       │   │   ├── board/
│       │   │   │   ├── board.tsx
│       │   │   │   ├── cell.tsx
│       │   │   │   └── figure.tsx
│       │   │   ├── dicePanel/
│       │   │   │   ├── result.tsx
│       │   │   │   └── rollButton.tsx
│       │   │   └── playerPanel/
│       │   │       ├── exitButton.tsx
│       │   │       ├── footer.tsx
│       │   │       ├── mainMenuButton.tsx
│       │   │       ├── playerCard.tsx
│       │   │       ├── playerPanel.tsx
│       │   │       └── titleSection.tsx
│       │   ├── modals/
│       │   │   ├── deedModal/
│       │   │   │   ├── css/
│       │   │   │   │   └── deedModal.css
│       │   │   │   ├── components/
│       │   │   │   │   ├── body.tsx
│       │   │   │   │   ├── deed.tsx
│       │   │   │   │   ├── expandButton.tsx
│       │   │   │   │   ├── exitButton.tsx
│       │   │   │   │   ├── header.tsx
│       │   │   │   │   ├── location.tsx
│       │   │   │   │   ├── locationDeeds.tsx
│       │   │   │   │   └── tradeButton.tsx
│       │   │   │   └── deedModal.tsx
│       │   │   ├── deedExpandModal/
│       │   │   │   ├── css/
│       │   │   │   │   └── deedExpandModal.css
│       │   │   │   ├── components/
│       │   │   │   │   ├── body.tsx
│       │   │   │   │   ├── castle.tsx
│       │   │   │   │   ├── deed.tsx
│       │   │   │   │   ├── exitButton.tsx
│       │   │   │   │   ├── header.tsx
│       │   │   │   │   ├── house.tsx
│       │   │   │   │   └── tradeButton.tsx
│       │   │   │   └── deedExpandModal.tsx
│       │   │   └── tradeModal/
│       │   │       ├── css/
│       │   │       │   └── tradeModal.css
│       │   │       ├── components/
│       │   │       │   ├── currentPlayer.tsx
│       │   │       │   ├── currentPlayerOffer.tsx
│       │   │       │   ├── exitButton.tsx
│       │   │       │   ├── header.tsx
│       │   │       │   ├── otherPlayer.tsx
│       │   │       │   ├── otherPlayerOffer.tsx
│       │   │       │   ├── tradePanel.tsx
│       │   │       │   └── proposeButton.tsx
│       │   │       └── tradeModal.tsx
│       │   └── game.tsx
│
│       └── notFound/
│           ├── css/
│           │   └── styles.css
│           └── notFound.tsx

```
