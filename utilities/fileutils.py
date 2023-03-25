import os
import time


class Fileutils:
    @staticmethod
    def garbage_collection(path: str, time_seconds: int):
        time.sleep(time_seconds)
        
        if os.path.exists(path):
            os.remove(path)
            
        exit(0)
