// Smooth scrolling for Learn More button
function learnMore() {
    document.getElementById('content').scrollIntoView({
        behavior: 'smooth'
    });
}

// Function to handle adding animation classes when elements are in view
function animateOnScroll() {
    const hiddenElements = document.querySelectorAll('.hidden');
    const observerOptions = {
        threshold: 0.3 // Trigger animation when 30% of the element is visible
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const animationType = entry.target.getAttribute('data-animation');
                entry.target.classList.add('animate-' + animationType);
                entry.target.classList.remove('hidden');
            }
        });
    }, observerOptions);

    hiddenElements.forEach(element => {
        observer.observe(element);
    });
}

// Call the function on page load
document.addEventListener('DOMContentLoaded', animateOnScroll);
