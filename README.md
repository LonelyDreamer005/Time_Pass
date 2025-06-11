# AiPokeDex - Pokémon Information App

An interactive Pokémon information app built with Flask, JavaScript, and the PokeAPI.

## Features

- Search for Pokémon by name to get detailed information
- Display Pokémon images, types, moves, and stats
- Dark/light theme toggle
- Responsive design for mobile and desktop
- Server connection status indicator

## Technology Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Flask (Python)
- **API**: PokeAPI
- **Deployment**: Render

## Deployment Instructions

### Deploying to Render

1. **Create a Render account**
   - Go to [render.com](https://render.com/) and sign up for a free account

2. **Connect your GitHub repository**
   - Push your code to GitHub
   - In the Render dashboard, click "New" and select "Blueprint"
   - Connect your GitHub account and select the repository

3. **Deploy with Blueprint**
   - Render will detect the `render.yaml` file and configure services
   - Click "Apply" to deploy both the backend and frontend

4. **Alternative Manual Deployment**

   **For the Backend:**
   - In the Render dashboard, click "New" and select "Web Service"
   - Connect your GitHub repo
   - Set the following:
     - Name: `aipokedex-api`
     - Environment: Python
     - Build Command: `pip install -r requirements.txt`
     - Start Command: `gunicorn app:app`
   - Click "Create Web Service"

   **For the Frontend:**
   - In the Render dashboard, click "New" and select "Static Site"
   - Connect your GitHub repo
   - Set the following:
     - Name: `aipokedex-frontend`
     - Build Command: (leave empty)
     - Publish Directory: `.`
   - Click "Create Static Site"

5. **Update Environment Variables**
   - After deployment, you may need to update the API URL in `script.js`

## Local Development

1. Clone the repository
2. Run the backend server:
   ```
   cd Time_Pass
   pip install -r requirements.txt
   python app.py
   ```
3. Open `index.html` in your browser

## Credits

- PokeAPI for Pokémon data: [pokeapi.co](https://pokeapi.co/)
