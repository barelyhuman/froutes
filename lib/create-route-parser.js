function createRouteParser(routeString) {
	return isDynamicRoute(routeString)
}

function isDynamicRoute(route) {
	let routeString = route
	const dynRegex = /(\[\w+])/g
	const matchGroups = route.match(dynRegex) || []
	for (const groupItem of matchGroups) {
		routeString = routeString.replace(groupItem, '((\\w+[-]*)+)')
	}

	routeString = routeString.replace(/\//g, '\\/')
	const parser = new RegExp(`^${routeString}$`)
	return {
		dynamic: dynRegex.test(route),
		parse: parser,
		getParam: (url) => {
			const group = url.match(parser).slice(1)

			const parameters = {}

			for (const [index, item] of matchGroups.entries()) {
				const key = item.replace(/[[\]]/g, '')
				parameters[key] = group[index]
			}

			return parameters
		},
	}
}

exports.createRouteParser = createRouteParser
