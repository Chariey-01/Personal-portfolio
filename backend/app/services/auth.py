from functools import wraps

from flask import current_app, jsonify, request
from itsdangerous import BadSignature, SignatureExpired, URLSafeTimedSerializer
from werkzeug.security import check_password_hash


def _serializer() -> URLSafeTimedSerializer:
    return URLSafeTimedSerializer(current_app.config["SECRET_KEY"], salt="portfolio-admin")


def create_admin_token(username: str) -> str:
    return _serializer().dumps({"sub": username})


def verify_admin_credentials(username: str, password: str) -> bool:
    expected_username = current_app.config["ADMIN_USERNAME"]
    password_hash = current_app.config["ADMIN_PASSWORD_HASH"]
    if not password_hash:
        return False
    return username == expected_username and check_password_hash(password_hash, password)


def require_admin(view):
    @wraps(view)
    def wrapper(*args, **kwargs):
        header = request.headers.get("Authorization", "")
        token = header.removeprefix("Bearer ").strip()
        if not token or token == header:
            return jsonify({"error": "Admin authentication required."}), 401

        try:
            payload = _serializer().loads(
                token,
                max_age=current_app.config["ADMIN_TOKEN_MAX_AGE_SECONDS"],
            )
        except SignatureExpired:
            return jsonify({"error": "Admin session expired."}), 401
        except BadSignature:
            return jsonify({"error": "Invalid admin session."}), 401

        if payload.get("sub") != current_app.config["ADMIN_USERNAME"]:
            return jsonify({"error": "Invalid admin session."}), 401

        return view(*args, **kwargs)

    return wrapper
