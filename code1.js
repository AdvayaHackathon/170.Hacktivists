// Main application JavaScript for RuralLearn Hub

// Wait for DOM to be fully loaded before executing
document.addEventListener('DOMContentLoaded', function() {
    // Initialize app components
    initializeNavigation();
    initializeConnectionStatus();
    initializeModals();
    initializeSubjects();
    initializeResourceTabs();
    initializeProgressCharts();
    simulateConnectionChecks();
});

// Navigation functionality
function initializeNavigation() {
    const navButtons = document.querySelectorAll('.nav-button');
    const pages = document.querySelectorAll('.page');
    
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons and pages
            navButtons.forEach(btn => btn.classList.remove('active'));
            pages.forEach(page => page.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Show the corresponding page
            const targetPageId = this.getAttribute('data-page');
            document.getElementById(targetPageId).classList.add('active');
        });
    });
}

// Connection status management
function initializeConnectionStatus() {
    const connectionIcon = document.getElementById('connection-icon');
    const connectionText = document.getElementById('connection-text');
    const syncStatus = document.getElementById('sync-status');
    const manualSyncBtn = document.getElementById('manual-sync');
    
    if (manualSyncBtn) {
        manualSyncBtn.addEventListener('click', function() {
            performSync();
        });
    }
    
    // Check if auto-sync checkbox exists and initialize its event listener
    const autoSyncCheckbox = document.getElementById('auto-sync');
    if (autoSyncCheckbox) {
        autoSyncCheckbox.addEventListener('change', function() {
            localStorage.setItem('autoSync', this.checked);
            if (this.checked && navigator.onLine) {
                performSync();
            }
        });
        
        // Set initial state from localStorage if available
        const savedAutoSync = localStorage.getItem('autoSync');
        if (savedAutoSync !== null) {
            autoSyncCheckbox.checked = savedAutoSync === 'true';
        }
    }
    
    // Initialize online/offline event listeners
    window.addEventListener('online', updateConnectionStatus);
    window.addEventListener('offline', updateConnectionStatus);
    
    // Initial connection status check
    updateConnectionStatus();
    
    function updateConnectionStatus() {
        if (navigator.onLine) {
            connectionIcon.classList.remove('offline');
            connectionIcon.classList.add('online');
            connectionText.textContent = 'Connected';
            
            // If auto-sync is enabled, perform sync when connection becomes available
            if (autoSyncCheckbox && autoSyncCheckbox.checked) {
                performSync();
            }
        } else {
            connectionIcon.classList.remove('online');
            connectionIcon.classList.add('offline');
            connectionText.textContent = 'Working Offline';
        }
    }
    
    function performSync() {
        connectionText.textContent = 'Syncing...';
        
        // Simulate sync process
        setTimeout(() => {
            const now = new Date();
            const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            syncStatus.textContent = `Last synced: ${formattedTime}`;
            connectionText.textContent = navigator.onLine ? 'Connected' : 'Working Offline';
            
            // Show a brief notification
            showNotification('Content synced successfully!', 'success');
        }, 2000);
    }
}

// Simulate periodic connection checks (for demo purposes)
function simulateConnectionChecks() {
    // Simulate random connection changes (for demo purposes only)
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        // Don't run this simulation in production
        return;
    }
    
    // Every 15-30 seconds, randomly change connection status for demo
    setInterval(() => {
        // This is just for demonstration - in real implementation, 
        // you'd rely on actual navigator.onLine status
        const event = new Event(Math.random() > 0.5 ? 'online' : 'offline');
        window.dispatchEvent(event);
    }, Math.random() * 15000 + 15000);
}

// Modal handling
function initializeModals() {
    const modals = document.querySelectorAll('.modal');
    const openButtons = {
        'lesson-modal': document.querySelectorAll('.open-subject-btn'),
        'download-modal': document.getElementById('download-content-btn')
    };
    const closeButtons = document.querySelectorAll('.close-modal');
    
    // Open modals
    if (openButtons['download-modal']) {
        openButtons['download-modal'].addEventListener('click', function() {
            document.getElementById('download-modal').classList.remove('hidden');
        });
    }
    
    openButtons['lesson-modal'].forEach(button => {
        button.addEventListener('click', function() {
            const subjectCard = this.closest('.subject-card');
            const subjectType = subjectCard.getAttribute('data-subject');
            const subjectTitle = subjectCard.querySelector('h3').textContent;
            
            // Set the lesson title in the modal
            document.getElementById('lesson-title').textContent = subjectTitle + ' - Lesson 1';
            
            // Load sample lesson content based on subject type
            loadLessonContent(subjectType, 1);
            
            // Show the modal
            document.getElementById('lesson-modal').classList.remove('hidden');
        });
    });
    
    // Close modals
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            modal.classList.add('hidden');
        });
    });
    
    // Close modal when clicking outside content area
    modals.forEach(modal => {
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                modal.classList.add('hidden');
            }
        });
    });
    
    // Lesson navigation buttons
    const prevLessonBtn = document.getElementById('prev-lesson');
    const nextLessonBtn = document.getElementById('next-lesson');
    const completeLessonBtn = document.getElementById('complete-lesson');
    const lessonProgressSpan = document.getElementById('lesson-progress');
    
    let currentLesson = 1;
    const totalLessons = 5; // Assuming 5 lessons per subject
    
    if (prevLessonBtn && nextLessonBtn && completeLessonBtn) {
        prevLessonBtn.addEventListener('click', function() {
            if (currentLesson > 1) {
                currentLesson--;
                updateLessonView();
            }
        });
        
        nextLessonBtn.addEventListener('click', function() {
            if (currentLesson < totalLessons) {
                currentLesson++;
                updateLessonView();
            }
        });
        
        completeLessonBtn.addEventListener('click', function() {
            // Mark current lesson as complete and move to next lesson
            showNotification('Lesson marked as complete!', 'success');
            
            if (currentLesson < totalLessons) {
                currentLesson++;
                updateLessonView();
            } else {
                // Last lesson completed
                document.getElementById('lesson-modal').classList.add('hidden');
                showNotification('All lessons completed for this subject!', 'success');
            }
        });
    }
    
    function updateLessonView() {
        // Update lesson progress display
        if (lessonProgressSpan) {
            lessonProgressSpan.textContent = `${currentLesson} of ${totalLessons}`;
        }
        
        // Update button states
        if (prevLessonBtn) {
            prevLessonBtn.disabled = currentLesson === 1;
        }
        
        if (nextLessonBtn) {
            nextLessonBtn.disabled = currentLesson === totalLessons;
        }
        
        // Update lesson title
        const activeSubject = document.querySelector('.subject-card.active')?.querySelector('h3')?.textContent || 'Current Subject';
        document.getElementById('lesson-title').textContent = `${activeSubject} - Lesson ${currentLesson}`;
        
        // Load content for current lesson
        const subjectType = document.querySelector('.subject-card.active')?.getAttribute('data-subject') || 'general';
        loadLessonContent(subjectType, currentLesson);
    }
    
    function loadLessonContent(subject, lessonNumber) {
        const lessonContent = document.getElementById('lesson-content');
        if (!lessonContent) return;
        
        // In a real app, you would fetch this content from a local database or API
        // For now, we'll generate sample content
        lessonContent.innerHTML = `
            <div class="lesson-section">
                <h3>Introduction to ${subject.charAt(0).toUpperCase() + subject.slice(1)} - Lesson ${lessonNumber}</h3>
                <p>This is sample content for ${subject} lesson ${lessonNumber}. In a real implementation, this would be loaded from offline storage or fetched from an API when online.</p>
                <div class="lesson-image">
                    <div class="placeholder-image">[Image for ${subject} lesson ${lessonNumber}]</div>
                </div>
                <h4>Key Learning Points</h4>
                <ul>
                    <li>Important concept #1 for ${subject}</li>
                    <li>Key understanding about ${subject}</li>
                    <li>Practical application of knowledge</li>
                </ul>
                <div class="interactive-element">
                    <h4>Quick Knowledge Check</h4>
                    <div class="quiz-question">
                        <p>Sample question about ${subject}?</p>
                        <div class="quiz-options">
                            <label><input type="radio" name="quiz"> Option A</label>
                            <label><input type="radio" name="quiz"> Option B</label>
                            <label><input type="radio" name="quiz"> Option C</label>
                        </div>
                        <button class="check-answer-btn">Check Answer</button>
                    </div>
                </div>
            </div>
        `;
        
        // Add event listener for the quiz button
        const checkAnswerBtn = lessonContent.querySelector('.check-answer-btn');
        if (checkAnswerBtn) {
            checkAnswerBtn.addEventListener('click', function() {
                showNotification('Great job! That\'s correct.', 'success');
            });
        }
    }
    
    // Download buttons in the download modal
    const downloadButtons = document.querySelectorAll('.download-action');
    downloadButtons.forEach(button => {
        button.addEventListener('click', function() {
            const downloadItem = this.closest('.download-item');
            const courseName = downloadItem.querySelector('h4').textContent;
            
            // Change button text
            this.textContent = 'Downloading...';
            
            // Simulate download
            setTimeout(() => {
                this.textContent = 'Downloaded';
                this.disabled = true;
                showNotification(`${courseName} downloaded successfully!`, 'success');
                
                // Update storage bar (simplified)
                const storageBar = document.querySelector('.storage-used');
                const currentWidth = parseInt(storageBar.style.width);
                const newWidth = Math.min(currentWidth + 10, 100);
                storageBar.style.width = `${newWidth}%`;
                
                // Update free space text
                const storageText = document.querySelector('.storage-info span');
                if (storageText) {
                    const match = storageText.textContent.match(/(\d+\.\d+) GB free of (\d+\.\d+) GB/);
                    if (match) {
                        const currentFree = parseFloat(match[1]);
                        const total = parseFloat(match[2]);
                        const newFree = Math.max(currentFree - 0.05, 0).toFixed(1);
                        storageText.textContent = `${newFree} GB free of ${total} GB`;
                    }
                }
            }, 2000);
        });
    });
}

// Subject card interactions
function initializeSubjects() {
    const subjectCards = document.querySelectorAll('.subject-card');
    const addSubjectCard = document.querySelector('.add-subject-card');
    const searchInput = document.getElementById('subject-search');
    const searchBtn = document.getElementById('search-btn');
    
    // Subject card hover effects
    subjectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.classList.add('hover');
        });
        
        card.addEventListener('mouseleave', function() {
            this.classList.remove('hover');
        });
    });
    
    // Add new subject
    if (addSubjectCard) {
        addSubjectCard.addEventListener('click', function() {
            showNotification('New subjects will be available after next sync', 'info');
        });
    }
    
    // Search functionality
    if (searchInput && searchBtn) {
        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keyup', function(event) {
            if (event.key === 'Enter') {
                performSearch();
            }
        });
    }
    
    function performSearch() {
        if (!searchInput) return;
        
        const searchTerm = searchInput.value.trim().toLowerCase();
        if (searchTerm === '') {
            // Reset search - show all cards
            subjectCards.forEach(card => {
                card.style.display = '';
            });
            return;
        }
        
        // Filter subject cards based on search term
        subjectCards.forEach(card => {
            const subjectTitle = card.querySelector('h3').textContent.toLowerCase();
            if (subjectTitle.includes(searchTerm)) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
        
        // Show message if no results
        const visibleCards = Array.from(subjectCards).filter(card => card.style.display !== 'none');
        if (visibleCards.length === 0) {
            showNotification('No subjects match your search', 'info');
            // Reset search after a delay
            setTimeout(() => {
                searchInput.value = '';
                subjectCards.forEach(card => {
                    card.style.display = '';
                });
            }, 3000);
        }
    }
}

// Community resources tab functionality
function initializeResourceTabs() {
    const resourceTabs = document.querySelectorAll('.resource-tab');
    const resourceContents = document.querySelectorAll('.resource-content');
    
    resourceTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs and content areas
            resourceTabs.forEach(t => t.classList.remove('active'));
            resourceContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Show the corresponding content
            const targetContentId = this.getAttribute('data-tab');
            document.getElementById(targetContentId).classList.add('active');
        });
    });
    
    // Event listeners for community resource buttons
    const downloadBtns = document.querySelectorAll('.community-card .download-btn');
    const viewBtns = document.querySelectorAll('.community-card .view-btn');
    const remindBtns = document.querySelectorAll('.remind-btn');
    
    downloadBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const resourceTitle = this.closest('.community-card').querySelector('h3').textContent;
            this.textContent = 'Saving...';
            
            setTimeout(() => {
                this.textContent = 'Saved Offline';
                this.disabled = true;
                showNotification(`"${resourceTitle}" saved for offline use`, 'success');
            }, 1500);
        });
    });
    
    viewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const resourceTitle = this.closest('.community-card').querySelector('h3').textContent;
            showNotification(`Opening "${resourceTitle}"`, 'info');
            // In a real app, this would open the resource in a viewer modal
        });
    });
    
    remindBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const eventName = this.closest('.event-item').querySelector('h3').textContent;
            if (this.textContent === 'Set Reminder') {
                this.textContent = 'Remove Reminder';
                this.classList.add('active');
                showNotification(`Reminder set for "${eventName}"`, 'success');
            } else {
                this.textContent = 'Set Reminder';
                this.classList.remove('active');
                showNotification(`Reminder removed for "${eventName}"`, 'info');
            }
        });
    });
}

// Project page functionality
function initializeProjects() {
    const newProjectBtn = document.getElementById('new-project-btn');
    const continueProjectBtns = document.querySelectorAll('.continue-project-btn');
    const viewProjectBtns = document.querySelectorAll('.view-project-btn');
    
    if (newProjectBtn) {
        newProjectBtn.addEventListener('click', function() {
            showNotification('New project creation will be available in the next update', 'info');
        });
    }
    
    continueProjectBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const projectTitle = this.closest('.project-card').querySelector('h3').textContent;
            showNotification(`Opening project: "${projectTitle}"`, 'info');
            // In a real app, this would open the project workspace
        });
    });
    
    viewProjectBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const projectTitle = this.closest('.project-card').querySelector('h3').textContent;
            showNotification(`Viewing completed project: "${projectTitle}"`, 'info');
            // In a real app, this would open the project viewer
        });
    });
}

// Progress charts and data visualization
function initializeProgressCharts() {
    const activityChartCanvas = document.getElementById('activity-chart');
    
    if (window.Chart && activityChartCanvas) {
        // If Chart.js is loaded, create charts
        new Chart(activityChartCanvas, {
            type: 'line',
            data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                datasets: [{
                    label: 'Hours Spent Learning',
                    data: [2.5, 3.0, 3.0, 4.0],
                    borderColor: '#4a90e2',
                    backgroundColor: 'rgba(74, 144, 226, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Hours'
                        }
                    }
                }
            }
        });
    } else {
        // Create a simple fallback if Chart.js is not available
        if (activityChartCanvas) {
            const ctx = activityChartCanvas.getContext('2d');
            if (ctx) {
                // Simple bar chart fallback using canvas API
                const data = [2.5, 3.0, 3.0, 4.0];
                const maxValue = Math.max(...data);
                const width = activityChartCanvas.width;
                const height = activityChartCanvas.height;
                const barWidth = width / (data.length * 2);
                const barSpacing = barWidth;
                
                ctx.clearRect(0, 0, width, height);
                
                // Draw bars
                ctx.fillStyle = 'rgba(74, 144, 226, 0.6)';
                data.forEach((value, index) => {
                    const barHeight = (value / maxValue) * (height - 40);
                    const x = index * (barWidth + barSpacing) + barSpacing;
                    const y = height - barHeight - 20;
                    ctx.fillRect(x, y, barWidth, barHeight);
                    
                    // Draw label
                    ctx.fillStyle = '#333';
                    ctx.font = '12px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText(`Week ${index + 1}`, x + barWidth / 2, height - 5);
                    
                    // Draw value
                    ctx.fillText(value.toString(), x + barWidth / 2, y - 5);
                    
                    // Reset fill color for next bar
                    ctx.fillStyle = 'rgba(74, 144, 226, 0.6)';
                });
                
                // Draw axis
                ctx.strokeStyle = '#999';
                ctx.beginPath();
                ctx.moveTo(barSpacing / 2, height - 20);
                ctx.lineTo(width - barSpacing / 2, height - 20);
                ctx.stroke();
                
                // Y-axis label
                ctx.save();
                ctx.rotate(-Math.PI / 2);
                ctx.textAlign = 'center';
                ctx.fillText('Hours', -height / 2, 15);
                ctx.restore();
            }
        }
    }
    
    // Date navigation for progress page
    const prevPeriodBtn = document.getElementById('prev-period');
    const nextPeriodBtn = document.getElementById('next-period');
    const currentPeriodSpan = document.getElementById('current-period');
    
    if (prevPeriodBtn && nextPeriodBtn && currentPeriodSpan) {
        const currentDate = new Date();
        let currentMonth = currentDate.getMonth();
        let currentYear = currentDate.getFullYear();
        
        updatePeriodDisplay();
        
        prevPeriodBtn.addEventListener('click', function() {
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            updatePeriodDisplay();
        });
        
        nextPeriodBtn.addEventListener('click', function() {
            // Don't allow navigating past current month
            if (currentMonth === currentDate.getMonth() && currentYear === currentDate.getFullYear()) {
                showNotification('Cannot view future data', 'info');
                return;
            }
            
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            updatePeriodDisplay();
        });
        
        function updatePeriodDisplay() {
            const monthNames = [
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'
            ];
            currentPeriodSpan.textContent = `${monthNames[currentMonth]} ${currentYear}`;
            
            // Update stats based on period (would fetch from database in real app)
            // For demo, just show different values
            const statValues = document.querySelectorAll('.stat-value');
            const statTrends = document.querySelectorAll('.stat-trend');
            
            // Only update if we're not on the current month
            if (currentMonth !== currentDate.getMonth() || currentYear !== currentDate.getFullYear()) {
                // Show different values for past months
                const demoData = [
                    { value: (8 + Math.random() * 4).toFixed(1), trend: '↑ 1.5 from previous month' },
                    { value: Math.floor(5 + Math.random() * 5), trend: '↑ 2 from previous month' },
                    { value: Math.floor(1 + Math.random() * 2), trend: '= Same as previous month' },
                    { value: `${Math.floor(70 + Math.random() * 15)}%`, trend: '↑ 3% from previous month' }
                ];
                
                statValues.forEach((elem, index) => {
                    elem.textContent = demoData[index].value;
                });
                
                statTrends.forEach((elem, index) => {
                    elem.textContent = demoData[index].trend;
                });
            } else {
                // Reset to current month data
                const currentData = [
                    { value: '12.5', trend: '↑ 2.3 from last month' },
                    { value: '8', trend: '↑ 3 from last month' },
                    { value: '1', trend: '= Same as last month' },
                    { value: '82%', trend: '↑ 4% from last month' }
                ];
                
                statValues.forEach((elem, index) => {
                    elem.textContent = currentData[index].value;
                });
                
                statTrends.forEach((elem, index) => {
                    elem.textContent = currentData[index].trend;
                });
            }
        }
    }
}

// Utility function to show notifications
function showNotification(message, type = 'info') {
    // Create notification element if it doesn't exist
    let notification = document.getElementById('app-notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'app-notification';
        notification.className = 'notification';
        document.body.appendChild(notification);
    }
    
    // Set notification type class
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Show the notification
    notification.classList.add('show');
    
    // Hide after delay
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Add this CSS using JavaScript (since we can only provide JS code)
function addNotificationStyles() {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .notification {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%) translateY(100px);
            background-color: #333;
            color: white;
            padding: 12px 24px;
            border-radius: 4px;
            box-shadow: 0 3px 6px rgba(0,0,0,0.2);
            transition: transform 0.3s ease-out;
            z-index: 1000;
            opacity: 0;
        }
        
        .notification.show {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
        
        .notification.success {
            background-color: #4CAF50;
        }
        
        .notification.error {
            background-color: #F44336;
        }
        
        .notification.info {
            background-color: #2196F3;
        }
        
        /* Additional styles for connection status */
        .connection-status {
            display: flex;
            align-items: center;
            padding: 6px 12px;
            background-color: #f5f5f5;
            border-bottom: 1px solid #e0e0e0;
        }
        
        #connection-icon {
            display: inline-block;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            margin-right: 8px;
        }
        
        #connection-icon.online {
            background-color: #4CAF50;
        }
        
        #connection-icon.offline {
            background-color: #F44336;
        }
        
        #sync-status {
            margin-left: auto;
            font-size: 0.8em;
            color: #666;
        }
    `;
    document.head.appendChild(styleElement);
}

// Call this function to add the notification styles
addNotificationStyles();