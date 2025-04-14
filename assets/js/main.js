document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const calendarEl = document.getElementById('calendar');
    const currentMonthEl = document.getElementById('current-month');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const selectedDateInput = document.getElementById('selected-date');
    const bookingForm = document.getElementById('booking-form');
    const confirmationModal = document.getElementById('confirmation-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const closeConfirmationBtn = document.getElementById('close-confirmation');
    const confirmationMessage = document.getElementById('confirmation-message');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');

    const sampleEvents = [
        {
            id: 1,
            title: "Team Meeting",
            date: new Date(2024, 1, 15)
        },
        {
            id: 2,
            title: "Product Launch",
            date: new Date(2024, 1, 20)
        },
        {
            id: 3,
            title: "Birthday Party",
            date: new Date(2024, 1, 25)
        }
    ];

    const bookedDates = sampleEvents.map(event => event.date.getDate());
    let currentDate = new Date();
    let selectedDate = null;

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    function init() {
        renderCalendar();
        setupEventListeners();
    }

    function renderCalendar() {
        calendarEl.innerHTML = '';
        dayNames.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'calendar-day-header';
            dayHeader.textContent = day;
            calendarEl.appendChild(dayHeader);
        });

        currentMonthEl.textContent = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
        const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const isCurrentMonth = currentDate.getMonth() === today.getMonth() &&
            currentDate.getFullYear() === today.getFullYear();

        for (let i = 0; i < startingDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day empty';
            calendarEl.appendChild(emptyDay);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = day;

            const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);

            if (isCurrentMonth && day === today.getDate()) {
                dayElement.classList.add('today');
            }
            if (bookedDates.includes(day)) {
                dayElement.classList.add('booked');
                const indicator = document.createElement('div');
                indicator.className = 'event-indicator';
                dayElement.appendChild(indicator);
            } else {
                dayElement.classList.add('available');
            }

            if (selectedDate &&
                selectedDate.getDate() === day &&
                selectedDate.getMonth() === currentDate.getMonth() &&
                selectedDate.getFullYear() === currentDate.getFullYear()) {
                dayElement.classList.add('selected');
            }

            dayElement.addEventListener('click', function () {
                if (dayElement.classList.contains('booked')) return;
                if (clickedDate < today) {
                    alert("You cannot select a past date. Please choose a future date.");
                    return;
                }
                document.querySelectorAll('.calendar-day').forEach(el => el.classList.remove('selected'));
                dayElement.classList.add('selected');
                selectedDate = clickedDate;
                selectedDateInput.value = selectedDate.toISOString().split('T')[0];
            });

            calendarEl.appendChild(dayElement);
        }
    }

    function validateForm() {
        let isValid = true;

        const name = document.getElementById('name').value.trim();
        if (name === '') {
            document.getElementById('name-error').textContent = 'Name is required';
            isValid = false;
        } else document.getElementById('name-error').textContent = '';

        const email = document.getElementById('email').value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email === '') {
            document.getElementById('email-error').textContent = 'Email is required';
            isValid = false;
        } else if (!emailRegex.test(email)) {
            document.getElementById('email-error').textContent = 'Please enter a valid email';
            isValid = false;
        } else document.getElementById('email-error').textContent = '';

        const contact = document.getElementById('contact').value.trim();
        if (contact === '') {
            document.getElementById('contact-error').textContent = 'Contact number is required';
            isValid = false;
        } else document.getElementById('contact-error').textContent = '';

        const details = document.getElementById('details').value.trim();
        if (details === '') {
            document.getElementById('details-error').textContent = 'Event details are required';
            isValid = false;
        } else document.getElementById('details-error').textContent = '';

        if (!selectedDate) {
            alert('Please select a date for your event');
            isValid = false;
        }

        return isValid;
    }

    function showConfirmation(name, date, eventType) {
        const formattedDate = date.toLocaleDateString('en-US', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        });
        confirmationMessage.textContent = `Thank you, ${name}! Your ${eventType} has been booked for ${formattedDate}.`;
        confirmationModal.style.display = 'flex';
    }

    function setupEventListeners() {
        prevMonthBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar();
        });
        nextMonthBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar();
        });

        bookingForm.addEventListener('submit', e => {
            e.preventDefault();
            if (validateForm()) {
                const name = document.getElementById('name').value.trim();
                const eventType = document.getElementById('event-type').value;
                showConfirmation(name, selectedDate, eventType);
                bookingForm.reset();
                selectedDate = null;
                selectedDateInput.value = '';
                document.querySelectorAll('.calendar-day').forEach(el => el.classList.remove('selected'));
            }
        });

        closeModalBtn.addEventListener('click', () => {
            confirmationModal.style.display = 'none';
        });
        closeConfirmationBtn.addEventListener('click', () => {
            confirmationModal.style.display = 'none';
        });
        confirmationModal.addEventListener('click', e => {
            if (e.target === confirmationModal) {
                confirmationModal.style.display = 'none';
            }
        });

        mobileMenuBtn.addEventListener('click', () => {
            nav.classList.toggle('active');
        });
        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
            });
        });
    }

    init();
});
