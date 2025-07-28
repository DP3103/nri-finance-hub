// Navigation toggle for mobile
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu) {
                navMenu.classList.remove('active');
            }
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (navToggle && navMenu) {
            if (!navToggle.contains(event.target) && !navMenu.contains(event.target)) {
                navMenu.classList.remove('active');
            }
        }
    });

    // Initialize tab functionality
    initializeTabs();
    
    // Add smooth scrolling to navigation links
    addSmoothScrolling();
    
    // Add active nav link highlighting
    highlightActiveNavLink();
    
    // Initialize topic card navigation
    initializeTopicCards();
});

// Initialize topic card navigation - Fixed to use data-section attribute
function initializeTopicCards() {
    const topicCards = document.querySelectorAll('.topic-card');
    topicCards.forEach(card => {
        card.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section');
            if (sectionId) {
                navigateToSection(sectionId);
            }
        });
        
        // Make cards keyboard accessible
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

// Tab switching functionality - Fixed to handle all tab containers properly
function showTab(tabId) {
    console.log('Showing tab:', tabId); // Debug log
    
    // Find all tab containers and identify which one contains this tab
    const allTabContainers = document.querySelectorAll('.content-tabs');
    let targetContainer = null;
    
    // Find the container that has this tab ID
    allTabContainers.forEach(container => {
        const targetTab = container.querySelector(`#${tabId}`);
        if (targetTab) {
            targetContainer = container;
        }
    });
    
    if (!targetContainer) {
        console.warn('Target container not found for tab:', tabId);
        return;
    }
    
    // Hide all tab contents in this container
    const tabContents = targetContainer.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
    });
    
    // Remove active class from all tab buttons in this container
    const tabButtons = targetContainer.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.classList.remove('active');
    });
    
    // Show the selected tab content
    const selectedTab = document.getElementById(tabId);
    if (selectedTab) {
        selectedTab.classList.add('active');
        console.log('Tab content activated:', tabId);
    } else {
        console.warn('Tab content not found:', tabId);
    }
    
    // Add active class to the button that corresponds to this tab
    const clickedButton = targetContainer.querySelector(`[data-tab="${tabId}"]`);
    if (clickedButton) {
        clickedButton.classList.add('active');
        console.log('Tab button activated:', tabId);
    } else {
        console.warn('Tab button not found for:', tabId);
    }
}

// Initialize tab functionality - Enhanced to work with data attributes
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    console.log('Initializing tabs, found buttons:', tabButtons.length);
    
    tabButtons.forEach((button, index) => {
        const tabId = button.getAttribute('data-tab');
        console.log(`Tab button ${index}: data-tab="${tabId}"`);
        
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const tabId = this.getAttribute('data-tab');
            console.log('Tab button clicked:', tabId);
            if (tabId) {
                showTab(tabId);
            }
        });
    });
}

// Navigate to section from topic cards - Enhanced to handle all section IDs
function navigateToSection(sectionId) {
    console.log('Navigating to section:', sectionId); // Debug log
    
    const section = document.getElementById(sectionId);
    
    if (section) {
        section.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
        
        // Add a slight delay to account for fixed header
        setTimeout(() => {
            window.scrollBy(0, -100);
        }, 500);
        
        // Track the navigation
        trackEvent('Navigation', 'Topic Card Click', sectionId);
        console.log('Successfully navigated to:', sectionId);
    } else {
        console.warn(`Section with ID "${sectionId}" not found`);
        // List all available sections for debugging
        const allSections = document.querySelectorAll('section[id]');
        console.log('Available sections:', Array.from(allSections).map(s => s.id));
    }
}

// Add smooth scrolling to all navigation links - Enhanced
function addSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            let targetSection = document.getElementById(targetId);
            
            // If direct ID not found, try to find section by mapping
            if (!targetSection) {
                const sectionMap = {
                    'fire-number': 'fire',
                    'retirement-mistakes': 'fire',
                    'bucket-strategy': 'fire',
                    'account-types': 'banking',
                    'banking-tips': 'banking',
                    'exit-tax': 'tax',
                    'rnor-status': 'tax',
                    'tds-rates': 'tax'
                };
                
                const mappedId = sectionMap[targetId];
                if (mappedId) {
                    targetSection = document.getElementById(mappedId);
                    // If it's a sub-section, also activate the appropriate tab
                    if (targetId === 'fire-number' || targetId === 'retirement-mistakes' || targetId === 'bucket-strategy') {
                        setTimeout(() => showTab(targetId), 600);
                    } else if (targetId === 'exit-tax' || targetId === 'rnor-status' || targetId === 'tds-rates') {
                        setTimeout(() => showTab(targetId), 600);
                    }
                }
            }
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Adjust for fixed header
                setTimeout(() => {
                    window.scrollBy(0, -80);
                }, 500);
                
                // Close mobile menu if open
                const navMenu = document.getElementById('nav-menu');
                if (navMenu) {
                    navMenu.classList.remove('active');
                }
            }
        });
    });
}

// Highlight active navigation link based on scroll position
function highlightActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    function updateActiveLink() {
        let currentSection = '';
        
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 150 && rect.bottom >= 150) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href').substring(1);
            if (href === currentSection) {
                link.classList.add('active');
            }
        });
    }
    
    // Update on scroll with throttling for performance
    let ticking = false;
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateActiveLink);
            ticking = true;
            setTimeout(() => { ticking = false; }, 16);
        }
    }
    
    window.addEventListener('scroll', requestTick);
    
    // Update on load
    updateActiveLink();
}

// Utility function to create accordion functionality (if needed)
function createAccordion(accordionSelector) {
    const accordions = document.querySelectorAll(accordionSelector);
    
    accordions.forEach(accordion => {
        const header = accordion.querySelector('.accordion-header');
        const content = accordion.querySelector('.accordion-content');
        
        if (header && content) {
            header.addEventListener('click', function() {
                const isActive = accordion.classList.contains('active');
                
                // Close all accordions in the same group
                const group = accordion.closest('.accordion-group');
                if (group) {
                    group.querySelectorAll('.accordion').forEach(item => {
                        item.classList.remove('active');
                    });
                }
                
                // Toggle current accordion
                if (!isActive) {
                    accordion.classList.add('active');
                }
            });
        }
    });
}

// Utility function to format numbers as Indian currency
function formatIndianCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

// Utility function to calculate FIRE number
function calculateFireNumber(monthlyExpense, multiplier = 35) {
    const annualExpense = monthlyExpense * 12;
    return annualExpense * multiplier;
}

// Interactive calculator functionality (if calculators are added)
function initializeCalculators() {
    const fireCalculator = document.getElementById('fire-calculator');
    
    if (fireCalculator) {
        const monthlyExpenseInput = fireCalculator.querySelector('#monthly-expense');
        const multiplierInput = fireCalculator.querySelector('#multiplier');
        const resultDisplay = fireCalculator.querySelector('#fire-result');
        
        function updateFireCalculation() {
            const monthlyExpense = parseFloat(monthlyExpenseInput.value) || 0;
            const multiplier = parseFloat(multiplierInput.value) || 35;
            
            if (monthlyExpense > 0) {
                const fireNumber = calculateFireNumber(monthlyExpense, multiplier);
                resultDisplay.textContent = formatIndianCurrency(fireNumber);
            }
        }
        
        if (monthlyExpenseInput) monthlyExpenseInput.addEventListener('input', updateFireCalculation);
        if (multiplierInput) multiplierInput.addEventListener('input', updateFireCalculation);
    }
}

// Print functionality
function printSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const printWindow = window.open('', '_blank');
        const sectionTitle = section.querySelector('h2')?.textContent || 'Section';
        printWindow.document.write(`
            <html>
                <head>
                    <title>NRI Financial Planning - ${sectionTitle}</title>
                    <link rel="stylesheet" href="style.css">
                </head>
                <body>
                    <div class="container">
                        ${section.innerHTML}
                    </div>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    }
}

// Analytics tracking (placeholder for future implementation)
function trackEvent(category, action, label = '') {
    // This would integrate with analytics services like Google Analytics
    console.log('Event tracked:', { category, action, label });
}

// Accessibility improvements
function enhanceAccessibility() {
    // Add skip link functionality
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
        skipLink.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.focus();
                target.scrollIntoView();
            }
        });
    }
    
    // Enhance keyboard navigation for dropdowns
    const dropdowns = document.querySelectorAll('.nav-dropdown');
    dropdowns.forEach(dropdown => {
        const trigger = dropdown.querySelector('.nav-link');
        const menu = dropdown.querySelector('.dropdown-content');
        
        if (trigger && menu) {
            trigger.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
                }
                
                if (e.key === 'Escape') {
                    menu.style.display = 'none';
                }
            });
        }
    });
    
    // Add ARIA labels to interactive elements
    const interactiveElements = document.querySelectorAll('.topic-card, .tab-btn');
    interactiveElements.forEach(element => {
        if (!element.getAttribute('aria-label')) {
            const text = element.textContent.trim();
            element.setAttribute('aria-label', text);
        }
    });
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    enhanceAccessibility();
    initializeCalculators();
    
    // Track important user interactions
    trackUserInteractions();
    
    // Debug: Log all sections and tabs for troubleshooting
    console.log('All sections:', Array.from(document.querySelectorAll('section[id]')).map(s => s.id));
    console.log('All tab contents:', Array.from(document.querySelectorAll('.tab-content')).map(t => t.id));
    console.log('All tab buttons:', Array.from(document.querySelectorAll('.tab-btn')).map(b => b.getAttribute('data-tab')));
});

// Track important user interactions
function trackUserInteractions() {
    // Track topic card clicks
    const topicCards = document.querySelectorAll('.topic-card');
    topicCards.forEach(card => {
        card.addEventListener('click', function() {
            const topicTitle = this.querySelector('h3')?.textContent || 'Unknown Topic';
            trackEvent('Navigation', 'Topic Card Click', topicTitle);
        });
    });
    
    // Track tab switches
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabTitle = this.textContent.trim();
            trackEvent('Content', 'Tab Switch', tabTitle);
        });
    });
    
    // Track button clicks
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const buttonText = this.textContent.trim();
            trackEvent('Action', 'Button Click', buttonText);
        });
    });
}

// Export functions for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        showTab,
        navigateToSection,
        calculateFireNumber,
        formatIndianCurrency,
        trackEvent
    };
}