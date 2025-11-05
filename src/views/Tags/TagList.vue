<template>
  <default-layout>
    <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex justify-space-between align-center">
            <span>Tags</span>
            <v-btn color="primary" @click="openDialog()">
              <v-icon left>mdi-plus</v-icon>
              New Tag
            </v-btn>
          </v-card-title>

          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="tags"
              :loading="loading"
              item-value="id"
            >
              <template v-slot:item.posts_count="{ item }">
                <v-chip size="small">
                  {{ item.posts_count || 0 }}
                </v-chip>
              </template>

              <template v-slot:item.created_at="{ item }">
                {{ formatDate(item.created_at) }}
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
    <v-dialog v-model="dialog" max-width="600">
      <v-card>
        <v-card-title>{{ editingTag ? 'Edit Tag' : 'Create New Tag' }}</v-card-title>
        <v-card-text>
          <v-form ref="formRef">
            <v-text-field
              v-model="form.name"
              label="Name"
              :rules="[rules.required]"
              required
            />
            <v-text-field
              v-model="form.slug"
              label="Slug"
              :rules="[rules.required]"
              hint="URL-friendly version"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="dialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="handleSubmit" :loading="saving">
            {{ editingTag ? 'Update' : 'Create' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title>Confirm Delete</v-card-title>
        <v-card-text>
          Are you sure you want to delete "{{ deleteItem?.name }}"?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="deleteDialog = false">Cancel</v-btn>
          <v-btn color="error" @click="deleteTag">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
  </default-layout>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { tagsAPI } from '@/api'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

const loading = ref(false)
const tags = ref([])
const dialog = ref(false)
const deleteDialog = ref(false)
const deleteItem = ref(null)
const editingTag = ref(null)
const saving = ref(false)
const formRef = ref(null)

const form = ref({
  name: '',
  slug: '',
})

const headers = [
  { title: 'Name', key: 'name', sortable: true },
  { title: 'Slug', key: 'slug', sortable: true },
  { title: 'Posts', key: 'posts_count', sortable: true },
  { title: 'Created', key: 'created_at', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false },
]

const rules = {
  required: (v) => !!v || 'This field is required',
}

// Auto-generate slug from name
watch(() => form.value.name, (newName) => {
  if (!editingTag.value && newName) {
    form.value.slug = newName
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
  }
})

const fetchTags = async () => {
  loading.value = true
  try {
    const response = await tagsAPI.getAll()
    tags.value = response.data || response
  } catch (error) {
    console.error('Error fetching tags:', error)
  } finally {
    loading.value = false
  }
}

const openDialog = (tag = null) => {
  if (tag) {
    editingTag.value = tag
    form.value = { name: tag.name, slug: tag.slug }
  } else {
    editingTag.value = null
    form.value = { name: '', slug: '' }
  }
  dialog.value = true
}

const handleSubmit = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  saving.value = true
  try {
    if (editingTag.value) {
      await tagsAPI.update(editingTag.value.id, form.value)
    } else {
      await tagsAPI.create(form.value)
    }
    dialog.value = false
    fetchTags()
  } catch (error) {
    console.error('Error saving tag:', error)
  } finally {
    saving.value = false
  }
}

const confirmDelete = (item) => {
  deleteItem.value = item
  deleteDialog.value = true
}

const deleteTag = async () => {
  try {
    await tagsAPI.delete(deleteItem.value.id)
    deleteDialog.value = false
    fetchTags()
  } catch (error) {
    console.error('Error deleting tag:', error)
  }
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString()
}

onMounted(() => {
  fetchTags()
})
</script>
