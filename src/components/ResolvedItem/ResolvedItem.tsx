import style from "./ResolvedItem.module.css";

const ResolvedItem = ({
  id,
  queueId,
  data: { id: userId, name, email },
}: ResolvedItem<User>) => {
  return (
    <div className={style.wrapper}>
      <span className={style.lightText}>Id: {id}</span>
      <span className={style.lightText}>Queue id: {queueId}</span>
      <span className={style.lightText}>User id: {userId}</span>
      <span className="font-bold">{name}</span>
      <span className="font-light">{email}</span>
    </div>
  );
};

export default ResolvedItem;
