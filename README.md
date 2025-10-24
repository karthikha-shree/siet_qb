 📚 College Question Bank System

A full-stack MERN web application that allows:

- 👩‍🏫 Admins to manage departments, regulations, semesters, subjects, and upload question paper PDFs.
- 👨‍🎓 Students/users to browse departments → regulations → semesters → subjects → and view PDFs.

🧩 Technologies Used

Frontend:
- React.js (with React Router DOM)
- Axios
- RSuite UI (for loader/spinner)

Backend:
- Node.js + Express.js
- MongoDB with Mongoose
- Cloudinary for file uploads
- JWT for admin authentication

Others:
- Git for version control
- .env for environment config

---

 🏗️ Project Structure

```
college-question-bank/
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/      # Navbar, Footer, LogoHeader
│   │   ├── pages/           # HomePage, AdminPanel, DepartmentView
│   │   └── assets/          # CSS styles
│   └── public/
├── server/                 # Node.js backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── server.js
├── .env                    # Environment variables
└── README.md
```

---

✅ Features

Admin Panel
- Login/logout (JWT Auth)
- Add departments
- Add regulations under departments
- Auto-create 8 semesters per regulation
- Add/edit/delete subjects in any semester
- Upload/delete multiple PDF files per subject (via Cloudinary)
- UI with icon buttons and dynamic updates without reload
Student View
- List of all departments on home page
- Click department → view regulations → view semesters → subjects
- PDFs view-only (disabled download, embedded in iframe with Google Viewer)

🚀 Getting Started

1. Clone the repository
```bash
git clone https://github.com/karthikha-shree/college-question-bank.git
cd college-question-bank
```

 2. Install dependencies

Backend:
```bash
cd server
npm install
```

Frontend:
```bash
cd ../client
npm install
```

3. Setup Environment Variables
Create a `.env` file in `/server` with:
```
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

4. Run the Project
Backend:
```bash
cd server
nodemon server.js
```

Frontend:
```bash
cd client
npm run dev
```


 🛡️ Security Notes
- Admin features are protected using JWT
- .env and sensitive files are ignored via `.gitignore`

---

👩‍💻 Author
Karthikha Shree
[GitHub](https://github.com/karthikha-shree)

---

