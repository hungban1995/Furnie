import fs from "fs";
import path from "path";
import { format } from "date-fns";
fs.promises;
const __dirname = path.resolve();
const logEvents = async (errMessage) => {
  const dateTime = `${format(new Date(), `dd/MM/yyyy, HH:mm:ss`)}`;
  const folderMonth = `${format(new Date(), `MM-yyyy`)}`;
  const folderDate = `${format(new Date(), `dd-MM-yyyy`)}`;
  const PATH = `${__dirname}/logs/${folderMonth}/${folderDate}`;
  if (!fs.existsSync(PATH)) {
    fs.mkdirSync(PATH, { recursive: true });
  }
  const fileName = path.join(`${PATH}/logs.log`);
  const contentLog = `Err details:\n ${errMessage}\n time: ${dateTime}\n ----------------------\n`;
  try {
    fs.appendFile(fileName, contentLog, (err) => {
      if (err) {
        console.log(err);
        return;
      }
    });
  } catch (err) {
    console.log(err.message);
  }
};
export default logEvents;
