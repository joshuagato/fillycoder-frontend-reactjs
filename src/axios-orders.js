import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://jgato-react-burger-builder-app.firebaseio.com/'
});

export default instance;