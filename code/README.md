## **Setup & Installation**

### **1. Clone the repository**
```bash
git clone https://github.com/yourusername/event-finder.git
cd event-finder 
```

### **2. Check installations**
Run the following to make sure you have node.js. If you don't have it, install node.js

```bash
node -v
```

Also, run the following to do the rest of the installs

```bash
npm install
```

### **3. Database Setup**
You are going to want to download MySQL Workbench with the following link: https://canvas.vt.edu/courses/223974/pages/mysql-installation-guide

(NOTE: Make sure to remember the port and password you use)

After you install and make a SQL Database, use the file in sql/event_finder.sql to import your data in the Workbench.

Before moving on, make sure it is running and take note of the port and password

### **4. Database Connection**
Navigate to the server folder
```bash
cd server
```
and do the following:
```bash
npm init -y
npm install express mysql2 cors
```

Now edit server.js with your own MySQL credentials:
const connection = mysql.createConnection({
  host: "localhost",
  user: "YOUR_DB_USER",
  password: "YOUR_DB_PASSWORD",
  database: "EventFinder",
});

(Currently, I have mine in their, also edit the port if you used 3306 because I used 3307)

Then you can start backend server:
```bash
node server.js
```

(Can run http://localhost:5000/events in a tab to see if any data shows up to see if it is working)

### **4. Frontend Connection**
Open another tab and
```bash
cd ../my-react-app
npm install
npm run dev
```

and now everything should start with the data manipulation working