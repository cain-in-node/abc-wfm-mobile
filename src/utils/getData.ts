import axios from 'axios';

export default async function getData(link: string) {
    return axios.create({ baseURL: link }).get('').then(response => {
        return response.data;
    });
}