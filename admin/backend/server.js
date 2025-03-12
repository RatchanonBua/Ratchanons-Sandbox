require('module-alias/register');

const app = require('@/app');
const port = process.env.PORT || 3000;

// Listen Section
app.listen(port, () => {
  console.log(`Server is Running on Port: ${port}`);
}).on('error', (error) => {
  console.error(`Error Starting Server:`, error)
});