import pdfx
from os.path import exists
from config import availableUris,uriMatchType
def getHrefsFromPDF(pdfPath:str)->dict:
    if not(exists(pdfPath)):
        raise FileNotFoundError("PDF File not Found")
    pdf = pdfx.PDFx(pdfPath)
    return pdf.get_references_as_dict().get('url',[])


def availableScreeningProfiles(pdfPath:str,idStr:str="Id not Defined")->dict:
    hrefs = getHrefsFromPDF(pdfPath=pdfPath)
    availableLinks = []
    for href in hrefs:
        for uri in availableUris:
            loweredString = href.lower()
            if uri in loweredString and uriMatchType[uri] in loweredString:
                availableLinks.append({
                    'href':href,
                    'uri':uri,
                    'id': idStr
                })
    return availableLinks

