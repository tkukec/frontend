<!-- src/components/NewEventModal.vue -->
<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <h2>Create New Event</h2>
      <form @submit.prevent="createEvent">
        <label>
          Name:
          <input v-model="newEvent.name" required />
        </label>
        <label>
          Affected Brand:
          <input v-model="newEvent.affectedBrand" required />
        </label>
        <label>
          Description:
          <textarea v-model="newEvent.description" required></textarea>
        </label>
        <label>
          Malicious URL:
          <input v-model="newEvent.maliciousURL" required />
        </label>
        <label>
          Matching Keywords:
          <input v-model="newEvent.matchingKeywords" placeholder="Comma-separated keywords" required />
        </label>
        <label>
          Status:
          <select v-model="newEvent.status" required>
            <option value="todo">To Do</option>
            <option value="in progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </label>
        <button type="submit">Create</button>
        <button type="button" @click="closeModal">Cancel</button>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { addDoc, collection, getFirestore, serverTimestamp } from 'firebase/firestore';

export default {
  name: 'NewEventModal',
  props: {
    isOpen: {
      type: Boolean,
      required: true
    }
  },
  setup(props, { emit }) {
    const db = getFirestore();
    const newEvent = ref({
      name: '',
      affectedBrand: '',
      description: '',
      maliciousURL: '',
      maliciousDomainRegistrationDate: '',
      matchingKeywords: '',
      status: 'todo',
      creationDateTime: serverTimestamp(),
      maliciousDomainDNSRecords: {
        A: [],
        NS: [],
        MX: []
      },
      analystComments: []
    });

    const closeModal = () => {
      emit('close');
    };

    const createEvent = async () => {
      try {
        newEvent.value.maliciousDomainRegistrationDate = new Date(newEvent.value.maliciousDomainRegistrationDate);
        newEvent.value.matchingKeywords = newEvent.value.matchingKeywords.split(',').map(keyword => keyword.trim());
        await addDoc(collection(db, 'phishing_events'), newEvent.value);
        closeModal();
      } catch (error) {
        console.error('Error creating new event:', error);
      }
    };

    return {
      newEvent,
      closeModal,
      createEvent
    };
  }
};
</script>

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

.modal-content button {
  margin-top: 10px;
}
</style>
