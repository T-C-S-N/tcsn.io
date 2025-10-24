import { defineStore } from 'pinia';
import { ref } from 'vue';
import { FieldItem } from '@/models';

export const useFieldStore = defineStore('field', () => {
  const items = ref([]);
  const itemsMaxAmount = ref(10);
  const maxOutsideDistance = 200; // how far outside the window items spawn
  const minVelocity = 0.0005; // minimum speed - very slow movement
  const maxVelocity = 0.002; // maximum speed - very slow movement

  // generate field items based on window size
  function generateFieldItems () {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const depth = 1000; // Arbitrary depth value for z-axis

    const newItems = [];
    for (let i = 0; i < itemsMaxAmount.value; i++) {
      newItems.push(FieldItem.generateRandom(width, height, depth, maxOutsideDistance, minVelocity, maxVelocity));
    }
    items.value = newItems;
  }  function updateFieldItems () {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const depth = 1000;
    
    // Update all items
    items.value.forEach(item => {
      item.updatePosition(width, height, depth);
    });

    // Check collisions between items
    for (let i = 0; i < items.value.length; i++) {
      for (let j = i + 1; j < items.value.length; j++) {
        if (items.value[i].collidesWith(items.value[j])) {
          items.value[i].handleCollision(items.value[j]);
        }
      }
    }

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
