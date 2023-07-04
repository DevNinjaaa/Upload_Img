import fs from "fs";

async function writeStream(encData, fileName, fileType) {
  const imageBuffer = Buffer.from(encData, "base64");
  let nameOfFile = fileName.split(".")[0];
  let mimeType = fileType.split("/")[1];
  let type = fileType.split("/")[0];
  if (type === "image") {
    return new Promise((resolve, reject) => {
      fs.writeFile(
        `./uploads/${nameOfFile}.${mimeType}`,
        imageBuffer,
        (err) => {
          if (err) {
            console.error(err);
            reject(err);
            return;
          }
          console.log("Image file saved successfully!");
          resolve({
            EncData: encData,
            FileName: fileName,
            FileType: type,
          });
        }
      );
    });
  } else {
    //handle not imge
  }
}

const resolvers = {
  Mutation: {
    uploadImg: async (_, { encData, fileName, fileType }) => {
      try {
        const result = await writeStream(encData, fileName, fileType);
        return result;
      } catch (error) {
        throw new Error("Failed to upload image");
      }
    },
  },
};

export default resolvers;
