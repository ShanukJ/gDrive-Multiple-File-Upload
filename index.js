const { google } = require("googleapis");
var fs = require("fs");

const KEYFILEPATH = "privat_key.json"; //Make sure to replace with youre key file.
const SCOPES = ["https://www.googleapis.com/auth/drive"];

const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: SCOPES,
});

const uploadFiles = async (auth) => {
  const driveService = google.drive({ version: "v3", auth });
  let count = 0;

  for (const file of fs.readdirSync("images")) {
    // Log the file name.
    console.log(JSON.stringify(file));

    let fileMetadata = {
      name: file,
      parents: ["folder_id"], //Optional and make sure to replace with your folder id.
    };

    let media = {
      mimeType: "image/jpeg",
      body: fs.createReadStream(`images/${file}`),
    };

    const task = driveService.files.create({
      resource: fileMetadata,
      media: media,
      fields: "id",
    });

    try {
      await task;
      count = count + 1;
    } catch (e) {
      console.log(e);
      return null;
    }
  }
  // log the total count of uploaded files.
  console.log("Count :", count);
  return;
};

uploadFiles(auth).catch(console.error);
