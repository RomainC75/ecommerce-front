import { Menu } from "../components/Menu";
import { InfiniteScroll } from "../components/InfiniteScroll";

import "./style/homePage.css";

import { GoHeart } from "react-icons/go";

import image from "../images/home-image.jpg";

export const HomePage = () => {
  return (
    <div className="HomePage">
      <Menu />
      <div className="HomePage__presentation">
        <h2>Home Page</h2>
        <img src={image} className="HomePage__presentation__img" alt="home page image" />
        <h3>Welcome to our BioCoop' website !</h3>
        <p>
          You will find the <span>best of the bio world</span> organised in{" "}
          <span>categories on the top</span> of this page.
        </p>
        <h3>
          Don't miss our{" "}
          <span>
            sales promotion <GoHeart className="heart" />
          </span>{" "}
          selection at a good price by using this
        </h3>
        <div className="content">
          <div className="content__container">
            <ul className="content__container__list">
              <li className="content__container__list__item">Infinite</li>
              <li className="content__container__list__item">Scroll</li>
              <li className="content__container__list__item">!!</li>
            </ul>
          </div>
        </div>
        <p className="warning">
          for this V1, you{" "}
          <strong>
            <span>HAVE to be logged in</span>
          </strong>{" "}
          to add some articles to your card
        </p>
      </div>
      <InfiniteScroll />
    </div>
  );
};
