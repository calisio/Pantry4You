export async function getDistance(lat1, long1, lat2, long2){
    
    var p = 0.017453292519943295;    // Math.PI / 180
    var c = Math.cos;
    var a = 0.5 - c((lat2 - lat1) * p)/2 + 
            c(lat1 * p) * c(lat2 * p) * 
            (1 - c((long2 - long1) * p))/2;

    var distance = 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
    console.log(distance);
    return distance; 
}