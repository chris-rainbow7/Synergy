<template>
  <table>
		<h1>Synergy</h1>
					
		<div>
		<h2>Person Greeter</h2> 
		<Person-Greeter personName="Lefteris"/>
		</div>

		<div>
		<Get-Location @locateMe="location= $event"/>
		</div>

		<div>
		<h2>Select city, and name or type of facility</h2>
		<Map-Comp :location="location"/>
		</div>
	
		</table>
</template>

<script>
import PersonGreeter from '..\\components\\PersonGreeter.vue';
import MapComp from '..\\components\\MapComp.vue';
import GetLocation from '..\\components\\GetLocation.vue';

export default {
	components: {
		PersonGreeter, 
		GetLocation,
		MapComp
	},
	data() {
   		return {
			location:''
     	}
   	}
}	
</script>


<style>

#app {

  font-family: Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
   
  
}

 
</style>