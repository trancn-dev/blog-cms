<template>
  <default-layout>
    <v-container fluid>
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-title>
              {{ isEdit ? "Edit Post" : "Create New Post" }}
            </v-card-title>

            <v-card-text>
              <v-form ref="formRef" @submit.prevent="handleSubmit">
                <v-row>
                  <v-col cols="12" md="8">
                    <v-text-field
                      v-model="form.title"
                      label="Title"
                      :rules="[rules.required]"
                      required
                    />

                    <v-text-field
                      v-model="form.slug"
                      label="Slug"
                      hint="URL-friendly version of title"
                      :rules="[rules.required]"
                    />

                    <v-textarea
                      v-model="form.excerpt"
                      label="Excerpt"
                      rows="3"
                      hint="Short description"
                    />

                    <!-- Rich Text Editor for Content -->
                    <div class="content-editor">
                      <label class="editor-label">Content *</label>
                      <QuillEditor
                        v-model:content="form.content"
                        content-type="html"
                        theme="snow"
                        :toolbar="editorToolbar"
                        placeholder="Write your post content here..."
                        style="min-height: 400px"
                      />
                    </div>

                    <v-text-field
                      v-model="form.featured_image"
                      label="Featured Image URL"
                      hint="URL to the featured image"
                      class="mt-4"
                    />
                  </v-col>

                  <v-col cols="12" md="4">
                    <v-select
                      v-model="form.status"
                      :items="statusOptions"
                      label="Status"
                      :rules="[rules.required]"
                    />

                    <v-select
                      v-model="form.category_id"
                      :items="categories"
                      item-title="name"
                      item-value="id"
                      label="Category"
                      :rules="[rules.required]"
                      :loading="loadingCategories"
                    />

                    <v-switch
                      v-model="form.is_featured"
                      label="Featured Post"
                      color="primary"
                    />

                    <v-text-field
                      v-model="form.published_at"
                      label="Publish Date"
                      type="datetime-local"
                    />

                    <v-divider class="my-4"></v-divider>

                    <!-- SEO Meta Expansion Panel -->
                    <v-expansion-panels class="mt-4">
                      <v-expansion-panel>
                        <v-expansion-panel-title>
                          <v-icon left>mdi-search-web</v-icon>
                          Advanced SEO Settings
                        </v-expansion-panel-title>
                        <v-expansion-panel-text>
                          <!-- Basic SEO -->
                          <h4 class="text-subtitle-1 mb-2">Basic SEO</h4>
                          <v-text-field
                            v-model="form.seo.meta_title"
                            label="SEO Title"
                            hint="Leave empty to use post title"
                            counter="60"
                          />
                          <v-textarea
                            v-model="form.seo.meta_description"
                            label="SEO Description"
                            hint="Leave empty to use excerpt"
                            counter="160"
                            rows="2"
                          />
                          <v-text-field
                            v-model="form.seo.meta_keywords"
                            label="Keywords"
                            hint="Comma separated keywords"
                          />
                          <v-text-field
                            v-model="form.seo.canonical_url"
                            label="Canonical URL"
                            hint="Leave empty for default URL"
                          />
                          <v-select
                            v-model="form.seo.meta_robots"
                            :items="robotsOptions"
                            label="Robots Meta"
                          />

                          <v-divider class="my-4"></v-divider>

                          <!-- Open Graph -->
                          <h4 class="text-subtitle-1 mb-2">
                            Open Graph (Facebook)
                          </h4>
                          <v-text-field
                            v-model="form.seo.og_title"
                            label="OG Title"
                            hint="Leave empty to use SEO title"
                          />
                          <v-textarea
                            v-model="form.seo.og_description"
                            label="OG Description"
                            rows="2"
                          />
                          <v-text-field
                            v-model="form.seo.og_image"
                            label="OG Image URL"
                            hint="Recommended: 1200x630px"
                          />
                          <v-select
                            v-model="form.seo.og_type"
                            :items="ogTypeOptions"
                            label="OG Type"
                          />

                          <v-divider class="my-4"></v-divider>

                          <!-- Twitter Card -->
                          <h4 class="text-subtitle-1 mb-2">Twitter Card</h4>
                          <v-select
                            v-model="form.seo.twitter_card"
                            :items="twitterCardOptions"
                            label="Twitter Card Type"
                          />
                          <v-text-field
                            v-model="form.seo.twitter_title"
                            label="Twitter Title"
                          />
                          <v-textarea
                            v-model="form.seo.twitter_description"
                            label="Twitter Description"
                            rows="2"
                          />
                          <v-text-field
                            v-model="form.seo.twitter_image"
                            label="Twitter Image URL"
                            hint="Recommended: 1200x675px"
                          />

                          <v-divider class="my-4"></v-divider>

                          <!-- Schema.org JSON-LD -->
                          <h4 class="text-subtitle-1 mb-2">
                            Schema.org JSON-LD
                          </h4>
                          <v-textarea
                            v-model="schemaJsonText"
                            label="JSON-LD Schema"
                            hint="Valid JSON schema markup"
                            rows="6"
                            @blur="validateSchema"
                          />
                          <v-alert
                            v-if="schemaError"
                            type="error"
                            dense
                            class="mt-2"
                          >
                            {{ schemaError }}
                          </v-alert>
                        </v-expansion-panel-text>
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>

            <v-card-actions>
              <v-btn @click="$router.push('/posts')">Cancel</v-btn>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="handleSubmit" :loading="saving">
                {{ isEdit ? "Update" : "Create" }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </default-layout>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { postsAPI, categoriesAPI } from "@/api";
import { useAuthStore } from "@/stores/auth";
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";

import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const formRef = ref(null);

const isEdit = computed(() => !!route.params.id);
const saving = ref(false);
const loadingCategories = ref(false);
const categories = ref([]);

const statusOptions = ["draft", "published", "archived"];

// Quill Editor Toolbar Configuration
const editorToolbar = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  ["bold", "italic", "underline", "strike"],
  [{ color: [] }, { background: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  [{ indent: "-1" }, { indent: "+1" }],
  [{ align: [] }],
  ["blockquote", "code-block"],
  ["link", "image", "video"],
  ["clean"],
];

const form = ref({
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  featured_image: "",
  category_id: null,
  author_id: authStore.user?.id || 1,
  status: "draft",
  published_at: null,
  is_featured: false,
  meta_title: "",
  meta_description: "",
  seo: {
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
    canonical_url: "",
    meta_robots: "index,follow",
    og_title: "",
    og_description: "",
    og_image: "",
    og_type: "article",
    twitter_card: "summary_large_image",
    twitter_title: "",
    twitter_description: "",
    twitter_image: "",
    schema_json: null,
  },
});

// SEO Options
const robotsOptions = [
  "index,follow",
  "noindex,follow",
  "index,nofollow",
  "noindex,nofollow",
];

const ogTypeOptions = ["article", "website", "blog"];

const twitterCardOptions = ["summary", "summary_large_image", "app", "player"];

// Schema JSON handling
const schemaJsonText = ref("");
const schemaError = ref("");

const validateSchema = () => {
  if (!schemaJsonText.value) {
    form.value.seo.schema_json = null;
    schemaError.value = "";
    return;
  }

  try {
    form.value.seo.schema_json = JSON.parse(schemaJsonText.value);
    schemaError.value = "";
  } catch (e) {
    schemaError.value = "Invalid JSON format";
  }
};

const rules = {
  required: (v) => !!v || "This field is required",
};

// Auto-generate slug from title
watch(
  () => form.value.title,
  (newTitle) => {
    if (!isEdit.value && newTitle) {
      form.value.slug = newTitle
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
    }
  }
);

const fetchCategories = async () => {
  loadingCategories.value = true;
  try {
    const response = await categoriesAPI.getAll();
    categories.value = response.data || response;
  } catch (error) {
    console.error("Error fetching categories:", error);
  } finally {
    loadingCategories.value = false;
  }
};

const fetchPost = async (id) => {
  try {
    const response = await postsAPI.getById(id);
    const post = response.data || response;

    // Assign basic fields
    Object.assign(form.value, post);

    // Handle SEO data
    if (post.seo) {
      form.value.seo = { ...form.value.seo, ...post.seo };
      // Convert schema_json to string for textarea
      if (post.seo.schema_json) {
        schemaJsonText.value = JSON.stringify(post.seo.schema_json, null, 2);
      }
    }
  } catch (error) {
    console.error("Error fetching post:", error);
    router.push("/posts");
  }
};

const handleSubmit = async () => {
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  saving.value = true;
  try {
    if (isEdit.value) {
      await postsAPI.update(route.params.id, form.value);
    } else {
      await postsAPI.create(form.value);
    }
    router.push("/posts");
  } catch (error) {
    console.error("Error saving post:", error);
    // Show error toast if API returns error message
    let message = "Error saving post.";
    if (error?.response?.data?.message) {
      message = error.response.data.message;
    } else if (error?.message) {
      message = error.message;
    }
    toast.error(message, { autoClose: 4000 });
  } finally {
    saving.value = false;
  }
};

onMounted(async () => {
  await fetchCategories();
  if (isEdit.value) {
    await fetchPost(route.params.id);
  }
});
</script>
