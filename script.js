document.addEventListener('DOMContentLoaded', () => {
    let closeMenu;

    // Mobile Menu Functionality
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navWrapper = document.querySelector('.nav-wrapper');
    const body = document.body;

    if (mobileMenuBtn && navWrapper) {
        // Toggle menu
        mobileMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('active');
            navWrapper.classList.toggle('active');
            body.classList.toggle('menu-open');
        });

        navWrapper.addEventListener('click', function(e) {
            e.stopPropagation();
        });

        // Add dropdown toggles for mobile
        const dropdownItems = document.querySelectorAll('.has-dropdown');
        dropdownItems.forEach(item => {
            const dropdownToggle = item.querySelector('.dropdown-toggle');
            if (!dropdownToggle) return;

            let icon = dropdownToggle.querySelector('.dropdown-icon');
            if (!icon) {
                icon = document.createElement('span');
                icon.className = 'dropdown-icon';
                icon.setAttribute('aria-hidden', 'true');
                icon.textContent = '+';
                dropdownToggle.appendChild(icon);
            }

            dropdownToggle.setAttribute('aria-expanded', 'false');

            dropdownToggle.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                const wasActive = item.classList.contains('active');
                // Close all other dropdowns
                dropdownItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                        const otherMegaMenu = otherItem.querySelector('.mega-menu');
                        if (otherMegaMenu) {
                            otherMegaMenu.style.display = 'none';
                        }
                        const otherToggle = otherItem.querySelector('.dropdown-toggle');
                        const otherIcon = otherItem.querySelector('.dropdown-icon');
                        if (otherIcon) otherIcon.textContent = '+';
                        if (otherToggle) otherToggle.setAttribute('aria-expanded', 'false');
                    }
                });
                // Toggle current dropdown
                item.classList.toggle('active');
                const megaMenu = item.querySelector('.mega-menu');
                if (megaMenu) {
                    if (wasActive) {
                        megaMenu.style.display = 'none';
                        icon.textContent = '+';
                        dropdownToggle.setAttribute('aria-expanded', 'false');
                    } else {
                        megaMenu.style.display = 'block';
                        icon.textContent = '×';
                        dropdownToggle.setAttribute('aria-expanded', 'true');
                    }
                }
            };

            // Ensure clicking the link always navigates
            const link = item.querySelector('a');
            if (link) {
                link.onclick = function(e) {
                    if (window.innerWidth <= 768) {
                        // Always navigate, never open dropdown
                        // No preventDefault here
                    }
                };
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!body.classList.contains('menu-open')) {
                return;
            }
            if (!navWrapper.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                closeMenu();
            }
        });

        // Close menu on window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                closeMenu();
                // Reset mega-menu display for desktop
                document.querySelectorAll('.mega-menu').forEach(menu => {
                    menu.style.display = '';
                });
                initializeDesktopDropdowns();
            }
        });

        // Helper function to close menu
        closeMenu = function() {
            mobileMenuBtn.classList.remove('active');
            navWrapper.classList.remove('active');
            body.classList.remove('menu-open');
            // Close all dropdowns
            const dropdownItems = document.querySelectorAll('.has-dropdown');
            dropdownItems.forEach(item => {
                item.classList.remove('active');
                const megaMenu = item.querySelector('.mega-menu');
                if (megaMenu) {
                    megaMenu.style.display = 'none';
                }
                const dropdownToggle = item.querySelector('.dropdown-toggle');
                const icon = item.querySelector('.dropdown-icon');
                if (dropdownToggle) dropdownToggle.setAttribute('aria-expanded', 'false');
                if (icon) icon.textContent = '+';
            });
        };
    }

    // Desktop dropdown behavior
    const initializeDesktopDropdowns = () => {
        const dropdownItems = document.querySelectorAll('.has-dropdown');
        dropdownItems.forEach(item => {
            if (item.dataset.hoverBound === 'true') return;
            let hideTimer;
            const megaMenu = item.querySelector('.mega-menu');
            if (!megaMenu) return;

            item.addEventListener('mouseenter', () => {
                clearTimeout(hideTimer);
                megaMenu.style.display = 'block';
            });

            item.addEventListener('mouseleave', () => {
                hideTimer = setTimeout(() => {
                    megaMenu.style.display = 'none';
                }, 300);
            });

            megaMenu.addEventListener('mouseenter', () => {
                clearTimeout(hideTimer);
                megaMenu.style.display = 'block';
            });

            megaMenu.addEventListener('mouseleave', () => {
                hideTimer = setTimeout(() => {
                    megaMenu.style.display = 'none';
                }, 300);
            });

            item.dataset.hoverBound = 'true';
        });
    };

    const desktopQuery = window.matchMedia('(min-width: 769px)');
    if (desktopQuery.matches) {
        initializeDesktopDropdowns();
    }
    desktopQuery.addEventListener('change', (event) => {
        if (event.matches) {
            initializeDesktopDropdowns();
        } else {
            document.querySelectorAll('.mega-menu').forEach(menu => {
                menu.style.display = '';
            });
        }
    });

    // Contact form handling (Formspree AJAX pattern)
    const contactForm = document.getElementById("contact-form");
    if (contactForm) {
        contactForm.addEventListener("submit", async function(event) {
            event.preventDefault();
            const status = document.getElementById("form-status");
            const data = new FormData(contactForm);
            fetch(contactForm.action, {
                method: contactForm.method,
                body: data,
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                if (response.ok) {
                    status.innerHTML = "Merci pour votre message ! Nous vous répondrons rapidement.";
                    contactForm.reset();
                } else {
                    response.json().then(data => {
                        if (Object.hasOwn(data, 'errors')) {
                            status.innerHTML = data["errors"].map(error => error["message"]).join(", ");
                        } else {
                            status.innerHTML = "Une erreur est survenue. Veuillez réessayer.";
                        }
                    });
                }
            }).catch(error => {
                status.innerHTML = "Une erreur est survenue. Veuillez réessayer.";
            });
        });
    }

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Header Scroll Effect
    const header = document.querySelector('header');
    let lastScroll = 0;

    if (header) {
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll <= 0) {
                header.classList.remove('scroll-up');
                return;
            }
            
            if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
                header.classList.remove('scroll-up');
                header.classList.add('scroll-down');
            } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
                header.classList.remove('scroll-down');
                header.classList.add('scroll-up');
            }
            
            lastScroll = currentScroll;
        });
    }

    // Intersection Observer for Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements with animation classes
    document.querySelectorAll('.fade-in, .slide-in, .scale-in').forEach((element) => {
        observer.observe(element);
    });

    // Hero section animations
    const heroContent = document.querySelector('.hero-content');
    const heroImage = document.querySelector('.hero-image');
    
    if (heroContent) {
        heroContent.classList.add('fade-in');
    }
    if (heroImage) {
        heroImage.classList.add('slide-in');
    }

    // Service cards animations
    document.querySelectorAll('.service-card').forEach((card, index) => {
        card.classList.add('fade-in');
        card.style.animationDelay = `${index * 0.1}s`;
    });

    // Back to Top Button
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    // Handle active state for navigation
    // Get current page URL
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Get all navigation links
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    // Remove all active classes first
    navLinks.forEach(link => link.classList.remove('active'));
    
    // Add active class to current page link
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
            
            // If the link is in a dropdown, also highlight the parent dropdown link
            const dropdownParent = link.closest('.has-dropdown');
            if (dropdownParent) {
                const dropdownLink = dropdownParent.querySelector('a');
                if (dropdownLink) {
                    dropdownLink.classList.add('active');
                }
            }
        }
        
        // Special case for services pages in dropdown
        if (currentPage.includes('comptabilite') || 
            currentPage.includes('fiscalite') || 
            currentPage.includes('juridique') || 
            currentPage.includes('damancom') || 
            currentPage.includes('simple-impots') || 
            currentPage.includes('paie')) {
            const servicesLink = document.querySelector('.nav-menu a[href="services.html"]');
            if (servicesLink) {
                servicesLink.classList.add('active');
            }
        }
    });
    // Event delegation for blog cards
    const blogList = document.querySelector('.blog-list');
    if (blogList) {
        blogList.addEventListener('click', function(e) {
            const card = e.target.closest('.blog-card');
            if (card) {
                const blogId = card.getAttribute('data-blog');
                openBlogModal(blogId);
                e.preventDefault();
            }
            // Also handle clicks on .btn-outline or h2 a
            if (e.target.classList.contains('btn-outline') || (e.target.tagName === 'A' && e.target.closest('.blog-card'))) {
                const cardLink = e.target.closest('.blog-card');
                if (cardLink) {
                    const blogId = cardLink.getAttribute('data-blog');
                    openBlogModal(blogId);
                    e.preventDefault();
                }
            }
        });
    }
    // Close modal on ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeBlogModal();
    });
    // Close modal on click outside content
    const blogModal = document.getElementById('blog-modal');
    if (blogModal) {
        blogModal.addEventListener('click', function(e) {
            if (e.target === this) closeBlogModal();
        });
    }
});

const setResultLines = (elementId, lines) => {
    const container = document.getElementById(elementId);
    if (!container) return;
    container.textContent = '';
    lines.forEach((line, index) => {
        container.appendChild(document.createTextNode(line));
        if (index < lines.length - 1) {
            container.appendChild(document.createElement('br'));
        }
    });
};

const getInputValue = (id) => {
    const element = document.getElementById(id);
    if (!element) return null;
    return element.value;
};

const getNumberValue = (id) => {
    const rawValue = getInputValue(id);
    if (rawValue === null) return null;
    return parseFloat(rawValue) || 0;
};

const getIntValue = (id) => {
    const rawValue = getInputValue(id);
    if (rawValue === null) return null;
    return parseInt(rawValue, 10) || 0;
};

const hasElements = (ids) => ids.every(id => document.getElementById(id));

// Loan Repayment Calculator
function calculateLoan() {
    if (!hasElements(['loan-amount', 'loan-rate', 'loan-years', 'loan-result'])) return;
    const amount = getNumberValue('loan-amount');
    const rate = getNumberValue('loan-rate') / 100 / 12;
    const years = getNumberValue('loan-years');
    const n = years * 12;
    if (amount > 0 && rate > 0 && n > 0) {
        const monthly = (amount * rate) / (1 - Math.pow(1 + rate, -n));
        const total = monthly * n;
        setResultLines('loan-result', [
            `Mensualité: ${monthly.toFixed(2)} DH`,
            `Total remboursé: ${total.toFixed(2)} DH`
        ]);
    } else {
        setResultLines('loan-result', ['Veuillez remplir tous les champs.']);
    }
}

// Break-even Point Calculator
function calculateBreakEven() {
    if (!hasElements(['fixed-costs', 'unit-price', 'unit-cost', 'breakeven-result'])) return;
    const fixed = getNumberValue('fixed-costs');
    const price = getNumberValue('unit-price');
    const cost = getNumberValue('unit-cost');
    if (price > cost && fixed > 0) {
        const qty = fixed / (price - cost);
        setResultLines('breakeven-result', [`Seuil de rentabilité: ${qty.toFixed(2)} unités`]);
    } else {
        setResultLines('breakeven-result', ['Veuillez remplir tous les champs correctement.']);
    }
}

// Gross/Net Margin Calculator
function calculateMargin() {
    if (!hasElements(['revenue', 'cost-of-goods', 'expenses', 'margin-result'])) return;
    const revenue = getNumberValue('revenue');
    const cogs = getNumberValue('cost-of-goods');
    const expenses = getNumberValue('expenses');
    if (revenue > 0) {
        const gross = revenue - cogs;
        const grossMargin = (gross / revenue) * 100;
        const net = revenue - cogs - expenses;
        const netMargin = (net / revenue) * 100;
        setResultLines('margin-result', [
            `Marge brute: ${grossMargin.toFixed(2)}%`,
            `Marge nette: ${netMargin.toFixed(2)}%`
        ]);
    } else {
        setResultLines('margin-result', ['Veuillez remplir tous les champs.']);
    }
}

// Depreciation Calculator (Declining Balance)
function calculateDepreciation() {
    if (!hasElements(['dep-asset-value', 'dep-rate', 'dep-years', 'dep-result'])) return;
    const value = getNumberValue('dep-asset-value');
    const rate = getNumberValue('dep-rate') / 100;
    const years = getIntValue('dep-years');
    const resultContainer = document.getElementById('dep-result');
    resultContainer.textContent = '';
    if (value > 0 && rate > 0 && years > 0) {
        const table = document.createElement('table');
        const headerRow = document.createElement('tr');
        ['Année', 'Amortissement', 'Valeur résiduelle'].forEach(text => {
            const th = document.createElement('th');
            th.textContent = text;
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);

        let bookValue = value;
        for (let i = 1; i <= years; i++) {
            const dep = bookValue * rate;
            bookValue -= dep;
            const row = document.createElement('tr');
            [i, dep.toFixed(2), bookValue.toFixed(2)].forEach(text => {
                const td = document.createElement('td');
                td.textContent = text;
                row.appendChild(td);
            });
            table.appendChild(row);
        }
        resultContainer.appendChild(table);
    } else {
        setResultLines('dep-result', ['Veuillez remplir tous les champs.']);
    }
}

// Working Capital Calculator
function calculateWorkingCapital() {
    if (!hasElements(['current-assets', 'current-liabilities', 'wc-result'])) return;
    const assets = getNumberValue('current-assets');
    const liabilities = getNumberValue('current-liabilities');
    if (assets >= 0 && liabilities >= 0) {
        const wc = assets - liabilities;
        setResultLines('wc-result', [`Fonds de roulement: ${wc.toFixed(2)} DH`]);
    } else {
        setResultLines('wc-result', ['Veuillez remplir tous les champs.']);
    }
}

// Quick Ratio & Current Ratio Calculator
function calculateLiquidityRatios() {
    if (!hasElements(['qr-assets', 'qr-inventory', 'qr-liabilities', 'liquidity-result'])) return;
    const assets = getNumberValue('qr-assets');
    const inventory = getNumberValue('qr-inventory');
    const liabilities = getNumberValue('qr-liabilities');
    if (assets > 0 && liabilities > 0) {
        const currentRatio = assets / liabilities;
        const quickRatio = (assets - inventory) / liabilities;
        setResultLines('liquidity-result', [
            `Current Ratio: ${currentRatio.toFixed(2)}`,
            `Quick Ratio: ${quickRatio.toFixed(2)}`
        ]);
    } else {
        setResultLines('liquidity-result', ['Veuillez remplir tous les champs.']);
    }
}

// Simple Invoice Generator
function generateInvoice() {
    if (!hasElements(['inv-client', 'inv-desc', 'inv-amount', 'invoice-result'])) return;
    const client = getInputValue('inv-client');
    const desc = getInputValue('inv-desc');
    const amount = getNumberValue('inv-amount');
    const resultContainer = document.getElementById('invoice-result');
    resultContainer.textContent = '';
    if (client && desc && amount > 0) {
        const wrapper = document.createElement('div');
        wrapper.style.border = '1px solid #ccc';
        wrapper.style.padding = '10px';

        const title = document.createElement('strong');
        title.textContent = 'Facture';

        const clientLine = document.createElement('div');
        clientLine.textContent = `Client: ${client}`;

        const descLine = document.createElement('div');
        descLine.textContent = `Description: ${desc}`;

        const amountLine = document.createElement('div');
        amountLine.textContent = `Montant: ${amount.toFixed(2)} DH`;

        wrapper.appendChild(title);
        wrapper.appendChild(document.createElement('br'));
        wrapper.appendChild(clientLine);
        wrapper.appendChild(descLine);
        wrapper.appendChild(amountLine);
        resultContainer.appendChild(wrapper);
    } else {
        resultContainer.textContent = 'Veuillez remplir tous les champs.';
    }
}

// Expense Splitter
function splitExpense() {
    if (!hasElements(['split-amount', 'split-people', 'split-result'])) return;
    const amount = getNumberValue('split-amount');
    const people = getIntValue('split-people');
    if (amount > 0 && people > 0) {
        const share = amount / people;
        setResultLines('split-result', [`Part par personne: ${share.toFixed(2)} DH`]);
    } else {
        setResultLines('split-result', ['Veuillez remplir tous les champs.']);
    }
}

// VAT Reverse Charge Calculator
function calculateReverseVAT() {
    if (!hasElements(['vat-base', 'vat-rate', 'reversevat-result'])) return;
    const base = getNumberValue('vat-base');
    const rate = getNumberValue('vat-rate') / 100;
    if (base > 0 && rate > 0) {
        const vat = base * rate;
        setResultLines('reversevat-result', [`TVA à autoliquider: ${vat.toFixed(2)} DH`]);
    } else {
        setResultLines('reversevat-result', ['Veuillez remplir tous les champs.']);
    }
}

// Blog Modal Logic
function openBlogModal(blogId) {
    const modal = document.getElementById('blog-modal');
    const modalContent = document.getElementById('blog-modal-content');
    const blogContent = document.getElementById('blog-content-' + blogId);
    if (blogContent) {
        // Clone the content to avoid moving it from hidden div
        const clone = blogContent.cloneNode(true);
        // Remove previous content except close button
        while (modalContent.childNodes.length > 1) {
            modalContent.removeChild(modalContent.lastChild);
        }
        modalContent.appendChild(clone);
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
        document.body.style.overflow = 'hidden';
    }
}

function closeBlogModal() {
    const modal = document.getElementById('blog-modal');
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
    document.body.style.overflow = '';
}
