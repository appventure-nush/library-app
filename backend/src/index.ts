import { Settings } from 'luxon';

import apiServer from './server';

Settings.defaultZoneName = 'Asia/Singapore';

const PORT = process.env.PORT || 3001;

apiServer.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
