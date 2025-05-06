import time

SITES = {
    "awslpu": {
        "private_key": "shashankpandey@captain",
        "allowed_domains": ["https://www.awslpu.xyz", "http://127.0.0.1:5500","http://127.0.0.1:5000"]
    }
}
TOKENS = {}

def get_site_config(public_key):
    return SITES.get(public_key)

def save_behavior_data(token, score):
    TOKENS[token] = {
        "score": score,
        "timestamp": time.time(),
        "private_key": "shashankpandey@captain"
    }

def verify_behavior_token(private_key, token):
    data = TOKENS.get(token)
    if not data or data["private_key"] != private_key:
        return None
    return data
