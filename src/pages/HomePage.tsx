import { Menu } from "../components/Menu";
import { InfiniteScroll } from "../components/InfiniteScroll";

import './style/homePage.css'

import image from '../images/home-image.jpg'

export const HomePage = () => {
  return (
    <div className="HomePage">
      <Menu/>
      <h2>Home Page</h2>
      <img src={image} className="HomePage__img" alt="home page image"/>
      <h3>Find you dream product at a good price by using this</h3>
      <div className="content">
        <div className="content__container">
          <ul className="content__container__list">
            <li className="content__container__list__item">Infinite</li>
            <li className="content__container__list__item">Scroll</li>
            <li className="content__container__list__item">!!</li>
          </ul>
        </div>
      </div>
      <InfiniteScroll/>
    </div>
  );
};
