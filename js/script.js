document.addEventListener('DOMContentLoaded', () => {

    // --- Navbar Scroll Effect ---
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // --- Mobile Menu Toggle ---
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
        // Close menu when clicking a link
        document.querySelectorAll('.nav-links li a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }

    // --- Auth Modal Logic (present on all pages) ---
    const authModal = document.getElementById('authModal');
    const closeModal = document.getElementById('closeModal');
    const btnNavLogin = document.getElementById('navLoginBtn');
    const btnNavSignup = document.getElementById('navSignupBtn');
    const btnHeroSignup = document.getElementById('heroSignupBtn'); // Only on index
    const tabLogin = document.getElementById('tabLogin');
    const tabSignup = document.getElementById('tabSignup');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    function updateUserUI() {
        const storedName = localStorage.getItem('aarogyam_firstName');
        const authButtonsDiv = document.querySelector('.auth-buttons');
        let logoutBtn = document.getElementById('navLogoutBtn');

        if (storedName) {
            if (btnNavLogin) btnNavLogin.style.display = 'none';
            if (btnNavSignup) {
                btnNavSignup.textContent = `Hi, ${storedName}`;
                btnNavSignup.style.pointerEvents = 'none';
            }
            
            // Inject Logout Button dynamically if it doesn't exist
            if (authButtonsDiv && !logoutBtn) {
                logoutBtn = document.createElement('button');
                logoutBtn.id = 'navLogoutBtn';
                logoutBtn.textContent = 'Logout';
                logoutBtn.style.marginLeft = '10px';
                logoutBtn.style.padding = '8px 20px';
                logoutBtn.style.background = 'transparent';
                logoutBtn.style.border = '2px solid var(--primary-color)';
                logoutBtn.style.color = 'var(--primary-color)';
                logoutBtn.style.borderRadius = '50px';
                logoutBtn.style.fontWeight = '600';
                logoutBtn.style.cursor = 'pointer';
                logoutBtn.style.transition = 'all 0.3s ease';
                
                logoutBtn.addEventListener('mouseenter', () => {
                    logoutBtn.style.background = 'var(--primary-color)';
                    logoutBtn.style.color = 'white';
                });
                logoutBtn.addEventListener('mouseleave', () => {
                    logoutBtn.style.background = 'transparent';
                    logoutBtn.style.color = 'var(--primary-color)';
                });
                
                logoutBtn.addEventListener('click', () => {
                    localStorage.removeItem('aarogyam_firstName');
                    sessionStorage.clear();
                    window.location.reload();
                });
                
                authButtonsDiv.appendChild(logoutBtn);
            } else if (logoutBtn) {
                logoutBtn.style.display = 'inline-block';
            }
            
            const dynamicNameEl = document.getElementById('heroDynamicName');
            if (dynamicNameEl) {
                dynamicNameEl.textContent = `Hi ${storedName}!`;
                dynamicNameEl.classList.add('appear');
            }
            // Release specific gated content if present
            const gatedContent = document.getElementById('authGatedContent');
            if (gatedContent) {
                gatedContent.style.display = 'block';
                gatedContent.style.opacity = '1';
                gatedContent.style.pointerEvents = 'auto';
            }
            
            document.body.style.overflow = 'auto';
            
            const closeBtnOrig = document.getElementById('closeModal');
            if (closeBtnOrig) closeBtnOrig.style.display = 'block';

        } else {
            // Restore default UI if no user session
            if (btnNavLogin) btnNavLogin.style.display = 'inline-block';
            if (btnNavSignup) {
                btnNavSignup.textContent = 'Sign Up';
                btnNavSignup.style.pointerEvents = 'auto';
            }
            if (logoutBtn) logoutBtn.style.display = 'none';
            
            const dynamicNameEl = document.getElementById('heroDynamicName');
            if (dynamicNameEl) {
                dynamicNameEl.textContent = '';
                dynamicNameEl.classList.remove('appear');
            }

            // Authentication Gate Enforcement for Contact Page ONLY
            if (window.location.pathname.includes('contact.html') || window.location.pathname.endsWith('contact')) {
                document.body.style.overflow = 'hidden';
                window.scrollTo(0,0);
                
                const authModal = document.getElementById('authModal');
                if (authModal) {
                    authModal.classList.add('active');
                    authModal.style.pointerEvents = 'auto'; // allow modal interaction
                    const closeBtnOrig = document.getElementById('closeModal');
                    if (closeBtnOrig) closeBtnOrig.style.display = 'none'; // Trap user fully
                }
            }
        }
    }
    updateUserUI();

    function openModal(mode) {
        if (!authModal) return;
        authModal.classList.add('active');
        if (mode === 'login') {
            tabLogin.classList.add('active');
            tabSignup.classList.remove('active');
            loginForm.classList.add('active');
            signupForm.classList.remove('active');
        } else {
            tabSignup.classList.add('active');
            tabLogin.classList.remove('active');
            signupForm.classList.add('active');
            loginForm.classList.remove('active');
        }
    }

    if (btnNavLogin) btnNavLogin.addEventListener('click', () => openModal('login'));
    if (btnNavSignup) btnNavSignup.addEventListener('click', () => openModal('signup'));
    if (btnHeroSignup) btnHeroSignup.addEventListener('click', () => openModal('signup'));
    
    if (closeModal) {
        closeModal.addEventListener('click', () => authModal.classList.remove('active'));
    }
    
    // Close when clicking outside content
    window.addEventListener('click', (e) => {
        if (e.target === authModal) authModal.classList.remove('active');
    });

    if (tabLogin) tabLogin.addEventListener('click', () => openModal('login'));
    if (tabSignup) tabSignup.addEventListener('click', () => openModal('signup'));

    // --- Auth API Calls ---
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('signupName').value;
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
            const msgBox = document.getElementById('signupMessage');
            
            try {
                const res = await fetch('/api/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, password })
                });
                const data = await res.json();
                if (res.ok) {
                    msgBox.textContent = 'Account created successfully! Please login.';
                    msgBox.className = 'message success';
                    setTimeout(() => openModal('login'), 2000);
                } else {
                    msgBox.textContent = data.error || 'Signup failed';
                    msgBox.className = 'message error';
                }
            } catch (err) {
                msgBox.textContent = 'Network error';
                msgBox.className = 'message error';
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            const msgBox = document.getElementById('loginMessage');
            
            try {
                const res = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const data = await res.json();
                if (res.ok) {
                    msgBox.textContent = 'Login successful!';
                    msgBox.className = 'message success';
                    
                    const firstName = data.user.name.split(' ')[0];
                    localStorage.setItem('aarogyam_firstName', firstName);
                    updateUserUI();
                    
                    setTimeout(() => {
                        authModal.classList.remove('active');
                        const closeBtnOrig = document.getElementById('closeModal');
                        if (closeBtnOrig) closeBtnOrig.style.display = 'block';
                    }, 1000);
                } else {
                    msgBox.textContent = data.error || 'Login failed';
                    msgBox.className = 'message error';
                }
            } catch (err) {
                msgBox.textContent = 'Network error';
                msgBox.className = 'message error';
            }
        });
    }

    // --- Booking Preview & Submission (Only on booking.html) ---
    const bookingForm = document.getElementById('bookingForm');
    const inputDate = document.getElementById('date');
    const inputTime = document.getElementById('time');
    const inputYogaType = document.getElementById('yogaType');
    const previewCard = document.getElementById('previewCard');

    if (bookingForm && inputDate && inputTime && inputYogaType && previewCard) {
        function updatePreview() {
            const dateVal = inputDate.value;
            const timeVal = inputTime.value;
            const yogaVal = inputYogaType.value;
            
            if (dateVal && timeVal && yogaVal) {
                const dateObj = new Date(dateVal);
                const formattedDate = dateObj.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                
                previewCard.innerHTML = `
                    <h3>Session Details</h3>
                    <ul class="preview-details">
                        <li><span class="label">Class:</span> <span class="value">${yogaVal}</span></li>
                        <li><span class="label">Date:</span> <span class="value">${formattedDate}</span></li>
                        <li><span class="label">Time:</span> <span class="value">${timeVal}</span></li>
                        <li><span class="label">Duration:</span> <span class="value">60 Minutes</span></li>
                        <li><span class="label">Status:</span> <span class="value" style="color:var(--primary-color);">Pending</span></li>
                    </ul>
                `;
            } else {
                previewCard.innerHTML = `<p>Select a date, time, and yoga type to see your preview here.</p>`;
            }
        }

        inputDate.addEventListener('change', updatePreview);
        inputTime.addEventListener('change', updatePreview);
        inputYogaType.addEventListener('change', updatePreview);

        // Disable past dates in date picker
        const today = new Date().toISOString().split('T')[0];
        inputDate.setAttribute('min', today);

        bookingForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Intercept booking if user is not logged in
            const storedName = localStorage.getItem('aarogyam_firstName');
            if(!storedName) {
                const authModal = document.getElementById('authModal');
                if (authModal) {
                    authModal.classList.add('active');
                    const msgBox = document.getElementById('bookingMessage');
                    if(msgBox) {
                        msgBox.textContent = 'Please log in or sign up first to confirm your booking.';
                        msgBox.className = 'message error';
                    }
                }
                return;
            }

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const age = document.getElementById('age').value;
            const yogaType = inputYogaType.value;
            const date = inputDate.value;
            const time = inputTime.value;
            
            const msgBox = document.getElementById('bookingMessage');
            const submitBtn = bookingForm.querySelector('.btn-submit');

            submitBtn.textContent = 'Processing...';
            submitBtn.disabled = true;

            try {
                const res = await fetch('/api/book', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, phone, age, yogaType, date, time })
                });
                const data = await res.json();
                
                if (res.ok) {
                    msgBox.textContent = data.message || 'Booking successful!';
                    msgBox.className = 'message success';
                    
                    // Retain preview data and mark as confirmed
                    const confirmedYoga = yogaType;
                    const confirmedDate = new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                    const confirmedTime = time;
                    
                    bookingForm.reset();
                    
                    previewCard.innerHTML = `
                        <h3 style="color:#2e7d32;">Session Confirmed!</h3>
                        <ul class="preview-details">
                            <li><span class="label">Class:</span> <span class="value">${confirmedYoga}</span></li>
                            <li><span class="label">Date:</span> <span class="value">${confirmedDate}</span></li>
                            <li><span class="label">Time:</span> <span class="value">${confirmedTime}</span></li>
                            <li><span class="label">Duration:</span> <span class="value">60 Minutes</span></li>
                            <li><span class="label">Status:</span> <span class="value" style="color:#2e7d32; font-weight:700;">Confirmed</span></li>
                        </ul>
                    `;
                    
                    setTimeout(() => msgBox.textContent = '', 5000);
                } else {
                    msgBox.textContent = data.error || 'Failed to book slot.';
                    msgBox.className = 'message error';
                }
            } catch (err) {
                msgBox.textContent = 'Network error. Please try again.';
                msgBox.className = 'message error';
            } finally {
                submitBtn.textContent = 'Confirm Booking';
                submitBtn.disabled = false;
            }
        });
    }

    // --- Contact Form (Only on contact.html) ---
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const msgBox = document.getElementById('contactMessage');
            const submitBtn = contactForm.querySelector('.btn-submit');
            
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Mocking API call for contact form
            setTimeout(() => {
                msgBox.textContent = 'Message sent successfully! We will get back to you soon.';
                msgBox.className = 'message success';
                contactForm.reset();
                submitBtn.textContent = 'Submit Message';
                submitBtn.disabled = false;
                setTimeout(() => msgBox.textContent = '', 5000);
            }, 1000);
        });
    }

    // --- Fade-In Scroll Animations ---
    const fadeElements = document.querySelectorAll('.fade-in');
    if (fadeElements.length > 0) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.15
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('appear');
                    observer.unobserve(entry.target); // Run once
                }
            });
        }, observerOptions);

        fadeElements.forEach(el => observer.observe(el));
    }

});
