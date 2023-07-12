
import json
# Get Table DATs
group_table = op('/project1/stage/Groups')
fixture_table = op('/project1/stage/Fixtures')
fixtureLibTable = op('/project1/stage/fixtureLibrary/fixtureLibTable')
util_table = op('/project1/stage/Util')
projector_table = op('/project1/stage/Projectors')
projector_library = op('/project1/stage/projectorLibrary/projLibTable')
mapping_table = op('/project1/stage/channelMapping')
chanNames_table = op('/project1/stage/channelNames')
GCRef = op('/project1/stage/GCRef')
fixture_GC = op('/project1/stage/fixtures_GC')
projDir = op('/project1/stage/projectorDirectory')
# Create StageHierarchy table if it doesn't exist
if not op('/project1/stage/StageHierarchy'):
    print('no stageHeirarchy found')
    op('stageCont').create("tableDAT", 'StageHierarchy')

stage_table = op('/project1/stage/StageHierarchy')


# Function to combine Group, Fixture and Projector tables into StageHierarchy
def combine_tables():
    ## CLEAR STAGE HEIRACHY TABLE
    print('running combine_tables')

	
    # Clear the table
    stage_table.clear()

    # Store fixtures that have been added
    #FOUR ARRAYS
    # ADDED-FIXTURES TO DIF THOSE ADDED VIA GROUP VS NOT
    # COMMON_CHANNELS - TBD
    # PATH_ARRAY - FOR TREELISTER
    # NAMEARRAY - FOR TREELISTER
    # GC BREAKDOWN FROM UTIL STATE - WHICH FIXTURES HAVE WHICH GLOBAL CHANNELS?

    added_fixtures = []
    common_channels= []
    pathArray = []
    nameArray = []
    GCBreakdown = util_table['GCBreakdown','stageData']


    #THE FOLLOWING WILL NOT ALLOW A CHILD TO BELONG TO MORE THAN ONE GROUP - FIX THIS LATER
    # ITERATE OVER GROUPS
    for group_col in range(1, group_table.numCols):
        thisGroup = group_table[0, group_col].val
        # group_col is a number
        # add group to Arrays
        # ADD GROUP TO NAMEARR AND PATHARR
        nameArray.append(thisGroup)
        pathArray.append("/" + thisGroup)


        # ADD EACH CHILD IN THIS GROUP TO ADDEDfIXTURES, NAME ARRAY, AND PATHARRAY(INCLUDING ITS PARENT GROUP)

        # Now we add the group's fixtures to our arrays.
        # Each group refers to (a string of) an array of fixtures
        # grab val, convert to arr, remove brackets, split str by comma, strip any spaces
        arrString = group_table["children", group_col].val
        arrString = arrString[1:-1]
        elements = [s.strip().replace("'","") for s in arrString.split(',')]
        
        # Add and record the fixtures from each group (dont want non-group fixtures to be repeated)
        for index,child in enumerate(elements):
            added_fixtures.append(child)
            nameArray.append(child)
            pathArray.append("/" + thisGroup + "/" + child)

    # NOW ITERATE THROUGH FIXTURES
        # IF FIXTURE NOT IN ADDED FIXTURES, ADD IT TO NAMEARRAY AND PATH ARRAY

    # Add remaining fixtures to stage_table
    for fixture_col in range(1, fixture_table.numCols):
        fixture = fixture_table[0, fixture_col].val
        if fixture not in added_fixtures:
            pathArray.append("/" + fixture)
            nameArray.append(fixture)
                
    stage_table.appendCol(["path", *pathArray])
    stage_table.appendCol(["objects", *nameArray])

    # FOR EACH FIXTURE, UPDATE UTIL STATE WITH FIXTURELIBIDARR, GC, AND DMX SPACE

    # For each fixture in state Fixtures, update fixtureLibIDArr, globalChannels, and DMX space
    # dirty ass subroutine
    #________________________________________________
    #secure DMX domain of fixture
    #dmx domain -> dmx address + libraryID
    stateFixtures = fixture_table.row(0)[1:]
    for child in stateFixtures:
    #OBTAIN ALL FIXTURELIBIDs AND ALL GC FROM UTILSTATE
    #THIS WILL ALLOW US TO UPDATE THEM IF NECESSARY - LIKE IF WE ADD/REMOVE STUFF

    #ALSO REF THE FIXTURE LIBRARY TABLE
    #FIXTURE'S LIBid -> FixLIBid TABLE -> ONE OF MANY UNIQUE MAPS TYING A SPECIFIC FIXTURE'S CHANNELS TO GLOBAL CHANNELS & PROVIDING RELATIVE DMX VALUES
        
    # FOR EACH FIXTURE:
        # GRAB DMX ADDRESS & LIBRARYid FROM UTIL STATE
            ## & THE GC FOR THIS FIXTURE & THE DMX CHANNELS EACH GLOBAL CHANNEL IS TIED FROM THE FIXTURELIBRARYTABLE 
        dmxAddress = fixture_table["stageID",child]

        # check utils for fixtureLibraryIDs, check to see if this fixure is in there
        # if it is, skip this

        # ERROR HANDLE FOR IF THE CURRENT FIX'S ID IS NOT IN THE LIBRARY
        # error catch for missing fixtureLibraryID
        if not fixture_table['libraryID',child].val:
            print('ACHTUNG! NO FIXTURE LIB ID FOR : ', child)

        # grab the LibID and globalChannels for this fixture
        thisFixtureLibID = int(fixture_table['libraryID',child].val)
        thisFixtureGCMap = op(op(fixtureLibTable)[str(thisFixtureLibID),'mapOP'])
        thisFixtureGC = [cell.val for cell in thisFixtureGCMap.col("globalChannel")[1:]]
        thisGCtoDMX = [int(cell.val+dmxAddress) for cell in thisFixtureGCMap.col("relativeChan")[1:]]
        # then, grab the list of fixture IDs and globalChannels from state
        fLIDA = (util_table['libraryIDs','stageData'].val)[1:-1]
        globalChannels = (util_table['globalChannels','stageData'].val)[1:-1]


        #print('thisFixtureLibID', thisFixtureLibID, type(thisFixtureLibID))
        #print('thisFixtureGC', thisFixtureGC, type(thisFixtureGC))
        #print("flida", fLIDA, type(fLIDA))
        #print("globalChannels", globalChannels, type(globalChannels))

        # GCNAMESTRING ARRAY FOR SOME REASON??
        GCNameStrings = [ "'" + x + "'" for x in globalChannels ]
        
        # IF USflidS ARE EMPTY AND USGC'S ARE EMPTY, 
            #CLEAR DMXcHANNELnAMEtABLE AND FILL IT WITH A LABEL AND 255 EMPTY VALS
            #EMPTY usgcBREAKDOWN
            #CLEAR GCRef - STILL UNSURE OF ITS PURPOSE
            #APPEND COL OF GC REF WITH.. SOMETHING? NAME STRINGS? 

            #NOW WE CAN UPDATE THE usflidS AND usgcS TO REFLECT THE ONES WE'VE JUST ADDED FROM THIS FIXTURE - FEEL FREE TO SET THEM EQUAL TO ONE ANOTHER
            #NOW WE PLACE THEM BACK INTO STATE.
            #NOW WE ADD THE THIS FIXTURE'S GC->DMX VALUES AS A COLUMN TO THE MAPPING TABLE
            #WE NEED TO ADD A REFERENCE TO THE FIXTURE GC VALUES IN A TABLE DUE TO THE COMPLEXITY OF PRODUCING COLOR DATA - OUTDATED? I THINK I STOPPED USING THIS


            #OPTIONAL CATCH CASE FOR IF ONE OF THE usflidS OR THE USGCs ARE EMPTY BUT NOT THE OTHER
        # When arrays are empty, both fLIDA and globalChannels are ""
        # if we detect this, we can go ahead and convert them into an array
        if fLIDA == "" and globalChannels == "":
            #print('both empty')
            GCBreakdown = ""
            chanNames_table.clear()
            chanNames_table.appendCol(['channelName',*[0]*255])
            mapping_table.clear()
            GCRef.clear()
            print('GC APPEND COL')
            thisFixtureGCNameStrings =  [ "'" + x + "'" for x in thisFixtureGC ]
            GCRef.appendCol(["",*thisFixtureGCNameStrings])
            #print(thisFixtureGCNameStrings)
           
            fLIDA = [thisFixtureLibID]
            globalChannels = thisFixtureGC
            # and now we place them back into state & place them in the mapping table
            op('/project1/stage/Util1')[10,0]  = globalChannels
            op('/project1/stage/Util1')[11,0] = fLIDA
            mapping_table.appendCol(["Mapping", *globalChannels])
            mapping_table.appendCol([child, *thisGCtoDMX])
            GCRefArray = []
            #for each gc in this fixture, append the reference to the appropriate table 
            for index, c in enumerate(globalChannels):
                chanNames_table[thisGCtoDMX[index], 0] = child + '_' + c 
                GCRefArray.append("op('/project1/stage/projectorWorkshop/fixtureGCVals')[1,'" + child + "_" + c + "'].val")
                GCBreakdown+=(child + "_" + c + ',')
            GCRef.appendCol(["'"+child+"'",*GCRefArray])
            #print('here')
            #for address in thisGCtoDMX


        # catch case for if one is empty but the other isnt
        elif fLIDA == "" and globalChannels != "":
            print('ACHTUNG! fLIDS empty, globalChannels is not!')
        elif fLIDA != "" and globalChannels == "":
            print('ACHTUNG! fLIDS not empty, globalChannels is!')

        # now we include the case where neither are empty
        elif fLIDA != "" and globalChannels != "":
            #print('neither are empty')
            # if we're here, fLIDA & GC are arrayStrings without their brackets.
            # we need to convert them to arrays
            fLIDA = [int(s.strip().replace("'","")) for s in fLIDA.split(',')]
            globalChannels = [s.strip().replace("'","") for s in globalChannels.split(',')]
            #print("flida", fLIDA, type(fLIDA))
            #print("globalChannels", globalChannels, type(globalChannels))
            
            #IF NEITHER USFLIDS NOR USGCs ARE EMPTY, ENTER THIS CLAUSE
            #NOW DIFF THE LID OF THIS FIXTURE & US TO DTMN IF WE HAVE ANY NEW FIXTURE IDs
            #IF NONE NEW, WE SHOULD BE GOOD.
            #IF SOME NEW, WE NEED TO UPDATE usflidS AND USGCs.
            #IF THIS FIXTURE HASN'T BEEN ADDED TO THE CHANNEL MAP,
                    #DO THAT
            #MAKE SURE TO UPDATE GCBREAKDOWN AS YOU GO, AND UPDATE UTILSTATE AFTER IF NEEDED.
            
            # first, check to see if this fLID is in state
            # if not, update fLIDA and GC
            if thisFixtureLibID not in fLIDA:
                op('/project1/stage/Util1')[11,0] = [*fLIDA, int(thisFixtureLibID)]
                # diff globalChannels of this fixture with globalChannels of state
                # if len > 0, update state GC and mapping Table
                newGCs = [x for x in thisFixtureGC if x not in globalChannels]
                if len(newGCs) > 0:
                    op('/project1/stage/Util1')[10,0]  = [*globalChannels, *newGCs]
                    for new in newGCs:
                        mapping_table.appendRow([new])
                        GCRef.appendRow(["'"+new+"'"])
            
            # add mapping values in the row pertaining to this fixture's GChan
            # but ONLY IF they're not currently in the map
            
            if child not in mapping_table.row(0)[1:]:
                mapping_table.appendCol([child])
                GCRef.appendCol(["'"+child+"'"])
                #print(thisFixtureGC)
                for index, gc in enumerate(thisFixtureGC):
                    mapping_table[gc,child] = int(thisFixtureGCMap[gc,"relativeChan"] + dmxAddress)
                    GCRef["'"+gc+"'","'"+child+"'"] = "op('/project1/stage/projectorWorkshop/fixtureGCVals')[1,'" + child + "_" + gc + "'].val"
                    GCBreakdown+=(child + "_" + gc+',')
                    chanNames_table[thisGCtoDMX[index],0] = child+"_"+gc
              
    op('/project1/stage/Util1')[12,'stageData'] = GCBreakdown           
                    

    return


def setProjectors():


    
    # SOME OVERVIEW:
    # PROJECTORS HAVE THEIR OUTPUTS MAPPED TO GCs
    # FIRST LOOK THROUGH PROJECORS TO FIND THE FIXTURES THEY APPLY TO
    # IF THAT PROJECTOR APPLIES TO A FIXTURE, DTMN INTERSECTION OF THEIR GC
    # THIS GOES TWO PLACES:
        # 


    # end dirty ass subroutine
    #________________________________________________

    #now we address the projectors, creating a string which will evaluate to a particular pixel in a top. 
    # for each projector in state,
    for proj in projector_table.row(0)[1:]:
    # LOOP THROUGH PROJECTORS IN PROJECTOR STATE
        #FOR EACH
        #GRAB PROJLIBID
        #GRAB REF FROM PROJLIBTABLE
        #LIB TABLE HOLDS DESIRED TOP AND MAPPING DATA
        #grab ID
        thisProjLibID = projector_table['libraryID',proj]

        # dtmn mapping
        thisProjMap = [projector_library[str(thisProjLibID),'map_r'],projector_library[str(thisProjLibID),'map_g'],projector_library[str(thisProjLibID),'map_b']]


        # dtmn children (convert from stringArray to array)
        thisProjChildrenStringArray = projector_table['children',proj].val[1:-1]
        thisProjChildren = [s.strip().replace("'","") for s in thisProjChildrenStringArray.split(',')]
        thisProjChildrenStringArray = thisProjChildrenStringArray.replace("'","").replace(",", " ")
        print(thisProjChildrenStringArray)
        
        #dtmn the top associated with this projector ID
        thisProjTOP = projector_library[str(thisProjLibID),'TOP']
        thisDirPrefix = "op('/project1/stage/projectorLibrary"+thisProjTOP+"').numpyArray(delayed=True)"

        # clear projector directory table
        projDir.clear()
        #this objects string is used for a dat merge reference later
        projDir.appendRow(["'Objects'", "'r g b a'"])
        # for each child,
        for child in thisProjChildren:
            #dtmn child's xpos and ypos
            #tranformed to the ref frame of the stage of course
            childX = int(fixture_table['tx',child])+int(util_table['stageX', 'stageData']/2)
            childY = int(fixture_table['ty',child])+int(util_table['stageY', 'stageData']/2)
            #REMEMBER: .numpyArray expects y value first!
            thisChildPos = "[" + str(childY) + "][" + str(childX) + "]"
            # dtmn child's gc
            thisFixtureLibID = fixture_table['libraryID',child]
            thisFixtureGCMap = op(op(fixtureLibTable)[str(thisFixtureLibID),'mapOP'])
            thisFixtureGC = thisFixtureGCMap.col(0)[1:]

            # diff the mapping Gc and the child's gc
            mapProjToChild = [x.val for x in thisFixtureGC if x in thisProjMap]


            #The following bit works well, but I'm gonna try a slightly different approach for ease of table merging

            ## for each element in that diff, 
            ## print the correct directory values in a new row
            ## REMEMBER: this string evaluates to a 4-ele tuple of r,g,b,a.
            ## because our map of elements is always iterated through in that order,
            ## you can use the index of the position to request which color value you want
            #for index, c in enumerate(mapProjToChild):
            #    thisChanIndex = "["+str(index)+"]"
            #    projDir.appendRow(["'" + child + "_" + c + "'", thisDirPrefix + thisChildPos + thisChanIndex])

            projDir.appendRow(["'" + child  + "'", thisDirPrefix + thisChildPos])


    return  