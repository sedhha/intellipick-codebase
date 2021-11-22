from fastapi import FastAPI, UploadFile, File, Request,WebSocket
from fastapi.middleware.cors import CORSMiddleware
from modules.pdfHrefExtractor import availableScreeningProfiles
from tempfile import TemporaryDirectory
from modules.orchestratorAPI import UIPathOrchestrator,readJson
from modules.idGenerator import IDGenerator
from modules.appScript import AppScriptAPI
import config as cfg
from datetime import datetime as d
from time import time
import json


app = FastAPI()

# origins = [
#     "http://localhost:3000/*",
#     "https://https://intellipick.web.app/*"
# ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
secrets = readJson(jsonPath=cfg.paths["uiPathSecretsPath"])
orchestrator = UIPathOrchestrator(RobotId = secrets["RobotId"],
ReleaseKey = secrets["ReleaseKey"],
MachineId = secrets["MachineId"])
idGen = IDGenerator()
appScript = AppScriptAPI(secretsPath = cfg.paths["appScriptSecrets"])

@app.get("/")
async def main():
    return {"message": "Hello Gals and Boiz"}

@app.post("/file_upload")
async def upload_file(resumePdf: UploadFile = File(...)):
    data = resumePdf.file.read()
    idx = idGen.generate()
    with TemporaryDirectory() as d: #Adding the file into a temporary storage for re-reading purposes
        tmpf = d + "pdf.pdf"
        with open(tmpf,"wb") as f:
            f.write(data)
    hrefs = availableScreeningProfiles(str(tmpf),idStr = idx)
    return hrefs


def completeRequestAndReturnResults(jobParams:dict,weights:dict=None):

    if weights is None:
        weights = cfg.defaultWeights

    date = d.now()
    dateString = f'{date.strftime("%Y-%m-%d %H:%M:%S")}__{time()}'
    jobParams = {
        'jsonArgument':{
            'running':False,
            'dateString': dateString,
            'params':jobParams,
            'weights': weights
            }
        }
    if orchestrator.free:
        response = orchestrator.startAJob(jobParams = jobParams,
        folderId=secrets["folderId"],
        runTimeType="Unattended")
    else:
        return {
            "error": True,
            "jobId": "NA",
            "jobResponse": "NA",
            "msg": "Only one Unattended Robot is allowed. Someone else is already using it :(. Please try after some time.",
            "status_code":500
            }

    appScriptResponse = appScript.getSheetData(sheetName="immediateMerged")
    appScriptResponse = appScriptResponse.json()

    if appScriptResponse["error"]:
        return {**appScriptResponse}
    
    return {**response,'as_data':appScriptResponse}

@app.post("/trigger_ui_path")
async def trigger_ui_path(req:Request):
    jobParams = await req.json()
    return completeRequestAndReturnResults(jobParams = jobParams["allResponses"],
            weights=jobParams["weights"])

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    print('Accepting client connection...')
    await websocket.accept()
    while True:
        try:
            # Wait for any message from the client
            jobParams=await websocket.receive_json()
            result = completeRequestAndReturnResults(jobParams = jobParams["allResponses"],
            weights=jobParams["weights"])
            # Send message to the client           
            await websocket.send_json(result)
            # print(data)
        except Exception as e:
            print('error:', e)
            break
    print('Bye..')

#https://cloud.google.com/run/docs/quickstarts/build-and-deploy/python