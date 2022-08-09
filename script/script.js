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
{   
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
            td.innerHTML=(i+'th row '+t+'th column')
            td.classList.add(pos,'empty')
            td.setAttribute('id',pos)

        }    
}}
function clean()
{
    Object.keys(playerShips).forEach(e => {
        playerShips[e].location=[]
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
        console.log(` You have selected ${shipname}`)
        shipTable.classList.remove('selectable')
        boardSelector()
    })
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
    x = slicer(target.classList[0]).a
    y = slicer(target.classList[0]).b
    const loc = target.classList
    console.log(` You have clicked ${loc}`)
    let preLocation=playerShips[shipname].location
//check if origin point entered. If entered proceed for direction
    if(preLocation.length>0 &&( x !=slicer(preLocation[0]).a && y!=slicer(preLocation[0]).b )){console.log('mal misin amk ');return}
    preLocation.push(loc[0])
// add is adjacent func here
    alert('now please select direction you want to place your ship:')
    if(preLocation.length>1)
    {   shipPlacer(preLocation[0],preLocation[1],shipname)
        console.log(`complete rest of the cells if there is enough space, also the coordinates are: ${x} ${y}`);return
        
    }
    
}   )}
function directionChecker(x,y)
{   let x1,x2,y1,y2
    y1=slicer(x).a
    x1=slicer(x).b
    y2=slicer(y).a
    x2=slicer(y).b
    console.log(x,y)
    if(x1>x2){console.log('<-');return -1}
    else if (x1<x2){console.log('->');return +1}
    else if(y1>y2){console.log('^');return -100}
    else if(y1<y2){console.log('v');return +100}}

//slicing the coordinates
function slicer(x='')
{x=x.toString();let a=x.slice(0,2);let b=x.slice(2,4);return {a,b}}

function shipPlacer(x,y,ship={})
{ ship = playerShips[ship]
  size = ship.size
  ship.location=[x]
  
  let findir = directionChecker(x,y)
  x=parseInt(x)
  y=parseInt(y)
  //checking for enough space
    for(i=0;i<size-1;i++)
    {   a=parseInt(x)+findir
        if(a>1010 || 1001> a >910 || a<101 || 201>a>110){ship.location=[];console.log('please select a valid direction');return;}

        ship.location.push(a)
        x+=findir
        ship.status='placed'
    }
    console.log(ship.location)
    shipTable.classList.add('selectable')
}
document.querySelector('#newGameButton').addEventListener('click',function(e){newGame()})











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


