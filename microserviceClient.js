// microserviceClient.js
// Client API helper for calling the CS361 Microservices

const REMINDER_SERVICE_URL = "http://127.0.0.1:5001";
const STATISTICS_SERVICE_URL = "http://127.0.0.1:5003";
const MODE_SERVICE_URL = "http://127.0.0.1:6000";
const MESSAGE_SERVICE_URL = "http://127.0.0.1:8000";

// ==========================================
// 1. Notification/Reminder Microservice
// Calls the Flask Notification/Reminder Microservice on port 5001
// ==========================================
async function createBillReminder(userId, message, dueDateTime, priority, notificationMethod) {
    console.log(`[Reminder Service Request] POST ${REMINDER_SERVICE_URL}/reminders`, {
        user_id: userId,
        reminder_message: message,
        due_date_time: dueDateTime,
        priority: priority,
        notification_method: notificationMethod
    });
    
    // Programmatic HTTP request/response communication
    const response = await fetch(`${REMINDER_SERVICE_URL}/reminders`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            user_id: userId,
            reminder_message: message,
            due_date_time: dueDateTime,
            priority: priority,
            notification_method: notificationMethod
        })
    });
    
    if (!response.ok) {
        throw new Error(`Reminder microservice returned error: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`[Reminder Service Response]`, data);
    return data;
}

// ==========================================
// 2. Statistics Microservice
// Calls the FastAPI Statistics Microservice on port 5002
// ==========================================
async function fetchSpendingStatistics(amounts, threshold) {
    console.log(`[Statistics Service Request] Posting to port 5002 with data:`, amounts, `threshold:`, threshold);
    
    // Programmatic HTTP request/response communication to threshold, max, and min endpoints
    const thresholdUrl = `${STATISTICS_SERVICE_URL}/threshold/?threshold=${threshold}`;
    const maxUrl = `${STATISTICS_SERVICE_URL}/max/`;
    const minUrl = `${STATISTICS_SERVICE_URL}/min/`;
    
    const [thresholdRes, maxRes, minRes] = await Promise.all([
        fetch(thresholdUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: amounts })
        }),
        fetch(maxUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: amounts })
        }),
        fetch(minUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: amounts })
        })
    ]);
    
    if (!thresholdRes.ok || !maxRes.ok || !minRes.ok) {
        throw new Error("Statistics microservice returned an error during analysis.");
    }
    
    const thresholdData = await thresholdRes.json();
    const maxData = await maxRes.json();
    const minData = await minRes.json();
    
    const results = {
        thresholdCount: thresholdData.result,
        thresholdPercent: thresholdData.percent,
        maxAmount: maxData.result,
        minAmount: minData.result
    };
    
    console.log(`[Statistics Service Response]`, results);
    return results;
}

// ==========================================
// 3. Mode Microservice
// Calls the FastAPI Mode Microservice on port 6000
// ==========================================
async function fetchMostFrequentCategory(categories) {
    console.log(`[Mode Service Request] Posting to port 6000 with categories:`, categories);
    
    // Programmatic HTTP request/response communication to mode and frequency endpoints
    const modeUrl = `${MODE_SERVICE_URL}/mode/`;
    const freqUrl = `${MODE_SERVICE_URL}/frequency/`;
    
    const [modeRes, freqRes] = await Promise.all([
        fetch(modeUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: categories })
        }),
        fetch(freqUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: categories })
        })
    ]);
    
    if (!modeRes.ok || !freqRes.ok) {
        throw new Error("Mode microservice returned an error during mode/frequency analysis.");
    }
    
    const modeData = await modeRes.json();
    const freqData = await freqRes.json();
    
    const results = {
        modeValues: modeData.result,
        modeFrequency: modeData.frequency,
        rankings: freqData // Array of [category, count]
    };
    
    console.log(`[Mode Service Response]`, results);
    return results;
}

// ==========================================
// 4. Message Broadcast System
// Calls the FastAPI Message Broadcast Microservice on port 8000
// ==========================================
async function fetchBroadcastMessages() {
    const appName = "walletwatch";
    console.log(`[Broadcast Service Request] GET ${MESSAGE_SERVICE_URL}/messages/${appName}/all`);
    
    // Programmatic HTTP request/response communication
    let response = await fetch(`${MESSAGE_SERVICE_URL}/messages/${appName}/all`);
    
    if (response.status === 404) {
        console.log(`[Broadcast Service] No messages found. Seeding default messages...`);
        // Seed some messages if none exist
        const defaultMessages = [
            "You are close to your monthly budget limit.",
            "Remember to review your weekly spending.",
            "New savings tip: reduce repeated small purchases."
        ];
        
        for (const msg of defaultMessages) {
            await fetch(`${MESSAGE_SERVICE_URL}/messages/${appName}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ data: msg })
            });
        }
        
        // Fetch again after seeding
        response = await fetch(`${MESSAGE_SERVICE_URL}/messages/${appName}/all`);
    }
    
    if (!response.ok) {
        throw new Error(`Broadcast microservice returned error status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`[Broadcast Service Response]`, data);
    return data;
}
