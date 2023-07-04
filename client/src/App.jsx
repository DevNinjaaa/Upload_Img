import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { gql } from "@apollo/client";
import { client } from "./main";

const UPLOAD_IMG_MUTATION = gql`
  mutation UploadImg($encData: String, $fileName: String, $fileType: String) {
    uploadImg(encData: $encData, fileName: $fileName, fileType: $fileType) {
      EncData
      FileName
      FileType
    }
  }
`;

function App() {
  const onDrop = useCallback((acceptedFiles) => {
    let reader = new FileReader();
    reader.readAsDataURL(acceptedFiles[0]);
    reader.onload = function () {
      let encData = reader.result.split(",")[1];
      let fileName = acceptedFiles[0].name;
      let fileType = acceptedFiles[0].type;
      let fileSize = acceptedFiles[0].size;

      client
        .mutate({
          mutation: UPLOAD_IMG_MUTATION,
          variables: { encData, fileName, fileType },
        })
        .then((response) => {
          console.log("Mutation response:", response);
        })
        .catch((error) => {
          console.error("Mutation failed:", error);
        });
    };
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Drag 'n' drop some files here, or click to select files</p>
      )}
    </div>
  );
}

export default App;
