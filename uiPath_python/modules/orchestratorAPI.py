from requests import post,get
import json
from time import time,sleep

def readJson(jsonPath:str):

    '''
            This function assumes to read a json File which then returns the metadata.
    '''

    with open(jsonPath) as f:
        data = json.load(f)
        return data


class UIPathOrchestrator:

    def __init__(self,RobotId:int,ReleaseKey:str,MachineId:int):

        self.start_time = time()

        self.RobotId = RobotId
        self.MachineId = MachineId
        self.ReleaseKey = ReleaseKey
        self.free = True

        with open(r"secrets/uipath_secrets.json","r") as f:
            self.secrets = json.load(f)
        self.oAuthToken = self.generateoAuthToken()

    
    def updateReleaseKey(self,newReleaseKey:str):
        self.ReleaseKey = newReleaseKey
        return True

    def setOccupied(self):
        self.free = False
    
    def releaseOccupied(self):
        self.free = True

    def updateMachineId(self,newReleaseKey:str):
        self.MachineId = newReleaseKey
        return True

    def updateRobotId(self,newReleaseKey:str):
        self.RobotId = newReleaseKey
        return True

        
    def generateoAuthToken(self,SCOPES=["OR.Jobs"]):

        self.start_time = time()

        params = {
            "grant_type": "client_credentials",
            "client_id": self.secrets["App ID"],
            "client_secret": self.secrets["App Secret"],
            "scope": " ".join(SCOPES)
            }
        
        uri = self.secrets["AuthorizeEndpoint"]

        response = post(uri,data = params)
        response = response.json()



        if "error" in response:
            raise ValueError(response["error"])
        
        self.oAuthToken = response["access_token"]

        return self.oAuthToken

    def getoAuthToken(self):
        current_time = time()
        deltaSeconds = int(current_time - self.start_time)


        if deltaSeconds > 3600:
            print("Changing Token")
            self.oAuthToken = self.generateoAuthToken()

        return self.oAuthToken


    def getJobStatus(self,jobId:str or int,folderId:str or int):
        uri = f'{self.secrets["GetJobStatusEndpoint"]}({jobId})'
        token = self.getoAuthToken()
        headers = {
            "Authorization": f'Bearer {token}',
            "X-UIPATH-OrganizationUnitId": f'{folderId}'
        }
        response = get(uri,headers=headers).json()
        state = response["State"]

        count = 0

        while True:
            if state != "Running" and state != "Pending":
                break
            token = self.getoAuthToken()
            response = get(uri,headers=headers).json()
            if state=="Pending":
                count += 1
                if count > 5:
                    response["State"] = "Unavailable"
                    break

            state = response["State"]
            sleep(2)

        self.releaseOccupied()

        if response["State"] == "Successful":
            return {
                "error": False,
                "jobId": jobId,
                "jobResponse": response["OutputArguments"],
                "msg": "Scrapping was Successful.",
                "status_code":201
            }
        elif response["State"] == "Unavailable":
            return {
                    "error": True,
                    "jobId": jobId,
                    "jobResponse": response["OutputArguments"],
                    "msg": "The Unattended Robot runs on a Local Windows Machine that is not available or disconnected. You may want to try again some other time or send an email @ activity.schoolsh2@gmail.com.",
                    "status_code":500
                }
        else: 
            return {
                "error": True,
                "jobId": jobId,
                "jobResponse": response,
                "msg": "While performing the Scrapping, some unexpected error happened and caused it to Fail. Please try again or if the issue persists, Email us @ activity.schoolsh2@gmail.com, along with the files.",
                "status_code":400
            }


    def startAJob(self,jobParams:str,
    folderId:str or int,RobotId:int=-1,
    MachineId:int=-1,ReleaseKey:str='-1',runTimeType:str="TestAutomation"):

        if RobotId == -1:
            RobotId = self.RobotId
        if MachineId == -1:
            MachineId = self.MachineId
        if ReleaseKey == '-1':
            ReleaseKey = self.ReleaseKey

        self.setOccupied()


        uri = self.secrets["StartJobEndpoint"]
        token = self.getoAuthToken()

        headers = {
            "Authorization": f'Bearer {token}',
            "X-UIPATH-OrganizationUnitId": f'{folderId}'
        }

        requestBody = {
            "startInfo": {
                "ReleaseKey": ReleaseKey,
                "JobsCount": 1,
                "JobPriority": "Normal",
                "Strategy": "ModernJobsCount",
                "ResumeOnSameContext": False,
                "RuntimeType": runTimeType,
                "InputArguments": json.dumps(jobParams) or "{}",
                "MachineRobots": [
                    {
                        "RobotId": RobotId,
                        "MachineId": MachineId
                    }
                ]
                }
            }

        response = post(uri,json = requestBody,headers = headers).json()

        if "error" in response:
            raise ValueError(response["error"])

        
        jobId = response["value"][0]["Id"]

        jobResponse = self.getJobStatus(jobId = jobId,folderId = folderId)

        return jobResponse

        

