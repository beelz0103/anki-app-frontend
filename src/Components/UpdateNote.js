import { useEffect, useState } from "react";

const UpdateNote = () => {
  const [searcVal, setSearchVal] = useState("");
  const [searcTagVal, setSearchTagVal] = useState("");
  const [searchSentenceValue, setSearchSentenceValue] = useState("");
  const [query, setQuery] = useState({});
  const { invokeAction } = useAnkiConnect();

  const handleChange = (e) => {
    setSearchVal(e.target.value);
    if (e.target.value === "") {
      const newQuery = { ...query };
      delete newQuery["front"];
      setQuery(newQuery);
    } else {
      setQuery({ ...query, front: e.target.value });
    }
  };

  const handleTagChange = (e) => {
    setSearchTagVal(e.target.value);
    if (e.target.value === "") {
      const newQuery = { ...query };
      delete newQuery["tags"];
      setQuery(newQuery);
    } else {
      setQuery({ ...query, tags: e.target.value.split(" ") });
    }
  };

  const handleSetenceChange = (e) => {
    setSearchSentenceValue(e.target.value);
    if (e.target.value === "") {
      const newQuery = { ...query };
      delete newQuery["Sentence"];
      setQuery(newQuery);
    } else {
      setQuery({ ...query, Sentence: e.target.value });
    }
  };

  const handleClick = async () => {
    let searchQuery = "";

    for (const key in query) {
      if (key === "front") searchQuery = searchQuery + `${key}:${query[key]} `;
      else if (key === "Sentence") searchQuery = searchQuery + `${query[key]} `;
      else {
        query[key].forEach((tag) => {
          searchQuery = searchQuery + `tag:${tag} `;
        });
      }
      console.log(searchQuery.slice(0, -1));
    }

    const noteList = await invokeAction("findNotes", {
      query: searchQuery,
    });
    console.log(noteList.result);
  };

  const handleUpdate = async () => {
    const updateNote = await fetch("http://localhost:8765", {
      method: "POST",
      body: JSON.stringify({
        action: "updateNoteFields",
        version: 6,
        params: {
          note: {
            id: 1685165198961,
            fields: {
              Sentence: "",
            },
          },
        },
      }),
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const updateResult = await updateNote.json();
    console.log(updateResult);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="note"
        value={searcVal}
        onChange={handleChange}
      ></input>{" "}
      <input
        type="text"
        placeholder="tags"
        value={searcTagVal}
        onChange={handleTagChange}
      ></input>
      <input
        type="text"
        placeholder="sentence"
        value={searchSentenceValue}
        onChange={handleSetenceChange}
      ></input>
      <button onClick={handleClick}>Find Card</button>
      <button onClick={handleUpdate}>Update Card</button>
    </div>
  );
};

const NotesDisplayer = ({ notesList }) => {
  return notesList ? (
    <div>
      {notesList.map((card) => {
        return (
          <div>
            <div>Front: {card.fields.front.value}</div>
            <div>Sentence: {stripHtml(card.fields.Sentence.value)}</div>
          </div>
        );
      })}
    </div>
  ) : null;
};

function stripHtml(html) {
  let tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}

const useAnkiConnect = () => {
  const invokeAction = async (action, params, version = 6) => {
    const response = await fetch("http://localhost:8765", {
      method: "POST",
      body: JSON.stringify({
        action,
        version,
        params,
      }),
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();
    return result;
  };

  return { invokeAction };
};

export default UpdateNote;
