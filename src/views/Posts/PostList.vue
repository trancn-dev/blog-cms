<template>
  <default-layout>
    <v-container fluid>
      <v-row>
        <v-col cols="12">
          <v-card>
          <v-card-title class="d-flex justify-space-between align-center">
            <span>Posts</span>
            <v-btn color="primary" @click="$router.push('/posts/create')">
              <v-icon left>mdi-plus</v-icon>
              New Post
            </v-btn>
          </v-card-title>

          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="posts"
              :loading="loading"
              item-value="id"
            >
              <template v-slot:item.status="{ item }">
                <v-chip :color="getStatusColor(item.status)" size="small">
                  {{ item.status }}
                </v-chip>
              </template>

              <template v-slot:item.is_featured="{ item }">
                <v-icon v-if="item.is_featured" color="warning">mdi-star</v-icon>
              </template>

              <template v-slot:item.published_at="{ item }">
                {{ formatDate(item.published_at) }}
              </template>

              <template v-slot:item.actions="{ item }">
                <v-btn icon size="small" @click="editPost(item.id)">
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
          Are you sure you want to delete "{{ deleteItem?.title }}"?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="deleteDialog = false">Cancel</v-btn>
          <v-btn color="error" @click="deletePost">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
  </default-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { postsAPI } from '@/api'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

const router = useRouter()
const loading = ref(false)
const posts = ref([])
const deleteDialog = ref(false)
const deleteItem = ref(null)

const headers = [
  { title: 'Title', key: 'title', sortable: true },
  { title: 'Category', key: 'category.name', sortable: true },
  { title: 'Status', key: 'status', sortable: true },
  { title: 'Featured', key: 'is_featured', sortable: false },
  { title: 'Published', key: 'published_at', sortable: true },
  { title: 'Views', key: 'view_count', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false },
]

const fetchPosts = async () => {
  loading.value = true
  try {
    const response = await postsAPI.getAll()
    posts.value = response.data || response
  } catch (error) {
    console.error('Error fetching posts:', error)
  } finally {
    loading.value = false
  }
}

const editPost = (id) => {
  router.push(`/posts/${id}/edit`)
}

const confirmDelete = (item) => {
  deleteItem.value = item
  deleteDialog.value = true
}

const deletePost = async () => {
  try {
    await postsAPI.delete(deleteItem.value.id)
    deleteDialog.value = false
    fetchPosts()
  } catch (error) {
    console.error('Error deleting post:', error)
  }
}

const getStatusColor = (status) => {
  const colors = {
    draft: 'grey',
    published: 'success',
    archived: 'warning'
  }
  return colors[status] || 'grey'
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString()
}

onMounted(() => {
  fetchPosts()
})
</script>
