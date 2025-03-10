from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend requests

POKEAPI_URL = "https://pokeapi.co/api/v2/pokemon/"

@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        if not data or 'message' not in data:
            return jsonify({'reply': 'Invalid request! Please send a JSON with a "message" key.'}), 400
        
        pokemon_name = data['message'].strip().lower()

        # Fetch Pokémon data from PokeAPI
        response = requests.get(f"{POKEAPI_URL}{pokemon_name}")
        if response.status_code == 404:
            return jsonify({'reply': f"Oops! '{pokemon_name}' is not a valid Pokémon name. Please check your spelling and try again. 😊"}), 404
        elif response.status_code != 200:
            return jsonify({'reply': 'Unable to fetch Pokémon data. Please try again later.'}), 500
        
        pokemon_data = response.json()

        # Extract relevant data
        name = pokemon_data['name'].capitalize()
        sprite = pokemon_data['sprites']['front_default']
        types = [t['type']['name'].capitalize() for t in pokemon_data['types']]
        moves = [m['move']['name'].capitalize() for m in pokemon_data['moves'][:5]]  # Limit to 5 moves

        # Create a detailed response
        result = {
            'name': name,
            'sprite': sprite,
            'types': ', '.join(types),
            'moves': ', '.join(moves)
        }

        return jsonify(result)
    
    except Exception as e:
        print("Error:", e)
        return jsonify({'reply': 'Something went wrong on our end. Please try again later!'}), 500

if __name__ == '__main__':
    app.run(debug=True)
