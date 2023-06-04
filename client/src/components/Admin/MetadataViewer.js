import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table } from "reactstrap";

const MetadataViewer = () => {
  const [metadata, setMetadata] = useState([]);
  const updateMetadataValue = async (id, data) => {
    if (!data[Object.keys(data)[0]]) {
      return;
    }
    await axios.post(`/api/metadata/update/sets/id/${id}`, data);
  };
  useEffect(() => {
    axios.get("/api/metadata/sets/all").then((res) => {
      setMetadata(res.data);
    });
  }, []);

  return (
    <div>
      Metadata Viewer
      {metadata.length > 0 && (
        <Table bordered>
          <thead>
            <tr>
              <th>ID</th>
              <th>Set name</th>
              <th>Cards</th>
              <th>Formatted set name</th>
              <th>Release year</th>
              <th>Set block</th>
            </tr>
          </thead>
          <tbody>
            {metadata.map((el) => (
              <tr key={el.id}>
                <td>{el.id}</td>
                <td>
                  <div
                    contentEditable
                    suppressContentEditableWarning={true}
                    onBlur={(e) =>
                      updateMetadataValue(el.id, {
                        set_name: e.currentTarget.textContent.trim(),
                      })
                    }
                  >
                    {el.set_name}
                  </div>
                </td>
                <td>{el.card_count}</td>
                <td>
                  <div
                    contentEditable
                    suppressContentEditableWarning={true}
                    onBlur={(e) =>
                      updateMetadataValue(el.id, {
                        formatted_set_name: e.currentTarget.textContent.trim(),
                      })
                    }
                  >
                    {el.formatted_set_name}
                  </div>
                </td>
                <td>
                  <div
                    contentEditable
                    suppressContentEditableWarning={true}
                    onBlur={(e) =>
                      updateMetadataValue(el.id, {
                        release_year: parseInt(
                          e.currentTarget.textContent.trim()
                        ),
                      })
                    }
                  >
                    {el.release_year}
                  </div>
                </td>
                <td>
                  <div
                    contentEditable
                    suppressContentEditableWarning={true}
                    onBlur={(e) =>
                      updateMetadataValue(el.id, {
                        set_block: e.currentTarget.textContent.trim(),
                      })
                    }
                  >
                    {el.set_block}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default MetadataViewer;
