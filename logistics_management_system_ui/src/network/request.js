import axios from 'axios'

export function request(config) {

	const instance = axios.create({
		baseURL: 'http://localhost:8888',  //把这里改成IP（192.168.31.123）就可以用另外的电脑操作了
	});

	return instance(config)
}
