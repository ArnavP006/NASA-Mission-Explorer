# NASA Mission Explorer

## About

NASA Mission Explorer is a simple web app that uses NASA’s Astronomy Picture of the Day (APOD) API to show daily space images along with their details.

The main idea was to make it interactive — users can pick any date (like their birthday) and see what NASA posted on that day.

---

## What it does

* Fetches data from NASA’s APOD API
* Shows image/video with title and explanation
* Lets users select a date to explore past entries
* Option to view images in HD and full screen

---

## API Used

* NASA APOD API
* https://api.nasa.gov/planetary/apod

Example:

```id="ex1234"
https://api.nasa.gov/planetary/apod?api_key=YOUR_API_KEY&date=YYYY-MM-DD
```

---

## UI

* Dark space-themed design
* Minimal layout (inspired by OpenAI / Google AI tools)
* Clean and responsive

---

## Tech Stack

* HTML
* CSS
* JavaScript (Fetch API)

---

## How to Run

1. Clone the repo
2. Get your API key from https://api.nasa.gov/
3. Add it in the code:

```js id="code123"
const API_KEY = "your_api_key_here";
```

4. Open `index.html`

---

## Things to Keep in Mind

* Use correct date format (`YYYY-MM-DD`)
* Some days return videos instead of images
* API won’t work for future dates
* Handle errors to avoid crashes

---

## Future Plans

* Add favorites
* Improve UI/animations
* Better video handling
* Deploy online

---

## What I Learned

* Working with APIs
* Async JavaScript (fetch/async-await)
* Basic UI/UX improvements

---

## Author

Arnav Patil
GitHub: https://github.com/ArnavP006

---
