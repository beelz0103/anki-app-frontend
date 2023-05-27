import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";
import UpdateNote from "./Components/UpdateNote";

function App() {
  const [inputImage, setInputImage] = useState(null);
  useEffect(() => {
    const testFetch = async () => {
      try {
        const data = await fetch("http://localhost:8765", {
          method: "POST",
          body: JSON.stringify({
            action: "addNote",
            version: 6,
            params: {
              note: {
                deckName: "DummyTest",
                modelName: "Mining-475ae English",
                fields: {
                  front: "word",
                },
                tags: ["test"],
                audio: [
                  {
                    url: "https://ssl.gstatic.com/dictionary/static/sounds/20200429/hello--_gb_1.mp3",
                    filename: "yomichan_test.mp3",
                    skipHash: "7e2c2f954ef6051373ba916f000168dc",
                    fields: ["Audio"],
                  },
                ],
              },
            },
          }),
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const result = await data.json();
        console.log(result);
      } catch (err) {
        console.log(err);
      }
    };
  });

  const handleNoteUpdate = async () => {
    fetch("https://en.wikipedia.org/wiki/Proverb", {
      mode: "cors",
    })
      .then(function (response) {
        if (response.ok) {
          return response.text();
        }
        throw new Error("Network response was not ok.");
      })
      .then(function (html) {
        console.log(html);
      })
      .catch(function (error) {
        console.log("Error:", error.message);
      });
  };

  const handleNoteUpdate1 = async () => {
    const data = await fetch("http://localhost:8765", {
      method: "POST",
      body: JSON.stringify({
        action: "findNotes",
        version: 6,
        params: {
          query: "deck:DummyTest",
        },
      }),
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const noteId = await data.json();
    console.log(noteId.result[0]);
    const noteInfo = await fetch("http://localhost:8765", {
      method: "POST",
      body: JSON.stringify({
        action: "notesInfo",
        version: 6,
        params: {
          notes: [noteId.result[0]],
        },
      }),
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const noteInfoData = await noteInfo.json();
    console.log(noteInfoData);
    const updateNote = await fetch("http://localhost:8765", {
      method: "POST",
      body: JSON.stringify({
        action: "updateNoteFields",
        version: 6,
        params: {
          note: {
            id: noteId.result[0],
            fields: {},
            picture: [
              {
                data: inputImage,
                filename: "test.jpg",
                skipHash: "8d6e4646dfae812bf39651b59d7429ce",
                fields: ["Picture"],
              },
            ],
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

  function blobToDataURL(blob, callback) {
    var reader = new FileReader();
    reader.onloadend = function () {
      callback(reader.result);
    };
    reader.readAsDataURL(blob);
  }

  return <UpdateNote />;

  return (
    <div className="App">
      <Input inputImage={inputImage} setInputImage={setInputImage} />
      <button onClick={handleNoteUpdate}>Update Note</button>
    </div>
  );
}

const Input = ({ setInputImage, inputImage }) => {
  const handeChange = (e) => {
    console.log(e.target.files[0]);
    const image = document.createElement("img");
    image.src = URL.createObjectURL(e.target.files[0]);

    var file = e.target.files[0];

    var reader = new FileReader();
    reader.onloadend = function () {
      var dataURL = reader.result;
      console.log(dataURL);
      setInputImage(dataURL.substring(22));
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <input type="file" onChange={handeChange}></input>
    </>
  );
};

export default App;
