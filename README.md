# Bug_Busters-SOEN341_Project_F25

## Project Description

This web application is designed to enhance campus life by helping **students**, **organizers**, and **administrators** discover, manage, and analyze events happening across the university. It simplifies event participation, streamlines event organization, and provides actionable insights into student engagement.

Inspired by platforms like [CampusGroups](https://www.campusgroups.com), the system offers a seamless experience tailored to campus communities.

---

## Primary User Roles & Core Features

### 1. Student Experience (US01–US04)

- **Event Discovery**: Browse and search events with filters (date, category, organization). (US01)
- **Save Events**: Save events to a personal calendar/favorites list. (US02)
- **Ticket Registration**: Claim tickets for events. (US03)
- **Digital Tickets**: Receive a unique QR code for event check-in. (US04)

---

### 2. Organizer Tools (US05–US08)

- **Event Creation**: Create and publish events (title, description, date, capacity, etc.). (US05)
- **Analytics Dashboard**: View statistics such as ticket count, attendance, and capacity. (US06)
- **Utilities**:
  - Export attendee lists (CSV format) (US07)
  - Validate tickets using an integrated QR code scanner (US08)

---

### 3. Administrator Capabilities (US09–US12)

- **Approve Organizer Accounts** to grant event posting permissions. (US09)
- **Moderate Events** to ensure posted events meet platform guidelines. (US10)
- **View Platform-wide Analytics** such as total events, attendance and engagement trends. (US11)
- **Manage Organizations and User Roles** (promote/demote users to organizer or admin roles). (US12)

---

### 4. Subscription Feature (US13–US15) 

- **Subscriptions**: Students can subscribe to organizers. (US13)
- **Organizer Subscriber List**: Organizers see who follows them. (US14)
- **Student Dashboard Feed**: Students see events from followed organizers first. (US15)

---

## Project Goals

-  Encourage campus engagement and student involvement
-  Simplify event creation and participation processes
-  Provide data-driven insights to improve event planning and campus life

---

## Team Members

| Name               | Student Number | GitHub Username |
| ------------------ | -------------- | --------------- |
| Spencer Toupin     | 40259693       | SpenyT          |
| Jeremy de Passorio | 40271747       | JeremDePass     |
| Mattia Vergnat     | 40276164       | martin0024      |
| Conrad Tcheuffa    | 40269674       | Conradtch07     |
| Nigel Kyle Arintoc | 40281248       | Nigelkyle21     |
| Muhammad Haris     | 40232227       | Harryjee7       |
| Zein Rammal        | 40282083       | ZeinRam         |
| Liam Handfield     | 40300383       | Doula           |

---

## Tech Stack (Languages & Techniques)

-  Language: TypeScript, Javascript, Html, tailwind, MySql
-  Frontend: React, tailwind
-  Backend: express.js
-  Database: MySql
-  Authentication: username & password (Clerk)
-  Version Control: Git + GitHub

## Coding Style & Naming Conventions

To maintain consistency across the project, we follow these naming conventions:

- React Components: `PascalCase`  

- Hooks: `camelCase` and always start with `use`  

- General Variables and Functions: `camelCase`

- Folders: `kebab-case`  

- Database Tables & Columns: `snake_case`  

- Constants: `UPPER_CASE`

## Installation & Setup 

This section explains how to install, configure, and run the project locally for development.  
Since this is a web application, these steps are intended for developers setting up the system on their machine.

---

### 1. Prerequisites

Ensure the following are installed:

- **Node.js** (v18+ recommended)  
- **npm**  
- **MySQL Server** (8.0+)  
- **Git**  
- Clerk account (for authentication keys)

---

### 2. Clone the Repository

```bash
git clone https://github.com/Bug-Busters-2025/Bug_Busters-SOEN341_Project_F25.git
```
---

### 3. Install Dependencies

#### Frontend (root)
```bash
cd src/client
npm install
cd ../..
```

#### Backend (/server)
```bash
cd src/server
npm install
cd ../..
```

---

### 4. Database Setup (MySQL)

The SQL schema is located at:

```
src/server/src/sql/db.sql
```

To set up the database:

1. Create a MySQL database named **bugbusters**  
2. **Import `src/server/src/sql/db.sql`** using any MySQL tool  
3. Confirm all tables were created successfully  


---
### 5. Environment Variables

Both backend and frontend require `.env` files.

---

#### Root `.env` (Frontend + Clerk)

Create a `.env` in the **project root**:

```bash
touch .env
```

Add:

```
VITE_CLERK_PUBLISHABLE_KEY=pk_test_ZXhwZXJ0LW1hbnRpcy0xMC5jbGVyay5hY2NvdW50cy5kZXYk
CLERK_PUBLISHABLE_KEY=pk_test_ZXhwZXJ0LW1hbnRpcy0xMC5jbGVyay5hY2NvdW50cy5kZXYk
CLERK_SECRET_KEY=sk_test_vBd0hdkVjkIxGDN7XdlZgv7laUULOjNpoLV6Fs4Ywy
```


---

#### Backend `.env` (inside `/server`)

Create:

```bash
cd server
touch .env
```

Add:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=bugbusters
DB_PORT=3307
PORT=3000
```

Return to root

---

### 6. Run the Project Locally

#### Start Backend
```bash
cd src/server/src
npm run dev
cd ../../..
```

Backend runs at:
```
http://localhost:3000
```

#### Start Frontend
```bash
cd src/client/src
npm run dev
```

Frontend runs at:
```
http://localhost:5173
```

---



## User Guide

### Student Guide (US01–US04, US13, US15)

#### Discover Events (US01)
- Go to **Discover** page and browse events.
- Use search and filters to refine results.

#### Save Events (US02)
- Click **Save** on an event card.
- View saved items under **Saved Events**.

#### Register for Tickets (US03)
- Open an event page and click **Register**.
- If full, you may be placed on a **waitlist**.

#### Digital Tickets (US04)
- Access **My Tickets** to view QR-coded tickets for check-in.

#### Subscribe to Organizers (US13)
- In the **Discovery** page, when viewing events, press the **follow organizer** button at the bottom right corner of an event card to follow the corresponding event's organizer.

#### Subscription Feed (US15)
- Navigate to **Dashboard → My Subscriptions** to view events created by who you follow.
- At the top of the dashbaord there are two selections: **Event Feed** and **Subscriptions**. **Event Feed** is selected by default when entering the **My Subscriptions** dashboard tab:
  - Select **Event Feed** to view the subscribed organizers’ events.
  - Select **Subscriptions** to view the list of organizers the user is subscribed to. In this tab, users can also remove an organizer from their list of subscriptions by pressing the corresponding **unfollow** button.


---

### Organizer Guide (US05–US08, US14)

#### Create Events (US05)
- Go to **Organizer Dashboard → Create Event**.
- Fill out required event details and publish.

#### View Analytics (US06)
- Navigate to **Dashboard → Analytics** to view:
  - Tickets claimed
  - Attendance statistics
  - Capacity remaining per event

#### Export Attendee List (US07)
- Open an event → Click **Export Attendees (CSV)**.

#### QR Code Check-In (US08)
- Select **Check-In Mode** and scan attendee QR tickets.

#### View Subscribers (US14)
- Go to **Dashboard → Subscribers** to see who is following your events.
- Click on the **Trash Can** icon to remove a follower from your subscribers list.

---

### Administrator Guide (US09–US12)

#### Approve Organizer Requests (US09)
- Go to **Admin Panel → Organizer Requests**.
- Approve or reject organizer status applications.

#### Moderate Events (US10)
- Review newly created events and approve visibility.

#### Platform-Wide Analytics (US11)
- Access **Admin Analytics** to view system-wide engagement data.

#### Manage Roles & Organizations (US12)
- Use **Admin User Management** to promote/demote users.

## Architecture Diagram

The system architecture is documented here:

[Architecture Diagram](Documentation/Architecture/Bugbuster-Architecture-updated.png)

## Testing Documentation
See the full testing report here:  
[TESTING.md](Documentation/Testing/TESTING.md)

## Contribution Documentation
See the full individual contribution here: 
[CONTRIBUTIONS.md](Documentation/Contributions/PROJECTCONTRIBUTIONS.md)

---

