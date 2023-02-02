class InvalidSignature(Exception):
    def __init__(self, *) -> None:
        super().__init__(*args)