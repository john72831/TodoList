import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";
import { Todo } from "~/models/todo";
import { $axios } from "~/utils/api";
import { authenticateModule, todoModule } from "~/utils/store-accessor";

@Module({
  name: "todoModule",
  stateFactory: true,
  namespaced: true
})
export default class TodoModule extends VuexModule {
  _todos: Todo[] = [];

  @Mutation
  addTodo(todo: Todo) {
    this._todos.push(todo);
  }

  @Mutation
  setTodos(todos: Todo[]) {
    this._todos = todos;
  }

  @Mutation
  async updateTodoData(index: number) {
    this._todos[index].isDone = !this._todos[index].isDone;
  }

  @Mutation
  async removeTodo(index: number) {
    this._todos.splice(index, 1);
  }

  @Action
  async loadTodo() {
    const userId = authenticateModule.userId;

    const response = await $axios.get(
      `https://todolist-a2433-default-rtdb.asia-southeast1.firebasedatabase.app/todos/${userId}.json`
    );

    if (response.status != 200) {
      alert("發生錯誤!");
      return false;
    }

    const responseData = response.data;
    const todos: Todo[] = [];

    for (const key in responseData) {
      const todo = {
        id: key,
        title: responseData[key].title,
        isDone: responseData[key].isDone
      };
      todos.push(todo);
    }

    this.setTodos(todos);
  }

  @Action
  async insertTodo(title: string) {
    const userId = authenticateModule.userId;

    const response = await $axios.post(
      `https://todolist-a2433-default-rtdb.asia-southeast1.firebasedatabase.app/todos/${userId}.json`,
      {
        title: title,
        isDone: false
      }
    );

    if (response.status != 200) {
      alert("發生錯誤!");
      return false;
    }

    const responseData = response.data;
    const newTodo: Todo = {
      title: title,
      id: responseData.name,
      isDone: false
    };

    this.addTodo(newTodo);
  }

  @Action
  async updateTodo(todo: Todo) {
    const userId = authenticateModule.userId;

    const response = await $axios.put(
      `https://todolist-a2433-default-rtdb.asia-southeast1.firebasedatabase.app/todos/${userId}/${todo.id}.json`,
      Object.assign({}, todo)
    );

    if (response.status != 200) {
      alert("發生錯誤!");
      return false;
    }

    const index = this._todos.findIndex(
      todoToBeUpdate => todoToBeUpdate.id == todo.id
    );

    this.updateTodoData(index);
  }

  @Action
  async deleteTodo(id: string) {
    const userId = authenticateModule.userId;

    const response = await $axios.delete(
      `https://todolist-a2433-default-rtdb.asia-southeast1.firebasedatabase.app/todos/${userId}/${id}.json`
    );

    if (response.status != 200) {
      alert("發生錯誤!");
      return false;
    }

    const todoIndex = this._todos.findIndex(todo => todo.id == id);

    this.removeTodo(todoIndex);
  }

  get TodoList() {
    return this._todos;
  }
}
