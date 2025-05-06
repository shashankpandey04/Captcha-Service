from flask import Flask, request, jsonify, render_template, abort
from database import get_site_config, verify_behavior_token, save_behavior_data
from utils import generate_behavior_token, calculate_score
from flask_cors import CORS
import time

app = Flask(__name__)
CORS(app, supports_credentials=True)
app.config["CORS_HEADERS"] = "Content-Type"
app.config["CORS_ORIGINS"] = ["*"]

@app.route("/captcha.js")
def serve_captcha_script():
    public_key = request.args.get("public_key")
    referrer = request.headers.get("Referer", "")
    print(f"Referrer URL: {referrer}")
    site_config = get_site_config(public_key)
    print(f"Site trying to access captcha: {site_config}")
    if not site_config or not any(domain in referrer for domain in site_config["allowed_domains"]):
        return app.send_static_file("modal.js")
    return render_template("captcha.js", public_key=public_key)

@app.route("/submit_behavior", methods=["POST"])
def submit_behavior():
    data = request.json
    public_key = data.get("public_key")
    behavior_data = data.get("behavior_data")
    
    score = calculate_score(behavior_data)
    token = generate_behavior_token(public_key, score)
    save_behavior_data(token, score)
    print(f"Generated token: {token}")
    return jsonify({"token": token})

@app.route("/verify", methods=["POST"])
def verify():
    data = request.json
    private_key = data.get("private_key")
    token = data.get("behavior_token")

    result = verify_behavior_token(private_key, token)
    if not result:
        return jsonify({"success": False, "error": "Invalid or expired token"}), 400

    return jsonify({
        "success": True if result["score"] >= 0.5 else False,
        "score": result["score"],
        "timestamp": result["timestamp"]
    })

if __name__ == "__main__":
    app.run(debug=True)
