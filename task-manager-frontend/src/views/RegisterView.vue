<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-5">
        <div class="card shadow-lg border-0 rounded-lg">
          <div class="card-header bg-success text-white rounded-top py-3">
            <h3 class="text-center mb-0"><i class="bi bi-person-plus-fill me-2"></i> Register</h3>
          </div>
          <div class="card-body p-4 p-md-5">
            <form @submit.prevent="handleRegister">
              <div class="mb-3">
                <label for="name" class="form-label"><i class="bi bi-person-circle me-2"></i> Name</label>
                <div class="input-group">
                  <input
                    type="text"
                    class="form-control"
                    id="name"
                    v-model="form.name"
                    :class="{ 'is-invalid': errors.name }"
                    placeholder="Enter your name"
                    :disabled="isSubmitting"
                  >
                  <span class="input-group-text bg-light border-start-0"><i class="bi bi-asterisk text-danger" v-if="errors.name"></i></span>
                </div>
                <div class="invalid-feedback" v-if="errors.name">
                  {{ errors.name }}
                </div>
              </div>
              <div class="mb-3">
                <label for="email" class="form-label"><i class="bi bi-envelope-fill me-2"></i> Email</label>
                <div class="input-group">
                  <input
                    type="email"
                    class="form-control"
                    id="email"
                    v-model="form.email"
                    :class="{ 'is-invalid': errors.email }"
                    placeholder="Enter your email"
                    :disabled="isSubmitting"
                  >
                  <span class="input-group-text bg-light border-start-0"><i class="bi bi-asterisk text-danger" v-if="errors.email"></i></span>
                </div>
                <div class="invalid-feedback" v-if="errors.email">
                  {{ errors.email }}
                </div>
              </div>
              <div class="mb-3">
                <label for="password" class="form-label"><i class="bi bi-key-fill me-2"></i> Password</label>
                <div class="input-group">
                  <input
                    type="password"
                    class="form-control"
                    id="password"
                    v-model="form.password"
                    :class="{ 'is-invalid': errors.password }"
                    placeholder="Enter your password"
                    :disabled="isSubmitting"
                  >
                  <span class="input-group-text bg-light border-start-0"><i class="bi bi-asterisk text-danger" v-if="errors.password"></i></span>
                </div>
                <div class="invalid-feedback" v-if="errors.password">
                  {{ errors.password }}
                </div>
              </div>
              <div class="mb-3">
                <label for="password_confirmation" class="form-label"><i class="bi bi-key-fill me-2"></i> Confirm Password</label>
                <div class="input-group">
                  <input
                    type="password"
                    class="form-control"
                    id="password_confirmation"
                    v-model="form.password_confirmation"
                    :class="{ 'is-invalid': errors.password_confirmation }"
                    placeholder="Confirm your password"
                    :disabled="isSubmitting"
                  >
                  <span class="input-group-text bg-light border-start-0"><i class="bi bi-asterisk text-danger" v-if="errors.password_confirmation"></i></span>
                </div>
                <div class="invalid-feedback" v-if="errors.password_confirmation">
                  {{ errors.password_confirmation }}
                </div>
              </div>
              <button type="submit" class="btn btn-success w-100 py-2" :disabled="isSubmitting">
                <i class="bi bi-person-plus-fill me-2" v-if="!isSubmitting"></i>
                <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                {{ isSubmitting ? 'Processing...' : 'Register' }}
              </button>
              <p class="mt-4 text-center text-muted">
                Already have an account? <router-link to="/" class="text-decoration-none">Log In</router-link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const form = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: ''
});

const errors = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: ''
});

const isSubmitting = ref(false); // Reactive ref to track submission state

const validateForm = () => {
  let isValid = true;

  errors.value = {
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  };

  if (!form.value.name) {
    errors.value.name = 'Name is required';
    isValid = false;
  } else if (form.value.name.length < 2) {
    errors.value.name = 'Name must be at least 2 characters';
    isValid = false;
  }

  if (!form.value.email) {
    errors.value.email = 'Email is required';
    isValid = false;
  } else if (!/^\S+@\S+\.\S+$/.test(form.value.email)) {
    errors.value.email = 'Please enter a valid email address';
    isValid = false;
  }

  if (!form.value.password) {
    errors.value.password = 'Password is required';
    isValid = false;
  } else if (form.value.password.length < 6) {
    errors.value.password = 'Password must be at least 6 characters';
    isValid = false;
  }

  if (!form.value.password_confirmation) {
    errors.value.password_confirmation = 'Confirm Password is required';
    isValid = false;
  } else if (form.value.password !== form.value.password_confirmation) {
    errors.value.password_confirmation = 'Passwords do not match';
    isValid = false;
  }

  return isValid;
};

const handleRegister = async () => {
  if (!validateForm()) return;

  isSubmitting.value = true; // Set submitting state to true

  try {
    const success = await authStore.register(form.value);
    if (success) {
      router.push('/tasks');
    } else {
      // Handle registration failure (optional)
      console.error('Registration failed');
      // You might want to display a general error message to the user here
    }
  } finally {
    isSubmitting.value = false; // Set submitting state back to false, regardless of success or failure
  }
};
</script>

<style scoped>
.card {
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.card-header {
  border-bottom: none;
}

.form-label {
  font-weight: 500;
  color: #495057;
}

.form-control {
  border-radius: 0.25rem;
}

.input-group > .form-control:not(:first-child),
.input-group > .form-select:not(:first-child) {
  border-left: 0;
}

.btn-success {
  background-color: #28a745; /* Success color for register */
  border-color: #28a745;
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-success:hover {
  background-color: #1e7e34;
  border-color: #1e7e34;
}

.invalid-feedback {
  color: #dc3545;
  font-size: 0.875em;
  margin-top: 0.25rem;
}

.text-muted {
  color: #6c757d !important;
}

.bi {
  vertical-align: -0.125em;
  fill: currentColor;
}

.spinner-border {
  width: 1rem;
  height: 1rem;
}
</style>