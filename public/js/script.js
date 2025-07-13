const socket=io(); //because of this connection request is sent to backend

if(navigator.geolocation){ //navigator means something who decide/follows the direction and it is inbuilt in windows object
    navigator.geolocation.watchPosition((position)=>{
        const {latitude,longitude}=position.coords;//this step is used to get the coordinates of the latitude and longitude
        //this is sender's end when emit is used it means that is sender's end
        socket.emit('sendLocation',{latitude,longitude});//we are sending the location coords from the server to backend
    },(error)=>{
console.log(error);
    },
{  //this is settings of watchPosition
    enableHighAccuracy:true,
    timeout:5000,//this is 5000 milliseconds which is 5 seconds
    maximumAge:0 //due to this the person won't get cache(means the person will be hidden)
})
}

const map=L.map("map").setView([0,0],16);//we are saying that give the locaion of the map and set the view at the centre(0,0 means longitude and latitude) of the map with 10% zoom
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
     attribution:'Shreiyans coding school'//can skip this part
}).addTo(map);// we are adding the map 

const markers={};

socket.on('receiveLocation',(data)=>{
    const {id,latitude,longitude}=data;
    map.setView([latitude,longitude]);
    if (markers[id]){ //if marker is already there then we will set latitude and longitude
       markers[id].setLatLng([latitude,longitude]);
    }
    else{
        markers[id]=L.marker([latitude,longitude]).addTo(map);
    }
})

socket.on('userDisconnected',(id)=>{
    if(markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id];
    }
})
