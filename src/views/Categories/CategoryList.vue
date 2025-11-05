<template>
  <default-layout>
    <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex justify-space-between align-center">
            <span>Categories</span>
            <v-btn color="primary" @click="$router.push('/categories/create')">
              <v-icon left>mdi-plus</v-icon>
              New Category
            </v-btn>
          </v-card-title>

          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="categories"
              :loading="loading"
              item-value="id"
            >
              <template v-slot:item.parent="{ item }">
                {{ item.parent?.name || '-' }}
              </template>

              <template v-slot:item.posts_count="{ item }">
                <v-chip size="small">
                  {{ item.posts_count || 0 }}
                </v-chip>
              </template>

              <template v-slot:item.created_at="{ item }">
                {{ formatDate(item.created_at) }}
              </template>

              <template v-slot:item.actions="{ item }">
                <v-btn icon size="small" @click="editCategory(item.id)">
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

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title>Confirm Delete</v-card-title>
        <v-card-text>
          Are you sure you want to delete "{{ deleteItem?.name }}"?
          <v-alert v-if="deleteItem?.posts_count > 0" type="warning" class="mt-2">
            This category has {{ deleteItem.posts_count }} post(s). They will be affected.
          </v-alert>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="deleteDialog = false">Cancel</v-btn>
          <v-btn color="error" @click="deleteCategory">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
  </default-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { categoriesAPI } from '@/api'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

const router = useRouter()
const loading = ref(false)
const categories = ref([])
const deleteDialog = ref(false)
const deleteItem = ref(null)

const headers = [
  { title: 'Name', key: 'name', sortable: true },
  { title: 'Slug', key: 'slug', sortable: true },
  { title: 'Parent', key: 'parent', sortable: false },
  { title: 'Posts', key: 'posts_count', sortable: true },
  { title: 'Order', key: 'order', sortable: true },
  { title: 'Created', key: 'created_at', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false },
]

const fetchCategories = async () => {
  loading.value = true
  try {
    const response = await categoriesAPI.getAll()
    categories.value = response.data || response
  } catch (error) {
    console.error('Error fetching categories:', error)
  } finally {
    loading.value = false
  }
}

const editCategory = (id) => {
  router.push(`/categories/${id}/edit`)
}

const confirmDelete = (item) => {
  deleteItem.value = item
  deleteDialog.value = true
}

const deleteCategory = async () => {
  try {
    await categoriesAPI.delete(deleteItem.value.id)
    deleteDialog.value = false
    fetchCategories()
  } catch (error) {
    console.error('Error deleting category:', error)
  }
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString()
}

onMounted(() => {
  fetchCategories()
})
</script>
