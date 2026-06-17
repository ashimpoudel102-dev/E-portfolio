/* 
========================================================================
   CENTRAL JAVASCRIPT ENGINE - ASHIM POUDEL EPORTFOLIO
   Features: Universal Dark/Light Sync, Typing Simulation, Statistics
             Counter, Client-Server Simulator, and 6 Javascript Mini-Apps
========================================================================
*/

document.addEventListener('DOMContentLoaded', () => {
    // -----------------------------------------------------------------
    // 1. UNIVERSAL THEME CONFIGURATION (Light / Dark)
    // -----------------------------------------------------------------
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // Load theme from localStorage or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
        updateThemeToggleIcon(savedTheme);
    } else {
        const defaultTheme = systemPrefersDark ? 'dark' : 'light';
        htmlElement.setAttribute('data-theme', defaultTheme);
        updateThemeToggleIcon(defaultTheme);
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeToggleIcon(newTheme);
        });
    }

    function updateThemeToggleIcon(theme) {
        if (!themeToggleBtn) return;
        const icon = themeToggleBtn.querySelector('i');
        if (theme === 'dark') {
            icon.className = 'fas fa-sun text-warning';
        } else {
            icon.className = 'fas fa-moon text-primary';
        }
    }

    // -----------------------------------------------------------------
    // 2. NAV HANDLING: smooth in-page scroll + active-section highlighting
    // -----------------------------------------------------------------
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

    // Smooth scroll for in-page anchors
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    // update url hash without jumping
                    history.replaceState(null, '', href);
                }
            });
        }
    });

    // Active section highlighting using IntersectionObserver for single-page
    const sections = document.querySelectorAll('[data-section], section[id]');
    if (sections.length > 0 && navLinks.length > 0) {
        const obsOptions = { root: null, rootMargin: '0px 0px -40% 0px', threshold: 0 };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    navLinks.forEach(link => {
                        const href = link.getAttribute('href');
                        if (href === `#${id}`) {
                            link.classList.add('active');
                        } else if (!href || !href.startsWith('#')) {
                            // leave external/page links alone
                        } else {
                            link.classList.remove('active');
                        }
                    });
                }
            });
        }, obsOptions);

        sections.forEach(sec => observer.observe(sec));
    } else {
        // fallback: keep original page-based active highlighting for multi-page
        const currentPath = window.location.pathname;
        const pageName = currentPath.split("/").pop() || 'index.html';
        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            if (linkHref === pageName) link.classList.add('active');
        });
    }

    // -----------------------------------------------------------------
    // 3. SCROLL-TO-TOP BUTTON
    // -----------------------------------------------------------------
    const scrollTopBtn = document.getElementById('scroll-to-top');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // -----------------------------------------------------------------
    // 4. HERO PAGE TYPING SIMULATION (index.html)
    // -----------------------------------------------------------------
    const typingElement = document.getElementById('typed-text');
    if (typingElement) {
        const phrases = ["Junior Full Stack Developer", "Computer System Engineering Student", "Creative Frontend Designer", "Passionate Tech Learner"];
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;

        function typeEffect() {
            const currentPhrase = phrases[phraseIndex];
            
            if (isDeleting) {
                typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 50; // faster deletion
            } else {
                typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 100;
            }

            if (!isDeleting && charIndex === currentPhrase.length) {
                isDeleting = true;
                typingSpeed = 2000; // pause at full text
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typingSpeed = 500; // pause before typing next
            }

            setTimeout(typeEffect, typingSpeed);
        }
        
        setTimeout(typeEffect, 1000);
    }

    // -----------------------------------------------------------------
    // 5. ANIMATED STATISTICS COUNTER (index.html)
    // -----------------------------------------------------------------
    const counters = document.querySelectorAll('.stat-number-counter');
    if (counters.length > 0) {
        const runCounters = () => {
            counters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-target'));
                const duration = 2000; // ms
                const increment = target / (duration / 16); // 60 FPS
                let current = 0;

                const updateCount = () => {
                    current += increment;
                    if (current < target) {
                        counter.textContent = Math.ceil(current) + (counter.getAttribute('data-suffix') || '');
                        requestAnimationFrame(updateCount);
                    } else {
                        counter.textContent = target + (counter.getAttribute('data-suffix') || '');
                    }
                };
                updateCount();
            });
        };

        // Trigger on load for simplicity, or use intersection observer
        runCounters();
    }

    // -----------------------------------------------------------------
    // 6. CLIENT-SERVER REQUEST SIMULATOR (fullstack.html)
    // -----------------------------------------------------------------
    const simTriggerBtn = document.getElementById('sim-trigger-btn');
    const simPacket = document.getElementById('sim-packet');
    const simConsole = document.getElementById('sim-console-output');

    if (simTriggerBtn && simPacket && simConsole) {
        simTriggerBtn.addEventListener('click', () => {
            // Disable button during animation
            simTriggerBtn.disabled = true;
            simConsole.innerHTML = `<span class="text-primary">> Client triggered: fetch('/api/student/ashim')...</span><br>`;
            
            // Phase 1: Client to Server (Left to Middle)
            simPacket.style.transition = 'left 1.5s ease-in-out';
            simPacket.style.left = '50%';
            
            setTimeout(() => {
                simConsole.innerHTML += `<span class="text-warning">> Server received GET request...</span><br>`;
                simConsole.innerHTML += `<span class="text-warning">> Querying Database for Student Record ID...</span><br>`;
                
                // Phase 2: Server to Database (Middle to Right)
                simPacket.style.transition = 'left 1s ease-in-out';
                simPacket.style.left = '85%';
                
                setTimeout(() => {
                    simConsole.innerHTML += `<span class="text-success">> DB MATCH FOUND: "Ashim Poudel" in ISMT Biratnagar collection.</span><br>`;
                    simConsole.innerHTML += `<span class="text-warning">> Encoding query response payload to JSON...</span><br>`;
                    
                    // Phase 3: DB back to Server (Right to Middle)
                    simPacket.style.left = '50%';
                    
                    setTimeout(() => {
                        simConsole.innerHTML += `<span class="text-warning">> Node.js server dispatching HTTP 200 OK headers...</span><br>`;
                        
                        // Phase 4: Server back to Client (Middle to Left)
                        simPacket.style.left = '22%';
                        
                        setTimeout(() => {
                            simConsole.innerHTML += `<span class="text-success">> Response rendered on Client DOM:</span><br>`;
                            simConsole.innerHTML += `<pre class="text-info" style="margin:0; font-size:0.8rem;">{\n  "status": "success",\n  "college": "ISMT Biratnagar",\n  "name": "Ashim Poudel",\n  "course": "Computer System Engineering"\n}</pre>`;
                            
                            // Reset
                            simTriggerBtn.disabled = false;
                        }, 1500);
                        
                    }, 1000);
                    
                }, 1000);
                
            }, 1500);
        });
    }

    // -----------------------------------------------------------------
    // 7. JAVASCRIPT PAGE - MINI PROJECTS (javascript.html)
    // -----------------------------------------------------------------

    // --- APP 1: CALCULATOR ENGINE ---
    const calcScreen = document.getElementById('calc-display-screen');
    const calcButtons = document.querySelectorAll('.calc-btn');
    if (calcScreen && calcButtons.length > 0) {
        let calcVal = '';
        calcButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.textContent;
                
                if (action === 'C') {
                    calcVal = '';
                    calcScreen.value = '0';
                } else if (action === '=') {
                    try {
                        // Clean equation strings and perform safe evaluation
                        let expression = calcVal.replace(/×/g, '*').replace(/÷/g, '/');
                        if (expression.trim() === '') return;
                        
                        // Prevent arbitrary execution, sanitize characters
                        if (/^[0-9+\-*/().\s]+$/.test(expression)) {
                            let result = Function(`"use strict"; return (${expression})`)();
                            
                            if (result === Infinity || result === -Infinity) {
                                calcScreen.value = 'Error: Div by 0';
                                calcVal = '';
                            } else {
                                // Round decimal to 6 points
                                calcScreen.value = Number(result.toFixed(6)).toString();
                                calcVal = calcScreen.value;
                            }
                        } else {
                            calcScreen.value = 'Error';
                            calcVal = '';
                        }
                    } catch (err) {
                        calcScreen.value = 'Syntax Error';
                        calcVal = '';
                    }
                } else {
                    if (calcScreen.value === '0' || calcScreen.value === 'Error' || calcScreen.value === 'Syntax Error' || calcScreen.value === 'Error: Div by 0') {
                        calcVal = '';
                    }
                    calcVal += action;
                    calcScreen.value = calcVal;
                }
            });
        });
    }

    // --- APP 2: TO-DO LIST PERSISTENT ENGINE ---
    const todoAddBtn = document.getElementById('todo-add-btn');
    const todoInputField = document.getElementById('todo-input-field');
    const todoListContainer = document.getElementById('todo-list');
    
    if (todoListContainer) {
        let tasks = JSON.parse(localStorage.getItem('ashim_tasks')) || [
            { id: 1, text: "Read Semantic HTML documentation", completed: true },
            { id: 2, text: "Style portfolio landing page", completed: false }
        ];

        function renderTasks() {
            todoListContainer.innerHTML = '';
            tasks.forEach(task => {
                const li = document.createElement('li');
                li.className = `todo-item ${task.completed ? 'completed' : ''}`;
                li.innerHTML = `
                    <div class="d-flex align-items-center gap-2">
                        <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(${task.id})">
                        <span>${escapeHtml(task.text)}</span>
                    </div>
                    <button class="todo-btn-del" onclick="deleteTask(${task.id})"><i class="fas fa-trash-alt"></i></button>
                `;
                todoListContainer.appendChild(li);
            });
            localStorage.setItem('ashim_tasks', JSON.stringify(tasks));
        }

        window.toggleTask = function(id) {
            tasks = tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task);
            renderTasks();
        };

        window.deleteTask = function(id) {
            tasks = tasks.filter(task => task.id !== id);
            renderTasks();
        };

        if (todoAddBtn && todoInputField) {
            todoAddBtn.addEventListener('click', () => {
                const txt = todoInputField.value.trim();
                if (txt === '') return;
                tasks.push({ id: Date.now(), text: txt, completed: false });
                todoInputField.value = '';
                renderTasks();
            });
            todoInputField.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    todoAddBtn.click();
                }
            });
        }

        renderTasks();
    }

    function escapeHtml(text) {
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // --- APP 3: COUNTER APP ---
    const counterDisplay = document.getElementById('cnt-display');
    const counterInc = document.getElementById('cnt-inc');
    const counterDec = document.getElementById('cnt-dec');
    const counterRst = document.getElementById('cnt-rst');
    
    if (counterDisplay && counterInc) {
        let count = 0;
        const updateDisplay = () => {
            counterDisplay.textContent = count;
            // animate counter element
            counterDisplay.style.transform = 'scale(1.2)';
            setTimeout(() => counterDisplay.style.transform = 'scale(1)', 100);
        };
        counterInc.addEventListener('click', () => {
            count++;
            updateDisplay();
        });
        counterDec.addEventListener('click', () => {
            count--;
            updateDisplay();
        });
        counterRst.addEventListener('click', () => {
            count = 0;
            updateDisplay();
        });
    }

    // --- APP 4: THEME VARIABLES SIMULATOR ---
    const simThemeToggle = document.getElementById('sim-theme-toggle-btn');
    const simBoxFrame = document.getElementById('sim-theme-box');
    if (simThemeToggle && simBoxFrame) {
        simThemeToggle.addEventListener('click', () => {
            const isLight = simBoxFrame.classList.contains('bg-light');
            if (isLight) {
                simBoxFrame.classList.remove('bg-light', 'text-dark');
                simBoxFrame.classList.add('bg-dark', 'text-white');
                simBoxFrame.querySelector('.sim-status').textContent = 'Dark Mode Active (Var --bg: #060913)';
                simThemeToggle.className = 'btn btn-outline-warning btn-sm';
                simThemeToggle.innerHTML = '<i class="fas fa-sun"></i> Switch to Light';
            } else {
                simBoxFrame.classList.remove('bg-dark', 'text-white');
                simBoxFrame.classList.add('bg-light', 'text-dark');
                simBoxFrame.querySelector('.sim-status').textContent = 'Light Mode Active (Var --bg: #f0f4f9)';
                simThemeToggle.className = 'btn btn-outline-dark btn-sm';
                simThemeToggle.innerHTML = '<i class="fas fa-moon"></i> Switch to Dark';
            }
        });
    }

    // --- APP 5: CLIENT-SIDE VALIDATOR ---
    const valForm = document.getElementById('sim-validation-form');
    const valName = document.getElementById('val-name');
    const valEmail = document.getElementById('val-email');
    const valFeedback = document.getElementById('val-feedback-msg');
    
    if (valForm && valName && valEmail && valFeedback) {
        valForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let hasError = false;
            
            // Validate name
            if (valName.value.trim().length < 3) {
                valName.classList.add('is-invalid');
                valName.classList.remove('is-valid');
                hasError = true;
            } else {
                valName.classList.remove('is-invalid');
                valName.classList.add('is-valid');
            }

            // Validate email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(valEmail.value.trim())) {
                valEmail.classList.add('is-invalid');
                valEmail.classList.remove('is-valid');
                hasError = true;
            } else {
                valEmail.classList.remove('is-invalid');
                valEmail.classList.add('is-valid');
            }

            if (!hasError) {
                valFeedback.className = 'alert alert-success mt-3';
                valFeedback.innerHTML = '<i class="fas fa-check-circle"></i> Validation Success! Form is ready to dispatch.';
                valFeedback.classList.remove('d-none');
            } else {
                valFeedback.className = 'alert alert-danger mt-3';
                valFeedback.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Form has errors. Please check red fields.';
                valFeedback.classList.remove('d-none');
            }
        });

        // Clear triggers
        valName.addEventListener('input', () => {
            if (valName.value.trim().length >= 3) {
                valName.classList.remove('is-invalid');
                valName.classList.add('is-valid');
            }
        });
        valEmail.addEventListener('input', () => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailRegex.test(valEmail.value.trim())) {
                valEmail.classList.remove('is-invalid');
                valEmail.classList.add('is-valid');
            }
        });
    }

    // --- APP 6: DYNAMIC TEXT ANALYZER ---
    const txtArea = document.getElementById('analyzer-textarea');
    const wordCountBadge = document.getElementById('cnt-words');
    const charCountBadge = document.getElementById('cnt-chars');
    const readingTimeBadge = document.getElementById('cnt-readtime');

    if (txtArea && wordCountBadge) {
        txtArea.addEventListener('input', () => {
            const val = txtArea.value.trim();
            const charCount = val.length;
            
            // Count words (splitting on space, filter empty values)
            const words = val.split(/\s+/).filter(word => word.length > 0);
            const wordCount = words.length;

            // Reading time based on average 200 WPM
            const readTime = Math.ceil(wordCount / 200);

            wordCountBadge.textContent = wordCount;
            charCountBadge.textContent = charCount;
            readingTimeBadge.textContent = readTime + ' min';
        });
    }

});
