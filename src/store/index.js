import { createStore } from "vuex";
import { postModule } from "@/store/postMolule";

export default createStore({
  /* использование "сторе" на примере лайков и авторизации */
  /* state: {
    likes: 2,
    isAuth: false,
  },
  getters: {
    doubleLikes(state) {
      return state.likes * 2
    }
  },
  mutations: {
    incrementLikes(state) {
      state.likes += 1
    },
    decrementLikes(state) {
      state.likes -= 1
    }
  },
  actions: {

  }, */
  modules: {
    post: postModule
  }
})