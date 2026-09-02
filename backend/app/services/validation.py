import re

EMAIL_PATTERN = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")


def validate_contact_payload(payload):
    name = str(payload.get("name", "")).strip()
    email = str(payload.get("email", "")).strip()
    message = str(payload.get("message", "")).strip()

    if len(name) < 2:
        return None, "Name must be at least 2 characters."
    if not EMAIL_PATTERN.match(email):
        return None, "Email address is invalid."
    if len(message) < 20:
        return None, "Message must be at least 20 characters."

    return {"name": name, "email": email, "message": message}, None
