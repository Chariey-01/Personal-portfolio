from datetime import datetime, timedelta, timezone

from flask import Blueprint, current_app, jsonify, request

from ..extensions import db
from ..models import ContactMessage
from ..services.validation import validate_contact_payload

contact_bp = Blueprint("contact", __name__)
recent_submissions = {}


@contact_bp.post("/contact")
def contact():
    client_key = request.headers.get("X-Forwarded-For", request.remote_addr or "unknown").split(",")[0]
    now = datetime.now(timezone.utc)
    window = timedelta(seconds=current_app.config["CONTACT_RATE_LIMIT_SECONDS"])
    last_submission = recent_submissions.get(client_key)

    if last_submission and now - last_submission < window:
        return jsonify({"error": "Please wait before sending another message."}), 429

    payload = request.get_json(silent=True) or {}
    validated, error = validate_contact_payload(payload)

    if error:
        return jsonify({"error": error}), 400

    message = ContactMessage(**validated)
    db.session.add(message)
    db.session.commit()
    recent_submissions[client_key] = now

    current_app.logger.info("New portfolio contact message stored with id=%s", message.id)
    return jsonify({"message": "Message received."}), 201
