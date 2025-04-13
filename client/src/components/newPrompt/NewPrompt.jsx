import { useEffect, useRef, useState } from "react";
import "./newPrompt.css";
import Upload from "../upload/Upload";
import { IKImage } from "imagekitio-react";
import generateResponse from "../../lib/gemini";
import Markdown from "react-markdown";

const NewPrompt = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [img, setImg] = useState({
    isLoading: false,
    error: "",
    dbData: {},
    aiData: {},
  });

  const endRef = useRef(null);

  useEffect(() => {
    endRef.current.scrollIntoView({ behavior: "smooth" });
  }, [question, answer, img.dbData]);

  const add = async (text) => {
    setQuestion(text);
    setAnswer(""); // clear previous answer
    setImg({ isLoading: true, error: "", dbData: {}, aiData: {} });
  
    const response = await generateResponse(
      Object.entries(img.aiData).length ? [img.aiData, text] : [text]
    );
  
    const words = response.split(" ");
    let index = 0;
  
    const typeOut = () => {
      if (index < words.length) {
        setAnswer((prev) => prev + words[index] + " ");
        index++;
        setTimeout(typeOut, 80); // adjust speed here
      } else {
        setImg({ isLoading: false, error: "", dbData: {}, aiData: {} });
      }
    };
  
    typeOut();
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    const text = e.target.text.value;
    if (!text) return;

    add(text);
  };

  return (
    <>
      {/* ADD NEW CHAT */}
      {img.isLoading && <div>Loading...</div>}
      {img.dbData?.filePath && (
        <IKImage
          urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
          path={img.dbData?.filePath}
          width="380"
          transformation={[{ width: 380 }]}
        />
      )}
      {question && <div className="message user">{question}</div>}
      {answer && (
        <div className="message">
          <Markdown>{answer}</Markdown>
        </div>
      )}
      <div className="endChat" ref={endRef}>
        <form className="newForm" onSubmit={handleSubmit}>
          <Upload setImg={setImg} />
          <input id="file" type="file" multiple={false} hidden />
          <input
            type="text"
            name="text"
            placeholder="Ask anything..."
            autoComplete="off"
          />
          <button>
            <img src="/arrow.png" alt="" />
          </button>
        </form>
      </div>
    </>
  );
};

export default NewPrompt;