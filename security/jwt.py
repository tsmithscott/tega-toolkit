import jwt
from jwt.exceptions import InvalidSignatureError
import json

from config import Config


class JWT:    
    @staticmethod
    def generate_jwt(payload: dict) -> str:
        if type(payload) != dict:
            return TypeError('Payload must be a dictionary.')
        else:
            token = jwt.encode(
                payload=payload,
                key=Config.JWT_SECRET,
                algorithm='HS256'
            )
            
            return token
        
    @staticmethod
    def decode_jwt(token: str) -> dict:
        if type(token) != str:
            return TypeError('Token must be a string.')
        else:
            try:
                token = jwt.decode(
                    jwt=token,
                    key=Config.JWT_SECRET,
                    algorithms='HS256'
                )
                
                return token
            except InvalidSignatureError:
                raise InvalidSignatureError('JWT signature is unverified. This token has been modified.')
    
