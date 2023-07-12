# After desired state is pulled from DB, define functions to update client accordingly

group_table = op('/project1/stage/group_state')
fixture_table = op('/project1/stage/fixture_state')
fixture_library = op('/project1/stage/fixtureLibrary/fixtureLibTable')
util_table = op('/project1/stage/util_state')
projector_table = op('/project1/stage/projector_state')
macro_library_table = op('/project1/workshop/macroLibrary/macroLibraryTable')
macroLib =  op('/project1/workshop/macroLibrary')
GCtoDMX_table = op('/project1/stage/fixtureGCtoDMX')
chanNames_table = op('/project1/stage/DMXChannelNames')
dmxChannelsPre_chop =  op('/project1/stage/DMXChannelsPre')
GCRef = op('/project1/stage/GCRef')
fixture_GC = op('/project1/stage/fixtures_GC')
fixturePixelEvals = op('/project1/stage/fixturePixelEvals')
TL_table = op('/project1/stage/treeListerHeirarchy')
macro_ref_pf = "op('/project1/workshop/macroLibrary/"
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
            chanNames_table.clear()
            GCtoDMX_table.appendCol(['GCstoDMX', *US_GCs]) #adding labels
            GCtoRender_table.appendCol(["'GCstoDMX'", *["'"+gc+"'" for gc in US_GCs]])
            GCtoDMX_table.appendCol([fName, *fGCtoDMX ])
            GCtoRender_table.appendCol(["'"+fName+"'" ])

            #do the same for the dmx channel names
            
            chanNames_table.appendCol(['channelName',*['empty']*255])

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
                
                #TODO: Fix fixturelibID bug
                #BUG HERE
                util_table['general_fixtureLibIDs','_UTIL_'] = " ".join([*US_FLIDs, fLID])
                #print('line 161'," ".join([*US_FLIDs, fLID]))

                #update any gcs not accounted for
                newGCs =[x for x in fGCs if x not in US_GCs] 
                newGCs = [x for x in newGCs if x != ""]
                if len(newGCs)>0:
                    util_table['general_globalChannels', '_UTIL_'] = " ".join([*US_GCs, *newGCs])
                    
                    for new in newGCs:
                        GCtoDMX_table.appendRow([new]) 
                        GCtoRender_table.appendRow(["'" + new+ "'"])
                        US_GCs.append(new)

            #MAKE SURE TO UPDATE GCBREAKDOWN AS YOU GO, AND UPDATE UTILSTATE AFTER IF NEEDED.
            
            GCtoDMXFixtures = [cell.val for cell in GCtoDMX_table.row(0)]
            if fName not in GCtoDMXFixtures:
                GCtoDMX_table.appendCol([fName])
                GCtoRender_table.appendCol(["'"+fName+"'"])
                for index, gc in enumerate(fGCs):
                    GCtoDMX_table[gc,fName] = int(fGCtoDMX[index])   
                    chanNames_table[fGCtoDMX[index],0] = fGCNames[index]
        #for index, chan in enumerate(chanNames_table.col(0)[1:]):
            
    
    return


    #the following function exists to allow the extractProjectors function
    #to map the macro references of a particular projector to operators that
    #provide channels through which to calculate fixture pixel values


def extractProjectors():
    #loop through projectors in proj-state
    tdToxPath_projectorNode = "C:/Program Files/Derivative/TouchDesigner/Samples/Palette/UI/Custom/projectorNode.tox"
    tdToxPath_pixelGen = "C:/Program Files/Derivative/TouchDesigner/Samples/Palette/UI/Custom/pixelGenerator.tox"
    
    wsNodeCont = op('/project1/workshop/projector_nodes')
    projectors = [cell.val for cell in projector_table.row(0)]
   
    #destory current ProjectorNodes in WS
    for child in wsNodeCont.children:
        child.destroy()

    #find and destory pixel generators in WS
    #print("HERE", macroLib.findChildren(tags=['pGenInstance'], depth=1, type=containerCOMP))
    for child in  macroLib.findChildren(tags=['pGenInstance'], depth=1, type=containerCOMP):
        #print(child.name + " destroyed")
        child.destroy()
        
    

    for proj in projectors[1:]:
        #print(proj)
        pIO0 = projector_table['gcRouting_0',proj].val 
        pIO1 = projector_table['gcRouting_1',proj].val
        pIO2 = projector_table['gcRouting_2',proj].val
        pIO3 = projector_table['gcRouting_3',proj].val
        pGCs = [pIO0,pIO1,pIO2,pIO3]
        pFixtures = projector_table['relationships_fixtures', proj].val.split(" ")
        pMacroRefs = projector_table['relationships_macros', proj].val.split(" ")
        #produce list of operators from list of IDs
        
        pMacros = [macro_ref_pf + macro_library_table[x,'operator'] + "')" for x in pMacroRefs]


        #set the nodes in the WS display
        thisNode = wsNodeCont.loadTox(tdToxPath_projectorNode)
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
        #for each macro, also create a pixel generator
        for mRef in pMacroRefs:
            macroName = macro_library_table[mRef,'operator'].val
            
            macroStr = macro_ref_pf + macro_library_table[mRef,'operator'] + "')"
            macroOp = op('/project1/workshop/macroLibrary/'+macroName )
            
            mOut0 = macro_library_table[mRef,'map_0'].val
            mOut1 = macro_library_table[mRef,'map_1'].val
            mOut2 = macro_library_table[mRef,'map_2'].val
            mOut3 = macro_library_table[mRef,'map_3'].val
            mOuts = [mOut0, mOut1, mOut2, mOut3]

            #Create new pixelGenerator
            newPGen = macroLib.loadTox(tdToxPath_pixelGen)
            newPGen.name = proj + "_" + mRef
            if util_table['general_pixelGenerators','_UTIL_'] == "":
                util_table['general_pixelGenerators','_UTIL_'] = proj + '_' + mRef
            else:
                util_table['general_pixelGenerators','_UTIL_'] = util_table['general_pixelGenerators','_UTIL_'].val + " " + proj + "_" + mRef

            pgSourceTable = op('/project1/workshop/macroLibrary/'+newPGen.name+'/source')
            pgClone = op('/project1/workshop/macroLibrary/'+newPGen.name+'/cloneThis')
            
            #connect pGen to top and to output
            op(macroOp).outputConnectors[0].connect(newPGen.inputConnectors[0])
            newPGen.outputConnectors[0].connect(op('/project1/workshop/macroLibrary/consolidateAllMacros'))

            #set up source table labels
            pgSourceTable.clear()
            pgClone.par.r = mOut0
            pgClone.par.g = mOut1
            pgClone.par.b = mOut2
            pgClone.par.a = mOut3
            pgSourceTable.appendRow(['fixtures', *[out for out in mOuts],'ftx','fty'])
            #source should instantiate w lable row only
            #for each fixture in our current

            
            for fName in pFixtures:
                fpmGCs = []
                addFixToSource = False
                #if we havent added this fixture to our source table, do it now

                fLID = fixture_table['id_fixtureLibraryID',fName].val
                fMap = op('/project1/stage/fixtureLibrary/' + fLID)
                fGCs = [cell.val for cell in fMap.col('globalChannel')[1:]]
                ftx = (int(fixture_table['general_tx', fName])+int(util_table['general_stageX', '_UTIL_']/2))/int(util_table['general_stageX', '_UTIL_'])
                fty= (int(fixture_table['general_ty', fName])+int(util_table['general_stageY', '_UTIL_']/2))/int(util_table['general_stageY', '_UTIL_'])
                #REMEMBER: .numpyArray expects y value first!
                fPos = "[" + str(fty) + "][" + str(ftx) + "]"
                for index, out in enumerate(mOuts):

                    #This is incorrect and will lead to bugs
                    #TODO: FIX
                    #we need to check for the fGs that are IN our pGCs, not all of both. This is not an intersection.
                    if out in pGCs and out in fGCs:
                        addFixToSource = True
                        fpmGCs.append(out)
                        #evaluation =  macroStr + '.numpyArray(delayed=True)[' + str(fty) + '][' + str(ftx) + '][' + str(index)+']'
                        evaluation = "op('/project1/stage/dmxChannels')[1,str('" + fName + "'+'_'+'"+out+"')]"
                        #print(evaluation)
                        #print(eval(evaluation))
                        GCtoRender_table["'"+out+"'","'"+fName+"'"] = evaluation
                        chanNames_table[fName+ "_" + out, "'Values'"] = evaluation
                    else:
                        fpmGCs.append("")

                if addFixToSource == True:
                    pgSourceTable.appendRow([fName, *[gc for gc in fpmGCs],ftx,fty])
                    #if we have common GCs, add row to source table of pixelGenerator
                    #this is sloppy. I need to recode this whole section.
                    #basically, if there's a common channel, see if we've added this fixture to the source already
                    #If we haven't add it n

                            
                        

    return
     




