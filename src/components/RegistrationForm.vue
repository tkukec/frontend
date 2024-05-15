<template>
  <div>
    <button @click="toggleView">{{ isLoginView ? 'Switch to Register' : 'Switch to Login' }}</button>

    <div v-if="isLoginView">
      <h2>Login</h2>
      <form @submit.prevent="login">
        <label for="login-email">Email:</label>
        <input id="login-email" v-model="loginEmail" type="email" required />

        <label for="login-password">Password:</label>
        <input id="login-password" v-model="loginPassword" type="password" required />

        <button type="submit">Login</button>
      </form>
      <button @click="forgotPassword">Forgot Password</button>
    </div>

    <div v-else>
      <h2>Register</h2>
      <form @submit.prevent="register">
        <label for="register-name">Name:</label>
        <input id="register-name" v-model="registerName" type="text" required />

        <label for="register-email">Email:</label>
        <input id="register-email" v-model="registerEmail" type="email" required />

        <label for="register-password">Password:</label>
        <input id="register-password" v-model="registerPassword" type="password" required />

        <button type="submit">Register</button>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, updateProfile } from 'firebase/auth'
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
        const userCredential = await createUserWithEmailAndPassword(auth, registerEmail.value, registerPassword.value)
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
  background-color: #007BFF;
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
