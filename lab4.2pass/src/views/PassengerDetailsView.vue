<template>
  <div>
    <h1>Passenger Details</h1>
    
    <div v-if="passenger">
      <p>ID: {{ passenger._id }}</p>
      <p>Name: {{ passenger.name }}</p>
      <p>Trips: {{ passenger.trips }}</p>
      <button @click="goToAirlineDetails">View Airline Details</button>
      <button @click="toggleEdit">Edit Passenger</button>
    </div>
    
    <div v-if="isEditing">
      <form @submit.prevent="simulateUpdate">
        <label for="name">Name:</label>
        <input type="text" id="name" v-model="editedPassenger.name">
        <label for="trips">Trips:</label>
        <input type="number" id="trips" v-model="editedPassenger.trips">
        <button type="submit">Update</button>
        <button @click="toggleEdit">Cancel</button>
      </form>
    </div>
    
    <div v-if="showFlashMessage" class="flash-message">
      Update in progress... Redirecting in 5 seconds.
    </div>
    
    <p v-if="loading">Loading...</p>
    <p v-else-if="error === 'not-found'">Resource not found. Please check the ID and try again.</p>
    <p v-else-if="error">An error occurred. Please try again later.</p>
  </div>
</template>

<script>
import { ref, defineComponent, computed } from 'vue';
import { useRouter } from 'vue-router';
import { usePassengerStore } from '@/stores/store';

export default defineComponent({
  setup() {
    const router = useRouter();
    const editedPassenger = ref({});
    const isEditing = ref(false);
    const showFlashMessage = ref(false);
    const loading = ref(false);
    const error = ref(null);
    const passengerStore = usePassengerStore();
    const passenger = computed(() => passengerStore.passenger);

    const toggleEdit = () => {
      isEditing.value = !isEditing.value;
      if (!isEditing.value) {
        editedPassenger.value = { ...passenger.value };
      }
    };

    const simulateUpdate = () => {
      showFlashMessage.value = true;
      setTimeout(() => {
        router.push({ name: 'home' });
      }, 5000);
    };

    const goToAirlineDetails = () => {
      if (passenger.value && passenger.value.airline.length > 0) {
        const airlineId = passenger.value.airline[0]._id;
        router.push({ name: 'airlineDetails', params: { id: airlineId }, query: { passengerId: passenger.value._id } });
        //router.push({ name: 'airlineDetails', params: { id: airlineId } });
      }
    };

    return {
      passenger,
      editedPassenger,
      isEditing,
      showFlashMessage,
      loading,
      error,
      goToAirlineDetails,
      toggleEdit,
      simulateUpdate
    };
  }
});
</script>

<style>
.flash-message {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #f8d7da;
  color: #721c24;
  padding: 10px;
  border-radius: 5px;
  z-index: 1000;
}
</style>