<template>
    <Transition>
        <div v-if="loaded" class="row m-0 p-0 h-100 py-2">
        <div class="col-3 h-100 overflow-x-auto">
            <form @submit.prevent="new_category" class="mb-3 rounded shadow-sm dark-shadow"  >
                <input v-model="new_category_text" :class="'form-control dark-input bg-transparent text-white ' + ( new_category_is_invaild ? 'border-2 border-danger shake': '')" type="text" placeholder="New Category">
            </form>
            <ul class="list-unstyled">
                <li 
                    v-for="category, index in categories"  v-bind:key="index" >
                    <div 
                        :class="'rounded mb-3 ' + (hoveredCategoryId===category.id ? 'border border-secondary':'border ') + (category.id === selected_category?.id ? 'border border-primary':'')"
                        @click="()=>{
                            todos=category.todos;
                            if (category.id !== selected_category?.id){
                                selected_todo = null
                            }
                            selected_category=category;
                        }"
                        style="cursor: pointer;"
                        @drop="handleDrop($event, category.id);hoveredCategoryId=null"
                        :dropzone="true"
                        @dragover.prevent="hoveredCategoryId=category.id"
                        @dragleave.prevent="hoveredCategoryId=null"
                        @dragenter.prevent>
                        <CategoryCard @remove_category="removeCategory" :cate="category" />
                    </div>
                </li>
            </ul>
        </div>
        <div class="col h-100 overflow-x-auto ">
            <form @submit.prevent="new_todo" class="sticky-top p-2 rounded shadow-sm mb-3 bg-transparent border border-light" id="newTodo">
                <div class="form-group">
                    <input 
                        :class="'form-control shdow-sm dark-input bg-transparent ' + ( new_todo_is_invaild ? 'border-2 border-danger shake': '')"
                        type="text" placeholder="New Todo" :disabled="!selected_category" v-model="new_todo_text"
                        >
                </div>
            </form>
        <Transition>
            <div v-if="todos.length > 0">
                <ul class="list-unstyled">
                    <li v-for="todo, index in todos" v-bind:key="index">
                        <div 
                            @click="selected_todo=todo" 
                            :draggable="true"
                            @dragstart="startDrag($event, todo)"
                            :class="'rounded mb-2 shdow-sm user-select-none drag-el ' + (selected_todo === todo ? 'border border-primary':'')"
                            style="cursor: pointer;">
                            <TodoCard :td="todo" />
                        </div>
                    </li>
                </ul>
            </div>
        </Transition>
        </div>
        <div class="col-4 d-flex h-100 overflow-x-auto">
            <Transition>
                <SelectedTodoCard v-if="selected_todo" :td="selected_todo" @syncTodo="sync_selected_todo"/>
            </Transition>
        </div>
    </div>
    </Transition>
</template>

<script setup>
import TodoService from '@/composable/TodoService';
import axios from 'axios';
import { ref, onMounted, watch } from 'vue';
import CategoryCard from '@/components/admin/todo/CategoryCard.vue'
import TodoCard from '@/components/admin/todo/TodoCard.vue'
import SelectedTodoCard from '@/components/admin/todo/SelectedTodoCard.vue'
import { useNotification } from "@kyvg/vue3-notification";

const { notify }  = useNotification()

const categories = ref()
const selected_category = ref(null)
const new_category_text = ref('')
const new_category_is_invaild = ref(false)

const todos = ref([])
const selected_todo = ref()

const hoveredCategoryId = ref()
const dragedTodo = ref()
const new_todo_text = ref('')
const new_todo_is_invaild = ref(false)

const removeCategory = async (category_id) => {
    await TodoService.removeCategory(category_id)
    selected_category.value = null
    const category_index = categories.value.findIndex(category => category.id === category_id)
    if (category_index !== -1) {
        categories.value.splice(category_index, 1);
        selected_todo.value = null
        flush_todos()
    }
}

const flush_todos = () => {
    todos.value.splice(0, todos.value.length)
}

const sync_selected_todo = (todo) => {
    if (todo === null){
        for (var category of categories.value){
            const index = category.todos.findIndex(todo => todo.id === selected_todo.value.id);
            if (index !== -1) {
                category.todos.splice(index, 1);
            }
        }
    }
    selected_todo.value = todo
}

const fetch_categories = async () => {
    return await axios.get('todo/').then(
        response => {
            categories.value = response.data
        }
    )
} 
const startDrag = (event, item) => {
        event.dataTransfer.dropEffect = 'move'
        event.dataTransfer.effectAllowed = 'move'
        dragedTodo.value = item
      //  event.dataTransfer.setData('itemID', item.id)

    }


const handleDrop = (event, category_id) => {
    for (var category of categories.value){
        //if (dragedTodo.value.category === category.id){}
        
        if (category_id === category.id) {
            if (!category.todos.some(todo => todo.id === dragedTodo.value.id)) {
                    category.todos.push(dragedTodo.value);
                }
        } 
        
        if (category_id !== category.id){
            const index = category.todos.findIndex(todo => todo.id === dragedTodo.value.id);
            if (index !== -1) {
                category.todos.splice(index, 1);
            }
        }
    }
    const updateTodo = dragedTodo.value
    updateTodo.category = category_id
    selected_todo.value = null
    TodoService.todoUpdate(updateTodo)
} 
 
const new_todo = async () => {
    if (new_todo_text.value.length >= 3){
        const new_todo = await TodoService.addTodo(new_todo_text.value, selected_category.value.id)
        if (new_todo) {
            selected_category.value.todos.push(new_todo)
            // selected_todo.value = new_todo
            new_todo_text.value = ''
        } else {
            alert('bilinmeyen hata')
        }
    } else {
        new_todo_is_invaild.value = true
        setTimeout(() => {
            new_todo_is_invaild.value = false
        }, 1500)
    }
}

const new_category = async () => {
    if (new_category_text.value.length >= 3){
        const new_category = await TodoService.addCategory(new_category_text.value)
        if (new_category) {
            categories.value.push(new_category)
            new_category_text.value = ''
            notify(
                {title: "Sync", text: "New category created!",}
            );
        } else {
            alert('bilinmeyen hata')
        }
    } else {
        new_category_is_invaild.value = true
        setTimeout(() => {
            new_category_is_invaild.value = false
        }, 1500)
    }
}


const loaded = ref(false)
onMounted(()=>{fetch_categories();loaded.value=true})
</script>

<style scoped>

.shake {
  animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  transform: translate3d(0, 0, 0);
}

@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }

  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }

  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
}
#newTodo{
    background-color: var(--bs-white);
}
.dark-mode #newTodo{
    box-shadow: 1px 1px 10px 5px rgba(211, 209, 209, 0.1)!important;
    color: var(--bs-white);
    background-color: #151e29!important;
}
.dark-mode .dark-input{
    box-shadow: 1px 1px 10px 5px rgba(211, 209, 209, 0.1)!important;
    background-color: transparent!important;
    color: var(--bs-white);
}
.dark-mode .dark-input:disabled{
    box-shadow: 1px 1px 10px 5px rgba(211, 209, 209, 0.1)!important;
    background-color: var(--bs-secondary)!important;
    color: var(--bs-white);
}

.dark-mode .dark-shadow {
    box-shadow: 1px 1px 10px 5px rgba(211, 209, 209, 0.1)!important;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 1.2s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>