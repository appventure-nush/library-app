import apiServer from './server';
const PORT = process.env.PORT || 3001;

apiServer.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
