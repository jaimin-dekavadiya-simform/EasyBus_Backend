import 'dotenv/config';

import app from './app.js';

console.log(process.env.PORT);
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
