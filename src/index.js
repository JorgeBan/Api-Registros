const app = require('./app');
const port = 3000 || process.env.PORT

function main() {
    app.listen(port, () => console.log(`app listening on port ${port}!`))
}

main()