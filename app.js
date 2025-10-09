import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    onAuthStateChanged, 
    signOut,
    sendEmailVerification,
    updateProfile,
    sendPasswordResetEmail,
    deleteUser, 
    EmailAuthProvider, 
    reauthenticateWithCredential,
    GoogleAuthProvider,
    signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { 
    getFirestore, 
    doc, 
    setDoc, 
    getDoc,
    onSnapshot,
    updateDoc,
    deleteDoc,
    collection,
    addDoc,
    query,
    where,
    orderBy,
    getDocs,
    Timestamp,
    runTransaction
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCNXQuFW6SLR_w5x1NxlLScp17LjppAuCA",
    authDomain: "schulmensa-9de80.firebaseapp.com",
    projectId: "schulmensa-9de80",
    storageBucket: "schulmensa-9de80.firebasestorage.app",
    messagingSenderId: "930393675999",
    appId: "1:930393675999:web:cb4bb79f7a448b86efb16a",
    measurementId: "G-5TXS661SFP"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();


const forbiddenUsernameFragments = [
    
    'admin', 'administrator', 'root', 'support', 'hilfe', 'gast',
    'moderator', 'system', 'info', 'kontakt', 'webmaster', 'sysadmin',
    'postmaster', 'staff', 'team', 'bot', 'robot', 'official',
    'offiziell', 'test', 'user', 'master', 'superuser', 'chef',

    
    'arsch', 'fick', 'hure', 'nazi', 'hitler', 'scheisse', 'penis', 'vagina',
    'arschloch', 'fotze', 'muschi', 'wixer', 'wichser', 'schlampe',
    'nutte', 'miststück', 'bastard', 'depp', 'idiot', 'trottel', 'vollidiot',
    'spast', 'spasst', 'behinderte', 'kanake', 'neger', 'mistgeburt',

    
    'bitch', 'fuck', 'shit', 'asshole', 'cunt', 'dick', 'pussy',
    'slut', 'whore', 'nigger', 'faggot', 'retard', 'douchebag',

    
    'heil', 'ss', 'wehrmacht', 'gestapo', 'hakenkreuz', 'hknkrz',
    '88', '18', 'siegheil', 'is', 'isis', 'terrorist', 'alqaida',

    
    'kaufen', 'verkaufen', 'sale', 'shop', 'angebot', 'deal',
    'cialis', 'viagra', 'casino', 'wett', 'poker',

    
    'www', 'http', 'https', 'com', 'net', 'org', 'de', 'io',

    
    'schwarz', 'dæli', 'mensa', 'hm', 'HM', 'Hm', 'hM'
];

let cart = {};
let currentUserProfile = null;
let selectedPickupDay = null;

let searchDebounceTimer; 


const stripe = Stripe("pk_test_51SEri0AmYRR9jDsfQRpujMicuceGW065Ayzz1yFe34uA0pOlFuxjyInkwZvFdCYBOdEHgOscKInwfb3xDYrDSGo100jgxcjLYi"); 
const backendUrl = 'https://daeli-backend.onrender.com'; 
let elements;


const profileBalance = document.getElementById('profile-balance');
const topupAmountInput = document.getElementById('topup-amount');
const topupBalanceBtn = document.getElementById('topup-balance-btn');
const topupErrorMessage = document.getElementById('topup-error-message');
const payWithBalanceBtn = document.getElementById('pay-with-balance-btn');
const userSearchInput = document.getElementById('user-search-input');
const userSearchBtn = document.getElementById('user-search-btn');
const userSearchResultsContainer = document.getElementById('user-search-results');
const userDetailModal = document.getElementById('user-detail-modal');
const checkoutInitialView = document.getElementById('checkout-initial-view');
const startOnlinePaymentBtn = document.getElementById('start-online-payment-btn');
const paymentElementContainer = document.getElementById('payment-element-container');
const backToPaymentOptionsBtn = document.getElementById('back-to-payment-options-btn');
const submitPaymentBtn = document.getElementById('submit-payment-btn');
const paymentMessage = document.getElementById('payment-message');
const passwordResetInitialView = document.getElementById('password-reset-initial-view');
const passwordResetSentView = document.getElementById('password-reset-sent-view');
const backToLoginFromSentLink = document.getElementById('back-to-login-from-sent');
const authModal = document.getElementById('auth-modal');
const authButton = document.getElementById('auth-button');
const closeModalButton = document.querySelector('.close-button');
const welcomeSection = document.getElementById('welcome-section');
const orderSection = document.getElementById('order-section');
const profileSection = document.getElementById('profile-section');
const userOrdersSection = document.getElementById('user-orders-section');
const managementOrdersSection = document.getElementById('management-orders-section');
const adminAreaSection = document.getElementById('admin-area-section');
const adminToolsSection = document.getElementById('admintools-section');
const userOrdersListContainer = document.getElementById('user-orders-list');
const managementOrdersListContainer = document.getElementById('management-orders-list');
const reportedOrdersListContainer = document.getElementById('reported-orders-list');
const homeLink = document.getElementById('home-link');
const orderLink = document.getElementById('order-link');
const orderCtaButton = document.getElementById('order-cta-button');
const userProfileLink = document.getElementById('user-profile-link');
const userOrdersLink = document.getElementById('user-orders-link');
const managementOrdersLink = document.getElementById('management-orders-link');
const adminAreaLink = document.getElementById('admin-area-link');
const adminToolsLink = document.getElementById('admintools-link');
const loginView = document.getElementById('login-view');
const registerView = document.getElementById('register-view');
const googleUsernameView = document.getElementById('google-username-view');
const verificationMessage = document.getElementById('verification-message');
const passwordResetView = document.getElementById('password-reset-view'); 
const showRegisterLink = document.getElementById('show-register');
const showLoginLink = document.getElementById('show-login');
const showPasswordResetLink = document.getElementById('show-password-reset'); 
const backToLoginLink = document.getElementById('back-to-login'); 
const loginEmailInput = document.getElementById('login-email');
const loginPasswordInput = document.getElementById('login-password');
const loginBtn = document.getElementById('login-btn');
const registerUsernameInput = document.getElementById('register-username');
const registerEmailInput = document.getElementById('register-email');
const registerPasswordInput = document.getElementById('register-password');
const registerBtn = document.getElementById('register-btn');
const googleSignInBtn = document.getElementById('google-signin-btn');
const googleUsernameInput = document.getElementById('google-username-input');
const googleUsernameSubmitBtn = document.getElementById('google-username-submit-btn');
const googleRegisterBtn = document.getElementById('google-register-btn');
const resetEmailInput = document.getElementById('reset-email'); 
const sendResetEmailBtn = document.getElementById('send-reset-email-btn'); 
const profileEmail = document.getElementById('profile-email');
const resetPasswordBtn = document.getElementById('reset-password-btn');
const profileUsername = document.getElementById('profile-username');
const profileFirstname = document.getElementById('profile-firstname');
const profileLastname = document.getElementById('profile-lastname');
const saveProfileBtn = document.getElementById('save-profile-btn');
const usernameLimitInfo = document.getElementById('username-limit-info');
const fullnameLimitInfo = document.getElementById('fullname-limit-info');
const discardProfileBtn = document.getElementById('discard-profile-btn');
const deleteAccountBtn = document.getElementById('delete-account-btn'); 
const reauthDeleteModal = document.getElementById('reauth-delete-modal'); 
const closeReauthButton = document.querySelector('.close-reauth-button'); 
const reauthPasswordInput = document.getElementById('reauth-password'); 
const confirmDeleteBtn = document.getElementById('confirm-delete-btn'); 
const menuContainer = document.querySelector('.menu-container');
const cartItemsList = document.getElementById('cart-items-list');
const cartPlaceholder = document.getElementById('cart-placeholder');
const totalPriceValue = document.getElementById('total-price-value');
const checkoutBtn = document.getElementById('checkout-btn');
const checkoutModal = document.getElementById('checkout-modal');
const closeCheckoutButton = document.querySelector('.close-checkout-button');
const cancelOrderBtn = document.getElementById('cancel-order-btn');
const confirmOrderBtn = document.getElementById('confirm-order-btn');
const checkoutTotalPrice = document.getElementById('checkout-total-price');
const checkoutPickupDay = document.getElementById('checkout-pickup-day');
const checkoutPickupTime = document.getElementById('checkout-pickup-time');
const statsUserCount = document.getElementById('stats-user-count');
const statsOpenOrdersCount = document.getElementById('stats-open-orders-count');
const reportedOrderDetailModal = document.getElementById('reported-order-detail-modal');
const reportedOrderDetailContent = document.getElementById('reported-order-detail-content');
const deleteOldOrdersBtn = document.getElementById('delete-old-orders-btn');
const hamburgerMenu = document.getElementById('hamburger-menu');
const navLinksContainer = document.getElementById('nav-links');
const customHourSelect = document.getElementById('custom-hour-select');
const customMinuteSelect = document.getElementById('custom-minute-select');
const customHourOptions = document.getElementById('custom-hour-options');
const customMinuteOptions = document.getElementById('custom-minute-options');
const lengthCheck = document.getElementById('length-check');
const uppercaseCheck = document.getElementById('uppercase-check');
const numberCheck = document.getElementById('number-check');
const pickupDaySelector = document.getElementById('pickup-day-selector');
const usernameErrorMessage = document.getElementById('username-error-message');
const googleUsernameErrorMessage = document.getElementById('google-username-error-message');
const usernameProfileError = document.getElementById('username-profile-error');
const firstnameProfileError = document.getElementById('firstname-profile-error');
const lastnameProfileError = document.getElementById('lastname-profile-error');
const statsTodayOrdersCount = document.getElementById('stats-today-orders-count');
const favoritesSection = document.getElementById('favorites-section');
const favoritesHeader = document.getElementById('favorites-header');
const favoritesList = document.getElementById('favorites-list');
const archivedOrdersListContainer = document.getElementById('archived-orders-list');
// NEU: Referenzen für einklappbare archivierte Bestellungen
const archivedOrdersSection = document.getElementById('archived-orders-section');
const archivedOrdersHeader = document.getElementById('archived-orders-header');


const dayMapping = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
const dayIndexMapping = { "Montag": 1, "Dienstag": 2, "Mittwoch": 3, "Donnerstag": 4, "Freitag": 5 };

const getAuthUserAfterRedirect = () => new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, user => {
        unsubscribe(); 
        resolve(user);
    }, reject);
});

document.addEventListener('DOMContentLoaded', () => {
     if (history.scrollRestoration) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept-btn');

    if (!localStorage.getItem('cookiesAccepted')) {
        cookieBanner.classList.add('show');
    }

    acceptBtn.addEventListener('click', () => {
        localStorage.setItem('cookiesAccepted', 'true');
        cookieBanner.classList.remove('show');
    });

    setupCustomSelect(customHourSelect);
    setupCustomSelect(customMinuteSelect);
    populateHours();
    populateMinutes();
    setupDaySelector();
    setupOrderTabs();
    checkStatus(); 
    setupInputValidation();
});

if (userSearchInput) {
    userSearchInput.addEventListener('input', handleUserSearchOnInput);
}



topupBalanceBtn.addEventListener('click', handleTopUpBalance);
payWithBalanceBtn.addEventListener('click', handlePayWithBalance);

backToLoginFromSentLink.addEventListener('click', (e) => { e.preventDefault(); switchModalView(loginView); });

hamburgerMenu.addEventListener('click', () => {
    navLinksContainer.classList.toggle('nav-active');
    hamburgerMenu.classList.toggle('is-active');
});

navLinksContainer.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
        navLinksContainer.classList.remove('nav-active');
        hamburgerMenu.classList.remove('is-active');
    }
});

document.addEventListener('click', (e) => {
    const isClickInsideNav = navLinksContainer.contains(e.target);
    const isClickOnHamburger = hamburgerMenu.contains(e.target);

    if (navLinksContainer.classList.contains('nav-active') && !isClickInsideNav && !isClickOnHamburger) {
        navLinksContainer.classList.remove('nav-active');
        hamburgerMenu.classList.remove('is-active');
    }
});

const validateInput = (inputElement, errorElement, fieldName) => {
    const value = inputElement.value.trim();
    const minLength = parseInt(inputElement.getAttribute('minlength'), 10);
    const maxLength = parseInt(inputElement.getAttribute('maxlength'), 10);
    let isValid = true;
    let errorMessage = '';

    if (value.length > 0 && value.length < minLength) {
        isValid = false;
        errorMessage = `${fieldName} muss mindestens ${minLength} Zeichen lang sein.`;
    } else if (value.length > maxLength) {
        isValid = false;
        errorMessage = `${fieldName} darf maximal ${maxLength} Zeichen lang sein.`;
    }

    if (!isValid) {
        errorElement.textContent = errorMessage;
        errorElement.style.display = 'block';
        inputElement.classList.add('invalid');
    } else {
        errorElement.style.display = 'none';
        inputElement.classList.remove('invalid');
    }
    return isValid;
};

const setupInputValidation = () => {
    registerUsernameInput.addEventListener('input', () => {
        validateInput(registerUsernameInput, usernameErrorMessage, 'Der Benutzername');
    });
    profileUsername.addEventListener('input', () => {
        validateInput(profileUsername, usernameProfileError, 'Der Benutzername');
    });
    profileFirstname.addEventListener('input', () => {
        validateInput(profileFirstname, firstnameProfileError, 'Der Vorname');
    });
    profileLastname.addEventListener('input', () => {
        validateInput(profileLastname, lastnameProfileError, 'Der Nachname');
    });
};


function setupCustomSelect(selectElement) {
    const trigger = selectElement.querySelector('.custom-select-trigger');
    const options = selectElement.querySelector('.custom-options');

    trigger.addEventListener('click', () => {
        selectElement.classList.toggle('open');
    });

    options.addEventListener('click', (e) => {
        if (e.target.classList.contains('custom-option')) {
            const currentlySelected = options.querySelector('.selected');
            if (currentlySelected) {
                currentlySelected.classList.remove('selected');
            }
            
            e.target.classList.add('selected');
            trigger.querySelector('span').textContent = e.target.textContent;
            selectElement.setAttribute('data-value', e.target.dataset.value);
            selectElement.classList.remove('open');
            selectElement.dispatchEvent(new Event('change'));
        }
    });
}

function setupDaySelector() {
    const today = new Date();
    const currentDayIndex = today.getDay(); 

    const buttons = pickupDaySelector.querySelectorAll('button');
    let defaultDaySet = false;

    buttons.forEach(button => {
        const buttonDay = button.dataset.day;
        const buttonDayIndex = dayIndexMapping[buttonDay];
        
        if (currentDayIndex === 6 || currentDayIndex === 0) {
            button.disabled = false;
            if (buttonDayIndex === 1 && !defaultDaySet) {
                button.classList.add('active');
                selectedPickupDay = buttonDay;
                defaultDaySet = true;
            }
        } else { 
            if (buttonDayIndex < currentDayIndex) {
                button.disabled = true;
            } else {
                button.disabled = false;
                if (buttonDayIndex === currentDayIndex && !defaultDaySet) {
                    button.classList.add('active');
                    selectedPickupDay = buttonDay;
                    defaultDaySet = true;
                }
            }
        }
    });
    renderCart();
}

function setupOrderTabs() {
    document.querySelectorAll('.orders-display-section').forEach(section => {
        const tabs = section.querySelector('.order-day-tabs');
        if (tabs) {
            tabs.addEventListener('click', e => {
                if (e.target.tagName === 'BUTTON') {
                    const day = e.target.dataset.day;
                    tabs.querySelector('.active')?.classList.remove('active');
                    e.target.classList.add('active');

                    if (section.id === 'user-orders-section') {
                        renderUserOrders(day);
                    } else if (section.id === 'management-orders-section') {
                        renderManagementOrders(day);
                    }
                }
            });
        }
    });
}

pickupDaySelector.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON' && !e.target.disabled) {
        pickupDaySelector.querySelectorAll('button').forEach(btn => {
            btn.classList.remove('active');
        });
        e.target.classList.add('active');
        selectedPickupDay = e.target.dataset.day;
        renderCart();
    }
});

window.addEventListener('click', (e) => {
    document.querySelectorAll('.custom-select').forEach(select => {
        if (!select.contains(e.target)) {
            select.classList.remove('open');
        }
    });
});

const showNotification = (message, type = 'error') => {
    const oldNotifier = document.querySelector('.notification');
    if (oldNotifier) oldNotifier.remove();

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add('show'), 10);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 500);
    }, 3000);
};

const startResendCooldown = (button, duration) => {
    button.disabled = true;
    let timer = duration;
    const interval = setInterval(() => {
        timer--;
        button.textContent = `Erneut senden (${timer}s)`;
        if (timer <= 0) {
            clearInterval(interval);
            button.textContent = 'Erneut senden';
            button.disabled = false;
        }
    }, 1000);
};

const handleGoogleAuth = async () => {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
            await setDoc(userDocRef, {
                username: user.displayName,
                email: user.email,
                createdAt: new Date(),
                firstName: "", 
                lastName: "", 
                usernameChangesThisMonth: 0,
                usernameLastChangeMonth: "none", 
                firstNameChangeCount: 0,
                lastNameChangeCount: 0,
                isCoAdmin: false, 
                isAdmin: false, 
                isBlocked: false,
                favorites: []
            });
            showNotification(`Willkommen, ${user.displayName}! Dein Konto wurde erstellt.`, 'success');
        } else {
            showNotification(`Willkommen zurück, ${user.displayName}!`, 'success');
        }
        closeModal();
    } catch (error) {
        console.error("Google Authentifizierungsfehler:", error);
        if (error.code === 'auth/popup-closed-by-user') {
            showNotification('Die Anmeldung wurde abgebrochen.', 'error');
        } else {
            showNotification('Ein Fehler bei der Google-Anmeldung ist aufgetreten.', 'error');
        }
    }
};

function togglePasswordVisibility(passwordInput, toggleIcon) {
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    } else {
        passwordInput.type = 'password';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
    }
}

const showPage = (pageToShow) => {
    [welcomeSection, orderSection, profileSection, userOrdersSection, managementOrdersSection, adminAreaSection, adminToolsSection].forEach(page => {
        const displayStyle = (page.id === 'order-section') ? 'grid' : 'flex';
        page.style.display = page === pageToShow ? displayStyle : 'none';
    });
};

const showHomePage = () => showPage(welcomeSection);

const showOrderPage = async () => {
    const user = auth.currentUser;
    if (user && user.emailVerified) {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
            currentUserProfile = userDocSnap.data();
            if (currentUserProfile.isBlocked) {
                showNotification("Dein Konto wurde für Bestellungen gesperrt. Falls du einwände hast wende dich bitte an einen Admin oder schreibe uns eine email.");
                showHomePage();
                return;
            }
        }
        showPage(orderSection);
        renderCart();
        renderFavorites();
        updateFavoriteIcons();
    } else {
        openModal();
    }
};

const showUserOrdersPage = () => {
    if (auth.currentUser) {
        showPage(userOrdersSection);
        const today = new Date().getDay(); 
        const defaultDay = (today === 0 || today === 6) ? "Montag" : dayMapping[today];
        const tabs = userOrdersSection.querySelector('.order-day-tabs');
        tabs.querySelector('.active')?.classList.remove('active');
        tabs.querySelector(`[data-day="${defaultDay}"]`).classList.add('active');
        renderUserOrders(defaultDay);
        renderArchivedOrders();
    } else {
        openModal();
    }
};

const showManagementOrdersPage = () => {
    if (auth.currentUser) {
        showPage(managementOrdersSection);
        const today = new Date().getDay(); 
        const defaultDay = (today === 0 || today === 6) ? "Montag" : dayMapping[today];
        const tabs = managementOrdersSection.querySelector('.order-day-tabs');
        tabs.querySelector('.active')?.classList.remove('active');
        tabs.querySelector(`[data-day="${defaultDay}"]`).classList.add('active');
        renderManagementOrders(defaultDay);
    } else {
        openModal();
    }
};


const resetCheckoutModalState = () => {
    paymentElementContainer.style.display = 'none';
    checkoutInitialView.style.display = 'block';

    const btnText = startOnlinePaymentBtn.querySelector('.btn-text');
    const btnSpinner = startOnlinePaymentBtn.querySelector('.btn-spinner');
    
    startOnlinePaymentBtn.disabled = false;
    if (btnText) btnText.style.display = 'inline';
    if (btnSpinner) btnSpinner.style.display = 'none';

    paymentMessage.textContent = '';
    paymentMessage.style.display = 'none';
};

const showAdminAreaPage = () => showPage(adminAreaSection);

const showAdminToolsPage = () => {
    if (auth.currentUser) {
        showPage(adminToolsSection);
        renderReportedOrders();
        renderAdminStats();
    } else {
        openModal();
    }
};

const showProfilePage = async () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });

    if (auth.currentUser) {
        showPage(profileSection);
        profileEmail.value = auth.currentUser.email;

        const userDocRef = doc(db, "users", auth.currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
            const data = userDocSnap.data();
            currentUserProfile = data; // Update currentUserProfile
            profileUsername.value = auth.currentUser.displayName || '';
            profileFirstname.value = data.firstName || '';
            profileLastname.value = data.lastName || '';

            // NEU: Guthaben anzeigen
            const currentBalance = data.balance || 0;
            profileBalance.textContent = `${currentBalance.toFixed(2).replace('.', ',')} €`;

            const currentMonth = new Date().toISOString().slice(0, 7);
            const changesThisMonth = data.usernameLastChangeMonth === currentMonth ? data.usernameChangesThisMonth : 0;
            usernameLimitInfo.textContent = `Kann noch ${2 - changesThisMonth} Mal diesen Monat geändert werden.`;

            const firstNameChanges = data.firstNameChangeCount || 0;
            const lastNameChanges = data.lastNameChangeCount || 0;
            fullnameLimitInfo.textContent = `Vorname kann noch ${2 - firstNameChanges} Mal, Nachname noch ${2 - lastNameChanges} Mal geändert werden.`;
        }
    } else {
        openModal();
    }
};

async function checkForTopUpSuccess() {
    const params = new URLSearchParams(window.location.search);
    const user = auth.currentUser;

    if (params.has('topup_success') && params.has('session_id') && user) {
        const sessionId = params.get('session_id');
        
        // Verhindern, dass die Funktion bei erneutem Laden der Seite erneut ausgeführt wird
        if (localStorage.getItem('last_session_id') === sessionId) {
            // Bereinige die URL, ohne die Seite neu zu laden
            window.history.replaceState(null, '', window.location.pathname);
            return;
        }

        try {
            // Hole die Session-Daten von Stripe über unser Backend (Sicherheitsmaßnahme)
            // (Hier vereinfacht: Wir nehmen an, der Betrag ist korrekt, da er in Stripe fixiert war)
            // In einer perfekten Welt würde das Backend den Betrag aus der Session lesen und an die DB senden.
            const response = await fetch(`${backendUrl}/get-checkout-session?sessionId=${sessionId}`); // Annahme: Es gibt diesen Endpunkt
            const sessionData = await response.json(); // Annahme: Backend gibt { amount_total, client_reference_id } zurück

            // WICHTIG: Die client_reference_id muss mit der aktuellen userId übereinstimmen!
            if (sessionData.client_reference_id !== user.uid) {
                 throw new Error("Session-Benutzer stimmt nicht mit angemeldetem Benutzer überein.");
            }
            
            const amountAdded = sessionData.amount_total / 100; // Umrechnung von Cent in Euro

            const userRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userRef);
            const currentBalance = userDoc.data().balance || 0;
            const newBalance = currentBalance + amountAdded;
            
            await updateDoc(userRef, { balance: newBalance });
            
            localStorage.setItem('last_session_id', sessionId);
            showNotification(`Dein Guthaben wurde erfolgreich um ${amountAdded.toFixed(2)} € aufgeladen.`, 'success');
            
            // Wenn der Nutzer auf der Profilseite ist, aktualisiere die Ansicht
            if (profileSection.style.display !== 'none') {
                showProfilePage();
            }

        } catch (error) {
            console.error("Fehler beim Verarbeiten der Top-Up-Session:", error);
            showNotification("Es gab ein Problem bei der Aktualisierung Ihres Guthabens. Bitte kontaktieren Sie den Support.", "error");
        } finally {
            // Bereinige die URL, ohne die Seite neu zu laden
            window.history.replaceState(null, '', window.location.pathname);
        }
    } else if (params.has('topup_canceled')) {
        showNotification("Die Aufladung wurde abgebrochen.", "error");
        window.history.replaceState(null, '', window.location.pathname);
    }
}


const openModal = () => {
    loginView.style.display = 'block';
    registerView.style.display = 'none';
    verificationMessage.style.display = 'none';
    passwordResetView.style.display = 'none';
    passwordResetInitialView.style.display = 'block';
    passwordResetSentView.style.display = 'none';

    authModal.style.display = 'flex'; 
};

const closeModal = () => { authModal.style.display = 'none'; };

const switchModalView = (viewToShow) => {
    [loginView, registerView, passwordResetView, verificationMessage, googleUsernameView].forEach(view => {
        view.style.display = view === viewToShow ? 'block' : 'none';
    });
};

const populateMinutes = (isFourteen = false) => {
    customMinuteOptions.innerHTML = '';
    const minutes = isFourteen ? ['00'] : ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];
    
    minutes.forEach(m => {
        const optionDiv = document.createElement('div');
        optionDiv.classList.add('custom-option');
        optionDiv.dataset.value = m;
        optionDiv.textContent = m;
        customMinuteOptions.appendChild(optionDiv);
    });
};

const populateHours = () => {
    customHourOptions.innerHTML = '';
    for (let h = 11; h <= 14; h++) {
        const optionDiv = document.createElement('div');
        optionDiv.classList.add('custom-option');
        optionDiv.dataset.value = h;
        optionDiv.textContent = h;
        customHourOptions.appendChild(optionDiv);
    }
};


const renderCart = () => {
    cartItemsList.innerHTML = '';
    const profileCompletionNotice = document.getElementById('profile-completion-notice');
    const maxOrderValueNotice = document.getElementById('max-order-value-notice');
    const selectDayNotice = document.getElementById('select-day-notice');
    const selectTimeNotice = document.getElementById('select-time-notice');

    profileCompletionNotice.innerHTML = '';

    let totalPrice = 0;
    const itemIds = Object.keys(cart);

    if (itemIds.length === 0) {
        cartItemsList.appendChild(cartPlaceholder);
        cartPlaceholder.style.display = 'block';
    } else {
        cartPlaceholder.style.display = 'none';
        itemIds.forEach(id => {
            const item = cart[id];
            const itemTotal = item.price * item.quantity;
            totalPrice += itemTotal;

            const li = document.createElement('li');
            li.className = 'cart-item';
            li.innerHTML = `
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.quantity}x ${item.name}</div>
                    <div class="cart-item-price">${item.price.toFixed(2).replace('.', ',')} €</div>
                </div>
                <div class="cart-item-total">${itemTotal.toFixed(2).replace('.', ',')} €</div>
            `;
            cartItemsList.appendChild(li);
        });
    }

    totalPriceValue.textContent = `${totalPrice.toFixed(2).replace('.', ',')} €`;
    checkoutTotalPrice.textContent = `${totalPrice.toFixed(2).replace('.', ',')} €`;

    let isButtonDisabled = false;
    let profileNoticeVisible = false;
    let maxOrderNoticeVisible = false;
    let dayNoticeVisible = false;
    let timeNoticeVisible = false;

    const hour = customHourSelect.getAttribute('data-value');
    const minute = customMinuteSelect.getAttribute('data-value');

    if (totalPrice === 0) {
        isButtonDisabled = true;
    }

    if (!selectedPickupDay) {
        dayNoticeVisible = true;
        isButtonDisabled = true;
    }

    if (!hour || !minute) {
        timeNoticeVisible = true;
        isButtonDisabled = true;
    }

    if (totalPrice > 150) {
        maxOrderValueNotice.textContent = 'Der maximale Bestellwert von 150,00 € darf nicht überschritten werden.';
        maxOrderNoticeVisible = true;
        isButtonDisabled = true;
    }

    if (currentUserProfile && totalPrice >= 10) {
        if (!currentUserProfile.firstName || !currentUserProfile.lastName) {
            profileCompletionNotice.innerHTML = `
                Vervollständige dein Profil für Bestellungen über 10,00 €.
                <br>
                <button id="go-to-profile-from-cart-btn" class="profile-notice-btn">
                    Zum Profil
                </button>
            `;
            document.getElementById('go-to-profile-from-cart-btn')?.addEventListener('click', showProfilePage);
            profileNoticeVisible = true;
            isButtonDisabled = true;
        }
    }

    profileCompletionNotice.style.display = profileNoticeVisible ? 'block' : 'none';
    maxOrderValueNotice.style.display = maxOrderNoticeVisible ? 'block' : 'none';
    selectDayNotice.style.display = dayNoticeVisible ? 'block' : 'none';
    selectTimeNotice.style.display = timeNoticeVisible ? 'block' : 'none';
    checkoutBtn.disabled = isButtonDisabled;
};

if (userSearchBtn) {
    userSearchBtn.addEventListener('click', handleUserSearch);
}

if (userSearchResultsContainer) {
    userSearchResultsContainer.addEventListener('click', e => {
        const viewProfileButton = e.target.closest('.view-profile-btn');
        if (viewProfileButton) {
            const userId = viewProfileButton.dataset.userId;
            openUserDetailModal(userId);
        }
    });
}

const resetOrder = () => {
    cart = {};
    setupDaySelector(); 
    customHourSelect.setAttribute('data-value', '');
    customHourSelect.querySelector('span').textContent = '--';
    populateMinutes();
    customMinuteSelect.setAttribute('data-value', '');
    customMinuteSelect.querySelector('span').textContent = '--';

    document.querySelectorAll('.menu-item .quantity').forEach(q => {
        q.textContent = '0';
    });
    renderCart();
};

// In app.js zu den anderen Event-Listenern hinzufügen

archivedOrdersListContainer.addEventListener('click', async (e) => {
    const target = e.target.closest('.reorder-btn');
    if (!target) return;

    const orderId = target.dataset.id;
    if (orderId) {
        handleReorder(orderId);
    }
});

let userOrdersListener = null;

const renderUserOrders = (day) => {
    const user = auth.currentUser;
    if (!user || !day) return;

    userOrdersListContainer.innerHTML = "<p>Lade Bestellungen...</p>";

    if (userOrdersListener) {
        userOrdersListener(); 
    }

    const q = query(
        collection(db, "orders"),
        where("userId", "==", user.uid),
        where("userAcknowledged", "==", false),
        where("pickupDay", "==", day)
    );

    userOrdersListener = onSnapshot(q, (querySnapshot) => {
        const orders = [];
        querySnapshot.forEach(doc => orders.push({ id: doc.id, ...doc.data() }));

        orders.sort((a, b) => a.pickupTime.localeCompare(b.pickupTime));

        if (orders.length === 0) {
            userOrdersListContainer.innerHTML = `<p>Du hast für ${day} keine offenen Bestellungen.</p>`;
            return;
        }

        userOrdersListContainer.innerHTML = ""; 
        orders.forEach(order => {
            const orderId = order.id;
            const orderDate = order.timestamp.toDate();
            const formattedDate = `${orderDate.toLocaleDateString('de-DE')} um ${orderDate.toLocaleTimeString('de-DE', {hour: '2-digit', minute:'2-digit'})} Uhr`;

            const itemsHtml = Object.values(order.items).map(item =>
                `<li><span>${item.quantity}x ${item.name}</span> <span>${(item.price * item.quantity).toFixed(2).replace('.', ',')} €</span></li>`
            ).join('');

            const orderCard = document.createElement('div');
            orderCard.className = 'order-card';
            if (order.paymentMethod === 'Online-Zahlung') orderCard.classList.add('paid');
            if (order.isPrepared) orderCard.classList.add('prepared');

            orderCard.innerHTML = `
                <div class="order-header">
                    <div class="order-header-info">
                        <strong>Bestellnr: ${order.orderNumber}</strong>
                        <span>${formattedDate}</span>
                    </div>
                    <div class="order-pickup-time">
                        <span>Abholung um:</span>
                        <strong>${order.pickupTime} Uhr</strong>
                    </div>
                </div>
                <div class="order-items-container">
                     <ul class="order-items-list">${itemsHtml}</ul>
                </div>
                <div class="order-footer">
                    <div class="order-total">
                        Gesamt: ${order.totalPrice.toFixed(2).replace('.', ',')} €
                    </div>
                    <button class="received-order-btn" data-id="${orderId}">Bestellung erhalten</button>
                </div>
            `;
            
            const headerInfo = orderCard.querySelector('.order-header-info');
            if (order.paymentMethod === 'Online-Zahlung') {
                const paymentStatusBadge = document.createElement('span');
                paymentStatusBadge.className = 'payment-status-badge paid';
                paymentStatusBadge.textContent = 'Bezahlt';
                headerInfo.appendChild(paymentStatusBadge);
            }
    
            if (order.isPrepared) {
                const preparedStatusBadge = document.createElement('span');
                preparedStatusBadge.className = 'payment-status-badge prepared';
                preparedStatusBadge.textContent = 'Vorbereitet';
                headerInfo.appendChild(preparedStatusBadge);
            }

            userOrdersListContainer.appendChild(orderCard);
        });
    }, (error) => {
        console.error("Fehler beim Lauschen auf Bestellungs-Updates:", error);
        userOrdersListContainer.innerHTML = `<p>Fehler beim Laden der Bestellungen.</p>`;
    });
};

const renderManagementOrders = async (day) => {
    if (!day) return;
    managementOrdersListContainer.innerHTML = "<p>Lade Bestellungen...</p>";

    const q = query(
        collection(db, "orders"), 
        where("adminCompleted", "==", false), 
        where("isReported", "==", false),
        where("pickupDay", "==", day)
    );
    const querySnapshot = await getDocs(q);

    const orders = [];
    querySnapshot.forEach(doc => orders.push({ id: doc.id, ...doc.data() }));

    orders.sort((a, b) => a.pickupTime.localeCompare(b.pickupTime));

    if (orders.length === 0) {
        managementOrdersListContainer.innerHTML = `<p>Für ${day} sind keine offenen Bestellungen vorhanden.</p>`;
        return;
    }

    managementOrdersListContainer.innerHTML = "";
    orders.forEach(order => {
        const orderId = order.id;
        const orderDate = order.timestamp.toDate();
        const formattedDate = `${orderDate.toLocaleDateString('de-DE')} um ${orderDate.toLocaleTimeString('de-DE', {hour: '2-digit', minute:'2-digit'})} Uhr`;
        const fullName = [order.userFirstName, order.userLastName].filter(Boolean).join(' ') || order.userName;

        const itemsHtml = Object.values(order.items).map(item => 
            `<li><span>${item.quantity}x ${item.name}</span> <span>${(item.price * item.quantity).toFixed(2).replace('.', ',')} €</span></li>`
        ).join('');

        const orderCard = document.createElement('div');
        orderCard.className = `order-card ${order.isPrepared ? 'prepared' : ''}`;
        if (order.paymentMethod === 'Online-Zahlung') {
            orderCard.classList.add('paid');
        }

        orderCard.innerHTML = `
            <div class="order-header">
                <div class="order-header-info">
                    <strong>Bestellnr: ${order.orderNumber}</strong>
                    <span>${formattedDate}</span>
                </div>
                <div class="order-user-info">
                    <span>Bestellt von:</span>
                    <strong>${fullName}</strong> 
                </div>
                <div class="order-pickup-time">
                    <span>Abholung um:</span>
                    <strong>${order.pickupTime} Uhr</strong>
                </div>
            </div>
            <div class="order-details-bar"></div>
            <div class="order-items-container">
                 <p><strong>Inhalt:</strong></p>
                 <ul class="order-items-list">${itemsHtml}</ul>
            </div>
            <div class="order-footer">
                 <div class="order-total">
                    Gesamt: ${order.totalPrice.toFixed(2).replace('.', ',')} €
                </div>
                <div class="order-actions">
                    <button class="report-order-btn danger-button" data-id="${orderId}">Melden</button>
                    <button class="prepare-order-btn" data-id="${orderId}" ${order.isPrepared ? 'disabled' : ''}>
                        ${order.isPrepared ? 'Vorbereitet' : 'Vorbereiten'}
                    </button>
                    <button class="finish-order-btn" data-id="${orderId}">
                        <i class="fa-solid fa-check"></i> Fertig
                    </button>
                </div>
            </div>
        `;

        if (order.paymentMethod === 'Online-Zahlung') {
            const headerInfo = orderCard.querySelector('.order-header-info');
            const paymentStatusBadge = document.createElement('span');
            paymentStatusBadge.className = 'payment-status-badge paid';
            paymentStatusBadge.textContent = 'Online Bezahlt';
            headerInfo.appendChild(paymentStatusBadge);
        }

        managementOrdersListContainer.appendChild(orderCard);
    });
};

const renderAdminStats = async () => {
    try {
        const usersQuery = query(collection(db, "users"));
        const usersSnapshot = await getDocs(usersQuery);
        statsUserCount.textContent = usersSnapshot.size;

        const openOrdersQuery = query(
            collection(db, "orders"),
            where("adminCompleted", "==", false),
            where("isReported", "==", false)
        );
        const openOrdersSnapshot = await getDocs(openOrdersQuery);
        statsOpenOrdersCount.textContent = openOrdersSnapshot.size;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const todayOrdersQuery = query(
            collection(db, "orders"),
            where("timestamp", ">=", today),
            where("timestamp", "<", tomorrow)
        );
        const todayOrdersSnapshot = await getDocs(todayOrdersQuery);
        statsTodayOrdersCount.textContent = todayOrdersSnapshot.size;

    } catch (error) {
        console.error("Fehler beim Laden der Admin-Statistiken:", error);
        statsUserCount.textContent = "Fehler";
        statsOpenOrdersCount.textContent = "Fehler";
        statsTodayOrdersCount.textContent = "Fehler";
    }
};

const renderReportedOrders = async () => {
    reportedOrdersListContainer.innerHTML = "<p>Lade gemeldete Bestellungen...</p>";

    const q = query(
        collection(db, "orders"), 
        where("isReported", "==", true),
        orderBy("timestamp", "desc")
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        reportedOrdersListContainer.innerHTML = "<p>Keine gemeldeten Bestellungen vorhanden.</p>";
        return;
    }

    reportedOrdersListContainer.innerHTML = "";
    for (const docSnapshot of querySnapshot.docs) {
        const order = docSnapshot.data();
        const orderId = docSnapshot.id;
        const orderDate = order.timestamp.toDate();
        const formattedDate = `${orderDate.toLocaleDateString('de-DE')} um ${orderDate.toLocaleTimeString('de-DE', {hour: '2-digit', minute:'2-digit'})} Uhr`;
        const fullName = [order.userFirstName, order.userLastName].filter(Boolean).join(' ') || order.userName;

        const compactItem = document.createElement('div');
        compactItem.className = 'reported-order-item-compact';
        compactItem.dataset.id = orderId;
        compactItem.innerHTML = `
            <div class="reported-order-info">
                <strong>Bestellnr: ${order.orderNumber}</strong>
                <span>Von: ${fullName}</span>
            </div>
            <div class="reported-order-date">
                <span>${formattedDate}</span>
            </div>
        `;
        reportedOrdersListContainer.appendChild(compactItem);
    }
};

const openReportedOrderDetailModal = async (orderId) => {
    const orderRef = doc(db, "orders", orderId);
    const orderSnap = await getDoc(orderRef);

    if (!orderSnap.exists()) {
        showNotification("Bestellung nicht gefunden.", "error");
        return;
    }
    const order = orderSnap.data();
    const userDocRef = doc(db, "users", order.userId);
    const userDocSnap = await getDoc(userDocRef);
    const userData = userDocSnap.exists() ? userDocSnap.data() : null;
    const orderDate = order.timestamp.toDate();
    const formattedDate = `${orderDate.toLocaleDateString('de-DE')} um ${orderDate.toLocaleTimeString('de-DE', {hour: '2-digit', minute:'2-digit'})} Uhr`;

    const itemsHtml = Object.values(order.items).map(item => 
        `<li><span>${item.quantity}x ${item.name}</span> <span>${(item.price * item.quantity).toFixed(2).replace('.', ',')} €</span></li>`
    ).join('');
    
    reportedOrderDetailContent.innerHTML = `
        <div class="order-header">
            <div class="order-header-info">
                <strong>Bestellnr: ${order.orderNumber}</strong>
                <span>${formattedDate}</span>
            </div>
            <div class="order-pickup-time">
                <span>Abholung am ${order.pickupDay} um:</span>
                <strong>${order.pickupTime} Uhr</strong>
            </div>
        </div>
        <div class="order-items-container">
             <ul class="order-items-list">${itemsHtml}</ul>
        </div>
        <div class="order-footer">
            <div class="order-total">
                Gesamt: ${order.totalPrice.toFixed(2).replace('.', ',')} €
            </div>
        </div>
        ${userData ? `
        <div class="reported-user-details">
            <h4>Nutzerinformationen</h4>
            <p><strong>Name:</strong> ${[userData.firstName, userData.lastName].filter(Boolean).join(' ') || 'N/A'}</p>
            <p><strong>E-Mail:</strong> ${userData.email}</p>
        </div>
        ` : '<p>Nutzerdaten nicht gefunden.</p>'}
        <div class="reported-order-modal-actions">
            <button class="resolve-report-btn secondary-button" data-order-id="${orderId}">Meldung aufheben</button>
            <button class="block-user-btn danger-button" data-user-id="${order.userId}" data-order-id="${orderId}" ${userData && userData.isBlocked ? 'disabled' : ''}>
                ${userData && userData.isBlocked ? 'Nutzer ist gesperrt' : 'Nutzer sperren & Bestellung löschen'}
            </button>
        </div>
    `;
    reportedOrderDetailModal.style.display = 'flex';
};

const renderArchivedOrders = async () => {
    const user = auth.currentUser;
    if (!user) return;

    archivedOrdersListContainer.innerHTML = "<p>Lade archivierte Bestellungen...</p>";

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysAgoTimestamp = Timestamp.fromDate(sevenDaysAgo);

    const q = query(
        collection(db, "orders"),
        where("userId", "==", user.uid),
        where("userAcknowledged", "==", true),
        where("timestamp", ">=", sevenDaysAgoTimestamp),
        orderBy("timestamp", "desc")
    );

    const querySnapshot = await getDocs(q);
    const orders = [];
    querySnapshot.forEach(doc => orders.push({ id: doc.id, ...doc.data() }));

    if (orders.length === 0) {
        archivedOrdersListContainer.innerHTML = `<p>Keine archivierten Bestellungen in den letzten 7 Tagen gefunden.</p>`;
        return;
    }

    archivedOrdersListContainer.innerHTML = "";
    orders.forEach(order => {
        const orderDate = order.timestamp.toDate();
        const formattedDate = `${orderDate.toLocaleDateString('de-DE')} um ${orderDate.toLocaleTimeString('de-DE', {hour: '2-digit', minute:'2-digit'})} Uhr`;

        const itemsHtml = Object.values(order.items).map(item =>
            `<li><span>${item.quantity}x ${item.name}</span></li>`
        ).join('');

        const orderCard = document.createElement('div');
        orderCard.className = 'order-card archived';
        orderCard.innerHTML = `
            <div class="order-header">
                <div class="order-header-info">
                    <strong>Bestellnr: ${order.orderNumber}</strong>
                    <span>Bestellt am: ${formattedDate}</span>
                </div>
                <div class="order-pickup-time">
                    <span>Abgeholt am ${order.pickupDay} um:</span>
                    <strong>${order.pickupTime} Uhr</strong>
                </div>
            </div>
            <div class="order-items-container">
                 <ul class="order-items-list">${itemsHtml}</ul>
            </div>
            <div class="order-footer">
                <div class="order-total">
                    Gesamt: ${order.totalPrice.toFixed(2).replace('.', ',')} €
                </div>
                <div class="order-actions">
                    <button class="reorder-btn cta-button" data-id="${order.id}">Erneut bestellen</button>
                </div>
            </div>
        `;
        archivedOrdersListContainer.appendChild(orderCard);
    });
};

// Neue Funktion in app.js

async function handleReorder(orderId) {
    const orderRef = doc(db, "orders", orderId);
    try {
        const orderSnap = await getDoc(orderRef);
        if (!orderSnap.exists()) {
            showNotification("Die ursprüngliche Bestellung konnte nicht gefunden werden.", "error");
            return;
        }

        const orderData = orderSnap.data();
        
        // Warenkorb leeren
        cart = {}; 
        
        // Warenkorb mit den alten Artikeln füllen
        cart = orderData.items;

        showNotification("Die Artikel wurden in deinen Warenkorb gelegt!", "success");
        
        // Zur Bestellseite wechseln
        showOrderPage();
        
        // Scrollt nach oben, damit der Nutzer den gefüllten Warenkorb direkt sieht
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });


    } catch (error) {
        console.error("Fehler beim erneuten Bestellen: ", error);
        showNotification("Ein Fehler ist aufgetreten. Die Artikel konnten nicht in den Warenkorb gelegt werden.", "error");
    }
}

onAuthStateChanged(auth, async (user) => {
    const optionalLinks = [userProfileLink, userOrdersLink, managementOrdersLink, adminToolsLink];
    optionalLinks.forEach(link => link.style.display = 'none');
    adminAreaLink.style.display = 'none';

    if (user && user.emailVerified) {
        authButton.textContent = 'Abmelden';
        authButton.onclick = () => signOut(auth);

        userProfileLink.textContent = user.displayName || "Profil";
        userProfileLink.style.display = 'block';
        userOrdersLink.style.display = 'block';

        const userDocRef = doc(db, "users", user.uid);

        onSnapshot(userDocRef, (docSnap) => {
            if (docSnap.exists()) {
                currentUserProfile = docSnap.data();
                // Wenn Profilseite offen ist, Guthaben aktualisieren
                if (profileSection.style.display !== 'none') {
                    const balance = currentUserProfile.balance || 0;
                    profileBalance.textContent = `${balance.toFixed(2).replace('.', ',')} €`;
                }
                userProfileLink.textContent = user.displayName || "Profil";
                if (currentUserProfile.isCoAdmin === true || currentUserProfile.isAdmin === true) {
                    managementOrdersLink.style.display = 'block';
                } else {
                    managementOrdersLink.style.display = 'none';
                }
                if (currentUserProfile.isAdmin === true) {
                    adminToolsLink.style.display = 'block';
                } else {
                    adminToolsLink.style.display = 'none';
                }
            }
        });
        
        await checkForTopUpSuccess(); 

        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
            currentUserProfile = userDocSnap.data();
            if (currentUserProfile.isCoAdmin === true || currentUserProfile.isAdmin === true) {
                managementOrdersLink.style.display = 'block';
            }
            if (currentUserProfile.isAdmin === true) {
                adminToolsLink.style.display = 'block';
            }
        }
    } else {
        const wasJustLoggedOut = authButton.textContent === 'Abmelden';
        if (wasJustLoggedOut) {
            showNotification("Du wurdest erfolgreich abgemeldet.", "success");
        }
        
        currentUserProfile = null;
        authButton.textContent = 'Anmelden';
        authButton.onclick = openModal;
        loginEmailInput.value = '';
        loginPasswordInput.value = '';
        showHomePage();
    }
    renderCart();
    renderFavorites();
    updateFavoriteIcons();
});

// app.js

async function handleTopUpBalance() {
    const user = auth.currentUser;
    if (!user) {
        showNotification("Bitte melde dich an, um Guthaben aufzuladen.", "error");
        return;
    }

    const amount = parseFloat(topupAmountInput.value);
    const currentBalance = currentUserProfile.balance || 0;

    // Validierung
    topupErrorMessage.style.display = 'none';
    if (isNaN(amount) || amount < 5) {
        topupErrorMessage.textContent = "Bitte gib einen Betrag von mindestens 5,00 € ein.";
        topupErrorMessage.style.display = 'block';
        return;
    }
    if (amount > 100) {
        topupErrorMessage.textContent = "Du kannst maximal 100,00 € auf einmal aufladen.";
        topupErrorMessage.style.display = 'block';
        return;
    }
    if (currentBalance + amount > 100) {
        topupErrorMessage.textContent = `Dein Guthaben darf 100,00 € nicht übersteigen. Du kannst noch maximal ${(100 - currentBalance).toFixed(2)} € aufladen.`;
        topupErrorMessage.style.display = 'block';
        return;
    }

    setButtonLoading(topupBalanceBtn, true);

    try {
        const response = await fetch(`${backendUrl}/create-checkout-session`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount, userId: user.uid })
        });

        if (!response.ok) {
            const { error } = await response.json();
            throw new Error(error || 'Fehler bei der Kommunikation mit dem Server.');
        }

        const session = await response.json();
        
        // Leite den Nutzer zu Stripe Checkout weiter
        const result = await stripe.redirectToCheckout({ sessionId: session.id });

        if (result.error) {
            showNotification(result.error.message, "error");
        }
    } catch (error) {
        console.error("Fehler beim Starten der Aufladung:", error);
        showNotification(`Ein Fehler ist aufgetreten: ${error.message}`, "error");
    } finally {
        setButtonLoading(topupBalanceBtn, false);
    }
}

registerUsernameInput.addEventListener('input', () => {
    const username = registerUsernameInput.value.trim().toLowerCase();
    const isForbidden = forbiddenUsernameFragments.some(fragment => username.includes(fragment));

    const isLengthValid = validateInput(registerUsernameInput, usernameErrorMessage, 'Der Benutzername');

    if (isForbidden && username.length > 0) {
        usernameErrorMessage.textContent = 'Dieser Benutzername ist nicht verfügbar.';
        usernameErrorMessage.style.display = 'block';
        registerUsernameInput.classList.add('invalid');
        registerBtn.disabled = true;
    } else if (isLengthValid && !isForbidden) {
        usernameErrorMessage.style.display = 'none';
        registerUsernameInput.classList.remove('invalid');
    }
    
    const pass = registerPasswordInput.value;
    const hasLength = pass.length >= 8;
    const hasUppercase = /[A-Z]/.test(pass);
    const hasNumber = /[0-9]/.test(pass);
    
    registerBtn.disabled = !(hasLength && hasUppercase && hasNumber && isLengthValid && !isForbidden);
});

googleUsernameInput.addEventListener('input', () => {
    const username = googleUsernameInput.value.trim().toLowerCase();
    const isForbidden = forbiddenUsernameFragments.some(fragment => username.includes(fragment));

    if (isForbidden && username.length > 0) {
        googleUsernameErrorMessage.textContent = 'Dieser Benutzername ist nicht verfügbar.';
        googleUsernameErrorMessage.style.display = 'block';
        googleUsernameInput.classList.add('invalid');
        googleUsernameSubmitBtn.disabled = true;
    } else {
        googleUsernameErrorMessage.style.display = 'none';
        googleUsernameInput.classList.remove('invalid');
        googleUsernameSubmitBtn.disabled = false;
    }
});

registerPasswordInput.addEventListener('input', () => {
    const pass = registerPasswordInput.value;
    const hasLength = pass.length >= 8;
    const hasUppercase = /[A-Z]/.test(pass);
    const hasNumber = /[0-9]/.test(pass);

    lengthCheck.classList.toggle('valid', hasLength);
    uppercaseCheck.classList.toggle('valid', hasUppercase);
    numberCheck.classList.toggle('valid', hasNumber);

    const isUsernameInvalid = registerUsernameInput.classList.contains('invalid');
    
    registerBtn.disabled = !(hasLength && hasUppercase && hasNumber) || isUsernameInvalid;
});

const handleLoginOnEnter = (event) => { if (event.key === 'Enter') { event.preventDefault(); loginBtn.click(); } };
loginEmailInput.addEventListener('keydown', handleLoginOnEnter);
loginPasswordInput.addEventListener('keydown', handleLoginOnEnter);

const handleRegisterOnEnter = (event) => { if (event.key === 'Enter' && !registerBtn.disabled) { event.preventDefault(); registerBtn.click(); } };
registerUsernameInput.addEventListener('keydown', handleRegisterOnEnter);
registerEmailInput.addEventListener('keydown', handleRegisterOnEnter);
registerPasswordInput.addEventListener('keydown', handleRegisterOnEnter);

const handlePasswordResetOnEnter = (event) => { if (event.key === 'Enter') { event.preventDefault(); sendResetEmailBtn.click(); } };
resetEmailInput.addEventListener('keydown', handlePasswordResetOnEnter);

const handleConfirmDeleteOnEnter = (event) => { if (event.key === 'Enter') { event.preventDefault(); confirmDeleteBtn.click(); } };
reauthPasswordInput.addEventListener('keydown', handleConfirmDeleteOnEnter);

document.getElementById('toggle-login-password').addEventListener('click', (e) => togglePasswordVisibility(loginPasswordInput, e.target));
document.getElementById('toggle-register-password').addEventListener('click', (e) => togglePasswordVisibility(registerPasswordInput, e.target));
document.getElementById('toggle-reauth-password').addEventListener('click', (e) => togglePasswordVisibility(reauthPasswordInput, e.target)); 

closeModalButton.addEventListener('click', closeModal);
window.addEventListener('click', (event) => { if (event.target === authModal) closeModal(); });

homeLink.addEventListener('click', (e) => { e.preventDefault(); showHomePage(); });
orderLink.addEventListener('click', (e) => { e.preventDefault(); showOrderPage(); });
orderCtaButton.addEventListener('click', showOrderPage);
userProfileLink.addEventListener('click', (e) => { e.preventDefault(); showProfilePage(); });
userOrdersLink.addEventListener('click', (e) => { e.preventDefault(); showUserOrdersPage(); });
managementOrdersLink.addEventListener('click', (e) => { e.preventDefault(); showManagementOrdersPage(); });
adminAreaLink.addEventListener('click', (e) => { e.preventDefault(); showAdminAreaPage(); });
adminToolsLink.addEventListener('click', (e) => { e.preventDefault(); showAdminToolsPage(); });

discardProfileBtn.addEventListener('click', async () => {
    await showProfilePage(); 
    showNotification("Änderungen verworfen.", "success");
});

showRegisterLink.addEventListener('click', (e) => { e.preventDefault(); switchModalView(registerView); });
showLoginLink.addEventListener('click', (e) => { e.preventDefault(); switchModalView(loginView); });
showPasswordResetLink.addEventListener('click', (e) => { e.preventDefault(); switchModalView(passwordResetView); }); 
backToLoginLink.addEventListener('click', (e) => { e.preventDefault(); switchModalView(loginView); }); 

registerBtn.addEventListener('click', async () => {
    const username = registerUsernameInput.value.trim();
    const email = registerEmailInput.value;
    const password = registerPasswordInput.value;

    if (!username || !email || !password) {
        showNotification("Bitte fülle alle Felder aus.");
        return;
    }

    setButtonLoading(registerBtn, true); 

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        await updateProfile(user, { displayName: username });
        
        await setDoc(doc(db, "users", user.uid), {
            username: username, email: email, createdAt: new Date(),
            firstName: "", lastName: "", usernameChangesThisMonth: 0,
            usernameLastChangeMonth: "none", 
            firstNameChangeCount: 0,
            lastNameChangeCount: 0,
            isCoAdmin: false, isAdmin: false, isBlocked: false,
            balance: 0,
            favorites: []
        });

        await sendEmailVerification(user);
        
        document.getElementById('verification-email-display').textContent = email;
        switchModalView(verificationMessage);

        const resendBtn = document.getElementById('resend-verification-btn');
        
        const newResendBtn = resendBtn.cloneNode(true);
        resendBtn.parentNode.replaceChild(newResendBtn, resendBtn);

        startResendCooldown(newResendBtn, 60);

        newResendBtn.addEventListener('click', async () => {
            if (!newResendBtn.disabled) {
                try {
                    if (auth.currentUser) {
                        await sendEmailVerification(auth.currentUser);
                        showNotification("Verifizierungs-E-Mail erneut gesendet.", "success");
                        startResendCooldown(newResendBtn, 60);
                    }
                } catch (error) {
                    showNotification("Fehler beim Senden der E-Mail.", "error");
                }
            }
        });

    } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
            showNotification('Diese E-Mail-Adresse wird bereits verwendet.');
        } else {
            showNotification('Fehler bei der Registrierung: ' + error.message);
        }
    } finally {
        setButtonLoading(registerBtn, false); 
    }
});

loginBtn.addEventListener('click', async () => {
    const email = loginEmailInput.value;
    const password = loginPasswordInput.value;

    if (!email || !password) {
        showNotification("Bitte gib E-Mail und Passwort ein.");
        return;
    }

    setButtonLoading(loginBtn, true); 

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        if (userCredential.user.emailVerified) {
            closeModal();
            showNotification(`Willkommen zurück, ${userCredential.user.displayName}!`, 'success');
        } else {
            showNotification("Bitte bestätige zuerst deine E-Mail-Adresse.");
            signOut(auth);
        }
    } catch (error) {
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
             showNotification('E-Mail oder Passwort ist falsch.');
        } else {
             showNotification('Fehler bei der Anmeldung: ' + error.message);
        }
    } finally {
        setButtonLoading(loginBtn, false); 
    }
});

googleSignInBtn.addEventListener('click', async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
            switchModalView(googleUsernameView);
            googleUsernameInput.value = user.displayName || '';

            googleUsernameSubmitBtn.addEventListener('click', async () => {
                const username = googleUsernameInput.value.trim();
                if (!username) {
                    showNotification("Bitte gib einen Benutzernamen ein.");
                    return;
                }

                try {
                    await updateProfile(user, { displayName: username });
                    await setDoc(doc(db, "users", user.uid), {
                        username: username,
                        email: user.email,
                        createdAt: new Date(),
                        firstName: result.user.displayName.split(' ')[0] || "",
                        lastName: result.user.displayName.split(' ').slice(1).join(' ') || "",
                        usernameChangesThisMonth: 0,
                        usernameLastChangeMonth: "none", 
                        firstNameChangeCount: 0,
                        lastNameChangeCount: 0,
                        isCoAdmin: false,
                        isAdmin: false,
                        isBlocked: false,
                        balance: 0,
                        favorites: []
                    });

                    closeModal();
                    showNotification(`Willkommen, ${username}! Dein Konto wurde erstellt.`, 'success');

                } catch (error) {
                    showNotification('Fehler beim Speichern des Benutzernamens: ' + error.message);
                }
            }, { once: true });

        } else {
            closeModal();
            showNotification(`Willkommen zurück, ${user.displayName}!`, 'success');
        }
    } catch (error) {
        if (error.code === 'auth/popup-closed-by-user') {
            showNotification('Anmeldung abgebrochen.', 'success');
        } else if (error.code === 'auth/account-exists-with-different-credential') {
            showNotification('Ein Konto mit dieser E-Mail existiert bereits. Bitte melde dich auf dem ursprünglichen Weg an.');
        } else {
            showNotification('Fehler bei der Google-Anmeldung: ' + error.message);
        }
    }
});

googleRegisterBtn.addEventListener('click', handleGoogleAuth);

sendResetEmailBtn.addEventListener('click', async () => {
    const email = resetEmailInput.value;
    if (!email) {
        showNotification("Bitte gib deine E-Mail-Adresse ein.", "error");
        return;
    }

    setButtonLoading(sendResetEmailBtn, true); 

    try {
        await sendPasswordResetEmail(auth, email);
        
        passwordResetInitialView.style.display = 'none';
        passwordResetSentView.style.display = 'block';
        document.getElementById('reset-email-display').textContent = email;

        const resendBtn = document.getElementById('resend-reset-email-btn');
        const newResendBtn = resendBtn.cloneNode(true);
        resendBtn.parentNode.replaceChild(newResendBtn, resendBtn);

        startResendCooldown(newResendBtn, 60);

        newResendBtn.addEventListener('click', async () => {
            if (!newResendBtn.disabled) {
                try {
                    await sendPasswordResetEmail(auth, email);
                    showNotification("Link zum Zurücksetzen erneut gesendet.", "success");
                    startResendCooldown(newResendBtn, 60);
                } catch (error) {
                    showNotification("Fehler beim Senden der E-Mail.", "error");
                }
            }
        });
    } catch (error) {
        showNotification("Fehler: " + error.message, "error");
    } finally {
        setButtonLoading(sendResetEmailBtn, false); 
    }
});

resetPasswordBtn.addEventListener('click', () => {
    const user = auth.currentUser;
    if (user) {
        sendPasswordResetEmail(auth, user.email)
            .then(() => {
                showNotification("E-Mail zum Zurücksetzen wurde an dein Postfach gesendet.", "success");
            })
            .catch((error) => {
                showNotification("Fehler: " + error.message);
            });
    }
});

saveProfileBtn.addEventListener('click', async () => {
    const user = auth.currentUser;
    if (!user) return;
    
    const isUsernameValid = validateInput(profileUsername, usernameProfileError, 'Der Benutzername');
    const isFirstnameValid = validateInput(profileFirstname, firstnameProfileError, 'Der Vorname');
    const isLastnameValid = validateInput(profileLastname, lastnameProfileError, 'Der Nachname');

    if (!isUsernameValid || !isFirstnameValid || !isLastnameValid) {
        showNotification("Bitte korrigiere die Fehler in deinem Profil.", "error");
        return;
    }

    const userDocRef = doc(db, "users", user.uid);
    setButtonLoading(saveProfileBtn, true); 

    try {
        const userDocSnap = await getDoc(userDocRef);
        if (!userDocSnap.exists()) {
            showNotification("Benutzerprofil nicht gefunden.", "error");
            return;
        }

        const data = userDocSnap.data();
        const newUsername = profileUsername.value.trim();
        const newFirstName = profileFirstname.value.trim();
        const newLastName = profileLastname.value.trim();
        const updates = {};
        let errorOccurred = false;
        
        if (newUsername !== user.displayName) {
            const currentMonth = new Date().toISOString().slice(0, 7);
            const changesThisMonth = data.usernameLastChangeMonth === currentMonth ? data.usernameChangesThisMonth : 0;
            
            if (changesThisMonth < 2) {
                await updateProfile(user, { displayName: newUsername });
                updates.username = newUsername;
                updates.usernameChangesThisMonth = changesThisMonth + 1;
                updates.usernameLastChangeMonth = currentMonth;
            } else {
                showNotification("Du kannst deinen Benutzernamen nur 2 Mal pro Monat ändern.", "error");
                profileUsername.value = user.displayName;
                errorOccurred = true;
            }
        }

        if (newFirstName !== (data.firstName || '')) {
            const changeCount = data.firstNameChangeCount || 0;
            if (changeCount < 2) {
                updates.firstName = newFirstName;
                updates.firstNameChangeCount = changeCount + 1;
            } else {
                showNotification("Du kannst deinen Vornamen nur 2 Mal ändern.", "error");
                profileFirstname.value = data.firstName || '';
                errorOccurred = true;
            }
        }

        if (newLastName !== (data.lastName || '')) {
            const changeCount = data.lastNameChangeCount || 0;
            if (changeCount < 2) {
                updates.lastName = newLastName;
                updates.lastNameChangeCount = changeCount + 1;
            } else {
                showNotification("Du kannst deinen Nachnamen nur 2 Mal ändern.", "error");
                profileLastname.value = data.lastName || '';
                errorOccurred = true;
            }
        }
        
        if (errorOccurred) {
            setButtonLoading(saveProfileBtn, false); 
            return;
        }

        if (Object.keys(updates).length > 0) {
            await updateDoc(userDocRef, updates);
            
            const updatedDoc = await getDoc(userDocRef);
            if (updatedDoc.exists()) {
                currentUserProfile = updatedDoc.data();
            }

            showNotification("Dein Profil wurde erfolgreich aktualisiert!", "success");
            userProfileLink.textContent = user.displayName;
        } else {
            showNotification("Es wurden keine Änderungen vorgenommen.", "success");
        }
        
        await showProfilePage();

    } catch (error) {
        console.error("Fehler beim Aktualisieren des Profils:", error);
        showNotification("Ein Fehler ist aufgetreten: " + error.message, "error");
        await showProfilePage();
    } finally {
        setButtonLoading(saveProfileBtn, false); 
    }
});


deleteAccountBtn.addEventListener('click', () => {
    reauthDeleteModal.style.display = 'flex';
});

closeReauthButton.addEventListener('click', () => {
    reauthDeleteModal.style.display = 'none';
    reauthPasswordInput.value = ''; 
});

confirmDeleteBtn.addEventListener('click', async () => {
    const user = auth.currentUser;
    const password = reauthPasswordInput.value;

    if (!user || !password) {
        showNotification("Bitte gib dein Passwort ein.", "error");
        return;
    }

    setButtonLoading(confirmDeleteBtn, true); 
    const credential = EmailAuthProvider.credential(user.email, password);
    const userDocRef = doc(db, "users", user.uid);

    try {
        await reauthenticateWithCredential(user, credential);

        try {
            const ordersQuery = query(collection(db, "orders"), where("userId", "==", user.uid));
            const querySnapshot = await getDocs(ordersQuery);
            
            const deletePromises = [];
            querySnapshot.forEach((doc) => {
                deletePromises.push(deleteDoc(doc.ref));
            });
            
            await Promise.all(deletePromises);

        } catch (orderError) {
            console.error("Fehler beim Löschen der Bestellungen:", orderError);
            showNotification("Die Bestellungen konnten nicht gelöscht werden. Das Konto wird nicht gelöscht.", "error");
            return;
        }

        try {
            await deleteDoc(userDocRef);
        } catch (dbError) {
            console.error("Fehler beim Löschen des Firestore-Dokuments:", dbError);
            showNotification("Konto konnte nicht vollständig gelöscht werden (DB-Fehler). Bitte kontaktiere den Support.", "error");
            return; 
        }
        
        await deleteUser(user);

        reauthDeleteModal.style.display = 'none';
        showNotification("Dein Konto und alle zugehörigen Bestellungen wurden endgültig gelöscht.", "success");

    } catch (authError) {
        if (authError.code === 'auth/wrong-password' || authError.code === 'auth/invalid-credential') {
            showNotification("Das eingegebene Passwort ist falsch.", "error");
        } else {
            console.error("Fehler bei Authentifizierung oder dem Löschen des Kontos:", authError);
            showNotification("Ein Fehler ist aufgetreten: " + authError.message, "error");
        }
    } finally {
        reauthPasswordInput.value = '';
        setButtonLoading(confirmDeleteBtn, false); 
    }
});

customHourSelect.addEventListener('change', () => {
    const selectedHour = customHourSelect.getAttribute('data-value');
    populateMinutes(selectedHour === '14');
    customMinuteSelect.setAttribute('data-value', '');
    customMinuteSelect.querySelector('span').textContent = '--';
    renderCart();
});

customMinuteSelect.addEventListener('change', renderCart);

const setButtonLoading = (button, isLoading) => {
    if (!button) return;
    const btnText = button.querySelector('.btn-text');
    const btnSpinner = button.querySelector('.btn-spinner');

    if (isLoading) {
        button.disabled = true;
        if (btnText) btnText.style.display = 'none';
        if (btnSpinner) btnSpinner.style.display = 'inline-block';
    } else {
        button.disabled = false;
        if (btnText) btnText.style.display = 'inline-block'; 
        if (btnSpinner) btnSpinner.style.display = 'none';
    }
};

// app.js

// ERSETZEN Sie die alte handleUserSearch-Funktion durch diese ZWEI neuen Funktionen:

/**
 * Steuert den Debounce-Timer für die Live-Suche.
 * Die Suche wird erst 300ms nach der letzten Eingabe ausgelöst.
 */
function handleUserSearchOnInput() {
    clearTimeout(searchDebounceTimer);
    searchDebounceTimer = setTimeout(() => {
        performUserSearch();
    }, 300);
}

/**
 * Führt die eigentliche Firestore-Suche aus.
 * Sucht nach Benutzernamen und E-Mails, die mit dem Suchbegriff beginnen.
 * WICHTIG: Die Suche unterscheidet zwischen Groß- und Kleinschreibung.
 */
async function performUserSearch() {
    const searchTerm = userSearchInput.value.trim();

    if (searchTerm.length === 0) {
        userSearchResultsContainer.innerHTML = '';
        return;
    }

    userSearchResultsContainer.innerHTML = '<p>Suche Nutzer...</p>';

    try {
        // Firestore-Anfrage, um Dokumente zu finden, die mit dem Suchbegriff beginnen.
        // \uf8ff ist ein spezielles Zeichen, das als "Ende des Bereichs" für den Suchbegriff dient.
        const usernameQuery = query(collection(db, "users"),
            where("username", ">=", searchTerm),
            where("username", "<=", searchTerm + '\uf8ff')
        );
        const emailQuery = query(collection(db, "users"),
            where("email", ">=", searchTerm),
            where("email", "<=", searchTerm + '\uf8ff')
        );

        const [usernameSnapshot, emailSnapshot] = await Promise.all([
            getDocs(usernameQuery),
            getDocs(emailQuery)
        ]);

        const users = new Map();
        usernameSnapshot.forEach(doc => users.set(doc.id, { id: doc.id, ...doc.data() }));
        emailSnapshot.forEach(doc => users.set(doc.id, { id: doc.id, ...doc.data() }));

        renderUserSearchResults(Array.from(users.values()));

    } catch (error) {
        console.error("Fehler bei der Nutzersuche:", error);
        userSearchResultsContainer.innerHTML = '<p>Bei der Suche ist ein Fehler aufgetreten. Prüfen Sie die Browser-Konsole für Details.</p>';
    }
}
/**
 * Stellt die gefundenen Nutzer im Suchergebnis-Container dar.
 * @param {Array} users - Ein Array von Nutzerobjekten, die angezeigt werden sollen.
 */
function renderUserSearchResults(users) {
    if (users.length === 0) {
        // Zeigt nur dann "Nichts gefunden" an, wenn auch wirklich etwas im Suchfeld steht.
        if (userSearchInput.value.trim().length > 0) {
            userSearchResultsContainer.innerHTML = '<p>Keine Nutzer für diese Suche gefunden.</p>';
        } else {
            userSearchResultsContainer.innerHTML = '';
        }
        return;
    }
    // ... der Rest der Funktion bleibt unverändert ...
    userSearchResultsContainer.innerHTML = '';
    users.forEach(user => {
        const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
        const userCard = document.createElement('div');
        userCard.className = 'user-result-card';
        userCard.dataset.userId = user.id;

        userCard.innerHTML = `
            <div class="user-info">
                <strong>${user.username}</strong>
                <span>${fullName || 'Kein Name angegeben'}</span>
                <span>${user.email}</span>
            </div>
            <div class="user-status">
                ${user.isBlocked ? '<span class="status-badge blocked">Gesperrt</span>' : ''}
                ${user.isAdmin ? '<span class="status-badge admin">Admin</span>' : ''}
                ${user.isCoAdmin ? '<span class="status-badge co-admin">Co-Admin</span>' : ''}
            </div>
            <div class="user-actions">
                 <button class="view-profile-btn secondary-button" data-user-id="${user.id}">Profil ansehen</button>
            </div>
        `;
        userSearchResultsContainer.appendChild(userCard);
    });
}


/** 
 * Öffnet ein Modal mit detaillierten Informationen zu einem Nutzer und stellt Moderationsoptionen bereit.
 * @param {string} userId - Die ID des Nutzers, dessen Details angezeigt werden sollen.
 */
async function openUserDetailModal(userId) {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
        showNotification("Nutzer nicht gefunden.", "error");
        return;
    }
    const user = userSnap.data();
    const modalContent = userDetailModal.querySelector('.modal-content');

    modalContent.innerHTML = `
        <span class="close-user-detail-modal close-button">&times;</span>
        <h2>Profil von ${user.username}</h2>
        <div class="user-details-content">
            <p><strong>Benutzername:</strong> ${user.username}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Name:</strong> ${user.firstName || ''} ${user.lastName || ''}</p>
            <p><strong>Status:</strong> ${user.isBlocked ? 'Gesperrt' : 'Aktiv'}</p>
            <p><strong>Rolle:</strong> ${user.isAdmin ? 'Admin' : (user.isCoAdmin ? 'Co-Admin' : 'Nutzer')}</p>
        </div>
        <div class="modal-button-group">
            <button class="toggle-block-btn danger-button" data-user-id="${userId}">
                ${user.isBlocked ? 'Nutzer entsperren' : 'Nutzer sperren'}
            </button>
             <button class="toggle-coadmin-btn secondary-button" data-user-id="${userId}">
                ${user.isCoAdmin ? 'Co-Admin entfernen' : 'Zum Co-Admin machen'}
            </button>
        </div>
    `;

    userDetailModal.style.display = 'flex';

    const closeModal = () => userDetailModal.style.display = 'none';

    modalContent.querySelector('.close-user-detail-modal').addEventListener('click', closeModal);

    modalContent.querySelector('.toggle-block-btn').addEventListener('click', async (e) => {
        const uid = e.target.dataset.userId;
        const isCurrentlyBlocked = user.isBlocked;
        await updateDoc(doc(db, "users", uid), { isBlocked: !isCurrentlyBlocked });
        showNotification(`Nutzer wurde ${!isCurrentlyBlocked ? 'gesperrt' : 'entsperrt'}.`, 'success');
        closeModal();
        await performUserSearch(); // Suchergebnisse aktualisieren
    });
    
    modalContent.querySelector('.toggle-coadmin-btn').addEventListener('click', async (e) => {
        const uid = e.target.dataset.userId;
        const isCurrentlyCoAdmin = user.isCoAdmin;
        await updateDoc(doc(db, "users", uid), { isCoAdmin: !isCurrentlyCoAdmin });
        showNotification(`Nutzer ist ${!isCurrentlyCoAdmin ? 'jetzt Co-Admin' : 'kein Co-Admin mehr'}.`, 'success');
        closeModal();
        await performUserSearch(); // Suchergebnisse aktualisieren
    });
}

checkoutBtn.addEventListener('click', () => {
    resetCheckoutModalState(); 
    const hour = customHourSelect.getAttribute('data-value');
    const minute = customMinuteSelect.getAttribute('data-value');
    checkoutPickupDay.textContent = selectedPickupDay || '--';
    checkoutPickupTime.textContent = hour && minute ? `${hour}:${minute}` : '--:--';
    checkoutModal.style.display = 'flex';

     const totalPrice = Object.values(cart).reduce((sum, item) => sum + item.price * item.quantity, 0);
    const currentBalance = currentUserProfile?.balance || 0;

    if (currentBalance >= totalPrice) {
        payWithBalanceBtn.disabled = false;
        payWithBalanceBtn.querySelector('.btn-text').textContent = `Mit Guthaben bezahlen  (${currentBalance.toFixed(2)} €)`;
    } else {
        payWithBalanceBtn.disabled = true;
        payWithBalanceBtn.querySelector('.btn-text').textContent = `Nicht genügend Guthaben`;
    }

    checkoutModal.style.display = 'flex';
    });



    const closeAndResetModal = () => {
    resetCheckoutModalState();
    checkoutModal.style.display = 'none';
    };

    closeCheckoutButton.addEventListener('click', closeAndResetModal);
    cancelOrderBtn.addEventListener('click', closeAndResetModal);

    reportedOrderDetailModal.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay') || e.target.classList.contains('close-button')) {
        reportedOrderDetailModal.style.display = 'none';
    }
});

managementOrdersListContainer.addEventListener('click', async (e) => {
    const target = e.target;
    const orderCard = target.closest('.order-card');
    if (!orderCard) return;

    const orderId = target.dataset.id;
    if (!orderId) return;
    const orderRef = doc(db, "orders", orderId);

    if (target.matches('.finish-order-btn')) {
        try {
            target.disabled = true;
            await updateDoc(orderRef, { adminCompleted: true });
            orderCard.style.transition = 'opacity 0.3s ease';
            orderCard.style.opacity = '0';
            setTimeout(() => {
                orderCard.remove();
                renderAdminStats();
            }, 300);
            showNotification("Bestellung als fertig markiert.", "success");
        } catch (error) {
            console.error("Fehler bei Admin-Aktion 'Fertig': ", error);
            showNotification("Aktion fehlgeschlagen.", "error");
            target.disabled = false;
        }
    }

    if (target.matches('.report-order-btn')) {
        try {
            target.disabled = true;
            await updateDoc(orderRef, { isReported: true });
            orderCard.style.transition = 'opacity 0.3s ease';
            orderCard.style.opacity = '0';
            setTimeout(() => {
                orderCard.remove();
                renderAdminStats();
            }, 300);
            showNotification("Bestellung wurde gemeldet und zur Überprüfung verschoben.", "success");
        } catch (error) {
            console.error("Fehler bei Admin-Aktion 'Melden': ", error);
            showNotification("Melden fehlgeschlagen.", "error");
            target.disabled = false;
        }
    }
    
    if (target.matches('.prepare-order-btn') && !target.disabled) {
        try {
            target.disabled = true;
            await updateDoc(orderRef, { isPrepared: true });
            orderCard.classList.add('prepared');
            target.textContent = 'Vorbereitet';
            showNotification("Bestellung als vorbereitet markiert.", "success");
        } catch (error) {
            console.error("Fehler bei Admin-Aktion 'Vorbereiten': ", error);
            showNotification("Aktion fehlgeschlagen.", "error");
            target.disabled = false;
        }
    }
});

userOrdersListContainer.addEventListener('click', async (e) => {
    const target = e.target.closest('.received-order-btn');
    if (!target) return;

    const orderId = target.dataset.id;
    const orderCard = target.closest('.order-card');
    const orderRef = doc(db, "orders", orderId);

    try {
        target.disabled = true;
        await updateDoc(orderRef, { userAcknowledged: true });
        
        orderCard.style.transition = 'opacity 0.3s ease';
        orderCard.style.opacity = '0';
        setTimeout(() => {
            orderCard.remove();
            renderArchivedOrders();
        }, 300);
        showNotification("Bestellung als erhalten markiert.", "success");

        const updatedDoc = await getDoc(orderRef);
        if (updatedDoc.exists() && updatedDoc.data().adminCompleted === true) {
            await deleteDoc(orderRef);
        }
    } catch (error) {
        console.error("Fehler bei Nutzer-Aktion: ", error);
        showNotification("Aktion fehlgeschlagen.", "error");
        target.disabled = false;
    }
});

reportedOrdersListContainer.addEventListener('click', (e) => {
    const target = e.target.closest('.reported-order-item-compact');
    if (!target) return;
    const orderId = target.dataset.id;
    openReportedOrderDetailModal(orderId);
});

reportedOrderDetailContent.addEventListener('click', async (e) => {
    if (e.target.matches('.block-user-btn') && !e.target.disabled) {
        const userId = e.target.dataset.userId;
        const orderId = e.target.dataset.orderId;
        const userRef = doc(db, "users", userId);
        const orderRef = doc(db, "orders", orderId);

        try {
            e.target.disabled = true;
            
            await Promise.all([
                updateDoc(userRef, { isBlocked: true }),
                deleteDoc(orderRef)
            ]);

            showNotification("Nutzer wurde gesperrt und die Bestellung wurde gelöscht.", "success");
            
            reportedOrderDetailModal.style.display = 'none';
            renderReportedOrders();
            renderAdminStats();

        } catch (error) {
            console.error("Fehler beim Sperren des Nutzers & Löschen der Bestellung:", error);
            showNotification("Aktion fehlgeschlagen.", "error");
            e.target.disabled = false;
        }
    }

    if (e.target.matches('.resolve-report-btn')) {
        const orderId = e.target.dataset.orderId;
        const orderRef = doc(db, "orders", orderId);
        try {
            e.target.disabled = true;
            await updateDoc(orderRef, { isReported: false });
            showNotification("Meldung wurde aufgehoben. Die Bestellung ist wieder normal sichtbar.", "success");
            reportedOrderDetailModal.style.display = 'none';
            renderReportedOrders();
            renderAdminStats();
        } catch (error) {
            console.error("Fehler beim Aufheben der Meldung:", error);
            showNotification("Aktion fehlgeschlagen.", "error");
            e.target.disabled = false;
        }
    }
});

deleteOldOrdersBtn.addEventListener('click', async () => {
    const confirmation = window.confirm("Möchtest du wirklich alle Bestellungen, die älter als 7 Tage sind, endgültig löschen? Diese Aktion kann nicht rückgängig gemacht werden.");
    if (!confirmation) return;

    deleteOldOrdersBtn.disabled = true;
    deleteOldOrdersBtn.textContent = "Lösche...";

    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const sevenDaysAgoTimestamp = Timestamp.fromDate(sevenDaysAgo);
        const q = query(collection(db, "orders"), where("timestamp", "<", sevenDaysAgoTimestamp));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            showNotification("Keine alten Bestellungen zum Löschen gefunden.", "success");
            return;
        }

        const deletePromises = [];
        querySnapshot.forEach((doc) => {
            deletePromises.push(deleteDoc(doc.ref));
        });
        
        await Promise.all(deletePromises);
        
        showNotification(`${deletePromises.length} alte Bestellungen wurden erfolgreich gelöscht.`, "success");
        renderAdminStats();

    } catch (error) {
        console.error("Fehler beim Löschen alter Bestellungen:", error);
        showNotification("Ein Fehler ist beim Löschen aufgetreten.", "error");
    } finally {
        deleteOldOrdersBtn.disabled = false;
        deleteOldOrdersBtn.textContent = "Alte Bestellungen löschen";
    }
});



startOnlinePaymentBtn.addEventListener('click', async () => {
    setButtonLoading(startOnlinePaymentBtn, true);
    
    const isReady = await initializeCheckout(); 
    
    setButtonLoading(startOnlinePaymentBtn, false);

    if (isReady) {
        checkoutInitialView.style.display = 'none';
        paymentElementContainer.style.display = 'block';
    }
});
submitPaymentBtn.addEventListener('click', handleSubmit);
backToPaymentOptionsBtn.addEventListener('click', resetCheckoutModalState);

async function initializeCheckout() {
    document.getElementById('payment-request-button-container').style.display = 'none';
    
    const cartArray = Object.keys(cart).map(id => ({
        id: id,
        quantity: cart[id].quantity
    }));

    const totalPriceForDisplay = Object.values(cart).reduce((sum, item) => sum + item.price * item.quantity, 0);

    try {
        const response = await fetch(`${backendUrl}/create-payment-intent`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cart: cartArray }),
        });

        if (!response.ok) {
            const { error } = await response.json();
            throw new Error(error || `HTTP-Fehler! Status: ${response.status}`);
        }

        const { clientSecret } = await response.json();
        elements = stripe.elements({ clientSecret, locale: 'de' });

        const paymentRequest = stripe.paymentRequest({
            country: 'DE',
            currency: 'eur',
            total: {
                label: 'Gesamtbetrag',
                amount: Math.round(totalPriceForDisplay * 100),
            },
            requestPayerName: true,
            requestPayerEmail: true,
        });

        const prButton = elements.create('paymentRequestButton', {
            paymentRequest,
        });

        
        const canMakePayment = await paymentRequest.canMakePayment();
        if (canMakePayment) {
            prButton.mount('#payment-request-button-container');
            document.getElementById('payment-request-button-container').style.display = 'block';
        } else {
            console.log("Google Pay / Apple Pay nicht verfügbar.");
        }

        paymentRequest.on('paymentmethod', async (ev) => {
            const hour = customHourSelect.getAttribute('data-value');
            const minute = customMinuteSelect.getAttribute('data-value');
            const orderDetails = {
                cart: cart,
                pickupDay: selectedPickupDay,
                pickupTime: `${hour}:${minute}`
            };
            localStorage.setItem('pendingOrderDetails', JSON.stringify(orderDetails));

            const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(
                clientSecret,
                { payment_method: ev.paymentMethod.id },
                { handleActions: false }
            );

            if (confirmError) {
                ev.complete('fail');
                showMessage(confirmError.message);
                resetCheckoutModalState();
            } else {
                ev.complete('success');
                if (paymentIntent.status === "requires_action") {
                    const { error } = await stripe.confirmCardPayment(clientSecret);
                    if (error) {
                       showMessage("Zusätzliche Bestätigung fehlgeschlagen.");
                    }
                }
            }
        });

        const paymentElement = elements.create("payment", { layout: "tabs" });
        paymentElement.mount("#payment-element");
        
        return true; 

    } catch (e) {
        console.error('Fehler beim Initialisieren des Checkouts:', e);
        showNotification(`Bezahlvorgang konnte nicht gestartet werden: ${e.message}`, 'error');
        resetCheckoutModalState();
        return false; 
    }
}

function showCardPaymentForm() {
    checkoutInitialView.style.display = 'none';
    paymentElementContainer.style.display = 'block';
}

function resetPaymentButton() {
    const btnText = startOnlinePaymentBtn.querySelector('.btn-text');
    const btnSpinner = startOnlinePaymentBtn.querySelector('.btn-spinner'); 
    
    startOnlinePaymentBtn.disabled = false;
    if (btnText) btnText.style.display = 'inline';
    if (btnSpinner) btnSpinner.style.display = 'none';
}


async function handlePayWithBalance() {
    const user = auth.currentUser;
    if (!user) return;

    const totalPrice = Object.values(cart).reduce((sum, item) => sum + item.price * item.quantity, 0);
    const hour = customHourSelect.getAttribute('data-value');
    const minute = customMinuteSelect.getAttribute('data-value');
    const pickupTime = `${hour}:${minute}`;

    if (Object.keys(cart).length === 0 || !selectedPickupDay || !pickupTime) {
        showNotification("Bestelldaten sind unvollständig.", "error");
        return;
    }

    setButtonLoading(payWithBalanceBtn, true);

    try {
        const userRef = doc(db, "users", user.uid);

        // Eine Firestore-Transaktion stellt sicher, dass das Lesen und Schreiben
        // des Guthabens als eine einzige, unteilbare Operation geschieht.
        // Das verhindert, dass ein Nutzer mit 10€ Guthaben zwei 10€-Bestellungen gleichzeitig aufgibt.
        await runTransaction(db, async (transaction) => {
            const userDoc = await transaction.get(userRef);
            if (!userDoc.exists()) {
                throw "Benutzerdokument nicht gefunden.";
            }

            const currentBalance = userDoc.data().balance || 0;
            if (currentBalance < totalPrice) {
                throw "Nicht genügend Guthaben. Die Transaktion wurde abgebrochen.";
            }

            const newBalance = currentBalance - totalPrice;
            transaction.update(userRef, { balance: newBalance });

            // Jetzt die Bestellung innerhalb der Transaktion speichern
            const orderData = await createOrderObject('Guthaben', cart, selectedPickupDay, pickupTime);
            const newOrderRef = doc(collection(db, "orders")); // Erzeuge eine Referenz für das neue Dokument
            transaction.set(newOrderRef, orderData);
        });

        checkoutModal.style.display = 'none';
        showNotification("Bestellung erfolgreich mit Guthaben bezahlt!", "success");
        resetOrder();
        showUserOrdersPage();

    } catch (error) {
        console.error("Fehler bei der Guthaben-Zahlung: ", error);
        showNotification(`Zahlung fehlgeschlagen: ${error}`, "error");
    } finally {
        setButtonLoading(payWithBalanceBtn, false);
    }
}

async function createOrderObject(paymentMethod, orderCart, orderPickupDay, orderPickupTime) {
    const user = auth.currentUser;
    const totalPrice = Object.values(orderCart).reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    // Wir verwenden currentUserProfile hier, da es die aktuellsten Daten (Vor/Nachname) hat
    const userFirstName = currentUserProfile?.firstName || "";
    const userLastName = currentUserProfile?.lastName || "";
    const orderNumber = Math.floor(100000 + Math.random() * 900000).toString();

    return {
        orderNumber,
        userId: user.uid,
        userName: user.displayName,
        userFirstName,
        userLastName, 
        items: orderCart,
        totalPrice,
        pickupDay: orderPickupDay,
        pickupTime: orderPickupTime,
        timestamp: Timestamp.now(),
        status: 'pending',
        paymentMethod,
        adminCompleted: false,
        userAcknowledged: false,
isReported: false,
isPrepared: false
    };
}

async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const hour = customHourSelect.getAttribute('data-value');
    const minute = customMinuteSelect.getAttribute('data-value');
    if (Object.keys(cart).length === 0 || !selectedPickupDay || !hour || !minute) {
        showNotification("Bitte stelle sicher, dass Warenkorb, Tag und Uhrzeit vollständig sind.", "error");
        setLoading(false);
        return;
    }

    const orderDetails = {
        cart: cart,
        pickupDay: selectedPickupDay,
        pickupTime: `${hour}:${minute}`
    };
    localStorage.setItem('pendingOrderDetails', JSON.stringify(orderDetails));

    const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
            return_url: window.location.origin + window.location.pathname,
        },
    });

    if (error.type === "card_error" || error.type === "validation_error") {
        showMessage(error.message);
    } else {
        showMessage("Ein unerwarteter Fehler ist aufgetreten.");
    }

    setLoading(false);
}

async function checkStatus() {
    const clientSecret = new URLSearchParams(window.location.search).get("payment_intent_client_secret");
    if (!clientSecret) return;

    window.history.replaceState({}, document.title, window.location.pathname);

    const user = await getAuthUserAfterRedirect();
    if (!user) {
        showNotification("Sitzung abgelaufen. Bitte melde dich erneut an, um die Bestellung zu sehen.", "error");
        return;
    }

    const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);


switch (paymentIntent.status) {
    case "succeeded":
        const pendingOrderJSON = localStorage.getItem('pendingOrderDetails');
        if (pendingOrderJSON) {
            const pendingOrder = JSON.parse(pendingOrderJSON);
            try {
                await saveOrderToFirestore('Online-Zahlung', pendingOrder.cart, pendingOrder.pickupDay, pendingOrder.pickupTime);
                
                localStorage.removeItem('pendingOrderDetails');
                showNotification("Zahlung erfolgreich! Deine Bestellung wurde aufgegeben.", "success");
                resetOrder();
                showUserOrdersPage();

            } catch (error) {
                console.error("Fehler: Zahlung erfolgreich, aber Bestellung konnte nicht gespeichert werden:", error);
                showNotification("Zahlung erfolgreich, aber die Bestellung konnte nicht gespeichert werden. Bitte kontaktiere den Support mit der Bestellzeit.", "error");
            }
        } else {
            showNotification("Zahlung erfolgreich, aber die Bestelldaten konnten nicht gefunden werden. Bitte kontaktiere den Support.", "error");
        }
        break;


        case "processing":
        // Eine neutrale Benachrichtigung ist hier besser.
        showNotification("Deine Zahlung wird noch verarbeitet.", "success"); 
        break;

    case "requires_payment_method":
        // Dies ist der wichtigste Fall für eine Fehlermeldung.
        showNotification("Zahlung fehlgeschlagen. Deine Bestellung wurde nicht aufgegeben.", "error");
        // Optional: Öffne das Checkout-Fenster erneut, damit der Nutzer es direkt nochmal versuchen kann.
        checkoutBtn.click();
        break;

    default:
        // Eine allgemeine Fehlermeldung.
        showNotification("Ein Fehler ist aufgetreten. Die Bestellung konnte nicht abgeschlossen werden.", "error");
        break;
    }
}

confirmOrderBtn.addEventListener('click', () => {
    const hour = customHourSelect.getAttribute('data-value');
    const minute = customMinuteSelect.getAttribute('data-value');
    saveOrderToFirestore('Barzahlung', cart, selectedPickupDay, `${hour}:${minute}`);
});


// app.js

async function saveOrderToFirestore(paymentMethod, orderCart, orderPickupDay, orderPickupTime) {
    const user = auth.currentUser;
    if (!user) {
        showNotification("Du musst angemeldet sein, um zu bestellen.", "error");
        return;
    }

    if (Object.keys(orderCart).length === 0 || !orderPickupDay || !orderPickupTime) {
        showNotification("Bestelldaten sind unvollständig.", "error");
        return;
    }

    // Setzt die Ladeindikatoren für die entsprechenden Buttons
    if (paymentMethod === 'Barzahlung') {
        setButtonLoading(confirmOrderBtn, true);
    } else {
        setButtonLoading(submitPaymentBtn, true);
    }
    
    try {
        // Erstellt das Bestellobjekt mit allen notwendigen Informationen
        const totalPrice = Object.values(orderCart).reduce((sum, item) => sum + item.price * item.quantity, 0);
        const userFirstName = currentUserProfile?.firstName || "";
        const userLastName = currentUserProfile?.lastName || "";
        const orderNumber = Math.floor(100000 + Math.random() * 900000).toString();

        const orderData = {
            orderNumber,
            userId: user.uid,
            userName: user.displayName,
            userFirstName,
            userLastName, 
            items: orderCart,
            totalPrice,
            pickupDay: orderPickupDay,
            pickupTime: orderPickupTime,
            timestamp: Timestamp.now(),
            status: 'pending',
            paymentMethod,
            adminCompleted: false,
            userAcknowledged: false,
            isReported: false,
            isPrepared: false
        };

        // Fügt das fertige Bestellobjekt zur "orders"-Sammlung in Firestore hinzu
        await addDoc(collection(db, "orders"), orderData);

        checkoutModal.style.display = 'none';
        
        // Zeigt nur bei Barzahlung eine direkte Erfolgsmeldung.
        // Bei Online-Zahlung wird die Meldung nach der Rückkehr von Stripe angezeigt.
        if (paymentMethod === 'Barzahlung') {
           showNotification("Bestellung wurde erfolgreich abgeschickt!", "success");
           resetOrder();
           showUserOrdersPage();
        }

    } catch (error) {
        console.error("Fehler beim Senden der Bestellung: ", error);
        showNotification("Ein Fehler ist aufgetreten. Bitte versuche es erneut.", "error");
    } finally {
        // Setzt die Ladeindikatoren der Buttons zurück
        if (paymentMethod === 'Barzahlung') {
            setButtonLoading(confirmOrderBtn, false);
        } else {
            setButtonLoading(submitPaymentBtn, false);
        }
    }
}


function showMessage(messageText) {
    paymentMessage.textContent = messageText;
    paymentMessage.style.display = 'block';
}

function setLoading(isLoading) {
    if (isLoading) {
        submitPaymentBtn.disabled = true;
        document.getElementById('spinner').style.display = 'inline';
        document.getElementById('button-text').style.display = 'none';
    } else {
        submitPaymentBtn.disabled = false;
        document.getElementById('spinner').style.display = 'none';
        document.getElementById('button-text').style.display = 'inline';
    }
}

// --- Logik für Favoriten & Archiv (ANGEPASST & NEU) ---

favoritesHeader.addEventListener('click', () => {
    favoritesSection.classList.toggle('open');
});

archivedOrdersHeader.addEventListener('click', () => {
    archivedOrdersSection.classList.toggle('open');
});

function renderFavorites() {
    if (!currentUserProfile || !currentUserProfile.favorites || currentUserProfile.favorites.length === 0) {
        favoritesSection.style.display = 'none';
        return;
    }
    
    favoritesSection.style.display = 'block';
    favoritesList.innerHTML = '';

    currentUserProfile.favorites.forEach(itemId => {
        const menuItemElem = document.querySelector(`.menu-item[data-id="${itemId}"]`);
        if (menuItemElem) {
            const clone = menuItemElem.cloneNode(true);
            const quantityDisplay = clone.querySelector('.quantity');
            quantityDisplay.textContent = cart[itemId] ? cart[itemId].quantity : 0;
            favoritesList.appendChild(clone);
        }
    });
}

async function toggleFavorite(itemId) {
    if (!currentUserProfile) {
        showNotification("Bitte melde dich an, um Favoriten zu speichern.");
        return;
    }

    const userRef = doc(db, "users", auth.currentUser.uid);
    let currentFavorites = currentUserProfile.favorites || [];
    const index = currentFavorites.indexOf(itemId);

    if (index > -1) {
        currentFavorites.splice(index, 1);
    } else {
        currentFavorites.push(itemId);
    }

    try {
        await updateDoc(userRef, { favorites: currentFavorites });
        currentUserProfile.favorites = currentFavorites;
        updateFavoriteIcons();
        renderFavorites();
    } catch (error) {
        console.error("Fehler beim Speichern der Favoriten:", error);
        showNotification("Favorit konnte nicht gespeichert werden.");
    }
}

function updateFavoriteIcons() {
    const favoriteIds = currentUserProfile?.favorites || [];
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        const menuItem = btn.closest('.menu-item');
        if (menuItem) {
            const itemId = menuItem.dataset.id;
            const icon = btn.querySelector('i');
            if (favoriteIds.includes(itemId)) {
                btn.classList.add('is-favorite');
                icon.classList.remove('fa-regular');
                icon.classList.add('fa-solid');
            } else {
                btn.classList.remove('is-favorite');
                icon.classList.remove('fa-solid');
                icon.classList.add('fa-regular');
            }
        }
    });
}

// NEU: Zentrale Funktion zur Warenkorb-Verwaltung
function handleCartAction(itemId, action) {
    const menuItem = document.querySelector(`.menu-item[data-id="${itemId}"]`);
    if (!menuItem) return;

    const name = menuItem.dataset.name;
    const price = parseFloat(menuItem.dataset.price);

    if (!cart[itemId]) {
        cart[itemId] = { name, price, quantity: 0 };
    }

    if (action === 'plus') {
        cart[itemId].quantity++;
    } else if (action === 'minus') {
        if (cart[itemId].quantity > 0) {
            cart[itemId].quantity--;
        }
    }

    if (cart[itemId].quantity === 0) {
        delete cart[itemId];
    }

    // Aktualisiere die Anzeige für ALLE Instanzen dieses Items (im Menü und in den Favoriten)
    const allItemInstances = document.querySelectorAll(`.menu-item[data-id="${itemId}"]`);
    allItemInstances.forEach(instance => {
        const quantityDisplay = instance.querySelector('.quantity');
        if (quantityDisplay) {
            quantityDisplay.textContent = cart[itemId] ? cart[itemId].quantity : 0;
        }
    });

    renderCart();
}


// Event Listener für das Hauptmenü und die Favoritenliste
[menuContainer, favoritesList].forEach(container => {
    container.addEventListener('click', (e) => {
        const target = e.target;
        const menuItem = target.closest('.menu-item');
        if (!menuItem) return;

        const id = menuItem.dataset.id;
        
        if (target.closest('.favorite-btn')) {
            toggleFavorite(id);
        } else if (target.closest('.plus-btn')) {
            handleCartAction(id, 'plus');
        } else if (target.closest('.minus-btn')) {
            handleCartAction(id, 'minus');
        }
    });
});