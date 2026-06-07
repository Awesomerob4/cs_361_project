// State Management
let state = {
    balance: 750.45,
    transactions: [
        { id: "1", name: "Chipotle", amount: 11.99, time: "12:00", place: "Chipotle", category: "Food", date: "4/15/26" },
        { id: "2", name: "OSU PARK", amount: 7.00, time: "14:00", place: "Campus", category: "Fees", date: "4/16/26" },
        { id: "3", name: "Sinclair", amount: 13.47, time: "16:00", place: "Gas Station", category: "Gas", date: "4/17/26" },
        { id: "4", name: "Chipotle", amount: 11.99, time: "18:00", place: "Chipotle", category: "Food", date: "4/17/26" }
    ]
};

// Initialize App
function initApp() {
    loadState();
    updateUI();
    setupEventListeners();
}

// Load state from localStorage
function loadState() {
    const savedState = localStorage.getItem('walletWatchState');
    if (savedState) {
        state = JSON.parse(savedState);
    }
}

// Save state to localStorage
function saveState() {
    localStorage.setItem('walletWatchState', JSON.stringify(state));
}

// UI Updates
function updateUI() {
    renderBalance();
    renderTransactions();
    renderRecent();
}

function renderBalance() {
    const balanceEl = document.getElementById('current-balance');
    if (balanceEl) balanceEl.textContent = formatCurrency(state.balance);
}

function formatCurrency(amount) {
    return '$' + parseFloat(amount).toFixed(2);
}

function renderRecent() {
    const recentEl = document.getElementById('recent-transaction');
    if (!recentEl) return;
    
    if (state.transactions.length > 0) {
        const latest = state.transactions[state.transactions.length - 1];
        recentEl.textContent = `${latest.name} | ${latest.amount.toFixed(2)} | ${latest.category} | ${latest.date}`;
    } else {
        recentEl.textContent = 'No recent transactions';
    }
}

function renderTransactions() {
    const listEl = document.getElementById('transactions-list');
    const emptyStateEl = document.getElementById('empty-state');
    
    if (!listEl) return;
    
    listEl.innerHTML = '';
    
    if (state.transactions.length === 0) {
        emptyStateEl.style.display = 'block';
        listEl.style.display = 'none';
    } else {
        emptyStateEl.style.display = 'none';
        listEl.style.display = 'block';
        
        // Render from newest to oldest
        [...state.transactions].reverse().forEach(tx => {
            const li = document.createElement('li');
            li.textContent = `${tx.name} | ${tx.amount.toFixed(2)} | ${tx.category} | ${tx.date}`;
            listEl.appendChild(li);
        });
    }
}

// Navigation
function navigateTo(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
    
    if (pageId === 'home-page') {
        const form = document.getElementById('add-expense-form');
        if (form) form.reset();
        const msg = document.getElementById('scan-message');
        if (msg) msg.classList.remove('show');
    }

    if (pageId === 'demo-page') {
        // Pre-fill datetime-local default (tomorrow's date at 12:00 PM local time)
        const tom = new Date();
        tom.setDate(tom.getDate() + 1);
        tom.setHours(12, 0, 0, 0);
        const formatDateTime = tom.toISOString().slice(0, 16);
        const dueInput = document.getElementById('rem-due');
        if (dueInput && !dueInput.value) {
            dueInput.value = formatDateTime;
        }
        
        // Show current transaction list values
        const statsInputsListEl = document.getElementById('stats-inputs-list');
        const amounts = state.transactions.map(t => t.amount);
        if (statsInputsListEl) {
            statsInputsListEl.textContent = amounts.length > 0 ? `[${amounts.join(', ')}]` : '[] (Will use default: [12.50, 45.00, 8.75, 120.00, 15.25])';
        }
        
        const modeInputsListEl = document.getElementById('mode-inputs-list');
        const categories = state.transactions.map(t => t.category);
        if (modeInputsListEl) {
            modeInputsListEl.textContent = categories.length > 0 ? `[${categories.map(c => `"${c}"`).join(', ')}]` : '[] (Will use default: ["Food", "Bills", "Food", "Gas", "Food", "Shopping", "Bills"])';
        }
    }
}

// Event Listeners
function setupEventListeners() {
    const addForm = document.getElementById('add-expense-form');
    if (addForm) {
        addForm.addEventListener('submit', handleAddExpense);
    }
    
    const updateForm = document.getElementById('update-balance-form');
    if (updateForm) {
        updateForm.addEventListener('submit', handleDeposit);
    }
}

// Actions
function handleAddExpense(e) {
    e.preventDefault();
    
    const nameInput = document.getElementById('expense-name').value.trim();
    const amountInput = parseFloat(document.getElementById('expense-amount').value);
    const timeInput = document.getElementById('expense-time').value;
    const placeInput = document.getElementById('expense-place').value.trim();
    const categoryInput = document.getElementById('expense-category').value;
    
    if (!nameInput) {
        alert('Name cannot be empty.');
        return;
    }
    if (isNaN(amountInput) || amountInput <= 0) {
        alert('Please enter a valid amount.');
        return;
    }
    
    // Create current date in m/d/yy format
    const today = new Date();
    const dateStr = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear().toString().slice(-2)}`;
    
    const transaction = {
        id: Date.now().toString(),
        name: nameInput,
        amount: amountInput,
        time: timeInput,
        place: placeInput,
        category: categoryInput,
        date: dateStr
    };
    
    state.transactions.push(transaction);
    state.balance -= amountInput;
    
    saveState();
    updateUI();
    
    e.target.reset();
    navigateTo('home-page');
}

function handleDeposit(e) {
    e.preventDefault();
    
    const amountInput = parseFloat(document.getElementById('deposit-amount').value);
    
    if (isNaN(amountInput) || amountInput <= 0) {
        alert('Please enter a valid deposit amount.');
        return;
    }
    
    state.balance += amountInput;
    
    saveState();
    updateUI();
    
    e.target.reset();
    navigateTo('home-page');
}

function cancelExpense() {
    const isConfirmed = confirm("Are you sure you want to cancel? Data will be lost.");
    if (isConfirmed) {
        document.getElementById('add-expense-form').reset();
        navigateTo('home-page');
    }
}

function scanReceipt() {
    const msg = document.getElementById('scan-message');
    msg.classList.add('show');
}

// Boot up
document.addEventListener('DOMContentLoaded', initApp);

// =========================================================================
// Microservice Event Triggers for Demo Page
// =========================================================================

// Calls the Notification/Reminder Microservice on port 5001
async function triggerBillReminder() {
    const loadingEl = document.getElementById('rem-loading');
    const errorEl = document.getElementById('rem-error');
    const successEl = document.getElementById('rem-success');
    
    loadingEl.style.display = 'block';
    errorEl.style.display = 'none';
    successEl.style.display = 'none';
    
    const userId = document.getElementById('rem-userid').value;
    const msg = document.getElementById('rem-msg').value;
    const due = document.getElementById('rem-due').value;
    const priority = document.getElementById('rem-priority').value;
    const method = document.getElementById('rem-method').value;
    
    try {
        // Request made to Notification/Reminder Microservice
        const res = await createBillReminder(userId, msg, due, priority, method);
        
        loadingEl.style.display = 'none';
        successEl.style.display = 'block';
        successEl.innerHTML = `
            <strong>Success Response:</strong><br>
            • Reminder ID: <code>${res.reminder_id}</code><br>
            • Status: <code>${res.status}</code><br>
            • Due: <code>${res.due_date_time}</code><br>
            • Priority: <code>${res.priority}</code><br>
            • Msg: "${res.message}"
        `;
    } catch (err) {
        loadingEl.style.display = 'none';
        errorEl.style.display = 'block';
        errorEl.textContent = `Error: ${err.message}. Make sure the Notification/Reminder Microservice is running on port 5001.`;
    }
}

// Calls the Statistics Microservice on port 5003
async function triggerSpendingStatistics() {
    const loadingEl = document.getElementById('stats-loading');
    const errorEl = document.getElementById('stats-error');
    const successEl = document.getElementById('stats-success');
    
    loadingEl.style.display = 'block';
    errorEl.style.display = 'none';
    successEl.style.display = 'none';
    
    const threshold = parseFloat(document.getElementById('stats-threshold').value) || 0;
    
    // Use transaction amounts from state, fall back to default if list is empty
    let amounts = state.transactions.map(t => t.amount);
    if (amounts.length === 0) {
        amounts = [12.50, 45.00, 8.75, 120.00, 15.25];
    }
    
    try {
        // Request made to Statistics Microservice
        const res = await fetchSpendingStatistics(amounts, threshold);
        
        loadingEl.style.display = 'none';
        successEl.style.display = 'block';
        successEl.innerHTML = `
            <strong>Analysis Results:</strong><br>
            • Threshold: <code>$${threshold.toFixed(2)}</code><br>
            • Transactions &ge; Threshold: <code>${res.thresholdCount} (${res.thresholdPercent}%)</code><br>
            • Largest Amount: <code>$${res.maxAmount.toFixed(2)}</code><br>
            • Smallest Amount: <code>$${res.minAmount.toFixed(2)}</code>
        `;
    } catch (err) {
        loadingEl.style.display = 'none';
        errorEl.style.display = 'block';
        errorEl.textContent = `Error: ${err.message}. Make sure the Statistics Microservice is running on port 5003.`;
    }
}

// Calls the Mode Microservice on port 6000
async function triggerMostFrequentCategory() {
    const loadingEl = document.getElementById('mode-loading');
    const errorEl = document.getElementById('mode-error');
    const successEl = document.getElementById('mode-success');
    
    loadingEl.style.display = 'block';
    errorEl.style.display = 'none';
    successEl.style.display = 'none';
    
    // Use categories from state, fall back to default if empty
    let categories = state.transactions.map(t => t.category);
    if (categories.length === 0) {
        categories = ["Food", "Bills", "Food", "Gas", "Food", "Shopping", "Bills"];
    }
    
    try {
        // Request made to Mode Microservice
        const res = await fetchMostFrequentCategory(categories);
        
        // Format Rankings
        let rankingsHtml = '';
        if (res.rankings && res.rankings.length > 0) {
            rankingsHtml = '<div style="margin-top: 8px; font-weight: bold;">Category Rankings:</div>';
            res.rankings.forEach(([cat, freq]) => {
                rankingsHtml += `• <code>${cat}</code>: ${freq} times<br>`;
            });
        }
        
        loadingEl.style.display = 'none';
        successEl.style.display = 'block';
        successEl.innerHTML = `
            <strong>Analysis Results:</strong><br>
            • Most Frequent Category: <code>${res.modeValues.join(', ')}</code><br>
            • Frequency: <code>${res.modeFrequency} times</code><br>
            ${rankingsHtml}
        `;
    } catch (err) {
        loadingEl.style.display = 'none';
        errorEl.style.display = 'block';
        errorEl.textContent = `Error: ${err.message}. Make sure the Mode Microservice is running on port 6000.`;
    }
}

// Calls the Message Broadcast System on port 8000
async function triggerBroadcastMessages() {
    const loadingEl = document.getElementById('alerts-loading');
    const errorEl = document.getElementById('alerts-error');
    const successEl = document.getElementById('alerts-success');
    
    loadingEl.style.display = 'block';
    errorEl.style.display = 'none';
    successEl.style.display = 'none';
    
    try {
        // Request made to Message Broadcast Microservice
        const messages = await fetchBroadcastMessages();
        
        loadingEl.style.display = 'none';
        successEl.style.display = 'block';
        successEl.innerHTML = '<strong>Broadcast Alerts:</strong>';
        
        Object.entries(messages).forEach(([id, text]) => {
            const item = document.createElement('div');
            item.className = 'box-border';
            item.style.padding = '8px';
            item.style.background = '#fff3cd';
            item.style.border = '1px solid #ffeeba';
            item.style.color = '#856404';
            item.style.borderRadius = '4px';
            item.style.marginTop = '5px';
            item.style.fontSize = '0.85rem';
            item.innerHTML = `
                <div style="font-weight: bold; font-size: 0.75rem; color: #666; margin-bottom: 2px;">Alert ID: ${id}</div>
                <div>⚠️ ${text}</div>
            `;
            successEl.appendChild(item);
        });
    } catch (err) {
        loadingEl.style.display = 'none';
        errorEl.style.display = 'block';
        errorEl.textContent = `Error: ${err.message}. Make sure the Message Broadcast Microservice is running on port 8000.`;
    }
}
