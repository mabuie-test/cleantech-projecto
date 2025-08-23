import API from './api';
const fetcher = (url) => API.get(url).then(r => r.data);
export default fetcher;