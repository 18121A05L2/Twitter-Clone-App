import React, { Children, createContext, useState, useEffect } from "react";
import { useSelector } from "react-redux";

const DataContext = createContext();

function DataProvider({ children }) {
  // const [allComments, setAllComments] = useState([]);
  // const commentAdded = useSelector((state) => state.global.commentAdded);
  // useEffect(() => {
  //   const getComments = async () => {
  //     const data = await fetch("http://localhost:8001/comments").then((res) =>
  //       res.json()
  //     );
  //     setAllComments(data);
  //   };
  //   getComments();
  //   console.count("commentAdded");
  // }, [commentAdded]);
  return <DataContext.Provider value={{}}>{children}</DataContext.Provider>;
}

export default DataProvider;
export { DataContext };
