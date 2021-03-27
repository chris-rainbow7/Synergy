<template>
<div id="Home">
  <table>
		<h1>Synergy</h1>					
		<div>
		<Person-Greeter personName="Glorious"/>
		</div>

		<div>
		<form class="search" @submit.prevent="submit">
			<fieldset>
      		<legend>Search for Facilities</legend>
      	<div class="form-group" align="center">
			<Get-Location @locateMe="location= $event" style="display: inline-block; " size="30"/> or 
			<input list="cities" v-model="city_q" placeholder="Choose a city" class="input" size="30"/> 	
			<datalist id="cities" >
			<option  v-for="c in cities" :value="c.city" v-bind:key="c.id">
				{{ c.city }}
				</option>
			</datalist></div>
		<div class="form-group"> 
			<input list="categories" v-model="category_q" placeholder="Choose a category"  class="input" size="15"/> or
  				<datalist id="categories" >
				<option  v-for="cat in categories" :value="cat.facCatName" v-bind:key="cat.idFacCat">
				{{ cat.facCatName }}
				</option>
  			</datalist>
			<input list="facilities" v-model="facility_q" placeholder="Choose a facility" class="input" size="30"/> 
			<datalist id="facilities" >
			<option  v-for="fac in facilities" :value="fac.facName" v-bind:key="fac.idFac">
				{{ fac.facName }}
				</option>
			</datalist></div>
			<input class="button" type="submit" value="Submit" v-on:click="getFacility()">	
			</fieldset>
			</form>
				<br>
				<table id="table"> 
				<tr>
				<th> AA </th> <th> Category </th><th> Name </th><th> Address </th><th> Outdoor </th><th> City </th>
				</tr>
				<tr v-on:click="getFacilityMessage(f)" v-for="(f, index) in facilities" v-bind:key="f.idfac" onmouseover="" style="cursor: pointer;">
				<td>{{ index+1 }}</td> <td> {{f.facCatName}} </td><td> {{f.facName}} </td><td> {{f.facAddress}} </td><td> {{ f.isOutdoor}} </td><td> {{f.city}} </td>
				</tr>				
				</table>			
		<br>
		</div>
	    <div id="mapContainer"></div>
		</table>
</div>
</template>

<script>
import PersonGreeter from '..\\components\\PersonGreeter.vue';
import GetLocation from '..\\components\\GetLocation.vue';
import axios from 'axios';
import "leaflet/dist/leaflet.css";
import L from "leaflet";



export default {
	components: {
		PersonGreeter, 
		GetLocation
	},
	data() {
   		return {
			location:'',
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
		}else if (this.city_q){
			return [this.city_q.latitude,this.city_q.longitude]
		}
		else if (this.facility){
			return [this.facility_q.facLat,this.facility_q.faclong]
		}
		else{
			return [37.9833333, 23.7333333]
			}
    	}
  	},
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
		if (this.location===''){
			if(this.city_q === '' && this.category_q=== '' && this.facility_q === ''){
				alert("You haven't specified your search, so we will be showing everything!")
				var url='http://localhost:3000/api/facilities';
			}
			else if(this.city_q != '' && this.category_q==='' && this.facility_q ===''){
				var url='http://localhost:3000/api/facilities/city/'+this.city_q;
			}
			else if(this.city_q === '' && this.category_q=== '' && this.facility_q !=''){
				var url='http://localhost:3000/api/facilities/'+this.facility_q;
			}
			else if(this.city_q != '' && this.category_q!='' && this.facility_q ===''){
				var url='http://localhost:3000/api/facilities/city/'+this.city_q+'/category/'+this.category_q;
			}
			else if(this.city_q != '' && this.category_q==='' && this.facility_q !=''){
				var url='http://localhost:3000/api/facilities/city/'+this.city_q+'/name/'+this.facility_q;
			}
			else if(this.city_q != '' && this.category_q!='' && this.facility_q !=''){
				var url='http://localhost:3000/api/facilities/city/'+this.city_q+'/category/'+this.category_q+'/'+this.facility_q;
			}
		}
		
		console.log(url);
		axios.get(url).then(res => {this.facilities = res.data.response});
	},
	getCategory(){
		var url='http://localhost:3000/api/category/'+this.category_q;
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
		this.getCity();
		this.getCategory();
		this.setupLeafletMap();
	}
}

</script>

<style>

#app {

  font-family: Helvetica, Arial, sans-serif;
  text-align: center;
  color: whitesmoke;
  margin-top: 60px;
  background-color:  #094f94;
  
}

.input{
	display:inline-block; 
	text-align:center; 
	color:#094f94
}
.input::placeholder{
	color:#094f94
}
.button{
	color:#094f94
}

#mapContainer {   width: 80vw;
  	height: 100vh; }
	h2 {
    font-size: 40px;
    color: mediumseagreen;
	}
#table{
	width:100%;
	text-align:center;
	vertical-align:middle;
	color: #094f94;
	border: 1px solid #094f94af;
	background-color: whitesmoke;
}
#table th{
	border: 1px solid #094f94af;
}
#table td{
	border: 1px solid #035fbbaf;
}

</style>