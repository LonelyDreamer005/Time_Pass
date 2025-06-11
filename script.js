document.addEventListener('DOMContentLoaded', function() {
    const sendButton = document.getElementById('send-btn');
    const userInput = document.getElementById('user-input');
    const chatBox = document.getElementById('chat-box');
    const clearButton = document.getElementById('clear-btn');
    const themeToggle = document.getElementById('theme-toggle');
    const serverStatus = document.getElementById('server-status');
    const originalButtonText = sendButton.innerHTML;
    
    // Get API URL (based on environment - local or production)
    const API_URL = getApiUrl();
    
    // Check server connection
    checkServerConnection();
    
    // Initialize theme from localStorage or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
    }
      // Function to determine the API URL based on environment
    function getApiUrl() {
        // IMPORTANT: Update this URL with your actual Render backend URL after deployment
        const RENDER_BACKEND_URL = 'https://pokedex-fe-cpq6.onrender.com'; 
        
        // Check if we're running on Render (production)
        if (window.location.hostname.includes('render.com') || 
            window.location.hostname.includes('onrender.com')) {
            // When hosted on Render, use the backend service URL
            return RENDER_BACKEND_URL;
        }
        // For development environment
        return 'http://127.0.0.1:5000/chat';
    }

    // Pokemon type color mapping
    const typeColorClasses = {
        normal: 'type-normal',
        fire: 'type-fire',
        water: 'type-water',
        electric: 'type-electric',
        grass: 'type-grass',
        ice: 'type-ice',
        fighting: 'type-fighting',
        poison: 'type-poison',
        ground: 'type-ground',
        flying: 'type-flying',
        psychic: 'type-psychic',
        bug: 'type-bug',
        rock: 'type-rock',
        ghost: 'type-ghost',
        dragon: 'type-dragon',
        dark: 'type-dark',
        steel: 'type-steel',
        fairy: 'type-fairy'
    };

    // Focus input field on page load
    userInput.focus();

    // Trigger search on Enter key
    userInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            sendButton.click();
        }
    });

    sendButton.addEventListener('click', async function() {
        const message = userInput.value.trim().toLowerCase();
        if (!message) return;

        // Add loading animation
        const loadingEl = document.createElement('div');
        loadingEl.className = 'card';
        loadingEl.innerHTML = `
            <div class="pokeball-loader"></div>
            <p style="text-align: center;">Searching for "${message}"...</p>
        `;
        chatBox.appendChild(loadingEl);
        chatBox.scrollTop = chatBox.scrollHeight;

        // Show loading state
        sendButton.disabled = true;
        sendButton.innerHTML = '<span class="loading-spinner"></span> Searching...';

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message })
            });

            // Remove loading animation
            chatBox.removeChild(loadingEl);

            if (!response.ok) {
                if (response.status === 404) {
                    const errorData = await response.json();
                    showErrorMessage(errorData.reply || `Pokémon "${message}" not found!`);
                } else {
                    throw new Error('Network response was not ok');
                }
            } else {
                const data = await response.json();

                if (data.error) {
                    showErrorMessage(data.error);
                } else {
                    // Format the types with colored badges
                    const typeArray = data.types.split(', ');
                    const formattedTypes = typeArray.map(type => {
                        const lowerType = type.toLowerCase();
                        return `<span class="pokemon-type ${typeColorClasses[lowerType] || ''}">${type}</span>`;
                    }).join(' ');

                    // Create card with enhanced layout and animations
                    const cardEl = document.createElement('div');
                    cardEl.className = 'card';
                    cardEl.innerHTML = `
                        <h3>${data.name}</h3>
                        <img src="${data.sprite}" alt="${data.name}" title="${data.name}">
                        <div>
                            <p><strong>Type:</strong> ${formattedTypes}</p>
                            <p><strong>Moves:</strong> ${data.moves}</p>
                        </div>
                        <div class="pokemon-stats">
                            <div class="stat-box">
                                <div>Weight</div>
                                <span>${data.weight || 'N/A'} kg</span>
                            </div>
                            <div class="stat-box">
                                <div>Height</div>
                                <span>${data.height || 'N/A'} m</span>
                            </div>
                            <div class="stat-box">
                                <div>Base Exp</div>
                                <span>${data.base_experience || 'N/A'}</span>
                            </div>
                        </div>
                    `;
                    chatBox.appendChild(cardEl);
                }
            }
        } catch (error) {
            // Remove loading animation if it still exists
            if (chatBox.contains(loadingEl)) {
                chatBox.removeChild(loadingEl);
            }
            
            showErrorMessage('Unable to fetch Pokémon data. Please check your server connection.');
            console.error('Error:', error);
            
            // Check server status
            checkServerConnection();
        } finally {
            // Reset button state
            sendButton.disabled = false;
            sendButton.innerHTML = originalButtonText;
            userInput.value = '';
            userInput.focus();
            chatBox.scrollTop = chatBox.scrollHeight;
        }
    });

    function showErrorMessage(message) {
        const errorEl = document.createElement('div');
        errorEl.className = 'card';
        errorEl.style.borderLeft = '4px solid #E3350D';
        errorEl.innerHTML = `
            <p style="color: #E3350D;"><i class="fa-solid fa-circle-exclamation"></i> <strong>Error</strong></p>
            <p>${message}</p>
            <p>Try another Pokémon name like "bulbasaur" or "eevee".</p>
        `;
        chatBox.appendChild(errorEl);
    }

    // Clear chat logs but keep the welcome message
    clearButton.addEventListener('click', function() {
        chatBox.innerHTML = `
            <div class="welcome-message card">
                <h3>Welcome, Trainer!</h3>
                <p>Search for any Pokémon by name to get detailed information about it.</p>
                <p>Try searching for "pikachu", "charizard", or your favorite Pokémon!</p>
            </div>
        `;
    });

    // Theme toggle functionality
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        
        // Update icon
        themeToggle.innerHTML = isDarkMode ? 
            '<i class="fa-solid fa-sun"></i>' : 
            '<i class="fa-solid fa-moon"></i>';
        
        // Save preference
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    });
    
    // Function to check server connection
    async function checkServerConnection() {
        serverStatus.textContent = 'Checking...';
        
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: 'connection_test' })
            });
            
            if (response.ok) {
                serverStatus.textContent = 'Online';
                serverStatus.className = 'online';
            } else {
                serverStatus.textContent = 'Error';
                serverStatus.className = 'offline';
            }
        } catch (error) {
            console.error('Server connection error:', error);
            serverStatus.textContent = 'Offline';
            serverStatus.className = 'offline';
        }
    }
});
