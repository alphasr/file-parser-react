import React from "react";
import { useState } from "react";
import { Card, Form, Spinner, Table } from "react-bootstrap";
import "./App.css";

/* Notes:
   - usage: `Validate a file, and send it to node server for parsing`
   - detail: `This the main App component for the input of the file`
   - params: `void` 
   - return: `React Component`
  */

const App: React.FC = () => {
  const [loading, setLoading] = useState<boolean | undefined>(false);
  const [data, setData] = useState<any>();
  const [cols, setCol] = useState<any>();

  /* 
   - usage: `Handles event when upload button is clicked`
   - detail: `Sets data and column after response is converted to json otherwise throws an error`
   - params: `React.ChangeEvent<HTMLInputElement>` 
   - return: `void`
  */

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setLoading(true);
    const files = e.target.files;
    const formData = new FormData();
    if (files && files[0]) {
      formData.append("file", files[0]);
    }
    console.log(formData.get("file"));

    //making the fetch request to upload files to backend
    //sending formData as request body
    //@return promise{res = res.table{data , cols}}
    await fetch("/upload-files", {
      method: "POST",
      body: formData,
    })
      .then((resp) => resp.json())
      .then((data) => {
        // setting response cols and data to state variables
        setCol(data.table.cols);
        setData(data.table.data);
        console.log(
          JSON.stringify(data.table.cols),
          "data = ",
          JSON.stringify(data.table.data)
        );
      });

    setLoading(false);
  };

  return (
    <div className="App">
      <form className="form-inline">
        <div className="form-group pl-5 pt-5">
          <Card className="shadow">
            <Card.Body>
              <Form>
                <Form.Group>
                  <Form.File
                    disabled={loading}
                    id="file"
                    accept={SheetJSFT}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
        </div>
      </form>
      {loading ? (
        <div className="my-spinner">
          <Card>
            <Card.Body>
              <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
              </Spinner>
              &nbsp; &nbsp;Loading your file...
            </Card.Body>
          </Card>
        </div>
      ) : (
        <div className="p-5">
          <Card className="shadow">
            <Card.Body style={{ maxHeight: 500, overflow: "auto" }}>
              {cols && data && !loading ? (
                <Table hover>
                  <thead style={{ border: "1px solid #2e2e2e" }}>
                    <tr>
                      {cols.map((c: any) => (
                        <th key={c.key}>{c.name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((r: any, i: any) => (
                      <tr key={i}>
                        {cols.map((c: any) => (
                          <td key={c.key}>{r[c.key]}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <div className="p-5">
                  <Card>
                    <Card.Body>Please Select a file to continue</Card.Body>
                  </Card>
                </div>
              )}
            </Card.Body>
          </Card>
        </div>
      )}
    </div>
  );
};

/* Notes:
   - usage: `To validate against if a valid file is uploaded`
   - detail: `Types of files supported by the library`
  */
const SheetJSFT = [
  "xlsx",
  "xlsb",
  "xlsm",
  "xls",
  "xml",
  "csv",
  "txt",
  "ods",
  "fods",
  "uos",
  "sylk",
  "dif",
  "dbf",
  "prn",
  "qpw",
  "123",
  "wb*",
  "wq*",
  "html",
  "htm",
]
  .map(function (x) {
    return "." + x;
  })
  .join(",");

export default App;
