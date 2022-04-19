<template>
  <div>
    <h1>Страница с постами</h1>
    <my-input
      v-model="searchQuery"
      placeholder="Поиск...."
    />
    <div class="app__Btns">
      <my-button @click ="showDialog">
        Создать пост 
      </my-button>
      <my-select
        v-model="selectedSort"
        :options="sortOptions"
      />
    </div>
    <my-dialog v-model:show ="dialogVisible">
      <post-form
        @create ="createPost"
      />
    </my-dialog>
    <post-list
      :posts="sortedAndSearchedPosts"
      @remove="removePost"
      v-if="!isPostLoading"
    />
    <div v-else>Идёт загрузка...</div>
    <div v-intersection class="observer"></div>
    <!-- <div ref="observer" class="observer"></div> -->
    <!-- Кнопки страниц -->
    <!-- <div class="page__wrapper">
      <div
        v-for="pageNumber in totalPage"
        :key="pageNumber"
        class="page"
        :class="{
          'current-page': page === pageNumber
        }"
        @click="changePage(pageNumber)"
      >
        {{ pageNumber }}
      </div>
    </div> -->
  </div>
</template>
<script>
import PostForm from "@/components/PostForm";
import PostList from "@/components/PostList";
import MyButton from "@/components/UI/MyButton";
import axios from 'axios';
import MySelect from "@/components/UI/MySelect";
import MyInput from '@/components/UI/MyInput.vue';


export default {
  components: {
    MyInput,
    MySelect,
    MyButton,
    PostList,
    PostForm,
  },
  data() {
    return {
      posts: [],
      dialogVisible: false,
      isPostLoading: false,
      selectedSort: '',
      searchQuery: '',
      page: 1,
      limit: 10,
      totalPage: 0,
      sortOptions: [
        {value: 'title', name: 'По названию'},
        {value: 'body', name: 'По содержанию'},
      ]
    }
  },
  methods: {
    createPost(post) {
      this.posts.push(post);
      this.dialogVisible = false;
    },
    removePost(post) {
      this.posts = this.posts.filter(p => p.id !== post.id)
    },
    showDialog() {
      this.dialogVisible = true;
    },
    // кнопки страницы снизу
   /*  changePage(pageNumber) {
      this.page = pageNumber
      // this.fetchPosts()
    }, */
    async fetchPosts() {
      try {
        this.isPostLoading = true;
        const response = await axios.get('https://jsonplaceholder.typicode.com/posts', {
          params: {
            _page: this.page,
            _limit: this.limit
          }
        });
        this.totalPage = Math.ceil(response.headers['x-total-count'] / this.limit)
        this.posts = response.data;
      } catch(e) {
        alert('Ошибка')
      } finally {
        this.isPostLoading = false;
      }
    },
    async loadMorePosts() {
      try {
        this.page += 1;
        // this.isPostLoading = true;
        const response = await axios.get('https://jsonplaceholder.typicode.com/posts', {
          params: {
            _page: this.page,
            _limit: this.limit
          }
        });
        this.totalPage = Math.ceil(response.headers['x-total-count'] / this.limit)
        this.posts = [...this.posts, ...response.data];
      } catch(e) {
        alert('Ошибка')
      // } finally {
      //   this.isPostLoading = false;
      }
    }
  },
  mounted() {
    // Intersection Observer API подгрузка страницы
    this.fetchPosts();
    /* console.log(this.$refs.observer); */
    /* const options = {
      rootMargin: '0px',
      threshold: 1.0
    }
    const callback = (entries, observer) => {
      if (entries[0].isIntersecting && this.totalPage) {
        this.loadMorePosts()
      }
    };
    const observer = new IntersectionObserver(callback, options);
    observer.observe(this.$refs.observer); */
  },
  computed: {
    sortedPost() {
      return [...this.posts].sort((post1, post2) => post1[this.selectedSort]?.localeCompare(post2[this.selectedSort]))
    },
    sortedAndSearchedPosts() {
      return this.sortedPost.filter(post => post.title.toLowerCase().includes(this.searchQuery.toLowerCase()))
    }
  },
  watch: {
    // кнопки страниц снизу
    /* page() {
      this.fetchPosts()
    } */
    /* selectedSort(newValue) {
      this.posts.sort((post1, post2) =>{
        return post1[newValue]?.localeCompare(post2[newValue])
      })
    } */
  }
}
</script>

<style>

.app__Btns
{
  margin: 15px 0;
  display: flex;
  justify-content: space-between;
}
.page__wrapper
{
  display: flex;
  margin-top: 15px;
}
.page
{
  border: 1px solid black;
  padding: 10px;
  margin-right: 2px;
  cursor: pointer;
  border-radius: 10px;
}
.current-page
{
  border: 2px solid teal;
}
.observer
{
  height: 30px;
  background: green;
}
</style>