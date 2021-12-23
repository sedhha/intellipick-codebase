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

    def getMultipleSheetDataAtOnce(self,sheetDetails:list,sheetId:str=None):
        if sheetId is None:
            sheetId = self.sheetId

        multipleSheetUri = "https://script.google.com/macros/s/AKfycbxQyuoetExczf3KaGM-K53XB4X269SuJ3kP4LBm1xxW3CVbyKLCoLS4XPrjmoJB-ElQdw/exec"
        
        reqBody = {
            'apiKey': self.secrets["apiKey"],
            'operationType':self.secrets["defined_operations"]["getMultipleTagData"],
            'operationProps': {
                "sheetId":sheetId,
                "sheetDetails":sheetDetails
            }
        }

        
        
        response = post(url = multipleSheetUri,json=reqBody)
        
        return response


