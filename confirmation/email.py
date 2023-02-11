from mailersend import emails
from config import Config


class Email:
    def __init__(self, mail_body: dict, mail_from: dict, recipients: list, reply_to: list, subject: str):
        self.mailer = emails.NewEmail(Config.MAILERSEND_API_KEY)
        self.mail_body = mail_body
        
        self.mailer.set_mail_from(mail_from, mail_body)
        self.mailer.set_mail_to(recipients, mail_body)
        self.mailer.set_subject(subject, mail_body)
        self.mailer.set_plaintext_content("Test email", mail_body)
        self.mailer.set_reply_to(reply_to, mail_body)
        
    def send(self) -> str:
        return self.mailer.send(self.mail_body)
    
    
if __name__ == "__main__":
    mail_body = {}
    mail_from = {
        "name": "Tega Support",
        "email": "no-reply@edvinas.tk"
    }
    recipients = [
        {
            "name": "Mohammed Awais",
            "email": "awaisrabnawaz@outlook.com"
        }
    ]
    reply_to = [
        {
            "name": "no-reply@edvinas.tk",
            "email": "no-reply@edvinas.tk"
        }
    ]
    
    app = Email(mail_body, mail_from, recipients, reply_to, "Test Email")
    print(app.send())
