const app = new koa()
const router = new koaRouter()
const PORT = 3000

// koaBody is needed just for POST.
router.post('/graphql', koaBody(), graphqlKoa({ schema: myGraphQLSchema }))
router.get('/graphql', graphqlKoa({ schema: myGraphQLSchema }))

router.get('/graphiql', graphiqlKoa({ endpointURL: '/graphql' }))

app.use(router.routes())
app.use(router.allowedMethods())
app.listen(PORT)
