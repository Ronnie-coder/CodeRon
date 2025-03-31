document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links with a slight delay
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            setTimeout(() => {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }, 100); // 100ms delay
        });
    });

    // Contact form submission with real-time validation
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateForm(this)) {
                const formData = new FormData(this);
                // Send form data to server using Fetch API
                fetch('your-server-endpoint', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    console.log('Success:', data);
                    alert('Thank you for your message! We will get back to you soon.');
                    this.reset();
                })
                .catch((error) => {
                    console.error('Error:', error);
                    alert('An error occurred. Please try again later.');
                });
            }
        });

        // Real-time validation
        const formInputs = contactForm.querySelectorAll('input, textarea');
        formInputs.forEach(input => {
            input.addEventListener('input', function() {
                validateInput(this);
            });
        });
    }

    // Lazy loading for images using Intersection Observer
    const images = document.querySelectorAll('img[loading="lazy"]');
    const imgOptions = {
        threshold: 0,
        rootMargin: "0px 0px 300px 0px"
    };

    const imgObserver = new IntersectionObserver((entries, imgObserver) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                preloadImage(entry.target);
                imgObserver.unobserve(entry.target);
            }
        });
    }, imgOptions);

    images.forEach(image => {
        imgObserver.observe(image);
    });

    function preloadImage(img) {
        const src = img.getAttribute('data-src');
        if (!src) {
            return;
        }
        img.src = src;
        img.onload = () => {
            img.style.opacity = 1;
        };
    }

    // Back to top button
    const backToTopButton = document.querySelector('.back-to-top');
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopButton.style.display = 'block';
        } else {
            backToTopButton.style.display = 'none';
        }
    });

    // Portfolio item modal
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const modal = document.querySelector('.modal');
    const modalContent = document.querySelector('.modal-content');
    const closeButton = document.querySelector('.close');

    portfolioItems.forEach(item => {
        item.addEventListener('click', () => {
            const projectTitle = item.querySelector('h3')?.textContent || 'Project Title';
            const projectImage = item.querySelector('img')?.src || '';
            const projectDescription = item.querySelector('p')?.textContent || 'Project Description';

            modalContent.innerHTML = `
                <span class="close">&times;</span>
                <h3>${projectTitle}</h3>
                <img src="${projectImage}" alt="Project Image">
                <p>${projectDescription}</p>
            `;
            modal.classList.add('show');
        });
    });

    closeButton.addEventListener('click', () => {
        modal.classList.remove('show');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });
});

// Form validation functions
function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        if (!validateInput(input)) {
            isValid = false;
        }
    });
    return isValid;
}

function validateInput(input) {
    let isValid = true;
    if (input.required && input.value.trim() === '') {
        isValid = false;
    } else if (input.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input.value)) {
            isValid = false;
        }
    }

    if (isValid) {
        input.style.borderColor = 'var(--secondary-color)';
        input.setCustomValidity('');
    } else {
        input.style.borderColor = 'var(--accent-color)';
        input.setCustomValidity('Invalid input');
    }

    return isValid;
}