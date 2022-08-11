const playerBoard = document.querySelector('#playerTable')
playerBoard.classList.add('selectable')
const enemyBoard = document.querySelector('#enemyTable')
const body = document.querySelector('body')

const playerTable = playerBoard.appendChild(document.createElement('table'))
const enemyTable = enemyBoard.appendChild(document.createElement('table'))
playerTable.classList.add('playerZone')
enemyTable.classList.add('enemyZone')
const tr = playerTable.appendChild(document.createElement('tr'))
const shipContainer = document.querySelector('#ships')
const shipTable = shipContainer.appendChild(document.createElement('table'))
shipTable.classList.add('selectable')
const shipTr = shipTable.appendChild(document.createElement('tr'))
const output = document.querySelector('#output')
const letters=['A','B','C','D','E','F','G','H','I','J','K','L']
let empty,shot,hit // change it to the deep copy 
const gamePhases = {0:'Menu',1:'New Game',2:'Play' ,3:'Game Over'}
let phase = gamePhases[0]
let trgClass, trgInner

// Ship status are: idle, placed, destroyed(destroyed phase comes with when the location array got empty due to move onto hit bar)
let playerShips=
{
'Carrier'   :{
size:5,
location:[],
status:'idle'
},

'Battleship':{
size:4,
location:[],
status:'idle'},

'Cruiser'   :{
size:3,
location:[],
status:'idle'},

'Submarine' :{
size:3,
location:[],
status:'idle'},

'Destroyer' :{
size:2,
location:[],
status:'idle'}
}
let enemyShip = {...playerShips}
function drawTable(place)
{   let zone='p'
    if(place.classList!='playerZone'){zone='e'}
    place.innerHTML=''
    for (let i = 0; i < 11; i++) 
    {
        const tr = place.appendChild(document.createElement('tr'))
        
        for (let t = 0; t < 11; t++) 
        {
            if (i==0 && t>0){const td = tr.appendChild(document.createElement('td'));td.innerHTML=(t);continue}
            else if (t==0 && i>0){const td = tr.appendChild(document.createElement('td'));td.innerHTML=(letters[i-1]);continue}
            else if (i==0 && t==0){const td = tr.appendChild(document.createElement('td'));td.innerHTML=('');continue}
            // for making 1010 instead of 010010 on class
            let pos = (i<10 ? '0'+(i).toString():(i).toString())+(t<10 ? '0'+(t).toString():(t).toString())
            const td = tr.appendChild(document.createElement('td'))
            // td.innerHTML=(i+'th row '+t+'th column')
            td.classList.add(pos,'cell',zone)
            td.setAttribute('id',zone+pos)

        }    
}}
function clean()
{
    Object.keys(playerShips).forEach(e => {
        playerShips[e].location=[]
        playerShips[e].status='idle'
    });
}
function drawShips(playerShips)
{   
    shipTr.innerHTML=''
    console.log('I have drawn the ships')
    for(let s in playerShips)
    {
        
        const tdShipname = shipTr.appendChild(document.createElement('td'))
        tdShipname.innerHTML=`${s}`
        tdShipname.classList=s
        // const tdShipSize = shipTr.appendChild(document.createElement('td'))
        // tdShipSize.innerHTML=`${playerShips[s].size}`
        // tdShipSize.classList.add(s.toLowerCase())
        // tdShipSize.classList.add('selectable')
        //console.log(s+' '+playerShips[s])
    }
    
}
drawTable(playerTable)
drawTable(enemyTable)
drawShips(playerShips)
phase=gamePhases[1]
shipSelector()
clean()
function newGame()
{
    drawTable(playerTable)
    drawTable(enemyTable)
    drawShips(playerShips)
    phase=gamePhases[1]
    shipSelector()
    clean()
}
function shipSelector()
{   
    shipTable.addEventListener('click',function(e)
    {   if(!shipTable.classList.contains('selectable')){return}
        target = e.target
        if(playerShips[target.classList].status=='placed'){return}
        shipname = target.classList
        shipSelected= true//to control if player has selected a ship to place
        console.log(` You have selected ${shipname}`)
        
        shipTable.classList.remove('selectable')
        
    })
    boardSelector()
}
function boardSelector()
{   
    
    playerBoard.addEventListener('click',function(e)
    {
    if(!playerBoard.classList.contains('selectable')){return}
    target = e.target
//check if same cell selected
    if(target.classList.contains('selected') ){console.log('you cant select same cell for direction');return}
    target.classList.add('selected')
    if(typeof shipname =='undefined'){return}
    x = slicer(target.classList[0]).a
    y = slicer(target.classList[0]).b
    const loc = target.classList
    console.log(` You have clicked ${loc}`)
    let preLocation=playerShips[shipname].location
//check if origin point entered. If entered proceed for direction
    if(preLocation.length>0 &&( x !=slicer(preLocation[0]).a && y!=slicer(preLocation[0]).b )){console.log('mal misin amk ');return}
    preLocation.push(loc[0])

    alert('now please select direction you want to place your ship:')
    if(preLocation.length>1)
    {   shipPlacer(preLocation[0],preLocation[1],shipname,)
        console.log(`complete rest of the cells if there is enough space, also the coordinates are: ${x} ${y}`);return
    }
    
}   )}
function directionChecker(x,y)
{   let x1,x2,y1,y2
    y1=slicer(x).a
    x1=slicer(x).b
    y2=slicer(y).a
    x2=slicer(y).b
    
    if(x1>x2){return -1}
    else if (x1<x2){return +1}
    else if(y1>y2){return -100}
    else if(y1<y2){return +100}}
    // if(x1>x2){console.log('<-');return -1}
    // else if (x1<x2){console.log('->');return +1}
    // else if(y1>y2){console.log('^');return -100}
    // else if(y1<y2){console.log('v');return +100}}

//slicing the coordinates
function slicer(x='')
{x=x.toString();let a=x.slice(0,2);let b=x.slice(2,4);return {a,b}}

function shipPlacer(x,y,ship={})
{ 
  ship = playerShips[ship]
  size = ship.size
  ship.location=[x]
  
  let findir = directionChecker(x,y)
  x=parseInt(x)
  y=parseInt(y)
  //checking for enough space
    for(i=0;i<size-1;i++)
    {   a=parseInt(x)+findir
        if(a>1010 || 1001> a >910 || a<101 || 201>a>110){ship.location=[];console.log('please select a valid direction');return;}
        b= a<1000? 0 + a.toString():a.toString()
        ship.location.push(b)
        x+=findir
        ship.status='placed'
    
    }
    // console.log(ship.location)
    shipTable.classList.add('selectable')
    Object.keys(playerShips).forEach(e => {
        if(playerShips[e].status=='placed')
        {
           playerShips[e].location.forEach(function (t,z)
           {
            td = document.getElementById('p'+t)
            td.classList.add('filled')
            td.classList.add(e+z)
            td.classList.remove('selected')
           }) 
        }
    })
}
document.querySelector('#newGameButton').addEventListener('click',function(e){newGame();enemyShipPlacer()})

     
function enemyShipPlacer()
{   
    document.querySelectorAll('.filled').forEach(a => {a.classList.remove('filled');})
    Object.keys(enemyShip).forEach(l => {enemyShip[l].location=[];enemyShip[l].status='idle'})
    Object.keys(enemyShip).forEach(e => {
        let ship= enemyShip[e]
        let size = ship.size
        let locs=randomLoc()
        // while (document.getElementById('e'+locs[0]).classList.contains('filled') || document.getElementById('e'+locs[1]).classList.contains('filled')) {
        //     document.querySelectorAll('.filled').forEach(a => {a.classList.remove('filled');})
        //     randomLoc()
        //     return enemyShipPlacer()
            
        // }
        let x=locs[0]
        let y=locs[1]
     // console.log('ship builders location: '+x+' and '+y)
     ship.location=[x]
     document.getElementById('e'+x).classList.add('filled')
    let findir = directionChecker(x,y)
    x=parseInt(x)
    y=parseInt(y)
    console.log(ship)
    //checking for enough space
    for(i=0;i<size-1;i++)
    {   let a=parseInt(x)+findir//this is our new b value(for the direction this for loop goes until it places everything)
        if(a>1010 || 1001> a >910 || a<101 || 201>a>110 ||a%100==0 ||a%100<=0 || a%100>=10){ship.location=[];enemyShipPlacer()}
        let b= a<1000? 0 + a.toString():a.toString()
        // document.getElementById('e'+b).classList.add('filled')
        ship.location.push(b)
        x+=findir
        ship.status='placed'
    }
})
overlapChecker()
// Object.keys(enemyShip).forEach(d=>{console.log(enemyShip[d].location)})
}
//worst way to check duplicates inside of dictionary, needs to be improved ,  IT DOESNT EVEN WORK..
function overlapChecker(x,y,ship)
{   
    Object.keys(enemyShip).forEach(e => {
        ship = enemyShip[e]
        loc = ship.location
        loc.forEach(function (t) {
            // for(let i  in enemyShip){if(e!=i && enemyShip[i].location.includes(t)) {console.log(i);enemyShipPlacer()}}
            
            Object.keys(enemyShip).forEach(g =>
                {
                    
                    if(enemyShip[g].location.includes(t) && e!=g && (t.length + enemyShip[g].location.length > 2 )){console.log(e,g+'\n'+ 'locations overlapped: ' +enemyShip[g].location+' and '+t); enemyShipPlacer()}    
                })
        
        })
    });
    
}
function enemyShipShow()
{   
    Object.keys(enemyShip).forEach(e => {
        if(enemyShip[e].status=='placed')
        {
        enemyShip[e].location.forEach(function (t,z)
            {
                tde =  document.getElementById('e'+t.toString())
                console.log(tde.classList+'   '+t)
                // tde.classList.add('filled')
                tde.classList.add(e+z)
                console.log(`placement in ${t}`)
                tde.classList.remove('selected')
            }) 
        }
    })
}
function randomLoc()
{ 
    x=Math.round(Math.floor(Math.random()*1000)/100)*100+Math.floor(Math.random()*10);
    locPic=[x+1,x-1,x+100,x-100]
    y=locPic[Math.floor(Math.random()*4)]
    if(x%100<1 ||x%100>10 || x<101 || x>1010)
    { 
        x=0
        y=0
        randomLoc()
    }else if(y%100<1 ||y%100>10 || y<101 || y>1010) 
    {   x=0
        y=0
        randomLoc()
    }
    else if(x!=undefined && y!=undefined)
    {       
            x=x<1000 ? '0'+x.toString() : x.toString()
            y=y<1000 ? '0'+y.toString() : y.toString()
            // console.log(x+'   '+y)
            
    }
    else{randomLoc()}
    arr=[x, y]
    return arr  
}
function shipOverlapChecker(who={})
{
    Object.keys(who).forEach(e=>{
        ship=who[e]
        ship.location.forEach(t => {
            
        });

    })
}










// function shipMouseLoc(asd) {
//     asd.addEventListener('click',function(e)
//         {  
//             // if(asd.classList.contains('selectable')){return}
            
//             target = e.target
//             trgInner = target.innerHTML
//             shipTrgClass = target.classList
//             console.log(target.innerHTML)
//             output.innerHTML=trgInner
//             selectShips()
//         })}
// function selectShips()
// {   let origin,direction
//     console.log('Choose your Ship')
//     if(shipTrgClass)
//     {   console.log(`You have selected ${shipTrgClass[0]}.. Please select ship location: `)
//         boardMouseLoc(playerBoard)
        
//     }

// }
// function boardMouseLoc(asd) 
// {
//     asd.addEventListener('click',function(e)
//     {  
//         // if(asd.classList.contains('selectable')){return}
        
//         target = e.target
//         target.classList.toggle('selected')
//         trgInner = target.innerHTML
//         trgClass = target.classList
//         console.log(target.innerHTML)
//         output.innerHTML=trgInner
//         shipSelectCoordinator(trgClass)
//     })

// }
// function shipSelectCoordinator(trg,loc)
// {   let shipName = shipTrgClass[0]
//     let tempLoc= trg[0]
//     console.log(shipName)
//     playerShips[shipName].location.push(trg[0])
//     console.log(`You have selected:${trg[0]} for the ship, Now please choose direction you want to place your ship`)
    
// }


// document.querySelector('#newGameButton').addEventListener('click',function(e){newGame()})


