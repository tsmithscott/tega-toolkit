import smtplib

from flask_mail import Message

from app import mail
from config import Config


class SendMail:
    @staticmethod
    def send_confirmation(recipient: str, token: str) -> None:
        with open("./confirmation/templates/confirmation.template", "r") as file:
            data = file.read()
            data = data.replace("{{URL}}", f"https://296b-82-22-79-167.eu.ngrok.io/confirm-account/{token}")
            
        message = Message(subject="Confirm Account", sender="no-reply@tegatoolkit.com", recipients=[recipient])
        message.body = data
        mail.send(message=message)
