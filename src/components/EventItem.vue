<template>
  <ul>
    <li class="event-card">
      <div class="card-content">
        <h3>{{ event.name }}</h3>
        <p>
          <strong>Creation Date:</strong> {{ event.creationDateTime?.toDate().toLocaleString() }}
        </p>
        <p><strong>Affected Brand:</strong> {{ event.affectedBrand }}</p>
        <p><strong>Description:</strong> {{ event.description }}</p>
        <p>
          <strong>Malicious URL:</strong>
          <a :href="event.maliciousURL" target="_blank">{{ event.maliciousURL }}</a>
        </p>
        <p>
          <strong>Malicious Domain Registration Date:</strong>
          {{ formattedmaliciousDomainRegistrationDate }}
        </p>
        <p><strong>Malicious Domain DNS Records:</strong></p>
        <ul>
          <li><strong>A:</strong> {{ event.maliciousDomainDNSRecords?.A?.join(', ') }}</li>
          <li><strong>NS:</strong> {{ event.maliciousDomainDNSRecords?.NS?.join(', ') }}</li>
          <li><strong>MX:</strong> {{ event.maliciousDomainDNSRecords?.MX?.join(', ') }}</li>
        </ul>
        <p><strong>Matching Keywords:</strong> {{ event.matchingKeywords?.join(', ') }}</p>
        <p><strong>Status:</strong> {{ event.status }}</p>
        <p><strong>Analyst Comments:</strong></p>
        <ul>
          <li v-for="comment in sortedComments" :key="comment.timestamp.seconds">
            {{ comment.timestamp?.toDate().toLocaleString() }}: {{ comment.comment }}
            <span v-if="comment.edited">(edited)</span>
          </li>
        </ul>
        <button @click="openModal">Edit</button>
      </div>
    </li>
  </ul>
  <EditEventModal :isOpen="isModalOpen" :eventId="event.id" @close="isModalOpen = false" @update="handleUpdate"/>
</template>

<script>
import { PhishingEvent } from '@/service/event_schema'
import { computed, ref } from 'vue'
import EditEventModal from '@/components/EditEventModal.vue'

export default {
  name: 'EventItem',
  components: { EditEventModal },
  props: {
    event: {
      type: PhishingEvent,
      required: true
    }
  },
  setup(props, { emit }) {
    const isModalOpen = ref(false)

    const openModal = () => {
      isModalOpen.value = true
    }

    const handleUpdate = () => {
      emit('update')
    }

    const sortedComments = computed(() => {
      return [...props.event.analystComments].sort(
        (a, b) => a.timestamp.seconds - b.timestamp.seconds
      )
    })

    const formattedmaliciousDomainRegistrationDate = computed(() => {
      try {
        return props.event.maliciousDomainRegistrationDate?.toDate().toLocaleString()
      } catch (error) {
        console.error('Error formatting date:', error)
        return ''
      }
     })

    return {
      sortedComments,
      isModalOpen,
      openModal,
      handleUpdate
    }
  }
}
</script>

<style scoped>
.event-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 16px;
  padding: 16px;
  background-color: #fff;
  transition: box-shadow 0.3s ease-in-out;
}

.event-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.card-content h3 {
  margin-top: 0;
  margin-bottom: 8px;
  font-size: 1.25em;
}

.card-content p,
.card-content ul {
  margin: 8px 0;
}

.card-content a {
  color: #007bff;
  text-decoration: none;
}

.card-content a:hover {
  text-decoration: underline;
}

.card-content ul {
  padding-left: 20px;
}

.card-content ul li {
  list-style-type: disc;
}

button {
  margin-top: 10px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #0056b3;
}

button:active {
  background-color: #004080;
}

button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.5);
}

</style>
