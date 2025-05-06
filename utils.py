import uuid

def calculate_score(data):
    # Very basic scoring — improve with ML later
    if len(data.get("mouseMoves", [])) < 5:
        return 0.2
    if len(data.get("keyTimings", [])) > 10:
        return 0.9
    return 0.5

def generate_behavior_token(public_key, score):
    return f"{public_key}-{uuid.uuid4().hex}"
