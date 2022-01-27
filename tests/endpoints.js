const process = require('process')
const axios = require('axios')

const baseURL = 'http://localhost:3000'

const passingCases = [
	{
		path: 'api/',
		method: 'get',
	},
	{
		path: 'api/me',
		method: 'get',
	},
	{
		path: 'api/1',
		method: 'get',
	},
	{
		path: 'api/1/2',
		method: 'get',
	},
	{
		path: 'api/hello/user',
		method: 'get',
	},
	{
		path: 'api/profile/1',
		method: 'get',
	},
	{
		path: 'api/user/1',
		method: 'get',
	},
	{
		path: 'api/user/delete/1',
		method: 'get',
	},
	{
		path: 'api/me?query=somequerystring',
		method: 'get',
	},
	{
		path: '/',
		method: 'get',
	},
	{
		path: '/outer-route',
		method: 'get',
	},
]

const failingCases = [
	{
		path: 'api/1',
		method: 'post',
	},
	{
		path: 'api/hello/idexist/1',
		method: 'get',
	},
	{
		path: 'api/hello/idexist/2',
		method: 'post',
	},
]

const instance = axios.create({
	baseURL,
})

function runCases(cases, shouldFail) {
	const successful = []
	const failed = []

	const promises = cases.map((item) => {
		return instance[item.method](item.path)
			.then(() => {
				if (shouldFail) {
					failed.push(item)
				} else {
					successful.push(item)
				}
			})
			.catch((_) => {
				if (shouldFail) {
					successful.push(item)
				} else {
					failed.push(item)
				}
			})
	})

	return Promise.all(promises).then(() => {
		console.log('=================================================')
		console.log('Successful' + JSON.stringify(successful, null, 2))
		console.log('=================================================')
		console.log('Failed' + JSON.stringify(failed, null, 2))
		console.log('=================================================')
	})
}

console.log('=================================================')
console.log('Running Passing Cases')
runCases(passingCases, false).then(() => {
	console.log('=================================================')
	console.log('Running Failing Cases')
	runCases(failingCases, true).then(() => {
		// eslint-disable-next-line unicorn/no-process-exit
		process.exit(0)
	})
})
