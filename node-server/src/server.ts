import app from './app';

/* Notes:
   - usage: `Starts listening at the value in the port variable`
  */

const port = 3001;
app.listen(port, () => {
  return console.log(`server is listening on ${port}`);
});
