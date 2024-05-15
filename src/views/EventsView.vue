<!-- src/views/EventView.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue';
import { useEvents } from '../service/events';
import EventItem from '../components/EventItem.vue';

const searchTerm = ref('');
const { events } = useEvents();

const filteredEvents = computed(() => {
  if (!searchTerm.value) {
    return events.value;
  }
  const term = searchTerm.value.toLowerCase();
  return events.value.filter(event =>
    event.matchingKeywords.some(keyword => keyword.toLowerCase().includes(term))
  );
});
</script>

<template>
  <main>
    <h1>Phishing Events</h1>
    <input v-model="searchTerm" placeholder="Search by keyword" />
    <ul>
      <EventItem v-for="event in filteredEvents" :key="event.id" :event="event" />
    </ul>
  </main>
</template>
