const { GoogleSpreadsheet } = require("google-spreadsheet");
const { JWT } = require("google-auth-library");

const serviceAccountAuth = new JWT({
  email: "rzp-test@razorpaytest.iam.gserviceaccount.com",
  key: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDrQiJC5mIbQLtE\nORZQaTSqXDHc8TVlBAzbjhYRzygMvBaal3cvDl8FIx9JDkKyOguB8mpDzckuMJwe\ntIWtihQjupDOGE5lQ0iN5Sjp36eJe+IVm6MlTDdq32FEtXgraIUgCnWczmdOzx1D\nda+bP++bnUy7nZDl/KGWc1uyLK3aGQg2zx3kL6bJZiPDZ1eMLYPJmJsejF/n3AfZ\nhv80b15oRCCc+jVVcXke2ps5C3zbtIMBltF+uaXCkXgiEJmr9ardOgGCi64Z8J07\ny+rrV/K9bmhCIEk5J/14sME3XkP1k0oaT9Ff2/QviNapnV8An0LXsSJV327AoUzq\nmrwa+C7NAgMBAAECggEABlyAnXNFi1mboiJgU1ao7SftixiP6APj/GZEV28Cq9Uy\nT/0H25oOoTMcLTTbncLoQdK87IBc5s2EVOfKONp2EypADA++1hMQN4AF6ygqlJwo\nxFPhkzYTM/g1HiYKdupOWl5Dv8/1sBiZ95OLZuBRdRFb18Xi+xtXW+42HNtMo7nd\n6x5bRoYh5ob2b787m4JiA49gz6BCR+yllIFTArNzKfZxZcbUYAHNNMmB6fKHNTou\nZARDUaGfoX26ybZQWCqdb77ba05j4+cBFaGNlw8/nyHu2tYqNd1Ijet9M9jo1IV+\nHPumuGgbVzCVPeoGiukIbbotcaLwbrFeBSMCQlTGIQKBgQD83nQmDtz5nXzi4vLs\nE6IEs0xbMm/IVHSCCZ0WJlYF866keabZGNheqbF2TbiAS3qNceu2V+9qBjztW1IN\nRpxDgf7NVMJKlNaSphOMGHpNZQ7mPRPoe+tc1YfiL7d8od2xn43pYjSSJ3pUpmdk\n+AZum4x8O8nptHjS+VqJjSxK4QKBgQDuK9uZlbDi2LtYjwbSJcPecIDfaAs1VNpc\n/DW9XMN8/vjk5aeMeAyS+LkrG0skgtvx1AcZiVSz0U66f4KtPjDU3ME0Gon9D2RJ\nKHj0zy9KqWHDq03s40MJag4kzWL68L+UgANAIRzsPiXL642JV8F4ulXASATTFWwW\n32aJMQrtbQKBgQDe4aCUrwMczTB3tzwQ01k6NWN2+qTGeZJbz+dyz4WBJ4FmnYdv\n0VNdVMsDkIuwIVc69w+hIC75T9hCCfzvkK5JXnpdN3ktTbU3e0S9dhHOx+VzEKDM\niPUyVU+5EP/0zaNfXVgzPolBzaQomqeFuovI0DfqhLR61sSsiHbByPoiYQKBgFFI\n+J63PvJ845u63KoWJ34gSWt11/Vwq0H29eRV54YegxWj54YCZtA2QQQcQY4Jd0VW\nhsHJY/Ym5kayRAgaZJIRcYL118hdW224eWeb2lkR7ALa0TKa8YMiBge7bR+V0Ny+\nv91AL93U7BNnphuMrsQkXCXOro7YDdbUkesaqM8VAoGBAItvJePCY9YUZZE4s0N/\nyVvd6P8rlMzYwAuSxYd+Cktp/+7zYghKKx8Y3jCqjxwZTxUX4wcULmf+QQBGykbV\nAac3/aF8SN7ePXT1mai9zJcCqqFObkvATC2cMSD9jXXbI9mv6SwMe6LQVHhOa4nn\nxuuvUJvDt1iJIP2k2q4gRHKY\n-----END PRIVATE KEY-----\n",
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

// const doc = new GoogleSpreadsheet(
//   "1RY2mvRhVIoal9o8jgbJVV3gODlB34_9X_8GodYx8TfM",
//   serviceAccountAuth
// );
const doc = new GoogleSpreadsheet(
  "1yImtECDCr5T0ULotNYiTiyVp3gpWyZd2nSBMysZsVvE",
  serviceAccountAuth
);

exports.getTask = async (email) => {
  try {
    await doc.loadInfo();

    const tasks = {};

    let t1 = doc.sheetsByTitle["Task_1"];
    const t1rows = await t1.getRows();
    var r1 = [];

    if (t1rows.length > 0) {
      r1 = t1rows.filter((row) =>
        row.get("email").toLowerCase().includes(email.toLowerCase())
      );
    }

    if (r1.length > 0) {
      const task1 = {
        email: email,
        name: r1[r1.length - 1].get("names"),
        status: r1[r1.length - 1].get("status"),
        dos: r1[r1.length - 1].get("Timestamp"),
        file: r1[r1.length - 1].get("file"),
        link: r1[r1.length - 1].get("link"),
      };
      tasks["task1"] = task1;
    }

    let t2 = doc.sheetsByTitle["Task_2"];
    const t2rows = await t2.getRows();

    var r2 = [];

    if (t2rows.length > 0) {
      r2 = t2rows.filter((row) =>
        row.get("email").toLowerCase().includes(email.toLowerCase())
      );
    }

    if (r2.length > 0) {
      jsonData = {
        email: email,
        name: r2[r2.length - 1].get("names"),
        status: r2[r2.length - 1].get("status"),
        dos: r2[r2.length - 1].get("Timestamp"),
        file: r2[r2.length - 1].get("file"),
        link: r2[r2.length - 1].get("link"),
      };
      tasks["task2"] = jsonData;
    }

    let t3 = doc.sheetsByTitle["Task_3"];
    const t3rows = await t3.getRows();

    var r3 = [];

    if (t3rows.length > 0) {
      r3 = t3rows.filter((row) =>
        row.get("email").toLowerCase().includes(email.toLowerCase())
      );
    }
    if (r3.length > 0) {
      jsonData = {
        email: email,
        name: r3[r3.length - 1].get("names"),
        status: r3[r3.length - 1].get("status"),
        dos: r3[r3.length - 1].get("Timestamp"),
        file: r3[r3.length - 1].get("file"),
        link: r3[r3.length - 1].get("link"),
      };
      tasks["task3"] = jsonData;
    }

    let t4 = doc.sheetsByTitle["Task_4"];
    const t4rows = await t4.getRows();

    var r4 = [];

    if (t4rows.length > 0) {
      r4 = t4rows.filter((row) =>
        row.get("email").toLowerCase().includes(email.toLowerCase())
      );
    }
    if (r4.length > 0) {
      jsonData = {
        email: email,
        name: r4[r4.length - 1].get("names"),
        status: r4[r4.length - 1].get("status"),
        dos: r4[r4.length - 1].get("Timestamp"),
        file: r4[r4.length - 1].get("file"),
        link: r4[r4.length - 1].get("link"),
      };
      tasks["task4"] = jsonData;
    }

    let t5 = doc.sheetsByTitle["Task_5"];
    const t5rows = await t5.getRows();

    var r5 = [];

    if (t5rows.length > 0) {
      r5 = t5rows.filter((row) =>
        row.get("email").toLowerCase().includes(email.toLowerCase())
      );
    }
    if (r5.length > 0) {
      jsonData = {
        email: email,
        name: r5[r5.length - 1].get("names"),
        status: r5[r5.length - 1].get("status"),
        dos: r5[r5.length - 1].get("Timestamp"),
        file: r5[r5.length - 1].get("file"),
        link: r5[r5.length - 1].get("link"),
      };
      tasks["task5"] = jsonData;
    }

    let t6 = doc.sheetsByTitle["Task_6"];
    const t6rows = await t6.getRows();
    var r6 = [];

    if (t6rows.length > 0) {
      r6 = t6rows.filter((row) =>
        row.get("email").toLowerCase().includes(email.toLowerCase())
      );
    }
    if (r6.length > 0) {
      jsonData = {
        email: email,
        name: r6[r6.length - 1].get("names"),
        status: r6[r6.length - 1].get("status"),
        dos: r6[r6.length - 1].get("Timestamp"),
        file: r6[r6.length - 1].get("file"),
        link: r6[r6.length - 1].get("link"),
      };
      tasks["task6"] = jsonData;
    }

    let t7 = doc.sheetsByTitle["Task_7"];
    const t7rows = await t7.getRows();

    var r7 = [];

    if (t7rows.length > 0) {
      r7 = t7rows.filter((row) =>
        row.get("email").toLowerCase().includes(email.toLowerCase())
      );
    }
    if (r7.length > 0) {
      jsonData = {
        email: email,
        name: r7[r7.length - 1].get("names"),
        status: r7[r7.length - 1].get("status"),
        dos: r7[r7.length - 1].get("Timestamp"),
        file: r7[r7.length - 1].get("file"),
        link: r7[r7.length - 1].get("link"),
      };
      tasks["task7"] = jsonData;
    }

    let t8 = doc.sheetsByTitle["Task_8"];
    const t8rows = await t8.getRows();

    var r8 = [];

    if (t8rows.length > 0) {
      r8 = t8rows.filter((row) =>
        row.get("email").toLowerCase().includes(email.toLowerCase())
      );
    }
    if (r8.length > 0) {
      jsonData = {
        email: email,
        name: r8[r8.length - 1].get("names"),
        status: r8[r8.length - 1].get("status"),
        dos: r8[r8.length - 1].get("Timestamp"),
        file: r8[r8.length - 1].get("file"),
        link: r8[r8.length - 1].get("link"),
      };
      tasks["task8"] = jsonData;
    }

    let t9 = doc.sheetsByTitle["Task_9"];
    const t9rows = await t9.getRows();

    var r9 = [];

    if (t9rows.length > 0) {
      r9 = t9rows.filter((row) =>
        row.get("email").toLowerCase().includes(email.toLowerCase())
      );
    }
    if (r9.length > 0) {
      jsonData = {
        email: email,
        name: r9[r9.length - 1].get("names"),
        status: r9[r9.length - 1].get("status"),
        dos: r9[r9.length - 1].get("Timestamp"),
        file: r9[r9.length - 1].get("file"),
        link: r9[r9.length - 1].get("link"),
      };
      tasks["task9"] = jsonData;
    }

    let t10 = doc.sheetsByTitle["Task_10"];
    const t10rows = await t10.getRows();

    var r10 = [];

    if (t10rows.length > 0) {
      r10 = t10rows.filter((row) =>
        row.get("email").toLowerCase().includes(email.toLowerCase())
      );
    }
    if (r10.length > 0) {
      jsonData = {
        email: email,
        name: r10[r10.length - 1].get("names"),
        status: r10[r10.length - 1].get("status"),
        dos: r10[r10.length - 1].get("Timestamp"),
        file: r10[r10.length - 1].get("file"),
        link: r10[r10.length - 1].get("link"),
      };
      tasks["task10"] = jsonData;
    }

    let t11 = doc.sheetsByTitle["Task_11"];
    const t11rows = await t11.getRows();

    var r11 = [];

    if (t11rows.length > 0) {
      r11 = t11rows.filter((row) =>
        row.get("email").toLowerCase().includes(email.toLowerCase())
      );
    }
    if (r11.length > 0) {
      jsonData = {
        email: email,
        name: r11[r11.length - 1].get("names"),
        status: r11[r11.length - 1].get("status"),
        dos: r11[r11.length - 1].get("Timestamp"),
        file: r11[r11.length - 1].get("file"),
        link: r11[r11.length - 1].get("link"),
      };
      tasks["task11"] = jsonData;
    }

    let t12 = doc.sheetsByTitle["Task_12"];
    const t12rows = await t12.getRows();

    var r12 = [];

    if (t12rows.length > 0) {
      r12 = t12rows.filter((row) =>
        row.get("email").toLowerCase().includes(email.toLowerCase())
      );
    }
    if (r12.length > 0) {
      jsonData = {
        email: email,
        name: r12[r12.length - 1].get("names"),
        status: r12[r12.length - 1].get("status"),
        dos: r12[r12.length - 1].get("Timestamp"),
        file: r12[r12.length - 1].get("file"),
        link: r12[r12.length - 1].get("link"),
      };
      tasks["task12"] = jsonData;
    }

    let t13 = doc.sheetsByTitle["Task_13"];
    const t13rows = await t13.getRows();

    var r13 = [];

    if (t13rows.length > 0) {
      r13 = t13rows.filter((row) =>
        row.get("email").toLowerCase().includes(email.toLowerCase())
      );
    }
    if (r13.length > 0) {
      jsonData = {
        email: email,
        name: r13[r13.length - 1].get("names"),
        status: r13[r13.length - 1].get("status"),
        dos: r13[r13.length - 1].get("Timestamp"),
        file: r13[r13.length - 1].get("file"),
        link: r13[r13.length - 1].get("link"),
      };
      tasks["task13"] = jsonData;
    }

    let t14 = doc.sheetsByTitle["Task_14"];
    const t14rows = await t14.getRows();

    var r14 = [];

    if (t14rows.length > 0) {
      r14 = t14rows.filter((row) =>
        row.get("email").toLowerCase().includes(email.toLowerCase())
      );
    }
    if (r14.length > 0) {
      jsonData = {
        email: email,
        name: r14[r14.length - 1].get("names"),
        status: r14[r14.length - 1].get("status"),
        dos: r14[r14.length - 1].get("Timestamp"),
        file: r14[r14.length - 1].get("file"),
        link: r14[r14.length - 1].get("link"),
      };
      tasks["task14"] = jsonData;
    }

    return tasks;
  } catch (error) {
    console.error("Error adding rows:", error);
    throw error;
  }
};
function convertString(inputString) {
  // Use a regular expression to match the numeric part at the end of the string
  var match = inputString.match(/\d+$/);

  // Check if a match is found
  if (match) {
    // Extract the numeric part
    var numericPart = match[0];

    // Create the new string with "Task_" prefix and the numeric part
    var outputString = "Task_" + numericPart;

    // Return the result
    return outputString;
  }

  // If no match is found, return the original string
  return inputString;
}
exports.updateTask = async (email, sheetname, status) => {
  try {
    await doc.loadInfo();

    let t1 = doc.sheetsByTitle[convertString(sheetname)];
    const t1rows = await t1.getRows();
    var r1 = [];

    if (t1rows.length > 0) {
      r1 = t1rows.filter((row) =>
        row.get("email").toLowerCase().includes(email.toLowerCase())
      );
    }

    r1[r1.length - 1].assign({ status: status });
    await r1[r1.length - 1].save();
    return "done";
  } catch (error) {
    console.error("Error adding rows:", error);
    throw error;
  }
};

// const fs = require("fs");

// const getUserss = async () => {
//   try {
//     await doc.loadInfo();

//     let allData = []; // Array to store all sheet data

//     for (const sheet of doc.sheetsByIndex) {
//       await sheet.loadCells();
//       const rows = await sheet.getRows();

//       // Iterate over each row and extract data
//       rows.forEach((row) => {
//         let name = row._rawData[1]; // Column B
//         console.log(row._rawData[1]);
//         let email = row._rawData[2]; // Column C
//         let number = row._rawData[3]; // Column D

//         // Create JSON object and push to allData array
//         let user = {
//           name: name,
//           email: email,
//           number: number,
//           password: "Upskillmafia",
//         };
//         allData.push(user);
//       });
//     }

//     // Write data to JSON file
//     fs.writeFileSync("./userdata.json", JSON.stringify(allData, null, 2));

//     console.log("Data written to userdata.json successfully.");
//   } catch (error) {
//     console.error("Error retrieving data:", error);
//     throw error;
//   }
// };

// // getUserss();

// const fs = require("fs");

// const getUserss = async () => {
//   try {
//     await doc.loadInfo();

//     let allSubmissions = []; // Array to store all submissions

//     for (const sheet of doc.sheetsByIndex) {
//       await sheet.loadCells();

//       const sheetName = sheet.title;
//       const rows = await sheet.getRows();

//       // Iterate over each row and extract data
//       rows.forEach((row) => {
//         let email = row._rawData[2]; // Column C
//         let taskLink = row._rawData[4]; // Column E
//         let submittedOn = row._rawData[0]; // Column A
//         console.log(email,sheetName)

//         // Create submission object and push to allSubmissions array
//         let submission = {
//           email: email,
//           taskLink: taskLink,
//           taskName: sheetName, // Using sheet name as task name
//           submittedOn: submittedOn,
//         };
//         allSubmissions.push(submission);
//       });
//     }

//     // Write data to JSON file
//     fs.writeFileSync(
//       "./submissions.json",
//       JSON.stringify(allSubmissions, null, 2)
//     );

//     console.log("Data written to submissions.json successfully.");
//   } catch (error) {
//     console.error("Error retrieving data:", error);
//     throw error;
//   }
// };

// getUserss();
