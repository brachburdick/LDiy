
# Function to combine Group, Fixture and Projector tables into StageHierarchy
def selectionUpdate(selectionPath, selectionName):
    op('stageCont/Util')['selected', 'stageData'] = selectionName
    return
            
