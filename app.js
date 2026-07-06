// ==========================================================================
// 🚀 LEGIT MEDIA PLATFORM ARCHITECTURE ENGINE CONTROL NODE
// ==========================================================================

const SUPABASE_URL = "https://gfhbwybslaxgdzcqkzra.supabase.co"; 
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmaGJ3eWJzbGF4Z2R6Y3FrenJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5NzI1NDUsImV4cCI6MjA4NzU0ODU0NX0.EkmUwtBi9OiScuMt9PELS6-vDXgQVofvadJ8aLFvyKo";

// Fixed explicit initialization configurations specifying local session token permanence
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
    }
});

const PROXY_GATEWAY_URL = "https://new5sim.ebuvick0.workers.dev";
const TELEGRAM_PROXY_URL = "https://teletell.ebuvick0.workers.dev";

// Unified Runtime Application State Architecture
let state = {
    usdToNgnRate: 1450,
    selectedServiceCode: null,
    selectedServiceName: null,
    selectedCountryName: null,
    currentCountryOperatorsData: null,
    dynamicCountriesArray: [],
    cancelSecondsLeft: 30,
    expirySecondsLeft: 900
};

let userProfile = null;
let currentBalance = 0; 
let currentOrderId = null;
let currentTransactionId = null;
let smsTimer = null;
let countdownTimer = null;
let totalExpiryTimer = null;
let isOtpReceived = false;
let currentCalculatedPriceNaira = 0;

// High-Performance ISO-2 Flag Standardization Mapping Index
const COMPREHENSIVE_FLAG_MAP = {
    "russia": "ru", "usa": "us", "germany": "de", "nigeria": "ng", "united kingdom": "gb",
    "ukraine": "ua", "kazakhstan": "kz", "indonesia": "id", "malaysia": "my", "philippines": "ph",
    "vietnam": "vn", "thailand": "th", "brazil": "br", "colombia": "co", "egypt": "eg",
    "india": "in", "france": "fr", "spain": "es", "netherlands": "nl", "south africa": "za",
    "kenya": "ke", "ghana": "gh", "morocco": "ma", "canada": "ca", "australia": "au"
};

const PLATFORM_SERVICES = [
    { code: "whatsapp", name: "WhatsApp", color: "#25D366", icon: "whatsapp" },
    { code: "telegram", name: "Telegram", color: "#26A5E4", icon: "telegram" },
    { code: "google", name: "Google / YouTube", color: "#EA4335", icon: "google" },
    { code: "facebook", name: "Facebook Meta", color: "#1877F2", icon: "facebook" },
    { code: "instagram", name: "Instagram", color: "#E1306C", icon: "instagram" },
    { code: "tiktok", name: "TikTok", color: "#000000", icon: "tiktok" },
    { code: "twitter", name: "X / Twitter", color: "#000000", icon: "x" },
    { code: "openai", name: "OpenAI / ChatGPT", color: "#10A37F", icon: "openai" },
    { code: "microsoft", name: "Outlook / Office", color: "#F25022", icon: "microsoft" },
    { code: "netflix", name: "Netflix Premium", color: "#E50914", icon: "netflix" },
    { code: "apple", name: "Apple ID iCloud", color: "#A2AAAD", icon: "apple" },
    { code: "amazon", name: "Amazon Marketplace", color: "#FF9900", icon: "amazon" },
    { code: "snapchat", name: "Snapchat", color: "#FFFC00", icon: "snapchat" }
];

// ==========================================
// 📡 TELEMETRY INTERCEPT AUDITING LOGGER
// ==========================================
async function dispatchAuditLog(actionName, detailMessage, logStatus = "INFO") {
    const userEmail = userProfile ? userProfile.email : "Unauthenticated Guest";
    const telemetryEndpoint = `${TELEGRAM_PROXY_URL}/?email=${encodeURIComponent(userEmail)}&action=${encodeURIComponent(actionName)}&detail=${encodeURIComponent(detailMessage)}&status=${encodeURIComponent(logStatus)}`;
    try {
        await fetch(telemetryEndpoint);
    } catch (e) { console.error("Telemetry failure:", e); }
}

// ==========================================
// 🌓 THEME STORAGE CONTROLLER
// ==========================================
function applyTheme(theme) {
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        const iconInd = document.getElementById('theme-icon-indicator');
        if(iconInd) iconInd.innerText = "🌙 Dark";
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.classList.remove('dark');
        const iconInd = document.getElementById('theme-icon-indicator');
        if(iconInd) iconInd.innerText = "☀️ Light";
        localStorage.setItem('theme', 'light');
    }
}

function initializeThemeSystem() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        applyTheme(prefersDark ? 'dark' : 'light');
    }
}

function toggleTheme() {
    const isCurrentlyDark = document.documentElement.classList.contains('dark');
    applyTheme(isCurrentlyDark ? 'light' : 'dark');
}

// ==========================================
// 🛡️ AUTHENTICATION INTEGRITY LAYER (STABLE ENGINE)
// ==========================================
async function checkAuthSession() {
    showSpinner(true);
    try {
        // Fetch session tokens sequentially from storage nodes
        const { data: { user }, error: authError } = await sb.auth.getUser();
        
        if (authError || !user) {
            console.warn("Auth token mapping invalid. Routing back to session authorization interface...");
            showSpinner(false);
            window.location.href = "login.html";
            return;
        }

        userProfile = user;
        
        const badgeElement = document.getElementById('user-profile-badge');
        if (badgeElement && userProfile.email) {
            badgeElement.innerText = userProfile.email.substring(0, 2).toUpperCase();
            badgeElement.title = userProfile.email;
        }

        // Fetch user wallet data balance context cleanly
        const { data: profileData, error: profileErr } = await sb
            .from('profiles')
            .select('wallet_balance, full_name')
            .eq('id', userProfile.id)
            .single();

        if (!profileErr && profileData) {
            currentBalance = parseFloat(profileData.wallet_balance) || 0;
            if (badgeElement && profileData.full_name) {
                badgeElement.innerText = profileData.full_name.substring(0, 2).toUpperCase();
            }
        } else {
            currentBalance = 0;
        }
        
        updateBalanceUIDisplays();
    } catch(err) {
        console.error("Critical execution mapping dropped, forcing fallback:", err);
        window.location.href = "login.html";
    }
    showSpinner(false);
}

function updateBalanceUIDisplays() {
    const walletDisplay = document.getElementById('user-wallet-balance');
    const mobileWalletDisplay = document.getElementById('user-wallet-balance-mobile');
    const formattedAmount = `₦${currentBalance.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
    
    if (walletDisplay) walletDisplay.innerText = formattedAmount;
    if (mobileWalletDisplay) mobileWalletDisplay.innerText = formattedAmount;
}

async function syncMarketRates() {
    try {
        const res = await fetch("https://open.er-api.com/v6/latest/USD");
        const data = await res.json();
        if(data && data.rates && data.rates.NGN) {
            state.usdToNgnRate = parseFloat(data.rates.NGN);
        }
    } catch(e) { console.warn("Using default internal processing rates parameters."); }
}

function computeNairaPrice(usdCost) {
    return Math.ceil((usdCost * state.usdToNgnRate) + 1600);
}

// ==========================================
// 🎨 DYNAMIC DESKTOP & MOBILE GRID RESPONSIVENESS
// ==========================================
function renderServicesGrid(services) {
    const grid = document.getElementById('services-grid');
    if(!grid) return;
    grid.innerHTML = '';
    services.forEach(item => {
        const card = document.createElement('div');
        card.className = "group p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 hover:bg-slate-50 dark:hover:bg-slate-900 hover:border-indigo-500/40 cursor-pointer text-center transition-all flex flex-col items-center justify-center gap-2.5 min-h-[105px] shadow-sm";
        card.innerHTML = `
            <div class="w-9 h-9 rounded-xl flex items-center justify-center p-2 transition-all group-hover:scale-110" style="background-color: ${item.color || '#4f46e5'}20; color: ${item.color || '#4f46e5'}; border: 1px solid ${item.color || '#4f46e5'}35">
                <span class="font-black text-xs uppercase">${(item.icon || 'LN').substring(0,2)}</span>
            </div>
            <span class="text-slate-700 dark:text-slate-200 font-extrabold tracking-tight text-[11px] group-hover:text-indigo-600 dark:group-hover:text-white transition-colors leading-tight">${item.name}</span>
        `;
        card.onclick = () => selectService(item.code, item.name);
        grid.appendChild(card);
    });
}

async function selectService(serviceCode, serviceName) {
    state.selectedServiceCode = serviceCode;
    state.selectedServiceName = serviceName;
    showSpinner(true);

    try {
        const targetUrl = `${PROXY_GATEWAY_URL}/?endpoint=${encodeURIComponent('v1/guest/prices?product=' + serviceCode)}`;
        const res = await fetch(targetUrl);
        const priceData = await res.json();

        showSpinner(false);
        if (priceData.error || !priceData[serviceCode]) {
            alert("No confirmation response channels open right now.");
            return;
        }

        goToStage(2);
        const serviceBlock = priceData[serviceCode] || {};
        state.dynamicCountriesArray = Object.keys(serviceBlock).sort();
        state.currentCountryOperatorsData = serviceBlock;
        renderCountriesGrid(state.dynamicCountriesArray);
    } catch (err) {
        showSpinner(false);
        alert(`Route Error: ${err.message}`);
    }
}

function renderCountriesGrid(countries) {
    const grid = document.getElementById('countries-grid');
    if(!grid) return;
    grid.innerHTML = '';
    countries.forEach(countryKey => {
        const countryOperators = state.currentCountryOperatorsData[countryKey] || {};
        let lowestUsdPrice = 999;
        Object.values(countryOperators).forEach(op => {
            if(op.cost < lowestUsdPrice) lowestUsdPrice = op.cost;
        });

        const localizedBaseNaira = computeNairaPrice(lowestUsdPrice);
        const flagIso = COMPREHENSIVE_FLAG_MAP[countryKey.toLowerCase()] || "un";

        const card = document.createElement('div');
        card.className = "p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/30 hover:bg-slate-50 dark:hover:bg-slate-900 hover:border-indigo-500/40 cursor-pointer transition-all flex items-center justify-between group shadow-sm";
        card.innerHTML = `
            <div class="flex items-center gap-3 max-w-[70%]">
                <div class="w-8 h-6 rounded overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 flex-shrink-0">
                    <img src="https://flagcdn.com/w40/${flagIso}.png" class="w-full h-full object-cover shadow-sm" onerror="this.src='https://flagcdn.com/w40/un.png'">
                </div>
                <span class="font-black text-xs uppercase tracking-wide text-slate-700 dark:text-slate-200 truncate group-hover:text-indigo-600 dark:group-hover:text-white">${countryKey}</span>
            </div>
            <div class="text-right">
                <span class="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block font-mono">Starts At</span>
                <span class="text-xs font-black text-indigo-600 dark:text-indigo-400">₦${localizedBaseNaira.toLocaleString()}</span>
            </div>
        `;
        card.onclick = () => selectCountry(countryKey);
        grid.appendChild(card);
    });
}

function selectCountry(countryKey) {
    state.selectedCountryName = countryKey;
    goToStage(3);

    const grid = document.getElementById('operators-grid');
    if(!grid) return;
    grid.innerHTML = '';
    const operatorsList = state.currentCountryOperatorsData[countryKey] || {};
    
    Object.keys(operatorsList).forEach(opKey => {
        const item = operatorsList[opKey];
        const finalCalculatedNaira = computeNairaPrice(item.cost);
        
        let dynamicSuccessRate = item.rate !== undefined && parseInt(item.rate) > 0 ? parseInt(item.rate) : Math.floor(Math.random() * (98 - 70 + 1)) + 70;
        dynamicSuccessRate = Math.min(100, Math.max(0, dynamicSuccessRate));

        let trackingColorClass = "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
        if(dynamicSuccessRate < 80 && dynamicSuccessRate >= 45) trackingColorClass = "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
        if(dynamicSuccessRate < 45) trackingColorClass = "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";

        const cleanOperatorHeading = opKey.toLowerCase() === "any" ? "Any Operator (Optimized Auto)" : opKey;

        const card = document.createElement('div');
        card.className = "p-4.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 hover:border-indigo-500/50 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm cursor-pointer";
        card.innerHTML = `
            <div class="space-y-0.5">
                <div class="flex items-center gap-2">
                    <h4 class="font-black text-xs uppercase tracking-wide text-slate-900 dark:text-white">${cleanOperatorHeading}</h4>
                    <span class="text-[8px] border px-2 py-0.5 rounded font-mono ${trackingColorClass}">${dynamicSuccessRate}% Rate</span>
                </div>
                <p class="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono">Stock Allocation: <span class="text-slate-700 dark:text-slate-300">${item.count.toLocaleString()}</span></p>
            </div>
            <div class="flex items-center justify-between sm:justify-end gap-4 border-t border-slate-100 dark:border-slate-800/60 sm:border-0 pt-2 sm:pt-0">
                <div class="sm:text-right">
                    <span class="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block font-mono">Price</span>
                    <span class="text-sm font-black text-indigo-600 dark:text-indigo-400">₦${finalCalculatedNaira.toLocaleString()}</span>
                </div>
                <button class="px-3.5 py-2 bg-indigo-600 text-white font-black text-[9px] tracking-wider uppercase rounded-xl">Buy Line</button>
            </div>
        `;
        card.onclick = () => triggerPurchaseProcess(opKey, finalCalculatedNaira);
        grid.appendChild(card);
    });
}

// ==========================================
// 🛒 EXECUTION INTERCEPT ROUTING TERMINAL
// ==========================================
async function triggerPurchaseProcess(operatorName, validatedFinalPrice) {
    currentCalculatedPriceNaira = validatedFinalPrice;

    if (currentBalance < currentCalculatedPriceNaira) {
        const lowBalModal = document.getElementById('lowBalanceModal');
        if(lowBalModal) {
            lowBalModal.classList.remove('hidden');
            lowBalModal.classList.add('flex');
        }
        await dispatchAuditLog("Purchase Blocked", `Blocked due to insufficient balance. Balance: ₦${currentBalance}, Cost: ₦${currentCalculatedPriceNaira}`, "ERROR");
        return;
    }

    showSpinner(true);
    await dispatchAuditLog("Purchase Process Initiated", `Line lease active on ${state.selectedServiceName} (${state.selectedCountryName}) costing ₦${currentCalculatedPriceNaira}`, "INFO");

    const buyEndpoint = `v1/user/buy/activation/${state.selectedCountryName}/${operatorName}/${state.selectedServiceCode}`;
    const targetUrl = `${PROXY_GATEWAY_URL}/?endpoint=${encodeURIComponent(buyEndpoint)}`;

    try {
        const res = await fetch(targetUrl);
        const data = await res.json();
        showSpinner(false);

        if (data.error || !data.id) {
            const restockM = document.getElementById('restockingModal');
            if(restockM) {
                restockM.classList.remove('hidden');
                restockM.classList.add('flex');
            }
            await dispatchAuditLog("Stock Shortage", `Carrier allocation depleted variant: ${data.error || 'Empty Stock'}`, "ERROR");
            return;
        }

        currentOrderId = data.id;
        const phoneNumber = data.phone;
        const generatedRef = 'SMS-' + Math.random().toString(36).substring(2, 9).toUpperCase();

        // Safe database ledger insertion tracking record context
        const { data: txData, error: txError } = await sb.from('transactions').insert({
            user_id: userProfile.id,
            type: 'SMS Activation',
            amount: -currentCalculatedPriceNaira,
            description: `Virtual Line: ${state.selectedServiceName} (${operatorName.toUpperCase()})`,
            status: 'Processing',
            recipient: phoneNumber,
            service_category: 'sms',
            api_order_id: currentOrderId.toString(),
            reference_id: generatedRef
        }).select().single();

        if (txError) throw txError;
        currentTransactionId = txData.id;

        // Debit 'wallet_balance' column parameters securely
        const balanceAfterDeduction = currentBalance - currentCalculatedPriceNaira;
        const { error: balanceUpdateError } = await sb
            .from('profiles')
            .update({ wallet_balance: balanceAfterDeduction })
            .eq('id', userProfile.id);

        if (balanceUpdateError) throw new Error("Supabase internal balance sync dropped context.");

        currentBalance = balanceAfterDeduction;
        updateBalanceUIDisplays();

        document.getElementById('panel-service-title').innerText = `${state.selectedServiceName} — Interceptor`;
        document.getElementById('activeNumber').innerText = `+${phoneNumber}`;
        
        document.getElementById('panel-stage-3').classList.add('hidden');
        document.getElementById('smsPanel').classList.remove('hidden');

        await dispatchAuditLog("Order Formally Structured", `Line allocated successfully. Number: +${phoneNumber}`, "SUCCESS");

        launchTimerCountdown();
        startPolling();
    } catch (err) {
        showSpinner(false);
        alert(`Hardware Transaction loop broken: ${err.message}`);
    }
}

function launchTimerCountdown() {
    state.cancelSecondsLeft = 30;
    state.expirySecondsLeft = 900;
    isOtpReceived = false;
    
    const cancelBtn = document.getElementById('btn-cancel');
    if(cancelBtn) {
        cancelBtn.disabled = true;
        cancelBtn.className = "w-full py-4 text-slate-400 dark:text-slate-500 bg-slate-200 dark:bg-slate-850 border border-slate-200 dark:border-slate-800/80 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-not-allowed";
        cancelBtn.innerText = `Cancel (${state.cancelSecondsLeft}s)`;
    }

    if (countdownTimer) clearInterval(countdownTimer);
    countdownTimer = setInterval(() => {
        state.cancelSecondsLeft--;
        if (state.cancelSecondsLeft <= 0) {
            clearInterval(countdownTimer);
            if(cancelBtn) {
                cancelBtn.disabled = false;
                cancelBtn.className = "w-full py-4 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 rounded-xl text-[10px] font-black uppercase tracking-wider cursor-pointer transition-all";
                cancelBtn.innerText = "Cancel Order & Refund";
            }
        } else {
            if(cancelBtn) cancelBtn.innerText = `Cancel (${state.cancelSecondsLeft}s)`;
        }
    }, 1000);

    if (totalExpiryTimer) clearInterval(totalExpiryTimer);
    totalExpiryTimer = setInterval(() => {
        state.expirySecondsLeft--;
        let mins = Math.floor(state.expirySecondsLeft / 60);
        let secs = state.expirySecondsLeft % 60;
        const expTimerDisplay = document.getElementById('expiry-timer');
        if(expTimerDisplay) expTimerDisplay.innerText = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

        if (state.expirySecondsLeft <= 0) {
            clearInterval(totalExpiryTimer);
            clearInterval(smsTimer);
            dispatchAuditLog("Session Expired", `Lease window expired without code interception.`, "INFO");
            resetActivationUIPanel();
        }
    }, 1000);
}

function startPolling() {
    if (smsTimer) clearInterval(smsTimer);
    smsTimer = setInterval(async () => {
        if (!currentOrderId) return;
        try {
            const checkUrl = `${PROXY_GATEWAY_URL}/?endpoint=${encodeURIComponent('v1/user/check/' + currentOrderId)}`;
            const res = await fetch(checkUrl);
            const data = await res.json();

            if (data && data.sms && data.sms.length > 0) {
                isOtpReceived = true;
                clearInterval(smsTimer);
                clearInterval(countdownTimer);
                clearInterval(totalExpiryTimer);

                const otpCode = data.sms[0].code;
                document.getElementById('otpDisplay').innerText = otpCode;
                document.getElementById('otpDisplay').className = "text-4xl font-mono font-black text-emerald-600 dark:text-emerald-400 tracking-[0.25em] bg-white dark:bg-slate-900/40 py-3 rounded-xl border border-slate-200 dark:border-slate-900 pop-animation";

                document.getElementById('otp-pulse-spinner').className = "w-2 h-2 rounded-full bg-emerald-400";
                document.getElementById('status-pulse-text').innerText = "TRANSMISSION PACKET CAPTURED";
                document.getElementById('status-pulse-text').className = "text-[9px] font-black text-emerald-400 uppercase tracking-widest font-mono";

                document.getElementById('btn-finish').classList.remove('opacity-40', 'pointer-events-none');
                
                // Write logs to tables
                await sb.from('transactions').update({ status: 'Completed', metadata: { otp: otpCode } }).eq('id', currentTransactionId);
                await sb.from('sms_logs').insert({
                    user_id: userProfile.id, transaction_id: currentTransactionId,
                    number: document.getElementById('activeNumber').innerText, otp: otpCode,
                    service: state.selectedServiceName, country: state.selectedCountryName, status: 'Completed'
                });

                await dispatchAuditLog("OTP Captured", `Intercept complete. OTP: [${otpCode}]`, "SUCCESS");
            }
        } catch (e) { console.log("Routing stream query loops active..."); }
    }, 4500);
}

async function cancelCurrentOrder() {
    if (isOtpReceived) return;
    clearInterval(smsTimer);
    clearInterval(countdownTimer);
    clearInterval(totalExpiryTimer);
    showSpinner(true);

    try {
        const cancelUrl = `${PROXY_GATEWAY_URL}/?endpoint=${encodeURIComponent('v1/user/cancel/' + currentOrderId)}`;
        await fetch(cancelUrl);

        const refundedBalance = currentBalance + currentCalculatedPriceNaira;
        await sb.from('profiles').update({ wallet_balance: refundedBalance }).eq('id', userProfile.id);
        await sb.from('transactions').update({ status: 'Cancelled' }).eq('id', currentTransactionId);
        
        currentBalance = refundedBalance;
        updateBalanceUIDisplays();
        
        await dispatchAuditLog("Order Revoked Safely", `Order ID: ${currentOrderId} canceled. Re-credited ₦${currentCalculatedPriceNaira}.`, "CANCEL");
    } catch(e){ console.error(e); }

    showSpinner(false);
    resetActivationUIPanel();
}

async function finishCurrentOrder() {
    if (!currentOrderId) return;
    try {
        showSpinner(true);
        const finishUrl = `${PROXY_GATEWAY_URL}/?endpoint=${encodeURIComponent('v1/user/finish/' + currentOrderId)}`;
        await fetch(finishUrl);
        showSpinner(false);
        await dispatchAuditLog("Order Released Successfully", `Closed allocation ID: ${currentOrderId}`, "SUCCESS");
        resetActivationUIPanel();
    } catch(e){ showSpinner(false); resetActivationUIPanel(); }
}

function resetActivationUIPanel() {
    document.getElementById("smsPanel").classList.add("hidden");
    document.getElementById('otpDisplay').innerText = "------";
    document.getElementById('otpDisplay').className = "text-4xl font-mono font-black text-slate-800 dark:text-white tracking-[0.25em] bg-white dark:bg-slate-900/40 py-3 rounded-xl border border-slate-200 dark:border-slate-900";
    document.getElementById('otp-pulse-spinner').className = "w-2 h-2 rounded-full bg-amber-500 animate-pulse";
    document.getElementById('status-pulse-text').innerText = "Awaiting SMS Intercept Packet...";
    document.getElementById('status-pulse-text').className = "text-[9px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest font-mono";
    goToStage(1);
}

// ==========================================
// 🛠️ UTILITIES & NAVIGATION WORKFLOWS
// ==========================================
function goToStage(stageNum) {
    const stages = ['panel-stage-1', 'panel-stage-2', 'panel-stage-3'];
    stages.forEach(s => {
        const el = document.getElementById(s);
        if(el) el.classList.add('hidden');
    });
    const activeStage = document.getElementById(`panel-stage-${stageNum}`);
    if(activeStage) activeStage.classList.remove('hidden');
}

function filterServices() {
    const q = document.getElementById('serviceSearch').value.toLowerCase();
    const filtered = PLATFORM_SERVICES.filter(s => s.name.toLowerCase().includes(q));
    renderServicesGrid(filtered);
}

function filterCountries() {
    const q = document.getElementById('countrySearch').value.toLowerCase();
    const filtered = state.dynamicCountriesArray.filter(c => c.toLowerCase().includes(q));
    renderCountriesGrid(filtered);
}

function showSpinner(status) {
    const loader = document.getElementById('global-loading-state');
    if(!loader) return;
    if (status) loader.classList.remove('hidden');
    else loader.classList.add('hidden');
}

function copyNumber() { 
    navigator.clipboard.writeText(document.getElementById('activeNumber').innerText); 
    alert("Number Allocation string copied to clipboard packet matrix.");
}
function copyOTP() {
    const code = document.getElementById('otpDisplay').innerText;
    if(code !== "------") {
        navigator.clipboard.writeText(code);
        alert("Verification Token code packet extracted.");
    }
}

// ==========================================
// 🚀 CONSOLE BOOTLOADER INITIATION ENTRY POINT
// ==========================================
async function init() {
    initializeThemeSystem(); 
    await syncMarketRates();
    await checkAuthSession();
    
    const sSearch = document.getElementById('serviceSearch');
    if(sSearch) sSearch.addEventListener('keyup', filterServices);
    
    const cSearch = document.getElementById('countrySearch');
    if(cSearch) cSearch.addEventListener('keyup', filterCountries);
    
    renderServicesGrid(PLATFORM_SERVICES);
    goToStage(1);
}

window.addEventListener('DOMContentLoaded', init);