<template>
  <div class="flex justify-center">
    <div class="w-96 p-6 border rounded-lg shadow-lg">
      <div class="flex justify-center mb-4">
        <button
          @click="toggleView"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {{ isLoginView ? 'Switch to Register' : 'Switch to Login' }}
        </button>
      </div>

      <div v-if="isLoginView">
        <h2 class="text-xl font-bold mb-4 text-center">Login</h2>
        <form @submit.prevent="login" class="space-y-4">
          <label for="login-email" class="block text-gray-700 text-sm font-bold mb-2">Email:</label>
          <input
            id="login-email"
            v-model="loginEmail"
            type="email"
            required
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />

          <label for="login-password" class="block text-gray-700 text-sm font-bold mb-2"
            >Password:</label
          >
          <input
            id="login-password"
            v-model="loginPassword"
            type="password"
            required
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <div class="flex justify-center mt-4">
            <button
              type="submit"
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Login
            </button>
          </div>
        </form>
        <div class="flex justify-center mt-4">
          <button
            @click="forgotPassword"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Forgot Password
          </button>
        </div>
      </div>
      <div v-else>
        <h2 class="text-xl font-bold mb-4 text-center">Register</h2>
        <form @submit.prevent="register" class="space-y-4">
          <label for="register-name" class="block text-gray-700 text-sm font-bold mb-2"
            >Name:</label
          >
          <input
            id="register-name"
            v-model="registerName"
            type="text"
            required
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />

          <label for="register-email" class="block text-gray-700 text-sm font-bold mb-2"
            >Email:</label
          >
          <input
            id="register-email"
            v-model="registerEmail"
            type="email"
            required
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />

          <label for="register-password" class="block text-gray-700 text-sm font-bold mb-2"
            >Password:</label
          >
          <input
            id="register-password"
            v-model="registerPassword"
            type="password"
            required
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />

          <div class="flex justify-center mt-4">
            <button
              type="submit"
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth'
import { firebaseApp } from '../firebase'
import { useRouter } from 'vue-router'

export default {
  setup() {
    const registerName = ref('')
    const registerEmail = ref('')
    const registerPassword = ref('')
    const loginEmail = ref('')
    const loginPassword = ref('')
    const isLoginView = ref(true)

    const auth = getAuth(firebaseApp)
    const router = useRouter()

    const toggleView = () => {
      isLoginView.value = !isLoginView.value
    }

    const register = async () => {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          registerEmail.value,
          registerPassword.value
        )
        await updateProfile(userCredential.user, { displayName: registerName.value })
        alert('Registration successful')
        router.push('/events')
      } catch (error) {
        alert(error.message)
      }
    }

    const login = async () => {
      try {
        await signInWithEmailAndPassword(auth, loginEmail.value, loginPassword.value)
        alert('Login successful')
        router.push('/events')
      } catch (error) {
        alert(error.message)
      }
    }

    const forgotPassword = async () => {
      if (!loginEmail.value) {
        alert('Please enter your email address first')
        return
      }
      try {
        await sendPasswordResetEmail(auth, loginEmail.value)
        alert('Password reset email sent')
      } catch (error) {
        alert(error.message)
      }
    }

    return {
      registerName,
      registerEmail,
      registerPassword,
      loginEmail,
      loginPassword,
      isLoginView,
      toggleView,
      register,
      login,
      forgotPassword
    }
  }
}
</script>

<style scoped>
form {
  margin-bottom: 20px;
}

label {
  display: block;
  margin: 5px 0;
}

input {
  display: block;
  margin: 5px 0 10px 0;
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
