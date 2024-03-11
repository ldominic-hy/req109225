# REQ109225

B.C. experiences 1,600 wildfires per year, on average. While the majority of these fires are put out before they threaten people, homes and communities, it is important to be prepared, especially if living in an area prone to wildfire.
This project is to build a web server and front-end to monitor the status of these wildfires and act accordingly.

## Available Scripts for local environment

The project is composed of client and server component.

In the src/client directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm run lint`

Launches es lint and display syntax errors to fix.

### `npm run test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.


## Building an image using Docker

In the src folder, build an image using the following command:

### `docker-compose up --build`

An image for client and server is built and started.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

To increment the image tag version, please update the version tag in `docker-compose.yml` from the src folder.


