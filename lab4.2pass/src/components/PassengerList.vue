<template>
  <div>
    <h1>Passenger List</h1>
    <ul>
      <li v-for="passenger in passengers" :key="passenger._id"
      @click="openPassengerDetails(passenger._id)">
        {{ passenger.name }} - Trip Amounts: {{ passenger.trips }}
      </li>
    </ul>
    <button @click="handlePageChange(-1)" :disabled="currentPage === 0">prev page</button>
    <span>Current Page: {{ currentPage + 1 }}</span> <!-- 修改这里的 currentPage + 1 -->
    <button @click="handlePageChange(1)" :disabled="currentPage >= totalPages - 1">next page</button>
    <input type="number" v-model="jumpPage" min="1" :max="totalPages" />
    <button @click="jumpToPage">jump to</button>
    <div v-if="selectedPassenger">
      <h2>Passenger Details:</h2>
      <p>ID: {{ selectedPassenger._id }}</p>
      <p>Name: {{ selectedPassenger.name }}</p>
      <p>Trips: {{ selectedPassenger.trips }}</p>
      <h3>Airlines Details:</h3>
  <ul>
    <li v-for="airline in selectedPassenger.airline" :key="airline._id">
      <strong>ID:</strong> {{ airline._id }}
      <br>
      <strong>Name:</strong> {{ airline.name }}
      <br>
      <strong>Country:</strong> {{ airline.country }}
      <br>
      <strong>Slogan:</strong> {{ airline.slogan }}
      <br>
      <strong>Headquarters:</strong> {{ airline.head_quaters }}
      <br>
      <strong>Website:</strong> <a :href="airline.website" target="_blank">{{ airline.website }}</a>
      <br>
      <strong>Established:</strong> {{ airline.established }}
      <br>
      <strong>__v:</strong> {{ airline.__v }}
    </li>
  </ul>
  <button @click="selectedPassenger = null">Close</button>
  </div>
  </div>
</template>

<script>
import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
export default {
  setup() {
    const passengers = ref([]);
    const currentPage = ref(0);
    const totalPages = ref(0);
    const jumpPage = ref(1); // 默认从第一页开始，而不是从零
    const selectedPassenger = ref(null);
    const router = useRouter();
   

    const fetchPassengers = async (page) => {
      try {
        const response = await axios.get(`https://api.instantwebtools.net/v1/passenger?page=${page - 1}&size=10`); // 调整这里的页数减1
        passengers.value = response.data.data;
        totalPages.value = response.data.totalPages; 
      } catch (error) {
        console.error('Failed to fetch passengers:', error);
      }
    };

    const handlePageChange = (offset) => {
      const nextPage = currentPage.value + offset;
      if (nextPage >= 0 && nextPage < totalPages.value) { 
        currentPage.value = nextPage;
        fetchPassengers(nextPage + 1); // 调整这里的页数加1
      }
    };
    const jumpToPage = () => {
      if (jumpPage.value >= 1 && jumpPage.value <= totalPages.value) {
        currentPage.value = jumpPage.value - 1; // 调整这里的页数减1
        fetchPassengers(jumpPage.value);
      } else {
        alert('plz enter right number');
        jumpPage.value = 1; // 默认跳转第一页，而不是零
      }
    };

   const openPassengerDetails = (id) => {
      router.push({ name: 'passengerDetails', params: { id } });
     };
  
    fetchPassengers(currentPage.value + 1); // 调整这里的页数加1

    return {
      passengers,
      currentPage,
      totalPages,
      handlePageChange,
      jumpPage,
      jumpToPage,
      openPassengerDetails,
      selectedPassenger
    };
  },
};

</script>

<style>

</style>
