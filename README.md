
## About The Project



[<img align="left" height="370px" width="300px" alt="memoryGame-image" src="https://raw.githubusercontent.com/RomainC75/ecommerce-front/master/screenshot/screenshot-20220914.jpg"/>](https://romainchenard-memorygame.netlify.app/)


BioCoop' is an e-commerce website I made after graduating from the Ironhack bootcamp to strengthen my knowledge about the MERN stack and add typescript to it. This project is currently in V1 and will growth in the months to come. The client can scroll the sales promotion selection at the bottom of the home page or select the desired category in the menu. Feel free to test it, but keep in mind that you need to **SIGNUP FIRST** to add the items in the basket :
https://biocoop-ecommerce.netlify.app/

### Built With

* 🖊️ MERN stack
* 🔎 Scraping with Puppeteer+sqlite3
* 💙 Typescript
* 💅 Scss



## Usage/features

- For this V1 : signup **BEFORE** adding items to the cart.
- Signup process : email confirmation
- Home page : infinite scroll with the promotionnal pricing items only.
- "Add" buttons : color change to show the client that order has been confirmed by the server.
- Category page : a filter/pagination system is on to look through the sub-categories/price
- Account page :
  - Form,
  - Avatar image (saved in Cloudinary),
- Basket page :
  - Change quantity and remove buttons for each item,
- Checkout :
  - Credit Card number : Controlled Form (need a valid number),
  - Address : by default, each field is filled with the account address and can be changed 
  - Order confirmation : the user receive a confirmation mail with the order information.

## Scraping
I used Puppeteer and Puppeteer-cluster to scrape about 5000 items and add it into a sqlite3 database first. Then I cleaned and parsed the data before adding it to the Mongo database. 

<!-- CONTACT -->
## Contact

Romain Chenard - [email me !](mailto:rom.chenard@gmail.com)

Project Link: [here](https://github.com/RomainC75/ecommerce-front)

Back-end repo : [here](https://github.com/RomainC75/ecommerce-back)
