# Test Failure Fix - US01

## Problem
The test `US01 - Event Discovery` is failing with a 500 error when calling `GET /api/v1/events`.

## Root Cause
The endpoint now filters events by `status = 'PUBLISHED'`, but the test database may:
1. Not have the `status` column
2. Have a different schema than production
3. Not have any PUBLISHED events

## Solution

### Option 1: Update Your Test Database Schema
Run this SQL command on your **test database**:

```sql
-- Add status column if it doesn't exist
ALTER TABLE `events` 
ADD COLUMN `status` enum('DELETED','PUBLISHED') NOT NULL DEFAULT 'PUBLISHED';

-- Update existing events to PUBLISHED so tests pass
UPDATE `events` SET `status` = 'PUBLISHED';
```

### Option 2: Recreate Test Database
Drop and recreate your test database using the updated `db.sql` file:

```bash
# Drop test database
mysql -u your_username -p -e "DROP DATABASE IF EXISTS your_test_db;"

# Create test database
mysql -u your_username -p -e "CREATE DATABASE your_test_db;"

# Import schema
mysql -u your_username -p your_test_db < src/sql/db.sql
```

### Option 3: Make Query More Flexible (Temporary)
If you want tests to pass without database changes, you can temporarily modify the query to handle missing status column:

```javascript
// In event.routes.js - GET "/" endpoint
const sql = `
    SELECT 
    events.*, 
    users.name AS organizer_name, 
    users.email AS organizer_email
    FROM events
    JOIN users ON events.organizer_id = users.id
    WHERE (events.status = 'PUBLISHED' OR events.status IS NULL)
`;
```

## Recommended Approach
**Option 1** is recommended - just add the status column and set existing events to PUBLISHED.

## Verify Fix
After applying the fix, run tests again:
```bash
npm test
```

The US01 test should now pass.
