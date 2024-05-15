<!-- src/components/EventItem.vue -->
<template>
  <li>
    <div>
      <h3>{{ event.name }}</h3>
      <p><strong>Creation Date:</strong> {{ event.creationDateTime.toDate().toLocaleString() }}</p>
      <p><strong>Affected Brand:</strong> {{ event.affectedBrand }}</p>
      <p><strong>Description:</strong> {{ event.description }}</p>
      <p><strong>Malicious URL:</strong> <a :href="event.maliciousURL" target="_blank">{{ event.maliciousURL }}</a></p>
      <p><strong>Malicious Domain Registration Date:</strong>
        {{ event.maliciousDomainRegistrationDate.toDate().toLocaleString() }}</p>
      <p><strong>Malicious Domain DNS Records:</strong></p>
      <ul>
        <li><strong>A:</strong> {{ event.maliciousDomainDNSRecords.A.join(', ') }}</li>
        <li><strong>NS:</strong> {{ event.maliciousDomainDNSRecords.NS.join(', ') }}</li>
        <li><strong>MX:</strong> {{ event.maliciousDomainDNSRecords.MX.join(', ') }}</li>
      </ul>
      <p><strong>Matching Keywords:</strong> {{ event.matchingKeywords.join(', ') }}</p>
      <p><strong>Status:</strong> {{ event.status }}</p>
      <p><strong>Analyst Comments:</strong></p>
      <ul>
        <li v-for="comment in sortedComments" :key="comment.timestamp.seconds">
          {{ comment.timestamp.toDate().toLocaleString() }}: {{ comment.comment }} <span
          v-if="comment.edited">(edited)</span>
        </li>
      </ul>

    </div>
  </li>
</template>

<script>
import { PhishingEvent } from '@/service/event_schema'
import { computed } from 'vue';

export default {
  name: 'EventItem',
  props: {
    event: {
      type: PhishingEvent,
      required: true
    }
  }, setup(props) {
    const sortedComments = computed(() => {
      return [...props.event.analystComments].sort((a, b) => a.timestamp.seconds - b.timestamp.seconds)
    })

    return {
      sortedComments
    }
  }

}
</script>
