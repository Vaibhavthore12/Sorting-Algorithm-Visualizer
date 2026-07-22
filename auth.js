/**
 * SortCraft — Authentication & User Profile Manager
 */

class AuthManager {
    constructor() {
        this.usersKey = 'sortcraft_users_v2';
        this.currentUserKey = 'sortcraft_active_user_v2';
        this.themeModeKey = 'sortcraft_theme_mode_v2';

        this.currentUser = null;
        this.isLightMode = false;

        this.init();
    }

    init() {
        this.loadUsers();
        this.loadCurrentUser();
        this.loadThemeMode();
        this.setupDOM();
        this.setupEventListeners();
        this.updateProfileUI();
    }

    loadUsers() {
        const stored = localStorage.getItem(this.usersKey);
        if (!stored) {
            const defaultUser = {
                id: 'usr_demo',
                name: 'Alex Mercer',
                email: 'alex@sortcraft.io',
                password: 'password123',
                visualizationsRun: 14,
                joinedDate: new Date().toLocaleDateString()
            };
            this.users = [defaultUser];
            this.saveUsers();
        } else {
            try {
                this.users = JSON.parse(stored);
            } catch (e) {
                this.users = [];
            }
        }
    }

    saveUsers() {
        localStorage.setItem(this.usersKey, JSON.stringify(this.users));
    }

    loadCurrentUser() {
        const stored = localStorage.getItem(this.currentUserKey);
        if (stored) {
            try {
                this.currentUser = JSON.parse(stored);
            } catch (e) {
                this.currentUser = null;
            }
        }
    }

    saveCurrentUser() {
        if (this.currentUser) {
            localStorage.setItem(this.currentUserKey, JSON.stringify(this.currentUser));
            const idx = this.users.findIndex(u => u.email === this.currentUser.email);
            if (idx !== -1) {
                this.users[idx] = this.currentUser;
                this.saveUsers();
            }
        } else {
            localStorage.removeItem(this.currentUserKey);
        }
    }

    loadThemeMode() {
        const mode = localStorage.getItem(this.themeModeKey);
        if (mode === 'light') {
            this.setLightMode(true);
        } else {
            this.setLightMode(false);
        }
    }

    setLightMode(isLight) {
        this.isLightMode = isLight;
        localStorage.setItem(this.themeModeKey, isLight ? 'light' : 'dark');

        const icon = document.getElementById('modeIcon');
        const modeText = document.getElementById('modeText');

        if (isLight) {
            document.body.classList.add('theme-light');
            if (icon) icon.className = 'fa-solid fa-sun';
            if (modeText) modeText.innerText = 'Light';
        } else {
            document.body.classList.remove('theme-light');
            if (icon) icon.className = 'fa-solid fa-moon';
            if (modeText) modeText.innerText = 'Dark';
        }

        if (window.sortEngine) {
            window.sortEngine.render();
        }
    }

    toggleLightMode() {
        this.setLightMode(!this.isLightMode);
    }

    login(email, password) {
        const user = this.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
        if (!user) {
            return { success: false, message: 'No account found with this email address.' };
        }
        if (user.password !== password) {
            return { success: false, message: 'Incorrect password. Please try again.' };
        }

        this.currentUser = user;
        this.saveCurrentUser();
        this.updateProfileUI();
        return { success: true, message: `Welcome back, ${user.name}!` };
    }

    register(name, email, password) {
        const existing = this.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
        if (existing) {
            return { success: false, message: 'An account with this email already exists.' };
        }

        const newUser = {
            id: 'usr_' + Date.now(),
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password: password,
            visualizationsRun: 0,
            joinedDate: new Date().toLocaleDateString()
        };

        this.users.push(newUser);
        this.saveUsers();

        this.currentUser = newUser;
        this.saveCurrentUser();
        this.updateProfileUI();
        return { success: true, message: `Account created successfully! Welcome, ${newUser.name}!` };
    }

    logout() {
        this.currentUser = null;
        this.saveCurrentUser();
        this.updateProfileUI();
    }

    recordVisualizationRun() {
        if (this.currentUser) {
            this.currentUser.visualizationsRun = (this.currentUser.visualizationsRun || 0) + 1;
            this.saveCurrentUser();
            this.updateProfileUI();
        }
    }

    setupDOM() {}

    setupEventListeners() {
        const modeBtn = document.getElementById('modeToggleBtn');
        if (modeBtn) {
            modeBtn.addEventListener('click', () => this.toggleLightMode());
        }

        const authBtn = document.getElementById('authModalBtn');
        if (authBtn) {
            authBtn.addEventListener('click', () => this.openModal('login'));
        }

        const closeBtn = document.getElementById('authCloseBtn');
        const overlay = document.getElementById('authOverlay');

        if (closeBtn) closeBtn.addEventListener('click', () => this.closeModal());
        if (overlay) overlay.addEventListener('click', (e) => {
            if (e.target === overlay) this.closeModal();
        });

        // User Guide Modal handlers
        const guideBtn = document.getElementById('guideModalBtn');
        const guideOverlay = document.getElementById('guideOverlay');
        const guideClose = document.getElementById('guideCloseBtn');

        if (guideBtn && guideOverlay) {
            guideBtn.addEventListener('click', () => guideOverlay.classList.add('active'));
        }
        if (guideClose && guideOverlay) {
            guideClose.addEventListener('click', () => guideOverlay.classList.remove('active'));
        }
        if (guideOverlay) {
            guideOverlay.addEventListener('click', (e) => {
                if (e.target === guideOverlay) guideOverlay.classList.remove('active');
            });
        }

        const tabLogin = document.getElementById('tabLoginBtn');
        const tabRegister = document.getElementById('tabRegisterBtn');

        if (tabLogin) tabLogin.addEventListener('click', () => this.switchTab('login'));
        if (tabRegister) tabRegister.addEventListener('click', () => this.switchTab('register'));

        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = document.getElementById('loginEmail').value;
                const pass = document.getElementById('loginPassword').value;
                const res = this.login(email, pass);
                this.showAuthNotice(res.message, res.success ? 'success' : 'error');
                if (res.success) {
                    setTimeout(() => this.closeModal(), 1200);
                }
            });
        }

        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = document.getElementById('regName').value;
                const email = document.getElementById('regEmail').value;
                const pass = document.getElementById('regPassword').value;
                const res = this.register(name, email, pass);
                this.showAuthNotice(res.message, res.success ? 'success' : 'error');
                if (res.success) {
                    setTimeout(() => this.closeModal(), 1200);
                }
            });
        }

        document.querySelectorAll('.toggle-password-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetId = btn.getAttribute('data-target');
                const input = document.getElementById(targetId);
                if (input) {
                    const isPass = input.type === 'password';
                    input.type = isPass ? 'text' : 'password';
                    btn.innerHTML = isPass ? '<i class="fa-solid fa-eye-slash"></i>' : '<i class="fa-solid fa-eye"></i>';
                }
            });
        });

        const profileTrigger = document.getElementById('profileTrigger');
        const profileDropdown = document.getElementById('profileDropdown');
        const logoutBtn = document.getElementById('logoutBtn');

        if (profileTrigger && profileDropdown) {
            profileTrigger.addEventListener('click', (e) => {
                e.stopPropagation();
                profileDropdown.classList.toggle('active');
            });

            document.addEventListener('click', (e) => {
                if (!profileTrigger.contains(e.target) && !profileDropdown.contains(e.target)) {
                    profileDropdown.classList.remove('active');
                }
            });
        }

        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.logout();
                if (profileDropdown) profileDropdown.classList.remove('active');
            });
        }
    }

    openModal(tab = 'login') {
        const overlay = document.getElementById('authOverlay');
        if (overlay) {
            overlay.classList.add('active');
            this.switchTab(tab);
            this.clearNotice();
        }
    }

    closeModal() {
        const overlay = document.getElementById('authOverlay');
        if (overlay) {
            overlay.classList.remove('active');
        }
    }

    switchTab(tab) {
        const tabLogin = document.getElementById('tabLoginBtn');
        const tabRegister = document.getElementById('tabRegisterBtn');
        const formLogin = document.getElementById('loginForm');
        const formRegister = document.getElementById('registerForm');

        this.clearNotice();

        if (tab === 'login') {
            tabLogin.classList.add('active');
            tabRegister.classList.remove('active');
            formLogin.style.display = 'flex';
            formRegister.style.display = 'none';
        } else {
            tabRegister.classList.add('active');
            tabLogin.classList.remove('active');
            formRegister.style.display = 'flex';
            formLogin.style.display = 'none';
        }
    }

    showAuthNotice(msg, type = 'error') {
        const box = document.getElementById('authNoticeBox');
        if (box) {
            box.innerText = msg;
            box.className = `auth-notice-box ${type}`;
            box.style.display = 'block';
        }
    }

    clearNotice() {
        const box = document.getElementById('authNoticeBox');
        if (box) {
            box.style.display = 'none';
            box.innerText = '';
        }
    }

    updateProfileUI() {
        const authBtn = document.getElementById('authModalBtn');
        const profileBox = document.getElementById('profileBox');

        if (this.currentUser) {
            if (authBtn) authBtn.style.display = 'none';
            if (profileBox) profileBox.style.display = 'flex';

            const nameEl = document.getElementById('profileName');
            const emailEl = document.getElementById('profileEmail');
            const avatarEl = document.getElementById('profileAvatar');
            const statsEl = document.getElementById('profileStatsRun');

            const initials = this.currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);

            if (nameEl) nameEl.innerText = this.currentUser.name;
            if (emailEl) emailEl.innerText = this.currentUser.email;
            if (avatarEl) avatarEl.innerText = initials;
            if (statsEl) statsEl.innerText = this.currentUser.visualizationsRun || 0;
        } else {
            if (authBtn) authBtn.style.display = 'flex';
            if (profileBox) profileBox.style.display = 'none';
        }
    }
}

window.addEventListener('DOMContentLoaded', () => {
    window.authManager = new AuthManager();
});
