import React, { useEffect, useState } from "react";
import "../styles/adminhome.css";
import Footer from "../parts/Footer";
import Header from "../parts/Header";
import { API_SHRINKER } from "../Global";
import TableList from "../parts/TableList";
import { Button } from "reactstrap";
import {AiOutlineBarChart} from "react-icons/ai";
import axios from "axios";

axios.defaults.withCredentials = true;

export default function AdminHome() {
  const [list, setList] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const sendRequest = async () => {
    const result = await axios
      .get(`${API_SHRINKER}/shortUrls`, {
        withCredentials: true,
      })
      .catch((error) => {
        setError(error.toString());
        localStorage.clear();
      });

    const data = await result.data;
    if(result.status === 200) {
        return data;
    } else {
        setError(data.message || result.statusText);
        localStorage.clear();
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

  useEffect(() => {
    window.addEventListener("popstate", e => {
      window.history.go(1);
    })
  },[])

  return (
    <div className="container_adminhome">
      <Header />
      <div className="container_adminhome-main">
        <div className="adminhome_data_div">
          <div className="data_box">
            <h3>{list.length}</h3>
            <p>Total URLs shortened</p>
          </div>

          <div className="data_box">
            <h3>
              {
                list.reduce((accum, val) => {
                  accum += val.clicks;
                  return accum
                },0)
              }
            </h3>
            <p>Total Clicks</p>
          </div>

          <div className="data_button">
          <Button type="button" color="success">Analyze <AiOutlineBarChart /></Button>
          </div>

        </div>
        <TableList list={list} error={error} isLoading={isLoading} />
      </div>
      <Footer />
    </div>
  );
}
