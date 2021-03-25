<template>
<div id="MapComp">

 		<form class="search" @submit.prevent="submit">
			<fieldset>
      		<legend>Search for Facilities</legend>
      	<div class="city" align="center">
			<input v-model="city_q" style="display: inline-block"/> 	
			<button v-on:click="getCity()" style="display: inline-block">Search for a city</button>
			<select v-model="city_q" style="width: 99% display: inline-block"> 
			<option value="" disabled hidden selected >Choose a city</option>
			<option  v-for="c in cities" :value="c.city" v-bind:key="c.id">
				{{ c.city }}
				</option>
			</select></div>
		<div class="category">
			<input v-model="category_q" style="display: inline-block"/>  
			<button v-on:click="getCategory()" style="display: inline-block">Enter facility category</button> 	
			<select v-model="category_q" style="width: 99% display: inline-block" >
			<option value="" disabled hidden selected >Choose a category</option>
			<option  v-for="cat in categories" :value="cat.facCatName" v-bind:key="cat.idFacCat">
				{{ cat.facCatName }}
				</option>
			</select></div>
		<div class="facility" style="display: inline-block">
			<input v-model="facility_q" style="display: inline-block"/> 
			<button v-on:click="getFacility()">Enter facility name</button> 
			<select v-model="facility_q" style="width: 99% display: inline-block">
			<option value="" disabled hidden selected >Choose a facility name</option>
			<option  v-for="fac in facilities" :value="fac.facName" v-bind:key="fac.idFac">
				{{ fac.facName }}
				</option>
			</select></div>	
			<div v-on:click="getFacilityMessage(f)" v-for="(f, index) in facilities" v-bind:key="f.idfac">{{ index }} : {{f.facName}} {{f.facAddress}} [{{f.facLat}},{{f.facLong}}]</div>
			</fieldset>
		</form>
	   <div id="mapContainer"></div>
</div>
</template>




<script>

import axios from 'axios';
import "leaflet/dist/leaflet.css";
import L from "leaflet";

export default {
props: {
	location
}
,
data(){

	return {
		country_q:'gr',
		city_q:'',
		facility_q:'',
		category_q:'',
		countries:[],
		cities:[],
		categories:[],
		facilities:[],
		mapDiv: {},
		myIcon : {},
	 
	}
},
computed: {
    center: function () {
		if(this.location){
			return [this.location.coords.latitude, this.location.coords.longitude]
		}else if (this.city){
			return [this.city.latitude,this.city.longitude]
		}
		else if (this.facility){
			return [this.facility.facLat,this.facility.faclong]
		}
		else{
			return [37.9833333, 23.7333333]
		}
    }
  }
,
methods:{
	getCity(){
		var url='http://localhost:3000/api/cities/'+this.country_q+'/'+this.city_q;
		console.log(url);
		//var params = new URLSearchParams();
		//params.append('miom', JSON.stringify(this.miom));
		//params.append('miom', this.miom);
		//var headers = {'Content-Type': 'application/json; charset=utf-8'};
		axios.get(url).then(res => {this.cities = res.data.response});
		console.log(this.cities);
	},
	getCities(){
		var url='http://localhost:3000/api/cities/'+this.country_q;
		console.log(url);
		//var params = new URLSearchParams();
		//params.append('miom', JSON.stringify(this.miom));
		//params.append('miom', this.miom);
		//var headers = {'Content-Type': 'application/json; charset=utf-8'};
		axios.get(url).then(res => {this.cities = res.data.response});
		console.log(this.cities);
	},
	getCountries(){
		var url='http://localhost:3000/api/countries/';
		console.log(url);
		var params = new URLSearchParams();
		//params.append('miom', JSON.stringify(this.miom));
		//params.append('miom', this.miom);
		var headers = {
			'Content-Type': 'application/json; charset=utf-8'
			};
		axios.get(url).then(res => {this.countries = res.data.response});
		console.log(this.countries);
			},
	getFacility(){
		var url='http://localhost:3000/facilities/name/'+this.facility_q;
		console.log(url);
		axios.get(url).then(res => {this.facilities = res.data.response});
	},
	getCategory(){
		var url='http://localhost:3000/facilities/category/'+this.category_q;
		var i=0;
		console.log(url);
		axios.get(url).then(res => {
			this.categories = res.data.response;
		})
	},
	getCityMessage(city){
		console.log("==>"+city.latitude+" "+city.longitude);
		this.AddMarker(city.latitude,city.longitude,city.city);
		this.city_q=city.city;
		/*this.center=[city.latitude,city.longitude]*/
	},
	getFacilityMessage(facility){
		console.log("==>"+facility.facLat+" "+facility.facLong);
		this.AddMarker(facility.facLat,facility.facLong,facility.facName);
		/*this.center=[facility.facLat,facility.facLong]*/
	},

	setupLeafletMap (){
		this.mapDiv = L.map("mapContainer").setView(this.center, 13);
			 
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
			}).addTo(this.mapDiv);
			 
			var LeafIcon = L.Icon.extend({
			options: {
				iconUrl: require('C:/Users/konch/synergy/client/src/assets/images/marker.png'),
				//shadowUrl: 'leaf-shadow.png',
				iconSize:     [30, 30],
				//shadowSize:   [50, 64],
				iconAnchor:   [22, 94],
				//shadowAnchor: [4, 62],
				popupAnchor:  [-3, -76]
				}
			});
			
			this.myIcon=new LeafIcon();
	   },
	   AddMarker(lat,long,description){
		L.marker([lat, long],{icon: this.myIcon}).addTo(this.mapDiv)
			.bindPopup(description)
			.openPopup();	
	   
	   
	   },
	   getDistance(lat1, lon1, lat2, lon2, unit) {
	if ((lat1 == lat2) && (lon1 == lon2)) {
		return 0;
	}
	else {
		var radlat1 = Math.PI * lat1/180;
		var radlat2 = Math.PI * lat2/180;
		var theta = lon1-lon2;
		var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
		if (unit=="K") { dist = dist * 1.609344 }
		if (unit=="N") { dist = dist * 0.8684 }
		return dist;
	}
}
	},
     mounted() {
        this.getCountries();
		this.getCities();
		this.getCategory();
		this.setupLeafletMap();
	}
}

</script>



<style scoped >
  #mapContainer {   width: 80vw;
 height: 100vh; }
   h2 {
    font-size: 40px;
    color: mediumseagreen;
  }


</style>
