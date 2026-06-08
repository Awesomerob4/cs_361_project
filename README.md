# Budget Tracker (CS 361 Milestone #1)

A simple, interactive Budget Tracker application built with plain HTML, CSS, and JavaScript.

## How to Run the App & Microservices

To fully run the Wallet Watch Tracker and its integrated microservices, you must launch all five processes in separate terminal windows:

### Prerequisites
Make sure you have Python installed. Install the necessary Python dependencies:
```bash
python -m pip install fastapi uvicorn pydantic aiosqlite pydantic-settings sqlalchemy asyncpg alembic
```

### Process Startup Layout
Open 5 separate terminals and run each command in its respective directory:

*   **Terminal 1: Wallet Watch Main Program**
    Simply open the project folder `c:\Users\robyd\OneDrive\Desktop\cs361\wallet watch\cs_361_project` and double-click `index.html` to run the frontend app in a web browser.
*   **Terminal 2: Notification/Reminder Microservice (Flask)**
    - Directory: `c:\Users\robyd\OneDrive\Desktop\cs361\reminder microservice\microservice-3`
    - Command: `python app.py`
    - Port: **5001**
*   **Terminal 3: Statistics Microservice (FastAPI)**
    - Directory: `c:\Users\robyd\OneDrive\Desktop\cs361\statistics microservice\Statistics`
    - Command: `python main.py`
    - Port: **5003** (Configured on 5003 to avoid local port 5000 conflicts)
*   **Terminal 4: Mode Microservice (FastAPI)**
    - Directory: `c:\Users\robyd\OneDrive\Desktop\cs361\mode microservice\Mode`
    - Command: `python main.py`
    - Port: **5004**
*   **Terminal 5: Message Broadcast Microservice (FastAPI)**
    - Directory: `c:\Users\robyd\OneDrive\Desktop\cs361\broadcast message microservice\osu_cs361-bp-microservice-BroadcastMessaging`
    - Command: `python -m uvicorn app.main:app --reload --port 8000`
    - Port: **8000** (Configured using a local SQLite database in .env)

## 3 Implemented User Stories (Functional Requirements)
1. **Add Expense Transaction**: Users can navigate to the "Add Expense" screen, enter valid expense details (description, amount, category, date), and click "Confirm". The transaction is saved to the history, and the current balance is decreased by the expense amount.
2. **View Transaction History**: Users can navigate to the "Transactions" screen to see all previously added transactions (with description, amount, category, date). If no transactions exist, a clear empty-state message is displayed.
3. **View and Update Balance**: The Home screen dynamically displays the current balance. Users can use the "Update Balance / Deposit" screen to enter a valid deposit amount to increase their balance.

## 8 Inclusivity Heuristics Reflected
* **IH#1 Explain benefits**: The Home page features a subtitle explaining that the app helps "Track your spending, review transactions, and easily monitor your balance to achieve your financial goals."
* **IH#2 Explain costs**: On the "Add Expense" screen, right below the Cancel button, there is a clear warning note: "Warning: Canceling will clear your current form entry."
* **IH#3 Let users gather as much information as they want, and no more**: The Home page is kept simple with just the balance and quick actions. The detailed list of past transactions is placed on a separate "Transactions" screen so the user isn't overwhelmed.
* **IH#4 Keep familiar features available**: Standard, familiar button labels are used ("Home", "Cancel", "Confirm", "Add Expense"). A prominent "Home" button with an icon is present in the top-left of every secondary screen.
* **IH#5 Make undo/redo and backtracking available**: The "Add Expense" screen includes a "Cancel" button and a "Home" button, allowing users to back out without saving an unwanted transaction.
* **IH#6 Provide an explicit path through the task**: The Add Expense form inputs are ordered logically top-to-bottom (Description -> Amount -> Category -> Date) and include clear labels and helper text below inputs.
* **IH#7 Provide ways to try out different approaches**: On the "Add Expense" screen, there is an alternative "Scan Receipt" button. When clicked, it displays a polite placeholder message explaining that the feature is coming later and to use manual entry for now.
* **IH#8 Encourage tinkerers to tinker mindfully**: The "Update Balance" screen includes an explanatory note (`ℹ️ You can manually update your balance...`) so users understand what the action will do. Additionally, the app prevents negative numbers to prevent users from accidentally corrupting their data.

## 3 Quality Attributes Reflected (Non-Functional Requirements)
1. **Usability**: The app features clear labels, short descriptive helper text under form inputs, and consistent navigation buttons on every screen.
2. **Reliability**: Input validation is enforced in JavaScript (e.g., `handleAddExpense` and `handleDeposit` functions) and via HTML5 constraints (`required`, `min="0.01"`). The app prevents empty descriptions, invalid amounts, and negative numbers from being processed.
3. **Maintainability**: The JavaScript logic in `app.js` is broken down into small, single-purpose functions with clear names (e.g., `loadState`, `updateUI`, `renderBalance`, `navigateTo`, `formatCurrency`). No logic is stuffed into one giant function.
