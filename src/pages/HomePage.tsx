import React from "react";
import { Menu } from "../components/Menu";
import { InfiniteScroll } from "../components/InfiniteScroll";

export const HomePage = () => {
  return (
    <div className="HomePage">
      <Menu/>

      <h2>Home Page</h2>
      <InfiniteScroll/>
    </div>
  );
};
