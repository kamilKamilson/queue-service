import { useEffect, useRef, useState } from "react";
import { faker } from "@faker-js/faker";
import ResolvedItem from "./components/ResolvedItem/ResolvedItem";
import ResolvedItemsList from "./components/ResolvedItemsList/ResolvedItemsList";
import QueueItemsList from "./components/QueueItemsList/QueueItemsList";

const TO_RESOLVE = 12;

const generateData = (length: number) => {
  const data: Data = [];

  for (let i = 0; i < length; i++) {
    data.push({
      item: {
        id: faker.datatype.uuid(),
        name: faker.name.fullName(),
        email: faker.internet.email(),
      },
      timeout: faker.datatype.number({ min: 100, max: 3000 }),
    });
  }

  return data;
};

const resolveData = (user: User, timeout: number): Promise<User> =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(user);
    }, timeout);
  });

const App = () => {
  const [queuesNumber, setQueuesNumber] = useState(0);
  const [data, setData] = useState<Data>([]);
  const [queues, setQueues] = useState<Record<string, Queue<User>>>({});
  const [resolvedRequests, setResolvedRequests] = useState<
    Array<ResolvedItem<User>>
  >([]);

  const handleChangeQueuesNumber = ({
    target,
  }: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = target;
    if (value === "") {
      setQueuesNumber(0);
    } else if (Number(value)) {
      setQueuesNumber(Number(value));
    }
  };

  let lastFetchedIndex = useRef(0);

  const getNextItem = () => {
    const item = data[lastFetchedIndex.current];
    lastFetchedIndex.current = lastFetchedIndex.current + 1;
    return item;
  };

  const fetchData = async () => {
    const { item, timeout } = getNextItem();
    return await resolveData(item, timeout);
  };

  const handleStartQueues = () => {
    const queues: Record<string, Queue<User>> = {};
    for (let i = 0; i < queuesNumber; i++) {
      const id = faker.datatype.uuid();
      Object.assign(queues, {
        [id]: {
          id,
          state: "INITIAL",
          resolvedItems: [],
        },
      });
    }
    lastFetchedIndex.current = 0;
    setResolvedRequests([]);
    setData(generateData(TO_RESOLVE));
    setQueues(queues);
  };

  useEffect(() => {
    Object.values(queues)
      .filter(({ state }) => state === "INITIAL" || state === "FETCHED")
      .forEach(async ({ id }) => {
        if (lastFetchedIndex.current < data.length) {
          setQueues((prevValue) => ({
            ...prevValue,
            [id]: {
              ...prevValue[id],
              state: "FETCHING",
            },
          }));
          fetchData().then((item) => {
            setResolvedRequests((prevValue) => [
              ...prevValue,
              {
                id: faker.datatype.uuid(),
                queueId: id,
                data: item,
              },
            ]);

            setQueues((prevValue) => ({
              ...prevValue,
              [id]: {
                ...prevValue[id],
                state: "FETCHED",
                resolvedItems: [...prevValue[id].resolvedItems, item],
              },
            }));
          });
        } else {
          setQueues((prevValue) => ({
            ...prevValue,
            [id]: {
              ...prevValue[id],
              state: "END",
            },
          }));
        }
      });
  }, [queues, data]);

  return (
    <div className="p-8">
      <h1 className="font-bold text-4xl">Queue Service</h1>
      <p className="text-lg mt-3 font-light">
        Handle queue of requests with few concurrent resolvers
      </p>

      <label className="flex flex-col mt-5">
        <span className="font-bold">Queues number</span>
        <input
          className="border-2 border-purple-600 rounded-md px-4 py-2 mt-1 w-[200px]"
          name="queuesNumber"
          value={queuesNumber}
          onChange={handleChangeQueuesNumber}
        />
      </label>

      <button
        onClick={handleStartQueues}
        className="bg-purple-600 text-white px-6 py-4 font-bold rounded-md text-md hover:bg-purple-500 transition-all mt-5"
      >
        Start Queues
      </button>

      {resolvedRequests.length > 0 && (
        <ResolvedItemsList list={resolvedRequests} maxItems={data.length} />
      )}

      <QueueItemsList list={queues} />
    </div>
  );
};

export default App;
