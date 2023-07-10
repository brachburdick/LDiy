# After desired state is pulled from DB, define functions to update client accordingly

group_table = op('/project1/stage/group_state')
fixture_table = op('/project1/stage/fixture_state')
fixture_library = op('/project1/stage/fixtureLibrary/fixtureLibTable')
util_table = op('/project1/stage/util_state')
projector_table = op('/project1/stage/projector_state')
macro_library = op('/project1/workshop/macroLibrary/macroLibraryTable')
GCtoDMX_table = op('/project1/stage/fixtureGCtoDMX')
chanNames_table = op('/project1/stage/DMXChannelNames')
GCRef = op('/project1/stage/GCRef')
fixture_GC = op('/project1/stage/fixtures_GC')
fixturePixelEvals = op('/project1/stage/fixturePixelEvals')
TL_table = op('/project1/stage/treeListerHeirarchy')
macro_ref_pf = "op('/project1/workshop/macroLibrary"
renderVal_table = op('/project1/stage/renderVals')
GCtoRender_table = op('/project1/stage/GCtoRender')
GCtoRender_eval = op('/project1/stage/GCtoRender_eval')
renderVals_table  = op('/project1/stage/renderVals')
def generateTreeListHeirarchy():
    print('generating TL heirarchy')
    ## CLEAR STAGE HEIRACHY TABLE
    TL_table.clear()

    #FOUR ARRAYS
    # ADDED-FIXTURES TO DIF THOSE ADDED VIA GROUP VS NOT
    addedFixtures = []
    # COMMON_CHANNELS - TBD
    commonChannels = []
    # PATH_ARRAY - FOR TREELISTER
    TLPathArr = []
    # NAMEARRAY - FOR TREELISTER
    TLNameArr = []
    TLTypeArr = []
    # GC BREAKDOWN FROM UTIL STATE - WHICH FIXTURES HAVE WHICH GLOBAL CHANNELS?
    

    #THE FOLLOWING WILL NOT ALLOW A CHILD TO BELONG TO MORE THAN ONE GROUP - FIX THIS LATER
    # ITERATE OVER GROUPS
    for group in group_table.row(0)[1:]:
        groupName = group.val

        # ADD GROUP TO NAMEARR AND PATHARR
        TLNameArr.append(groupName)
        TLPathArr.append("/"+groupName)
        TLTypeArr.append('group')
        children = group_table["relationships_children",groupName].val
        childArr = children.split(" ")

        # ADD EACH CHILD IN THIS GROUP TO ADDEDfIXTURES, NAME ARRAY, AND PATHARRAY(INCLUDING ITS PARENT GROUP)
        for child in childArr:
            TLNameArr.append(child)
            TLPathArr.append("/"+groupName+"/"+child)
            TLTypeArr.append('fixture')
            addedFixtures.append(child)

    # NOW ITERATE THROUGH FIXTURES
    for fixture in fixture_table.row(0)[1:]:
        fixtureName = fixture.val
        
        # IF FIXTURE NOT IN ADDED FIXTURES, ADD IT TO NAMEARRAY AND PATH ARRAY
        if fixtureName not in addedFixtures:
            TLNameArr.append(fixtureName)
            TLPathArr.append("/"+fixtureName)
            TLTypeArr.append('fixture')
    
    TL_table.appendCol(['path',*TLPathArr])
    TL_table.appendCol(['objects',*TLNameArr])
    TL_table.appendCol(['type',*TLTypeArr])
    return


def processFixtureLibraryIDs():
    print('processing FLIDS')
    
    #OBTAIN ALL FIXTURELIBIDs AND ALL GC FROM UTILSTATE
    #THIS WILL ALLOW US TO UPDATE THEM IF NECESSARY - LIKE IF WE ADD/REMOVE STUFF
    US_FLIDs = util_table['general_fixtureLibIDs','_UTIL_'].val.split(" ")
    US_FLIDs = [x for x in US_FLIDs if x != ""]
    US_GCs = util_table['general_globalChannels','_UTIL_'].val.split(" ")
    US_GCs = [x for x in US_GCs if x != ""]
    

    # clear the render vals table

    
    
    # FOR EACH FIXTURE, UPDATE UTIL STATE WITH FIXTURELIBIDARR, GC, AND DMX SPACE    
    # FOR EACH FIXTURE:
    for fixture in fixture_table.row(0)[1:]:

        # GRAB DMX ADDRESS & LIBRARYid FROM FIXTURE STATE
        fName = fixture.val
        fLID = fixture_table['id_fixtureLibraryID',fName].val
        fAddress = fixture_table['address_channel',fName].val
        
        # error handler in case fLID isn't in library
        if not op('/project1/stage/fixtureLibrary/' + fLID):
            print('ACHTUNG! FLID map not found in fixture library')

        #FIXTURE'S LIBid -> this fixture's global channels and relative dmx mapping
        #fixture's GC & relative dmx mapping -> names & channels for dmx name table
        
        fMap = op('/project1/stage/fixtureLibrary/' + fLID)
        fGCs = [cell.val for cell in fMap.col('globalChannel')[1:]]
        fGCtoDMX = [int(cell.val) + int(fAddress) for cell in fMap.col('relativeChannel')[1:]]
        
        fGCNames = [(fName+ '_' + chan) for chan in fGCs]
        #POTENTIALLY USELESS BUT WHY NOT
        #GCBreakdown = ''
        #??????
        # IF USflidS ARE EMPTY AND USGC'S ARE EMPTY, 
        if len(US_FLIDs) == 0 and len(US_GCs) ==0:
            #if both of these are empty, we are filling from the beginnig- new load (potential other case?)
            #anyway - if we're here, then we know that our US_FLIDs and US_GCs are going to at LEAST consist of our current fixture
            #Update the utility state accordingly
            util_table['general_globalChannels', '_UTIL_'] = " ".join(fGCs)
            util_table['general_fixtureLibIDs', '_UTIL_'] = str(fLID)
           
            #now that we've updated state, let's update our variables
            US_GCs = util_table['general_globalChannels', '_UTIL_'].val.split(" ")
            US_FLIDs = util_table['general_fixtureLibIDs', '_UTIL_'].val
            
            
            
            #clear the fixture gc -> dmx mapping table and set it up again. 
            GCtoDMX_table.clear()
            GCtoRender_table.clear()
            GCtoDMX_table.appendCol(['GCstoDMX', *US_GCs]) #adding labels
            GCtoRender_table.appendCol(["'GCstoDMX'", *["'"+gc+"'" for gc in US_GCs]])
            GCtoDMX_table.appendCol([fName, *fGCtoDMX ])
            GCtoRender_table.appendCol(["'"+fName+"'" ])

            #do the same for the dmx channel names
            chanNames_table.clear()
            chanNames_table.appendCol(['channelName',*[0]*255])
            chanNames_table.appendCol(["'Values'"])

            for index,name in enumerate(fGCNames):
                chanNames_table[fGCtoDMX[index],'channelName'] = name
            
           
        #OPTIONAL CATCH CASE FOR IF ONE OF THE usflidS OR THE USGCs ARE EMPTY BUT NOT THE OTHER
        elif (len(US_FLIDs) == 0 and len(US_GCs) != 0) or (len(US_FLIDs) != 0 and len(US_GCs) == 0):
            print('ACHTUNG! US_FLIDs and/or US_GCs is outta whack') 
        
        #IF NEITHER USFLIDS NOR USGCs ARE EMPTY, ENTER THIS CLAUSE
        elif (len(US_FLIDs) != 0 and len(US_GCs) != 0): 
            #NOW DIFF THE LID OF THIS FIXTURE & US TO DTMN IF WE HAVE ANY NEW FIXTURE IDs
            if fLID not in US_FLIDs:
                util_table['general_fixtureLibIDs','_UTIL_'] = " ".join([*US_FLIDs, fLID])

                #update any gcs not accounted for
                newGCs =[x for x in fGCs if x not in US_GCs] 
                newGCs = [x for x in newGCs if x != ""]
                if len(newGCs)>0:
                    util_table['general_globalChannels', '_UTIL_'] = " ".join([*US_GCs, *newGCs])
                    for new in newGCs:
                        GCtoDMX_table.appendRow([new]) 
                        GCtoRender_table.appendRow(["'" + new+ "'"])
            #MAKE SURE TO UPDATE GCBREAKDOWN AS YOU GO, AND UPDATE UTILSTATE AFTER IF NEEDED.
            
            GCtoDMXFixtures = [cell.val for cell in GCtoDMX_table.row(0)]
            if fName not in GCtoDMXFixtures:
                GCtoDMX_table.appendCol([fName])
                GCtoRender_table.appendCol(["'"+fName+"'"])
                for index, gc in enumerate(fGCs):
                    GCtoDMX_table[gc,fName] = int(fGCtoDMX[index])   
                    chanNames_table[fGCtoDMX[index],0] = fGCNames[index]
    
    
    return


    #the following function exists to allow the extractProjectors function
    #to map the macro references of a particular projector to operators that
    #provide channels through which to calculate fixture pixel values


def extractProjectors():
    #loop through projectors in proj-state
    tdToxPath = "C:/Program Files/Derivative/TouchDesigner/Samples/Palette/UI/Custom/projectorNode.tox"
    wsNodeCont = op('/project1/workshop/projector_nodes')
    projectors = [cell.val for cell in projector_table.row(0)]
   
    for child in wsNodeCont.children:
        child.destroy()

    for proj in projectors[1:]:
        print(proj)
        pIO0 = projector_table['gcRouting_0',proj].val 
        pIO1 = projector_table['gcRouting_1',proj].val
        pIO2 = projector_table['gcRouting_2',proj].val
        pIO3 = projector_table['gcRouting_3',proj].val
        pGCs = [pIO0,pIO1,pIO2,pIO3]
        pFixtures = projector_table['relationships_fixtures', proj].val.split(" ")
        pMacroRefs = projector_table['relationships_macros', proj].val.split(" ")
        #produce list of operators from list of IDs
        
        pMacros = [macro_ref_pf + macro_library[x,'operator'] + "')" for x in pMacroRefs]


        #set the nodes in the WS display
        thisNode = wsNodeCont.loadTox(tdToxPath)
        thisNode.name = proj + "_node"
        thisNode.par.Leftlabeltext = proj
        thisNode.par.Rightlabeltext = pIO0 + "  |  " +pIO1 + "  |  " + pIO2 + "  |  " + pIO3

    #we'll have to write in some scripting on how to
    #map tops to projectors' state by dragging tops over nodes
    #until then, lets hardwire in some tops


        #Grab list of macro IDs from relationship_macros state
        
        #print('pMacroRefs', pMacroRefs)
        #print('pMacros', pMacros)
        #for each macro, grab a reference to the appropriate top (for now- in the future we'll reference the channel out)
        for mRef in pMacroRefs:
            macro = macro_ref_pf + macro_library[mRef,'operator'] + "')"
            print(eval(macro))
            mOut0 = macro_library[mRef,'map_0'].val
            mOut1 = macro_library[mRef,'map_1'].val
            mOut2 = macro_library[mRef,'map_2'].val
            mOut3 = macro_library[mRef,'map_3'].val
            mOuts = [mOut0, mOut1, mOut2, mOut3]

            for index, out in enumerate(mOuts):
                for fName in pFixtures:
                    fLID = fixture_table['id_fixtureLibraryID',fName].val
                    fMap = op('/project1/stage/fixtureLibrary/' + fLID)
                    fGCs = [cell.val for cell in fMap.col('globalChannel')[1:]]
                    ftx = int(fixture_table['general_tx', fName])+int(util_table['general_stageX', '_UTIL_']/2)
                    fty= int(fixture_table['general_ty', fName])+int(util_table['general_stageY', '_UTIL_']/2)
                    #REMEMBER: .numpyArray expects y value first!
                    fPos = "[" + str(fty) + "][" + str(ftx) + "]"
                    
                    if out in pGCs and out in fGCs:
                        evaluation =  macro + '.numpyArray(delayed=True)[' + str(fty) + '][' + str(ftx) + '][' + str(index)+']'
                    
                        GCtoRender_table["'"+out+"'","'"+fName+"'"] = evaluation
                        chanNames_table[fName+ "_" + out, "'Values'"] = evaluation

                            
                        

            for fName in pFixtures:
                #print(fName)
                #grab fGC and mGC
                

                fLID = fixture_table['id_fixtureLibraryID',fName].val
                fMap = op('/project1/stage/fixtureLibrary/' + fLID)
                fGCs = [cell.val for cell in fMap.col('globalChannel')[1:]]
                # This will need to be redone in the future based on some linear algebra and orientation of the projector
                # For now we'll stick with xy, and hardcode stuff
                            #dtmn child's xpos and ypos
                #tranformed to the ref frame of the stage of course
                ftx = int(fixture_table['general_tx', fName])+int(util_table['general_stageX', '_UTIL_']/2)
                fty= int(fixture_table['general_ty', fName])+int(util_table['general_stageY', '_UTIL_']/2)
                #REMEMBER: .numpyArray expects y value first!
                fPos = "[" + str(fty) + "][" + str(ftx) + "]"
                
                print(fGCs)
                print(ftx,fty)
                #take intersection
                intersection = [x for x in pGCs if x in fGCs]
                print(intersection)
                #fLookupStatements = op('/project1/stage/projectorLibrary' + ).numpyArray(delayed=True)[ftx][fty]
               
                for gc in intersection:
                    ###for gc in theseGC:
                    evaluation =  macro + '.numpyArray(delayed=True)[' + str(fty) + '][' + str(ftx) + ']'
                    print(evaluation)
                    #renderVals_table.appendRow(["'" + fName  + "'",evaluation])

                    #calculate formula for pixel @ arg = this each
                    #add to GCtoRender table at [gc,fixture]
                    ####GCtoRender_table[gc,fix] = mOpRef.selectPixel(fLookupVals,gc)

                    #this table should be made when calculating each fixture's GCs
                    #and should feed to an eval table
                    #which should feed to the stage display
                    #and join with the table of other relevant vals to be passed to the geom instances
    
    return
     

