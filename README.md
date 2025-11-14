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

## Installation & Setup -NEEDED

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

#### Subscribe to Organizers (US13) -TO BE REWORKED
- On an organizer/event page, click **Subscribe**.

#### Subscription Feed (US15) -TO BE REWORKED
- Subscribed organizers’ events will appear **at the top** of the Discover feed.

---

### Organizer Guide (US05–US08, US14)

#### Create Events (US05)
- Go to **Organizer Dashboard → Create Event**.
- Fill out required event details and publish.

#### View Analytics (US06)
- Navigate to **Dashboard → Analytics** to view:
  - Tickets claimed
  - Attendance statistics
  - Capacity remaining

#### Export Attendee List (US07)
- Open an event → Click **Export Attendees (CSV)**.

#### QR Code Check-In (US08)
- Select **Check-In Mode** and scan attendee QR tickets.

#### View Subscribers (US14) -TO BE REWORKED
- Go to **Dashboard → Subscribers** to see who is following your events.

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

## Testing Documentation
See the full testing report here:  
[TESTING.md](Documentation/Testing/TESTING.md)

## Contribution Documentation
See the full individual contribution here: 
[CONTRIBUTIONS.md](Documentation/Contributions/PROJECTCONTRIBUTIONS.md)

---

