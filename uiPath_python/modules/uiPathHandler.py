import subprocess
from config import paths
import json
from time import sleep

def triggerUIPathFile(filePath:str)->bool:
    if isUIPathProcessRunning():
        return False
    else:
        setMetaDataFile("running",True)
        subprocess.call(f'"{filePath}"')
        setMetaDataFile("running",False)
    return True

def isUIPathProcessRunning():
    filePath = open(paths["queuePath"],mode = "r")
    data = json.load(filePath)
    return data["running"]

def setMetaDataFile(key:str,value):

    with open(paths["queuePath"], "r") as jsonFile:
        data = json.load(jsonFile)

    data[key] = value

    with open(paths["queuePath"], "w") as jsonFile:
        json.dump(data, jsonFile)
    return True


