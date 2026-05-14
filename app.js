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
