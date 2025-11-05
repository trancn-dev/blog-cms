<template>
  <default-layout>
    <v-container fluid>
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-title class="d-flex justify-space-between align-center">
              <span>Projects</span>
              <v-btn color="primary" @click="openDialog()">
                <v-icon left>mdi-plus</v-icon>
                New Project
              </v-btn>
            </v-card-title>

            <v-card-text>
              <v-data-table
                :headers="headers"
                :items="projects"
                :loading="loading"
                item-value="id"
              >
                <template v-slot:item.featured_image="{ item }">
                  <v-avatar v-if="item.featured_image" size="60" rounded>
                    <v-img :src="item.featured_image"></v-img>
                  </v-avatar>
                  <v-icon v-else size="60" color="grey-lighten-2">mdi-briefcase-outline</v-icon>
                </template>

                <template v-slot:item.status="{ item }">
                  <v-chip :color="item.status === 'published' ? 'success' : 'default'" size="small">
                    {{ item.status }}
                  </v-chip>
                </template>

                <template v-slot:item.is_featured="{ item }">
                  <v-icon v-if="item.is_featured" color="warning">mdi-star</v-icon>
                </template>

                <template v-slot:item.links="{ item }">
                  <div class="d-flex gap-2">
                    <v-btn v-if="item.demo_url" :href="item.demo_url" target="_blank" icon size="x-small" variant="text">
                      <v-icon size="small">mdi-open-in-new</v-icon>
                    </v-btn>
                    <v-btn v-if="item.repository_url" :href="item.repository_url" target="_blank" icon size="x-small" variant="text">
                      <v-icon size="small">mdi-github</v-icon>
                    </v-btn>
                  </div>
                </template>

                <template v-slot:item.actions="{ item }">
                  <v-btn icon size="small" @click="openDialog(item)">
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn icon size="small" color="error" @click="confirmDelete(item)">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Create/Edit Dialog -->
      <v-dialog v-model="dialog" max-width="800" scrollable>
        <v-card>
          <v-card-title>{{ editMode ? 'Edit Project' : 'Create New Project' }}</v-card-title>
          <v-card-text>
            <v-form ref="formRef">
              <v-text-field
                v-model="form.title"
                label="Title"
                :rules="[v => !!v || 'Title is required']"
                required
              ></v-text-field>

              <v-text-field
                v-model="form.slug"
                label="Slug"
                hint="Auto-generated from title"
                :rules="[v => !!v || 'Slug is required']"
                required
              ></v-text-field>

              <v-textarea
                v-model="form.description"
                label="Description"
                rows="3"
              ></v-textarea>

              <v-textarea
                v-model="form.content"
                label="Content"
                rows="6"
              ></v-textarea>

              <v-text-field
                v-model="form.featured_image"
                label="Featured Image URL"
                type="url"
              ></v-text-field>

              <v-text-field
                v-model="form.demo_url"
                label="Demo URL"
                type="url"
              ></v-text-field>

              <v-text-field
                v-model="form.repository_url"
                label="Repository URL"
                type="url"
              ></v-text-field>

              <v-select
                v-model="form.status"
                :items="['draft', 'published']"
                label="Status"
              ></v-select>

              <v-checkbox
                v-model="form.is_featured"
                label="Featured Project"
              ></v-checkbox>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="closeDialog">Cancel</v-btn>
            <v-btn color="primary" @click="saveProject">
              {{ editMode ? 'Update' : 'Create' }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Delete Confirmation Dialog -->
      <v-dialog v-model="deleteDialog" max-width="400">
        <v-card>
          <v-card-title>Confirm Delete</v-card-title>
          <v-card-text>
            Are you sure you want to delete "{{ deletingProject?.title }}"?
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="deleteDialog = false">Cancel</v-btn>
            <v-btn color="error" @click="deleteProject">Delete</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </default-layout>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { projectsAPI } from '@/api'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

const router = useRouter()
const projects = ref([])
const loading = ref(false)
const dialog = ref(false)
const deleteDialog = ref(false)
const editMode = ref(false)
const deletingProject = ref(null)
const formRef = ref(null)

const headers = [
  { title: 'Image', key: 'featured_image', sortable: false },
  { title: 'Title', key: 'title' },
  { title: 'Description', key: 'description', sortable: false },
  { title: 'Status', key: 'status' },
  { title: 'Featured', key: 'is_featured' },
  { title: 'Links', key: 'links', sortable: false },
  { title: 'Actions', key: 'actions', sortable: false },
]

const form = ref({
  title: '',
  slug: '',
  description: '',
  content: '',
  featured_image: '',
  demo_url: '',
  repository_url: '',
  status: 'draft',
  is_featured: false
})

watch(() => form.value.title, (newTitle) => {
  if (!editMode.value && newTitle) {
    form.value.slug = newTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }
})

const fetchProjects = async () => {
  loading.value = true
  try {
    const response = await projectsAPI.getAll()
    projects.value = response.data.data || response.data
  } catch (error) {
    console.error('Error fetching projects:', error)
  } finally {
    loading.value = false
  }
}

const openDialog = (project = null) => {
  if (project) {
    editMode.value = true
    form.value = { ...project }
  } else {
    editMode.value = false
    form.value = {
      title: '',
      slug: '',
      description: '',
      content: '',
      featured_image: '',
      demo_url: '',
      repository_url: '',
      status: 'draft',
      is_featured: false
    }
  }
  dialog.value = true
}

const closeDialog = () => {
  dialog.value = false
  editMode.value = false
  form.value = {
    title: '',
    slug: '',
    description: '',
    content: '',
    featured_image: '',
    demo_url: '',
    repository_url: '',
    status: 'draft',
    is_featured: false
  }
}

const saveProject = async () => {
  try {
    if (editMode.value) {
      await projectsAPI.update(form.value.id, form.value)
    } else {
      await projectsAPI.create(form.value)
    }

    await fetchProjects()
    closeDialog()
  } catch (error) {
    console.error('Error saving project:', error)
  }
}

const confirmDelete = (project) => {
  deletingProject.value = project
  deleteDialog.value = true
}

const deleteProject = async () => {
  try {
    await projectsAPI.delete(deletingProject.value.id)
    await fetchProjects()
    deleteDialog.value = false
    deletingProject.value = null
  } catch (error) {
    console.error('Error deleting project:', error)
  }
}

onMounted(() => {
  fetchProjects()
})
</script>
