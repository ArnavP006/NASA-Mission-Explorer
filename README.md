# 🚀 NASA Mission Explorer

## 🌌 Overview

NASA Mission Explorer is a modern web application that allows users to explore NASA’s Astronomy Picture of the Day (APOD). Users can view recent space images, search missions, filter content, and even discover what NASA posted on their birthday.

---

## ✨ Features

* 🔍 Search missions by title or description
* 🎯 Filter by media type (image/video)
* 🔄 Sort by date or title
* ❤️ Like/Favorite missions
* 🎂 Birthday explorer (view APOD for any date)
* 🌗 Dark / Light mode toggle
* 🖼️ HD image view + fullscreen modal
* 📱 Fully responsive design

---

## 🔗 API Used

* NASA APOD API
* https://api.nasa.gov/planetary/apod

Example:

```
https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&date=YYYY-MM-DD
```

---

## 🛠️ Tech Stack

* HTML5
* CSS3 (Glassmorphism UI)
* Vanilla JavaScript (ES6+)
* Fetch API

---

## ⚙️ How to Run

1. Clone the repository
2. Open the project folder
3. Replace API key in `script.js`:

```js
const API_KEY = "your_api_key_here";
```

4. Open `index.html` in browser

---

## 🧠 Concepts Used

* Async/Await for API calls
* Array Higher-Order Functions:

  * `map()`
  * `filter()`
  * `sort()`
  * `find()`
* DOM Manipulation
* LocalStorage (theme persistence)

---

## 🚀 Deployment

Live Project: *(Add your Netlify/Vercel link here)*

---

## 📌 Notes

* Some APOD entries return videos instead of images
* Future dates are not supported by the API
* Fallback data is used if API limit is exceeded

---

## 📚 What I Learned

* Working with real-world APIs
* Writing clean and modular JavaScript
* Building responsive UI/UX
* Improving performance and user experience

---

## 👨‍💻 Author

**Arnav Patil**
GitHub: https://github.com/ArnavP006
