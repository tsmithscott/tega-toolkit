from itsdangerous import URLSafeTimedSerializer

from config import Config

class Token:
    def __init__(self):
        self.serializer = URLSafeTimedSerializer(Config.SECRET_KEY)

    def generate_token(self, email: str) -> str:
        return self.serializer.dumps(
            email,
            salt=Config.SERIALIZER_SALT
        )

    def confirm_token(self, token, expiration=86400):
        try:
            email = self.serializer.loads(
                token,
                salt=Config.SECRET_KEY,
                max_age=expiration
            )
            return email
        except Exception:
            return False
