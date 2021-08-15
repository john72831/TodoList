import { v4 } from "uuid";

export type Todo = {
  id: string | null;
  isDone: boolean;
  title: string | null;
};
