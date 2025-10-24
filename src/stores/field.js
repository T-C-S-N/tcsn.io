import { defineStore } from 'pinia';
import { ref } from 'vue';
import { FieldItem } from '@/models';

export const useFieldStore = defineStore('field', () => {
  const items = ref([]);
  const itemsMaxAmount = ref(10);

  // generate field items based on window size
  function generateFieldItems () {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const depth = 1000; // Arbitrary depth value for z-axis

    const newItems = [];
    for (let i = 0; i < itemsMaxAmount.value; i++) {
      newItems.push(FieldItem.generateRandom(width, height, depth));
    }
    items.value = newItems;
  }

function updateFieldItems () {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const depth = 1000;
    
    items.value.forEach(item => {
      item.updatePosition(width, height, depth);
    });
    // Force reactivity by reassigning the array reference
    // This tells Vue that the items have changed
    items.value = [...items.value];
  }

  return {
    items,
    generateFieldItems,
    updateFieldItems
  };
});
