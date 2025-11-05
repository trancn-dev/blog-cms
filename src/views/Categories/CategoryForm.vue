<template>
  <default-layout>
    <v-container fluid>
    <v-row>
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title>
            {{ isEdit ? 'Edit Category' : 'Create New Category' }}
          </v-card-title>

          <v-card-text>
            <v-form ref="formRef" @submit.prevent="handleSubmit">
              <v-text-field
                v-model="form.name"
                label="Name"
                :rules="[rules.required]"
                required
              />

              <v-text-field
                v-model="form.slug"
                label="Slug"
                hint="URL-friendly version of name"
                :rules="[rules.required]"
              />

              <v-textarea
                v-model="form.description"
                label="Description"
                rows="4"
                hint="Optional description"
              />

              <v-select
                v-model="form.parent_id"
                :items="parentCategories"
                item-title="name"
                item-value="id"
                label="Parent Category"
                hint="Optional - for subcategories"
                clearable
                :loading="loadingParents"
              />

              <v-text-field
                v-model.number="form.order"
                label="Order"
                type="number"
                hint="Display order (lower numbers first)"
              />
            </v-form>
          </v-card-text>

          <v-card-actions>
            <v-btn @click="$router.push('/categories')">Cancel</v-btn>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              @click="handleSubmit"
              :loading="saving"
            >
              {{ isEdit ? 'Update' : 'Create' }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  </default-layout>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { categoriesAPI } from '@/api'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

const router = useRouter()
const route = useRoute()
const formRef = ref(null)

const isEdit = computed(() => !!route.params.id)
const saving = ref(false)
const loadingParents = ref(false)
const parentCategories = ref([])

const form = ref({
  name: '',
  slug: '',
  description: '',
  parent_id: null,
  order: 0,
})

const rules = {
  required: (v) => !!v || 'This field is required',
}

// Auto-generate slug from name
watch(() => form.value.name, (newName) => {
  if (!isEdit.value && newName) {
    form.value.slug = newName
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
  }
})

const fetchParentCategories = async () => {
  loadingParents.value = true
  try {
    const response = await categoriesAPI.getAll()
    let allCategories = response.data || response

    // Exclude current category from parent options when editing
    if (isEdit.value) {
      allCategories = allCategories.filter(cat => cat.id !== parseInt(route.params.id))
    }

    parentCategories.value = allCategories
  } catch (error) {
    console.error('Error fetching categories:', error)
  } finally {
    loadingParents.value = false
  }
}

const fetchCategory = async (id) => {
  try {
    const response = await categoriesAPI.getById(id)
    const category = response.data || response
    Object.assign(form.value, {
      name: category.name,
      slug: category.slug,
      description: category.description,
      parent_id: category.parent_id,
      order: category.order,
    })
  } catch (error) {
    console.error('Error fetching category:', error)
    router.push('/categories')
  }
}

const handleSubmit = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  saving.value = true
  try {
    if (isEdit.value) {
      await categoriesAPI.update(route.params.id, form.value)
    } else {
      await categoriesAPI.create(form.value)
    }
    router.push('/categories')
  } catch (error) {
    console.error('Error saving category:', error)
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  await fetchParentCategories()
  if (isEdit.value) {
    await fetchCategory(route.params.id)
  }
})
</script>
