import React from "react";
import { Spinner, Table } from "reactstrap";
import { API_HOME } from "../Global";
import "../styles/tablelist.css";

export default function TableList(props) {
  let shortUrl, date;
  let { list, error, isLoading } = props;

  return (
    <div className="container_tablelist">
      {error ? (
        <h6 className="text-danger">{error}</h6>
      ) : isLoading && !list.length ? (
        <Spinner color="success">Loading...</Spinner>
      ) : (
        list.length && (
          <Table bordered hover responsive size="sm">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Short URL</th>
                <th>Original URL</th>
                <th>Clicks</th>
                <th>Created At</th>
                <th>Created By</th>
              </tr>
            </thead>
            <tbody>
              {list.map((item, index) => {
                shortUrl = `${API_HOME}/${item.shortUrl}`;
                date =
                  new Date(item.createdAt).getDate() +
                  "." +
                  (new Date(item.createdAt).getMonth() + 1) +
                  "." +
                  new Date(item.createdAt).getFullYear();
                return (
                  <tr key={index}>
                    <th scope="row">{index + 1}</th>
                    <td>
                      <a href={shortUrl} target="_blank" rel="noreferrer">
                        {shortUrl}
                      </a>
                    </td>
                    <td>{item.fullUrl}</td>
                    <td>{item.clicks}</td>
                    <td>{date}</td>
                    <td>{item.username}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )
      )}
    </div>
  );
}
