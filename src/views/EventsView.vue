<!-- src/views/EventView.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useEvents } from '../service/events'
import EventItem from '../components/EventItem.vue'
import NewEventModal from '../components/NewEventModal.vue'

const searchTerm = ref('')
const searchType = ref('keywords') // Default search type
const { events } = useEvents()
const isModalOpen = ref(false)

const openModal = () => {
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}




const filteredEvents = computed(() => {
  if (!searchTerm.value) {
    return events.value
  }
  const term = searchTerm.value.toLowerCase()
  return events.value.filter((event) => {
    switch (searchType.value) {
      case 'name':
        return event.name.toLowerCase().includes(term)
      case 'date':
        return event.creationDateTime.toDate().toLocaleString().toLowerCase().includes(term)
      case 'affectedBrand':
        return event.affectedBrand.toLowerCase().includes(term)
      case 'maliciousDomain':
        return event.maliciousURL.toLowerCase().includes(term)
      case 'keywords':
        return event.matchingKeywords.some((keyword) => keyword.toLowerCase().includes(term))
      default:
        return false
    }
  })
})
</script>

<template>
  <main class="max-w-screen">
    <div class="mt-[100px] md:mx-32 mx-10 flex justify-center">
      <div class="justify-center">
        <h1>Phishing Events</h1>
        <div class="search-container">
          <input v-model="searchTerm" placeholder="Search term" />
          <select v-model="searchType">
            <option value="keywords">Keywords</option>
            <option value="name">Name</option>
            <option value="date">Date</option>
            <option value="affectedBrand">Affected Brand</option>
            <option value="maliciousDomain">Malicious Domain</option>
          </select>
          <button @click="openModal">Add New</button>
        </div>
        <ul>
          <EventItem v-for="event in filteredEvents" :key="event.id" :event="event" />
        </ul>
        <NewEventModal v-if="isModalOpen" :isOpen="isModalOpen" @close="closeModal" />
      </div>
    </div>
  </main>
</template>

<style scoped>
.search-container {
  display: flex;
  gap: 10px; /* Space between input, select, and button */
  align-items: center; /* Align items vertically center */
  margin-bottom: 20px; /* Add some space below the search container */
}

.search-container input,
.search-container select {
  height: 40px; /* Adjust the height as needed */
  padding: 5px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.search-container select {
  padding: 5px 10px; /* Ensure select has appropriate padding */
}

.search-container button {
  height: 40px; /* Match height of input and select */
  padding: 5px 15px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
}

.search-container button:hover {
  background-color: #0056b3;
}
</style>

