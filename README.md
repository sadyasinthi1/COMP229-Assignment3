# COMP229 Assignment 3 — Sadya's ORIGINAL React Portfolio + Backend

**This version preserves the original Assignment 1 React portfolio:** its SS logo, branding, Home, About, Projects, Education, Services, Contact pages, résumé, images, and original `src/styles.css`. No replacement/redesign of these pages was made. New functionality uses a separate `src/assignment3.css` stylesheet.

## Quick start (Windows PowerShell / VS Code)

1. Unzip `COMP229_Assignment3_Original_Portfolio.zip` into your Downloads folder.
2. Open the extracted `COMP229_Assignment3_Original_Design` folder in VS Code.
3. **Copy your working `.env` file** from the previous `COMP229-Assignment3` project root into this new project root (beside `server.js`). The downloaded ZIP deliberately does not contain passwords. You can also copy `.env.example` to `.env` and fill it yourself.
4. Open Terminal 1 in the project root:
   ```powershell
   npm install
   npm run dev
   ```
   Expect `MongoDB connected: Portfolio` and `Server running at http://localhost:5000`.
5. Open Terminal 2 (project root) and run:
   ```powershell
   cd client/sadya-react-portfolio
   npm install
   npm run dev
   ```
   Open http://localhost:5173.
6. Sign in at `/signin` using the **existing Admin email/password in your own `.env`**. Your previously seeded Admin remains in the same MongoDB `Portfolio` database, so you do not need to seed again. If it doesn't exist, from the project root run `npm run seed:admin`.

**IMPORTANT:** Never upload `.env` to GitHub, a ZIP submission, or chat. The ZIP contains `.env.example` only. Since a database password was previously shared, reset that Atlas database password, then update the value in your local `.env`.

## Where features live

| Feature | Location |
| --- | --- |
| Original Home/About/Services | `client/sadya-react-portfolio/src/pages/` (preserved) |
| Original navbar + Sign In/Sign Up/Admin links | `src/components/NavBar.jsx` |
| JWT auth and role state | `src/auth/AuthContext.jsx`, `src/pages/AuthPage.jsx` |
| Project and Education original content + MongoDB records | `src/pages/Projects.jsx`, `src/pages/Education.jsx` |
| Working original-style Contact form | `src/pages/Contact.jsx` |
| Admin CRUD dashboard | `src/pages/AdminDashboard.jsx` |
| Backend JWT/roles | `backend/middleware/auth.js` |
| Admin-only CRUD routes | `backend/routes/{contact,project,qualification,user}Routes.js` |
| Contact form inbox API | `backend/routes/contactMessageRoutes.js`, `backend/models/ContactMessage.js` |

**Contact design decision:** The public contact form saves its messages to the `contact_messages` MongoDB collection. This is separate from the required `contacts` CRUD collection, which remains Admin-only for POST/PUT/DELETE. This maintains the assignment's regular-user read-only roles **and** ensures the public Contact form saves data. Admin sees messages on the dashboard's Messages tab.

## 10-minute testing walkthrough

1. Sign in as Admin; open **Admin** in the navbar.
2. On Projects, click **Add Project**, complete the six fields, and save. Verify the saved card; edit and save again; delete and verify removal.
3. Open Education, Contacts, Users and Messages tabs. Repeat create/edit/delete on Education and Contacts. Users can be created and managed by Admin.
4. Sign out and sign up with a different email/password (8+ characters). Confirm you have a `user` role, can view projects/education, and **cannot see or access** the Admin dashboard or backend write APIs.
5. Submit the Contact form. Check the home-page success message. Sign back in as Admin and look in **Messages**; the submitted message appears there.
6. In MongoDB Atlas, inspect the `Portfolio` database's collections `projects`, `qualifications`, `contacts`, `users`, `contact_messages`.
7. Take screenshots of Home (original portfolio), Projects, Education, Contact form, Admin dashboard and CRUD, regular-user mode, MongoDB collection records and terminal output.
8. Run `npm run build` from the frontend folder to test compilation, then push code and submit your ZIP + GitHub URL + screenshot Word doc.

## API routes

- `POST /api/users` signup (always regular `user`)
- `POST /api/auth/signin` (also `/auth/signin`)
- `GET /api/auth/signout` and `POST /api/auth/signout` (also `/auth/signout`)
- `GET /api/auth/profile` — bearer JWT required
- `GET /api/projects`, `GET /api/qualifications`, `GET /api/contacts` — public read
- `POST /api/projects`, `PUT /api/projects/:id`, `DELETE /api/projects/:id` — Admin JWT
- Same Admin CRUD pattern for qualifications and contacts.
- `GET /api/users` and user updates/deletes — Admin JWT; `POST /api/users/admin` Admin-only user creation.
- `POST /api/contact-messages` — saves visitors' Contact messages; `GET /api/contact-messages` and `DELETE /api/contact-messages/:id` Admin-only.

Backend `.env` parameters: `PORT=5000`, `MONGODB_URI=...`, `JWT_SECRET=...`, `ADMIN_EMAIL=...`, `ADMIN_PASSWORD=...`.

Do not submit `node_modules`, `.git`, or `.env`. This ZIP excludes them.
