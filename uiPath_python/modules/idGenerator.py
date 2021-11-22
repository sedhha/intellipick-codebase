from time import time
class IDGenerator:

    def __init__(self):
        
        def idGenerate():

            count = 0
            while True:
                yield count
                count += 1
        
        self.idGenerator = idGenerate()

    def generate(self):
        timeStamp = int(time()*1000000)
        idx = next(self.idGenerator)
        return f'{timeStamp}__{idx}'