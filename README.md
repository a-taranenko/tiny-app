# TinyApp

This is an application that lets the user assign short URLs to links. Links can be accessed by clicking on the corresponding short URL. The URL pairs are stored using MongoDB.

## Motivation

This is a project designed by Lighthouse Labs for the September 2016 cohort. The motivation was to practice routing using Express on the back end and EJS on the front end, while using MongoDB to store data.

## Setup

1. Fork & clone
2. Run `npm install` to install dependencies
3. Create a .env file based on the .env.example file
4. Install MongoDB and seed it.
5. Run the program with `node tiny_app.js` or `npm start`

## Dependencies

- dotenv
- express
- ejs
- mongodb
- body-parser
- cookie-parser
- method-override