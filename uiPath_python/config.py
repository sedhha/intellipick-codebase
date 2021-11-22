from os.path import exists
availableUris = {
    "github":"Github",
    "stackoverflow":"Stack Overflow",
    "devpost":"Devpost"
}

uriMatchType = {
    "github": "github.com/",
    "stackoverflow":"stackoverflow.com/users/",
    "devpost":"devpost.com/"
}

paths = {
    "appScriptSecrets": r"secrets/appScript_secrets.json",
    "uiPathSecretsPath": r"secrets/uipath_secrets.json"
}

defaultWeights =  {
    'devpost': {
        'pc': 1, 
        'hc': 1, 
        'ac': 1, 
        'fc': 1, 
        'flc': 1, 
        'lc': 1
        }, 
    'github': {
        'pc': 1, 
        'rc': 1, 
        'pkc': 1, 
        'fc': 1, 
        'flc': 1
        },
    'so': {
        'rc': 1, 
        'rch': 1, 
        'qc': 1, 
        'ac': 1, 
        'pc': 1
        }
    }

for eachElement in paths:
    if not(exists(paths[eachElement])):
        raise Exception("{} does not exist in path".format(paths[eachElement]))