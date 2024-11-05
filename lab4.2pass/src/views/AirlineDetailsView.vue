<template>
  <div>
    <h1>Airline Details</h1>
    <div v-if="airline">
      <p>ID: {{ airline._id }}</p>
      <p>Name: {{ airline.name }}</p>
      <p>Country: {{ airline.country }}</p>
      <p>Slogan: {{ airline.slogan }}</p>
      <p>Headquarters: {{ airline.head_quaters }}</p>
      <p>Website: <a :href="airline.website" target="_blank">{{ airline.website }}</a></p>
      <p>Established: {{ airline.established }}</p>
      <button @click="goBackToPassenger">Back to Passenger Details</button>
    </div>
    <div v-else>
      Loading...
    </div>
  </div>
</template>

<script>
import { ref, defineComponent } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';

export default defineComponent({
  setup() {
    const airline = ref(null);
    const route = useRoute();
    const router = useRouter();

    const fetchAirlineDetails = async () => {
      try {
        const response = await axios.get(`https://api.instantwebtools.net/v1/airlines/${route.params.id}`);  
        airline.value = response.data;
      } catch (error) {
        console.error('Failed to fetch airline details:', error);
      }
    };

    const goBackToPassenger = () => {
      // 从路由参数中获取passenger的ID
      const passengerId = route.query.passengerId || route.params.passengerId;
      if (passengerId) {
        router.push({ name: 'passengerDetails', params: { id: passengerId } });
      } else {
        console.error('Passenger ID not found in airline data');
      }
    };

    fetchAirlineDetails();

    return {
      airline,
      goBackToPassenger
    };
  }
});
</script>