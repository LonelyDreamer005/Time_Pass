document.addEventListener('DOMContentLoaded', function() {
    const sendButton = document.getElementById('send-btn');
    const userInput = document.getElementById('user-input');
    const chatBox = document.getElementById('chat-box');
    const clearButton = document.getElementById('clear-btn');

    // Trigger search on Enter key
    userInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            sendButton.click();
        }
    });

    sendButton.addEventListener('click', async function() {
        const message = userInput.value.trim();
        if (!message) return;

        // Show loading state
        sendButton.disabled = true;
        sendButton.textContent = 'Searching...';

        try {
            const response = await fetch('http://localhost:5000/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            if (data.error) {
                chatBox.innerHTML += `<p><strong>Bot:</strong> ${data.error}</p>`;
            } else {
                chatBox.innerHTML += `
                    <div class="card">
                        <h3>${data.name}</h3>
                        <img src="${data.sprite}" alt="Sprite of ${data.name}">
                        <p><strong>Type:</strong> ${data.types}</p>
                        <p><strong>Moves:</strong> ${data.moves}</p>
                    </div>
                `;
            }
        } catch (error) {
            chatBox.innerHTML += `<p><strong>Bot:</strong> Unable to fetch Pokémon data. Please try again later.</p>`;
            console.error('Error:', error);
        } finally {
            // Reset button state
            sendButton.disabled = false;
            sendButton.textContent = 'Search';
        }

        userInput.value = '';
        chatBox.scrollTop = chatBox.scrollHeight;
    });

    // Clear chat logs
    clearButton.addEventListener('click', function() {
        chatBox.innerHTML = '';
    });
});
