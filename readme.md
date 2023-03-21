# Placement Cell App
An interface to fill in the data into the database and then download it in CSV format.

## Pages
1.  Sign In/ Sign Up

    Create new user with Sign Up form. Otherwise Sign In if user already exists.

2. Student Details Page

    Home page showing Batch wise students list. Form to create new Student. 
    Create new Batch if batch with given start date does not exists.
    Link to download student data in CSV format.

    > Header contains link to Jobs page showing latest available Jobs. Also link for interview page.

3. Interview Page

    Page showing Interviews list with students applied for that interview. Form to create new Interview.
    Each interview has form to add student and form provides list of students to select from.
    Each student in turn has update result form to update result of student from list itself.
    Link to download student data in CSV format.

4. Jobs Page

    It display latest Jobs available.


## Getting Started with Placement Cell App

This project uses Bootstrap and fontawesome to style & use icons.
After you have this project in your machine.

**To setup:**

### `npm install`

Installs all the dependencies for App that are present in package.json file.

> You can secret keys of your choice within env.js file. If required then MongoDB url.

**In the project directory, you can run:**

### `npm start`

Runs the app.
Open [http://localhost:8000](http://localhost:8000) to view it in your browser.

> You can change port number by modifying env.js file.
