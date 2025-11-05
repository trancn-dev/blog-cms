<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app>
      <v-list-item>
        <v-list-item-title class="text-h6">
          CMS Admin
        </v-list-item-title>
        <v-list-item-subtitle>
          {{ user?.email }}
        </v-list-item-subtitle>
      </v-list-item>

      <v-divider></v-divider>

      <v-list density="compact" nav>
        <v-list-item prepend-icon="mdi-view-dashboard" title="Dashboard" value="dashboard" to="/dashboard"></v-list-item>
        <v-list-item prepend-icon="mdi-post" title="Posts" value="posts" to="/posts"></v-list-item>
        <v-list-item prepend-icon="mdi-folder" title="Categories" value="categories" to="/categories"></v-list-item>
        <v-list-item prepend-icon="mdi-tag" title="Tags" value="tags" to="/tags"></v-list-item>
        <v-list-item prepend-icon="mdi-briefcase" title="Projects" value="projects" to="/projects"></v-list-item>
        <v-list-item prepend-icon="mdi-code-tags" title="Skills" value="skills" to="/skills"></v-list-item>
        <v-list-item prepend-icon="mdi-comment" title="Comments" value="comments" to="/comments"></v-list-item>
        <v-list-item prepend-icon="mdi-image" title="Media" value="media" to="/media"></v-list-item>
        <v-list-item prepend-icon="mdi-information" title="About" value="about" to="/about"></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app color="primary" dark>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Blog CMS</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="handleLogout">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <slot />
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const drawer = ref(true)

const user = computed(() => authStore.user)

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>
