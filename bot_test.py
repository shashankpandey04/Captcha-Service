from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
import time
import json
import requests

# CONFIG
TEST_FORM_URL = "http://127.0.0.1:5500/test.html"  # Updated URL for your page
VERIFY_API_URL = "http://localhost:5000/verify"
PRIVATE_KEY = "shashankpandey@captain"

# Set up Selenium (headless mode optional)
options = Options()
# Uncomment this to run headless (no browser window)
# options.add_argument("--headless")

driver = webdriver.Chrome(options=options)
driver.get(TEST_FORM_URL)

print("[*] Page loaded. Submitting immediately (bot-like)...")

# Wait 1s for JS to load (not enough to simulate human behavior)
time.sleep(1)

# Submit form without any interaction
submit_btn = driver.find_element(By.CSS_SELECTOR, "form#loginForm button")
submit_btn.click()

# Wait to let CAPTCHA finish generating token
time.sleep(4)

# Get the behavior token from the page
token = driver.execute_script("return window.__behavior_token")
print("[+] Got behavior token:", token)

if not token:
    print("[-] No token generated. CAPTCHA likely blocked it.")
else:
    # Verify token using the backend endpoint
    response = requests.post(VERIFY_API_URL, json={
        "private_key": PRIVATE_KEY,
        "behavior_token": token
    })

    try:
        result = response.json()
        print("[+] Verification result:")
        print(json.dumps(result, indent=2))
    except Exception as e:
        print("[-] Failed to decode JSON response:", e)
        print(response.text)

driver.quit()
