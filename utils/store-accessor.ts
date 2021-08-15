import { Store } from "vuex";
import { getModule, config } from "vuex-module-decorators";
import TodoModule from "~/store/todoModule";
import AuthenticateModule from "~/store/authenticateModule";

let todoModule: TodoModule;
let authenticateModule: AuthenticateModule;

function initialiseStores(store: Store<any>): void {
  config.rawError = false;

  todoModule = getModule(TodoModule, store);
  authenticateModule = getModule(AuthenticateModule, store);
}

export { initialiseStores, todoModule, authenticateModule };
