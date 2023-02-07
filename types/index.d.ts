const TO_RESOLVE = 30;

type PromiseData<T> = {
  item: T;
  timeout: number;
};

type User = {
  id: string;
  name: string;
  email: string;
};

type Queue<T> = {
  id: string;
  state: QueueState;
  resolvedItems: T[];
};

type Data = Array<PromiseData<User>>;

type QueueState = "INITIAL" | "FETCHING" | "FETCHED" | "END";
