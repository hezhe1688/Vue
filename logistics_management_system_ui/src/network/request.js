import axios from 'axios'

export function request(config) {

	const instance = axios.create({
		baseURL: 'http://123.56.160.215:8888',
	});

	return instance(config)
}
