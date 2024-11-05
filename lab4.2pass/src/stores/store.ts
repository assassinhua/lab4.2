// store.js
import { defineStore } from 'pinia';

export const usePassengerStore = defineStore('passenger', {
  state: () => ({
    passenger: null,
  }),
  actions: {
    setPassenger(data) {
      this.passenger = data;
    }
  }
});