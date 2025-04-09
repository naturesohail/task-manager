<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1>Task Manager</h1>
      <button @click="handleLogout" class="btn btn-danger">Logout</button>
    </div>

    <div class="card mb-4">
      <div class="card-header">
        <h3>Add New Task</h3>
      </div>
      <div class="card-body">
        <form @submit.prevent="addTask">
          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="title" class="form-label">Title</label>
              <input type="text" class="form-control" id="title" v-model="newTask.title" required>
            </div>
            <div class="col-md-6 mb-3">
              <label for="due_date" class="form-label">Due Date</label>
              <input type="date" class="form-control" id="due_date" v-model="newTask.due_date" required>
            </div>
          </div>
          <div class="mb-3">
            <label for="description" class="form-label">Description</label>
            <textarea class="form-control" id="description" v-model="newTask.description"></textarea>
          </div>
          <button type="submit" class="btn btn-primary">Add Task</button>
        </form>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <h3>Your Tasks</h3>
      </div>
      <div class="card-body">
        <div v-if="loading" class="text-center">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
        <div v-else>
          <div v-if="tasks.length === 0" class="alert alert-info">
            No tasks found. Add a new task above.
          </div>
          <div v-else class="table-responsive">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="task in tasks" :key="task.id">
                  <td>{{ task.title }}</td>
                  <td>{{ task.description || 'N/A' }}</td>
                  <td>{{ formatDate(task.due_date) }}</td>
                  <td>
                    <span :class="['badge', task.status === 'completed' ? 'bg-success' : 'bg-warning']">
                      {{ task.status }}
                    </span>
                  </td>
                  <td>
                    <button @click="editTask(task)" class="btn btn-sm btn-primary me-2">Edit</button>
                    <button @click="deleteTask(task.id)" class="btn btn-sm btn-danger">Delete</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Task Modal -->
    <div class="modal fade" id="editTaskModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Edit Task</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="updateTask">
              <div class="mb-3">
                <label for="edit_title" class="form-label">Title</label>
                <input type="text" class="form-control" id="edit_title" v-model="editTaskData.title" required>
              </div>
              <div class="mb-3">
                <label for="edit_description" class="form-label">Description</label>
                <textarea class="form-control" id="edit_description" v-model="editTaskData.description"></textarea>
              </div>
              <div class="mb-3">
                <label for="edit_due_date" class="form-label">Due Date</label>
                <input type="date" class="form-control" id="edit_due_date" v-model="editTaskData.due_date" required>
              </div>
              <div class="mb-3">
                <label for="edit_status" class="form-label">Status</label>
                <select class="form-select" id="edit_status" v-model="editTaskData.status">
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <button type="submit" class="btn btn-primary">Update Task</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useTaskStore } from '../stores/tasks'
import { useAuthStore } from '../stores/auth'
import { Modal } from 'bootstrap'
import { useRouter } from 'vue-router'

const taskStore = useTaskStore()
const authStore = useAuthStore()
const router = useRouter()

const tasks = ref([])
const loading = ref(false)
const newTask = ref({
  title: '',
  description: '',
  due_date: '',
  status:"pending"
})
const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};


const editTaskData = ref({
  id: null,
  title: '',
  description: '',
  due_date: '',
  status: 'pending'
})

let editModal = null

onMounted(async () => {
  await loadTasks()
  editModal = new Modal(document.getElementById('editTaskModal'))
})

const loadTasks = async () => {
  try {
    loading.value = true
    await taskStore.fetchTasks()
    tasks.value = taskStore.tasks
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

const addTask = async () => {
  try {
    loading.value = true
    await taskStore.addTask(newTask.value)
    tasks.value = taskStore.tasks
    newTask.value = { title: '', description: '', due_date: '' }
  } finally {
    loading.value = false
  }
}

const editTask = (task) => {
  editTaskData.value = {
    ...task,
    due_date: formatDateForInput(task.due_date)
  };
  editModal.show();
};

const updateTask = async () => {
  try {
    loading.value = true
    await taskStore.updateTask(editTaskData.value)
    tasks.value = taskStore.tasks
    editModal.hide()
  } finally {
    loading.value = false
  }
}

const deleteTask = async (taskId) => {
  if (confirm('Are you sure you want to delete this task?')) {
    try {
      loading.value = true
      await taskStore.deleteTask(taskId)
      tasks.value = taskStore.tasks
    } finally {
      loading.value = false
    }
  }
}

const handleLogout = () => {
  authStore.logout()
  router.push('/')
}
</script>