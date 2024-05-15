<!-- src/views/EventView.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue';
import { useEvents } from '../service/events';
import EventItem from '../components/EventItem.vue';

const searchTerm = ref('');
const searchType = ref('keywords'); // Default search type
const { events } = useEvents();

const filteredEvents = computed(() => {
  if (!searchTerm.value) {
    return events.value;
  }
  const term = searchTerm.value.toLowerCase();
  return events.value.filter(event => {
    switch (searchType.value) {
      case 'name':
        return event.name.toLowerCase().includes(term);
      case 'date':
        return event.creationDateTime.toDate().toLocaleString().toLowerCase().includes(term);
      case 'affectedBrand':
        return event.affectedBrand.toLowerCase().includes(term);
      case 'maliciousDomain':
        return event.maliciousURL.toLowerCase().includes(term);
      case 'keywords':
        return event.matchingKeywords.some(keyword => keyword.toLowerCase().includes(term));
      default:
        return false;
    }
  });
});
</script>

<template>
  <main>
    <h1>Phishing Events</h1>
    <div>
      <input v-model="searchTerm" placeholder="Search term" />
      <select v-model="searchType">
        <option value="keywords">Keywords</option>
        <option value="name">Name</option>
        <option value="date">Date</option>
        <option value="affectedBrand">Affected Brand</option>
        <option value="maliciousDomain">Malicious Domain</option>
      </select>
    </div>
    <ul>
      <EventItem v-for="event in filteredEvents" :key="event.id" :event="event" />
    </ul>
  </main>
</template>
