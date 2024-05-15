<!-- src/components/EditEventModal.vue -->
<script setup lang="ts">
import { ref, watch } from 'vue'
import { doc, updateDoc, getFirestore, serverTimestamp, getDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { httpsCallable } from 'firebase/functions'
import { functions } from '../firebase'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  eventId: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['close', 'update'])

const editedEvent = ref(null)

const fetchDnsData = async (domain) => {
  try {
    const getDnsData = httpsCallable(functions, 'getDnsData')
    const result = await getDnsData({ domain })
    return result.data
  } catch (error) {
    console.error('Error fetching DNS data:', error)
  } finally {
    return null;
  }
}

const fetchEvent = async () => {
  const eventDoc = await getDoc(doc(db, 'phishing_events', props.eventId))
  if (eventDoc.exists()) {
    editedEvent.value = eventDoc.data()
  }
}

const closeModal = () => {
  emit('close')
}

const updateEvent = async () => {
  try {
    const dnsData = await fetchDnsData(editedEvent.value.maliciousURL)

    editedEvent.value.maliciousDomainRegistrationDate = dnsData.creationDate
    editedEvent.value.maliciousDomainDNSRecords.A = dnsData.A
    editedEvent.value.maliciousDomainDNSRecords.NS = dnsData.NS
    editedEvent.value.maliciousDomainDNSRecords.MX = dnsData.MX
    editedEvent.value.matchingKeywords = editedEvent.value.matchingKeywords.split(',').map(keyword => keyword.trim())
    await updateDoc(doc(db, 'phishing_events', props.eventId), editedEvent.value)
    emit('update')
    closeModal()
  } catch (error) {
    console.error('Error updating event:', error)
  }
}

const addComment = () => {
  editedEvent.value.analystComments.push({
    timestamp: serverTimestamp(),
    comment: '',
    edited: false
  })
}

const updateComment = (index, comment) => {
  editedEvent.value.analystComments[index].comment = comment
  editedEvent.value.analystComments[index].edited = true
}

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    fetchEvent()
  }
})
</script>

<template>
  <div class="modal-overlay" @click.self="closeModal" v-if="editedEvent">
    <div class="modal-content">
      <h2>Edit Event</h2>
      <form @submit.prevent="updateEvent">
        <label>
          Name:
          <input v-model="editedEvent.name" required />
        </label>
        <label>
          Affected Brand:
          <input v-model="editedEvent.affectedBrand" required />
        </label>
        <label>
          Description:
          <textarea v-model="editedEvent.description" required></textarea>
        </label>
        <label>
          Malicious URL:
          <input v-model="editedEvent.maliciousURL" required />
        </label>
        <label>
          Matching Keywords:
          <input v-model="editedEvent.matchingKeywords" placeholder="Comma-separated keywords" required />
        </label>
        <label>
          Status:
          <select v-model="editedEvent.status" required>
            <option value="todo">To Do</option>
            <option value="in progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </label>
        <h3>Comments</h3>
        <div v-for="(comment, index) in editedEvent.analystComments" :key="index" class="comment">
          <label>
            Comment:
            <textarea v-model="comment.comment" @input="updateComment(index, comment.comment)"></textarea>
          </label>
        </div>
        <button type="button" @click="addComment">Add Comment</button>
        <button type="submit">Update</button>
        <button type="button" @click="closeModal">Cancel</button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;
}

.modal-content h2 {
  margin-top: 0;
}

.modal-content form {
  display: flex;
  flex-direction: column;
}

.modal-content label {
  margin-bottom: 10px;
}

.comment {
  margin-bottom: 10px;
}

.modal-content button {
  margin-top: 10px;
}
</style>
