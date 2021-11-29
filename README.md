# Implementation

**Prerequisites**
- Node [v16.11.0^](https://nodejs.org/dist/v16.11.0/)
- MongoDB Atlas URI [Login|Signup](https://cloud.mongodb.com/)

1. **Installing all dependencies**
Paste this command below in your terminal within the working folder.
```
npm install
```
> All dependencies will start to download, please wait to finish before moving on to the next.

1. **Create a 'config.env' file inside './secrets' folder**
Write ''ATLAS_URI=your_URI" inside the 'config.env'
```
ATLAS_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/<DBname>?retryWrites=true&w=majority
```
> Save it!
1. **Starting the development server**
After downloading all dependencies, you should now able to run the development server by using this command below:
```
npm run dev
```
You should see something like this in your terminal
```
Server running on port 5000
Connected to MongoDB!
```
Your website should now run on `http://localhost:5000/`



