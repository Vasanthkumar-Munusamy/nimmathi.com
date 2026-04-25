import { useEffect, useState } from "react";
import API from "../services/api";

function Articles() {
  const [data, setData] = useState([]);

  useEffect(() => {
    API.get("/api/articles").then(res => setData(res.data));
  }, []);

  return (
    <div>
      {data.map(a => <h3 key={a._id}>{a.title}</h3>)}
    </div>
  );
}

export default Articles;