from __future__ import annotations

import smtplib
from email.message import EmailMessage

from flask import current_app


def send_contact_notification(contact_message) -> bool:
    """Send owner notification when SMTP is configured; storage remains authoritative."""
    host = current_app.config.get("SMTP_HOST")
    recipient = current_app.config.get("CONTACT_NOTIFICATION_TO")
    sender = current_app.config.get("CONTACT_NOTIFICATION_FROM") or recipient
    if not host or not recipient or not sender:
        return False

    email = EmailMessage()
    email["Subject"] = f"Portfolio Inquiry: {contact_message.inquiry_type}"
    email["From"] = sender
    email["To"] = recipient
    reply_to = f"{contact_message.name} <{contact_message.email}>"
    email["Reply-To"] = reply_to
    email.set_content(
        "\n".join(
            [
                f"Name: {contact_message.name}",
                f"Email: {contact_message.email}",
                f"Inquiry type: {contact_message.inquiry_type}",
                f"Submitted: {contact_message.created_at.isoformat()}",
                "",
                contact_message.message,
            ]
        )
    )

    port = int(current_app.config.get("SMTP_PORT", 587))
    username = current_app.config.get("SMTP_USERNAME")
    password = current_app.config.get("SMTP_PASSWORD")
    use_tls = current_app.config.get("SMTP_USE_TLS", True)

    with smtplib.SMTP(host, port, timeout=10) as smtp:
        if use_tls:
            smtp.starttls()
        if username and password:
            smtp.login(username, password)
        smtp.send_message(email)
    return True
