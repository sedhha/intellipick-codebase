from requests import post
from modules.orchestratorAPI import readJson
from os.path import exists
class AppScriptAPI:
    def __init__(self,secretsPath:str):

        if not(exists(secretsPath)):
            raise ValueError(f"Secrets file not found in {secretsPath} ")
        
        self.secrets = readJson(secretsPath)
        self.sheetId = self.secrets["default_sheet_id"]
        self.base_uri = f'https://script.google.com/macros/s/{self.secrets["deploymentId"]}/exec'

    def getSheetData(self,sheetName:str,sheetId:str=None):

        if sheetId is None:
            sheetId = self.sheetId

        reqBody = {
            'apiKey': self.secrets["apiKey"],
            'operationType':self.secrets["defined_operations"]["getSheetData"],
            'operationProps': {
                "sheetId":sheetId,
                "sheetName":sheetName
            }
        }
        
        response = post(url = self.base_uri,json=reqBody)
        
        return response

