document.addEventListener('DOMContentLoaded', () => {
    let closeMenu;

    // Mobile Menu Functionality
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navWrapper = document.querySelector('.nav-wrapper');
    const navMenu = document.querySelector('.nav-menu');
    const body = document.body;

    if (mobileMenuBtn && navWrapper) {
        // Toggle menu
        mobileMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('active');
            navWrapper.classList.toggle('active');
            body.classList.toggle('menu-open');
        });

        // Add dropdown toggles for mobile
        const dropdownItems = document.querySelectorAll('.has-dropdown');
        dropdownItems.forEach(item => {
            // Use the existing button only
            const dropdownToggle = item.querySelector('.dropdown-toggle');
            if (!dropdownToggle) return;

            // Remove ALL existing .dropdown-icon spans inside the button
            dropdownToggle.querySelectorAll('.dropdown-icon').forEach(icon => icon.remove());

           

            const icon = dropdownToggle.querySelector('.dropdown-icon');

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
                        const otherIcon = otherItem.querySelector('.dropdown-icon');
                        if (otherIcon) otherIcon.textContent = '+';
                    }
                });
                // Toggle current dropdown
                item.classList.toggle('active');
                const megaMenu = item.querySelector('.mega-menu');
                if (megaMenu) {
                    if (wasActive) {
                        megaMenu.style.display = 'none';
                        icon.textContent = '+';
                    } else {
                        megaMenu.style.display = 'block';
                        icon.textContent = '×';
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
            });
        };
    }

    // Desktop dropdown behavior
    if (window.innerWidth > 768) {
        const dropdownItems = document.querySelectorAll('.has-dropdown');
        dropdownItems.forEach(item => {
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
        });
    }

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
});

// Handle active state for navigation
document.addEventListener('DOMContentLoaded', function() {
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
});

// Loan Repayment Calculator
function calculateLoan() {
    const amount = parseFloat(document.getElementById('loan-amount').value) || 0;
    const rate = parseFloat(document.getElementById('loan-rate').value) / 100 / 12;
    const years = parseFloat(document.getElementById('loan-years').value) || 0;
    const n = years * 12;
    let result = '';
    if (amount > 0 && rate > 0 && n > 0) {
        const monthly = (amount * rate) / (1 - Math.pow(1 + rate, -n));
        const total = monthly * n;
        result = `Mensualité: ${monthly.toFixed(2)} DH<br>Total remboursé: ${total.toFixed(2)} DH`;
    } else {
        result = 'Veuillez remplir tous les champs.';
    }
    document.getElementById('loan-result').innerHTML = result;
}

// Currency Converter (placeholder rates)
function convertCurrency() {
    const amount = parseFloat(document.getElementById('currency-amount').value) || 0;
    const from = document.getElementById('currency-from').value;
    const to = document.getElementById('currency-to').value;
    // Example rates (MAD: 1, EUR: 11, USD: 10)
    const rates = { MAD: 1, EUR: 11, USD: 10 };
    let result = '';
    if (from && to && amount > 0) {
        const madValue = amount * rates[from];
        const converted = madValue / rates[to];
        result = `${amount} ${from} = ${converted.toFixed(2)} ${to}`;
    } else {
        result = 'Veuillez remplir tous les champs.';
    }
    document.getElementById('currency-result').innerHTML = result;
}

// Break-even Point Calculator
function calculateBreakEven() {
    const fixed = parseFloat(document.getElementById('fixed-costs').value) || 0;
    const price = parseFloat(document.getElementById('unit-price').value) || 0;
    const cost = parseFloat(document.getElementById('unit-cost').value) || 0;
    let result = '';
    if (price > cost && fixed > 0) {
        const qty = fixed / (price - cost);
        result = `Seuil de rentabilité: ${qty.toFixed(2)} unités`;
    } else {
        result = 'Veuillez remplir tous les champs correctement.';
    }
    document.getElementById('breakeven-result').innerHTML = result;
}

// Gross/Net Margin Calculator
function calculateMargin() {
    const revenue = parseFloat(document.getElementById('revenue').value) || 0;
    const cogs = parseFloat(document.getElementById('cost-of-goods').value) || 0;
    const expenses = parseFloat(document.getElementById('expenses').value) || 0;
    let result = '';
    if (revenue > 0) {
        const gross = revenue - cogs;
        const grossMargin = (gross / revenue) * 100;
        const net = revenue - cogs - expenses;
        const netMargin = (net / revenue) * 100;
        result = `Marge brute: ${grossMargin.toFixed(2)}%<br>Marge nette: ${netMargin.toFixed(2)}%`;
    } else {
        result = 'Veuillez remplir tous les champs.';
    }
    document.getElementById('margin-result').innerHTML = result;
}

// Depreciation Calculator (Declining Balance)
function calculateDepreciation() {
    const value = parseFloat(document.getElementById('dep-asset-value').value) || 0;
    const rate = parseFloat(document.getElementById('dep-rate').value) / 100 || 0;
    const years = parseInt(document.getElementById('dep-years').value) || 0;
    let result = '';
    if (value > 0 && rate > 0 && years > 0) {
        let depTable = '<table><tr><th>Année</th><th>Amortissement</th><th>Valeur résiduelle</th></tr>';
        let bookValue = value;
        for (let i = 1; i <= years; i++) {
            const dep = bookValue * rate;
            bookValue -= dep;
            depTable += `<tr><td>${i}</td><td>${dep.toFixed(2)}</td><td>${bookValue.toFixed(2)}</td></tr>`;
        }
        depTable += '</table>';
        result = depTable;
    } else {
        result = 'Veuillez remplir tous les champs.';
    }
    document.getElementById('dep-result').innerHTML = result;
}

// Working Capital Calculator
function calculateWorkingCapital() {
    const assets = parseFloat(document.getElementById('current-assets').value) || 0;
    const liabilities = parseFloat(document.getElementById('current-liabilities').value) || 0;
    let result = '';
    if (assets >= 0 && liabilities >= 0) {
        const wc = assets - liabilities;
        result = `Fonds de roulement: ${wc.toFixed(2)} DH`;
    } else {
        result = 'Veuillez remplir tous les champs.';
    }
    document.getElementById('wc-result').innerHTML = result;
}

// Quick Ratio & Current Ratio Calculator
function calculateLiquidityRatios() {
    const assets = parseFloat(document.getElementById('qr-assets').value) || 0;
    const inventory = parseFloat(document.getElementById('qr-inventory').value) || 0;
    const liabilities = parseFloat(document.getElementById('qr-liabilities').value) || 0;
    let result = '';
    if (assets > 0 && liabilities > 0) {
        const currentRatio = assets / liabilities;
        const quickRatio = (assets - inventory) / liabilities;
        result = `Current Ratio: ${currentRatio.toFixed(2)}<br>Quick Ratio: ${quickRatio.toFixed(2)}`;
    } else {
        result = 'Veuillez remplir tous les champs.';
    }
    document.getElementById('liquidity-result').innerHTML = result;
}

// Simple Invoice Generator
function generateInvoice() {
    const client = document.getElementById('inv-client').value;
    const desc = document.getElementById('inv-desc').value;
    const amount = parseFloat(document.getElementById('inv-amount').value) || 0;
    let result = '';
    if (client && desc && amount > 0) {
        result = `<div style='border:1px solid #ccc;padding:10px;'><strong>Facture</strong><br>Client: ${client}<br>Description: ${desc}<br>Montant: ${amount.toFixed(2)} DH</div>`;
    } else {
        result = 'Veuillez remplir tous les champs.';
    }
    document.getElementById('invoice-result').innerHTML = result;
}

// Expense Splitter
function splitExpense() {
    const amount = parseFloat(document.getElementById('split-amount').value) || 0;
    const people = parseInt(document.getElementById('split-people').value) || 0;
    let result = '';
    if (amount > 0 && people > 0) {
        const share = amount / people;
        result = `Part par personne: ${share.toFixed(2)} DH`;
    } else {
        result = 'Veuillez remplir tous les champs.';
    }
    document.getElementById('split-result').innerHTML = result;
}

// VAT Reverse Charge Calculator
function calculateReverseVAT() {
    const base = parseFloat(document.getElementById('vat-base').value) || 0;
    const rate = parseFloat(document.getElementById('vat-rate').value) / 100 || 0;
    let result = '';
    if (base > 0 && rate > 0) {
        const vat = base * rate;
        result = `TVA à autoliquider: ${vat.toFixed(2)} DH`;
    } else {
        result = 'Veuillez remplir tous les champs.';
    }
    document.getElementById('reversevat-result').innerHTML = result;
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

document.addEventListener('DOMContentLoaded', function() {
    // Event delegation for blog cards
    var blogList = document.querySelector('.blog-list');
    if (blogList) {
        blogList.addEventListener('click', function(e) {
            let card = e.target.closest('.blog-card');
            if (card) {
                const blogId = card.getAttribute('data-blog');
                openBlogModal(blogId);
                e.preventDefault();
            }
            // Also handle clicks on .btn-outline or h2 a
            if (e.target.classList.contains('btn-outline') || (e.target.tagName === 'A' && e.target.closest('.blog-card'))) {
                const card = e.target.closest('.blog-card');
                if (card) {
                    const blogId = card.getAttribute('data-blog');
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
    var blogModal = document.getElementById('blog-modal');
    if (blogModal) {
        blogModal.addEventListener('click', function(e) {
            if (e.target === this) closeBlogModal();
        });
    }
});
