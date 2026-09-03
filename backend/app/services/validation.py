import re

EMAIL_PATTERN = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")
INQUIRY_TYPES = {
    "Job Opportunity",
    "Freelance / Project Proposal",
    "Collaboration",
    "Internship Opportunity",
    "Technical Discussion",
    "Mentorship / Networking",
    "Other",
}


def validate_contact_payload(payload):
    name = str(payload.get("name", "")).strip()
    email = str(payload.get("email", "")).strip()
    inquiry_type = str(payload.get("inquiryType", "Other")).strip() or "Other"
    message = str(payload.get("message", "")).strip()

    if len(name) < 2:
        return None, "Name must be at least 2 characters."
    if not EMAIL_PATTERN.match(email):
        return None, "Email address is invalid."
    if len(message) < 20:
        return None, "Message must be at least 20 characters."
    if inquiry_type not in INQUIRY_TYPES:
        return None, "Inquiry type is invalid."

    return {"name": name, "email": email, "inquiry_type": inquiry_type, "message": message}, None
