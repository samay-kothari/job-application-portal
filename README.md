# JOB APPLICATION PORTAL
Created a job Application portal in MERN stack as a assignment for DASS course.
- React.js​ for Frontend
- Backend Framework using ​Express JS​ implementing ​REST​ API.
- Node.js​ for Backend Engine
- MongoDB​ - Database

## SETUP AND RUNNING

* Running backend server
	* Open a terminal window

```bash
	cd backend
	npm install
	npm run server
```

* Running frontend server
	* Open a new terminal window


```bash
	cd frontend/job_application/
	npm install
	npm start
```

### App will start in your default browser, open http://localhost:3000/ in Google Chrome otherwise will throw an error due to redux plugins used

CAUTION : If the ports are already being used by some other processes, they must be killed before running the above script
* If backend port is in use
```bash
    sudo fuser -k 5000/tcp
```
* If frontend port is in use
``` 
    sudo fuser -k 3000/tcp
```
