const app = require('./app-mongoose.js');
const PORT = 3003;

app.listen(PORT, () => console.log(`listening on port ${PORT}!`));
