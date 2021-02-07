import express from 'express';
import * as bodyParser from 'body-parser';

/* Notes:
   - detail: `MiddleWare used for parsing and response management`
  */

const cors = require('cors');
const morgan = require('morgan');
const formidableMiddleware = require('express-formidable');
const XLSX = require('xlsx');
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(formidableMiddleware());

declare module 'express-serve-static-core' {
  // extending express to accept files property
  interface Request {
    files?: { file: any };
  }
}

/* Notes:
   - usage: `POST request sent with file`
   - detail: `The file is parsed using XLSX library and set into columns. Response is sent in table variable with data and columns.`
  */
app.post('/upload-files', async (req, res) => {
  try {
    if (!req.files) {
      res.send({
        status: false,
        message: 'No file uploaded',
      });
    } else {
      const file = req.files.file ? req.files.file : null;

      //xlsx operations
      var wb = XLSX.readFile(file.path, { PRN: true }); //work book
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname]; // work sheet
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      const cols = make_cols(ws['!ref']);
      // console.log('data=', data, 'cols=', cols);

      //Response for the request
      return res.send({
        status: true,
        message: 'File is uploaded',
        table: { data: data, cols: cols },
      });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});
export default app;

const make_cols = (refstr) => {
  let o = [],
    C = XLSX.utils.decode_range(refstr).e.c + 1;
  for (var i = 0; i < C; ++i) o[i] = { name: XLSX.utils.encode_col(i), key: i };
  return o;
};
