import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  InputGroup,
  UncontrolledAlert,
} from "reactstrap";
import { API_SHRINKER } from "../Global";
import Footer from "../parts/Footer";
import Header from "../parts/Header";
import TableList from "../parts/TableList";
import "../styles/userhome.css";
import axios from "axios";

axios.defaults.withCredentials = true;

export default function UserHome() {
  const [url, setUrl] = useState("");
  const [urlError, setUrlError] = useState("");
  const [list, setList] = useState([]);
  const [tableError, setTableError] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const sendRequest = async () => {
    const result = await axios
      .get(`${API_SHRINKER}/shortUrls`, {
        withCredentials: true,
      })
      .catch((error) => {
        setTableError(error.toString());
        localStorage.clear();
      });

    const data = await result.data;
    if (result.status === 200) {
      return data;
    } else {
      setTableError(data.message || result.statusText);
    }
  };

  useEffect(() => {
    sendRequest().then((data) => {
      setList([...data]);
      if (list.length) {
        setIsLoading(false);
      }
    });
  }, [list]);

  const postURL = async () => {
    const result = await axios
      .post(
        `${API_SHRINKER}/shortUrls`,
        {
          fullUrl: url,
        },
        {
          withCredentials: true,
        }
      )
      .catch((err) => {
        setError(err.toString());
        localStorage.clear();
      });

    const data = result.data;
    if (data.isSuccess === true && result.status === 200) {
      setSuccess(data.message);
    } else {
      setError(data.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url) {
      setUrlError("Please enter URL");
      return;
    }
    console.log(url);
    await postURL();
  };

  useEffect(() => {
    window.addEventListener("popstate", e => {
      window.history.go(1);
    })
  },[])

  return (
    <div className="container_userhome">
      <Header />
      <div className="container_userhome-main">
      {error !== "" && (
        <UncontrolledAlert className="msg_alert_userhome" color="danger" fade>
          {error}
        </UncontrolledAlert>
      )}
      {success !== "" && (
        <UncontrolledAlert className="msg_alert_userhome" color="success" fade>
          {success}
        </UncontrolledAlert>
      )}
        <div className="userhome_input">
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <InputGroup style={{ width: "60vw", position: "relative" }}>
                <Input
                  bsSize="lg"
                  type="url"
                  name="url"
                  id="url"
                  placeholder="Enter your URL here and shrink it!!!"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  invalid={urlError !== ""}
                />
                <Button type="submit" size="lg" color="success">
                  Shrink
                </Button>
              </InputGroup>
              {urlError !== "" ? (
                <FormFeedback
                  style={{ display: "inline", position: "absolute" }}
                >
                  <sup>*</sup>
                  {urlError}
                </FormFeedback>
              ) : (
                <FormFeedback
                  style={{ display: "inline", position: "absolute" }}
                >
                  <p>
                    <sup>*</sup>Kindly prefix the url with "http://" or
                    "https://"
                  </p>
                </FormFeedback>
              )}
            </FormGroup>
          </Form>
        </div>
        <h4 className="text-white bg-success mb-5">List of Short Links</h4>
        <TableList list={list} error={tableError} isLoading={isLoading} />
      </div>
      <Footer />
    </div>
  );
}
