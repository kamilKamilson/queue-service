import { useEffect, useRef, useState } from "react";
import { faker } from "@faker-js/faker";

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
  const [time, setTime] = useState<number | string>(0);

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
    setTime(Date.now());
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

  useEffect(() => {
    if (
      resolvedRequests.length > 0 &&
      resolvedRequests.length === data.length
    ) {
      setTime((prevValue) =>
        ((Date.now() - Number(prevValue)) / 1000).toFixed(2)
      );
    }
  }, [resolvedRequests]);

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
        <div className="flex flex-col mt-5">
          <div className="px-4 py-5 bg-purple-100 text-center text-xl font-bold rounded-md">
            Resolved items {resolvedRequests.length} / {data.length}
          </div>
          <div className="grid grid-cols-4 gap-4 py-4">
            {resolvedRequests.map(
              ({ id, queueId, data: { id: userId, name, email } }) => (
                <div
                  key={id}
                  className="flex flex-col border p-2 mb-2 rounded-md border-gray-200 hover:border-purple-300 select-none transition-colors hover:bg-purple-50"
                >
                  <span className="font-bold text-xs text-gray-400">
                    Id: {id}
                  </span>
                  <span className="font-bold text-xs text-gray-400">
                    Queue id: {queueId}
                  </span>
                  <span className="font-bold text-xs text-gray-400">
                    User id: {userId}
                  </span>
                  <span className="font-bold">{name}</span>
                  <span className="font-light">{email}</span>
                </div>
              )
            )}
          </div>
          {resolvedRequests.length > 0 &&
            resolvedRequests.length === data.length && (
              <div className="border-t border-t-gray-200 pt-3">
                Fetching ended in: <strong>{time} s</strong>
              </div>
            )}
        </div>
      )}

      <div className="mt-5 grid grid-cols-4 gap-x-2">
        {Object.values(queues).map(({ id, state, resolvedItems }) => (
          <div key={id} className="mt-5">
            <div className="p-4 text-sm  bg-purple-100 rounded-t-md">
              <h2 className="font-bold text-lg">Queue</h2>
              <p>
                Id: <span className="font-bold">{id}</span>
              </p>
              <p>
                Resolved items:{" "}
                <span className="font-bold">{resolvedItems.length}</span>
              </p>
              <p>
                Status: <span className="font-bold">{state}</span>
              </p>
            </div>

            <div className="flex flex-col p-4 rounded-b-md border-gray-200 border">
              {resolvedItems.map(({ id, name, email }) => (
                <div
                  key={id}
                  className="flex flex-col border-b pb-2 mb-2 border-b-gray-200"
                >
                  <span className="font-bold text-xs text-gray-400">{id}</span>
                  <span className="font-bold">{name}</span>
                  <span className="font-light">{email}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
