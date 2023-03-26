from unittest import TestCase, main
from jwt.exceptions import InvalidSignatureError
from security.jwt import JWT
from config import Config


class TestJWT(TestCase):
    original_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmb28iOiJiYXIifQ.vazZCgNLelGWzRcmDFWb5YOvGEN-3oVYhWxQFGpQHL0'
    fake_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmb28iOiJiYXIifQ._edgENelkMUWzMn_yla70XDzL88hvmD2f1Sqi-QdnwA'
    
    def test_generate(self):
        test_data = {'foo': 'bar'}
        actual = JWT.generate_jwt(test_data)
        
        self.assertEqual(self.original_token, actual)

    def test_decode(self):
        expected = {'foo': 'bar'}
        self.assertEqual(expected, JWT.decode_jwt(self.original_token))
        
    def test_incorrect_signature(self):
        with self.assertRaises(InvalidSignatureError) as exception:
            JWT.decode_jwt(self.fake_token)
            self.assertEqual(str(exception.exception), 'JWT signature is unverified. This token has been modified.')


if __name__ == "__main__":
    main()
