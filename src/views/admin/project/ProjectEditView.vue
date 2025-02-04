<script>
import axios from 'axios';
import { ref } from 'vue'
import { VMarkdownEditor } from 'vue3-markdown'
import 'vue3-markdown/dist/style.css'
import { Vue3JsonEditor } from 'vue3-json-editor'


export default{
    name: 'ProjectEditView',
    props: ['slug'],
    components: { VMarkdownEditor, Vue3JsonEditor },
    data:()=>{return{
        project: ref(''),
        previous_project: ref(''),
        amit: true,
        selected_programing_languages: [],
        is_new: false,
        //content_type = ''
        //content_types:[],
        content_type_tags: [],
        timerId: 0,
        // -pars
        on_update: false,
        jsonData: {
        key: "value",
        list: [1, 2, 3]
        }
    }},
    methods: {
        echo_context_sync() {
            clearTimeout(this.timerId);
            this.timerId = setTimeout(() => {
            if (this.project !== this.previous_project) {
                const update_response = this.update_project()
                this.previous_project = update_response.data
                //this.project.update = this.previous_project.update
            }
            }, 2000);
        },
        async get_project() {
            try {
                const response = await axios.get(`content/edit/${this.slug}/`)
                this.project = response.data  
                await this.get_content_type_tags(this.project.content_type)
            } catch (error) {
                console.error('Error fetching project:', error)
            }
        },
        async get_content_type_tags(content_type){
            const response = await axios.get('content/type/' + content_type)
            
            // this.content_types = response.data.other_content_types
            this.content_type_tags = []
            response.data.sub_tags.forEach(tag_category => {
                tag_category.tags.forEach(tag => {
                    for (const selected_tag of this.project.tags) {
                    if (selected_tag.id === tag.id) {
                        tag.slected = true;
                        break;
                    }
                }
                    this.content_type_tags.push(tag)
                });
            });
        },
        tagic (){
            this.project.tags = []
                this.content_type_tags.forEach(tag => {
                    if (tag.slected){
                        this.project.tags.push(tag)        
                    }
                })
        },
        async update_project(){
            try {
                this.on_update = true
                this.tagic()
                const pyload = await axios.put(`content/edit/${this.slug}/`, this.project)
                this.on_update = false
                return pyload
            } catch (error) {
//                if (error.response.status === 400){
//              }
                console.error('Error fetching project:', error)
            }
        },
        async create_project(){
            try {
                this.on_update = true
                this.tagic()
                console.log(this.project)

                await axios.post(`content/all/`, this.project).then((response)=>{this.project = response.data})
                this.is_new = false
                this.on_update = false
            } catch (error) {
//                if (error.response.status === 400){
//              }
                console.error('Error fetching project:', error)
            }
        },
        keyboard_on_save(e) {
        if (!(e.keyCode === 83 && e.ctrlKey)) {
            return;
        }
        e.preventDefault();
            this.save_project()
        },
    set_new_project_layout(){
        this.project = {
            "tags": [],
            "title": "Untitled",
            "show": false,
            "seo_description": "new",
            "content_type": 'project'
        }
    },
    save_project(){
        if (this.is_new){
            this.create_project()
        } else {
            this.update_project()
        }
    }
    },
    async mounted(){
        if (this.slug === '_new'){
            this.is_new = true
            this.set_new_project_layout()
        } else {
            await this.get_project()
        }
        document.addEventListener("keydown", this.keyboard_on_save);
    },
    unmounted(){
      document.removeEventListener("keydown", this.keyboard_on_save);
    }
}
''.toString
</script>

<template>
<section class="row m-0 p-2 h-100">
    <article class="col-12 col-md-4 col-lg-3 col-xl-3 position-relative h-100 overflow-y-scroll">
        <button class="btn btn-lg btn-success w-100 rounded-0 border-0" @click="update_project" :disabled="on_update">
            <span v-if="!on_update">{{this.is_new ? 'Create' : 'Save'}}</span>
            <div v-else class="spinner-border text-light" role="status">
                <span class="sr-only">Loading...</span>
            </div>
        </button>
        <div class="row m-1 p-1 shadow-sm rounded">
            <div class="col-2 d-flex"><i class="fa-regular fa-calendar m-auto justify-content-center"></i></div>
            <div class="col-10">{{ project.update?.split('T')[0] }}</div>
            <div class="col-2 d-flex"><i class="fa-solid fa-clock m-auto justify-content-center"></i></div>
            <div class="col-10">{{ project.update?.split('T')[1] }}</div>
        </div>        
        <button 
            :class="'w-100 mt-2 btn ' + (project.show ? 'btn-primary': 'btn-outline-primary')"
            @click="project.show = !project.show;update_project()">{{ project.show ? 'Hide' : 'Show' }}
        </button>
        <button 
            :class="'w-100 mt-2 btn ' + (project.is_featured ? 'btn-info': 'btn-outline-info')"
            @click="project.is_featured = !project.is_featured;update_project()">{{ project.is_featured ? 'Feat' : 'Nativ' }}
        </button>
        
        <div class="" name="edit">
            <hr>
            <div class="mb-3">
            <label class="fw-semibold ms-2">
                Title
            </label>
            <input v-model="project.title" class="mt-1 form-control">
            </div>
            <div class="mb-3">
                <label class="fw-semibold ms-2">
                    slug
                </label>
                <input v-model="project.slug" class="mt-1 form-control disabled" disabled>
            </div>
            
            <div class="d-flex">
                <strong class="my-auto">SEO</strong>
                <hr class="ms-2 w-100">
            </div>
            <label class="ms-2">ceo description</label>
            <input v-model="project.seo_description" class="mt-1 form-control" placeholder="ceo description">
            
            <label class="ms-2">ceo image url</label>
            <input v-model="project.seo_image_url" class="mt-1 form-control" placeholder="image url">

            <label class="ms-2">ceo image description</label>
            <input v-model="project.seo_image_alt" class="mt-1 form-control" placeholder="ceo image description">
            <hr>
            <label class="fw-bold">
                Content Type : <span class="text-success">{{ project.content_type }}</span>
            </label>
            <hr>

            <div class="d-flex">
                <strong class="my-auto">Tag's</strong>
                <hr class="ms-2 w-100">
            </div>
            <ul class="list-unstyled overflow-y-auto" style="max-height: 20vh;">
                <li 
                v-for="(tag,index) in content_type_tags" 
                v-bind:key="index"
                :class="'d-flex rounded p-2 me-2 mb-2 btn btn-' + (tag.slected ? 'primary':'secondary')"
                @click="tag.slected = !tag.slected"
                >{{ tag.name }}</li>
            </ul>

            <div class="d-flex">
                <strong class="my-auto" style="min-width: max-content;">JSON' fields</strong>
                <hr class="ms-2 w-100">
            </div>
            <Vue3JsonEditor
                v-model="project.custom_data"
                :show-btns="true"
                :expandedOnStart="true"
                @json-change="update_project()"
            />
            <textarea v-model="project.custom_data"></textarea>

        </div>
    </article>
    <article class="col me-0 pe-0 shadow-sm">
        <div v-if="!project" class="bg-success fw-bold">LOADING...</div>
        <VMarkdownEditor v-else
            class="rounded"
            v-model="project.text"
            locale="en"
            :fullscreen="amit"
            :onkeyup="echo_context_sync"            
        />
    </article>
</section>
</template>

<style>
.vmd-toolbar {
    border-top-left-radius: var(--bs-border-radius) !important;
    border-top-right-radius: var(--bs-border-radius) !important;
}
.vmd-body {
    border-bottom-right-radius: var(--bs-border-radius) !important;
    border-bottom-left-radius: var(--bs-border-radius) !important;
}
</style>
