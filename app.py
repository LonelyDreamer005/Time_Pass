from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os

app = Flask(__name__)
# Enable CORS with more specific settings to allow requests from your frontend domain
CORS(app, resources={r"/*": {"origins": ["https://pokedex-fe-cpq6.onrender.com", "http://localhost:*", "http://127.0.0.1:*"]}}, supports_credentials=True)

POKEAPI_URL = "https://pokeapi.co/api/v2/pokemon/"

@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        if not data or 'message' not in data:
            return jsonify({'reply': 'Invalid request! Please send a JSON with a "message" key.'}), 400
        
        pokemon_name = data['message'].strip().lower()
        
        # Handle connection test
        if pokemon_name == 'connection_test':
            return jsonify({'status': 'ok', 'message': 'Server is online'}), 200
        
        # Skip empty messages
        if not pokemon_name:
            return jsonify({'reply': 'Please enter a Pokémon name.'}), 400

        # Fetch Pokémon data from PokeAPI
        response = requests.get(f"{POKEAPI_URL}{pokemon_name}")
        if response.status_code == 404:
            return jsonify({'reply': f"Oops! '{pokemon_name}' is not a valid Pokémon name. Please check your spelling and try again. 😊"}), 404
        elif response.status_code != 200:
            return jsonify({'reply': 'Unable to fetch Pokémon data. Please try again later.'}), 500
        
        pokemon_data = response.json()

        # Extract relevant data
        name = pokemon_data['name'].capitalize()
        
        # Get the official artwork as primary image (higher quality)
        sprite = pokemon_data['sprites']['other']['official-artwork'].get('front_default')
        if not sprite:  # Fallback to regular sprite if artwork doesn't exist
            sprite = pokemon_data['sprites']['front_default']
            
        types = [t['type']['name'].capitalize() for t in pokemon_data['types']]
        moves = [m['move']['name'].replace('-', ' ').capitalize() for m in pokemon_data['moves'][:5]]  # Limit to 5 moves and format nicer
        
        # Get weight (convert from hectograms to kg) and height (convert from decimeters to m)
        weight = pokemon_data.get('weight', 0) / 10  # Convert to kg
        height = pokemon_data.get('height', 0) / 10  # Convert to m
        
        # Get base experience
        base_experience = pokemon_data.get('base_experience')

        # Create a detailed response
        result = {
            'name': name,
            'sprite': sprite,
            'types': ', '.join(types),
            'moves': ', '.join(moves),
            'weight': weight,
            'height': height,
            'base_experience': base_experience
        }

        return jsonify(result)
    
    except Exception as e:
        print("Error:", e)
        return jsonify({'reply': 'Something went wrong on our end. Please try again later!'}), 500

# Add a route to handle OPTIONS requests for CORS preflight
@app.route('/chat', methods=['OPTIONS'])
def handle_options():
    response = jsonify({'status': 'ok'})
    response.headers.add('Access-Control-Allow-Origin', 'https://pokedex-fe-cpq6.onrender.com')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))
