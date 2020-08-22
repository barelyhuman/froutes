function createRouteParser(routeString) {
    return isDynamicRoute(routeString)
}

function isDynamicRoute(route) {
    let routeString = route
    const dynRegex = /(\[\w+\])/g
    const matchGroups = route.match(dynRegex) || []
    matchGroups.forEach((groupItem) => {
        routeString = routeString.replace(groupItem, '((\\w+[-]*)+)')
    })
    routeString = routeString.replace(/\//g, '\\/')
    const parser = RegExp(`^${routeString}$`)
    return {
        dynamic: dynRegex.test(route),
        parse: parser,
        getParam: (url) => {
            const group = url.match(parser).slice(1)

            const params = {}

            matchGroups.forEach((item, index) => {
                const key = item.replace(/[\[\]]/g, '')
                params[key] = group[index]
            })

            return params
        },
    }
}

exports.createRouteParser = createRouteParser
