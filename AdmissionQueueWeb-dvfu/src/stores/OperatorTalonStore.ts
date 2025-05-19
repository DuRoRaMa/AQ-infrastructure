import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useOperatorTalonStore = defineStore('operator-talon', () => {
  const currentTalonId = ref(-1);

  function setCurrentTalonId(id: number) {
    currentTalonId.value = id;
  }

  return { currentTalonId, setCurrentTalonId };
});
