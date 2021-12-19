import { createConnection } from "mysql2/promise";
import fs from "fs";

/**
 * 用于从文件中读取数据并自动向数据库中插入数据
 */

// const connection = await createConnection({
//   host: '100.76.7.167',
//   user: 'root',
//   password: '123456',
//   database: 'plan',
// });

const file = fs.readFileSync("test.txt", "utf8");

const lines = file.split("\n");

const sqlList = [];

// insert into food (name, protein, phe, rule, type) values ("xxx", 3.2, 100.25, "red", "accurate");
for (let i = 0; i < lines.length; i++) {
  const line = lines[i].split("|");
  const name = line[0];
  const protein = line[1];
  let phe = line[2];
  let type = "accurate";
  // 存在 phe 值则为精确值
  if (phe) {
    type = "accurate";
  } else {
    type = "estimate";
  }
  // 如果 phe 不存在，则使用蛋白质 * 50 进行估算
  if (phe === "-") {
    if (protein === "-") {
      phe = "-";
    } else {
      phe = protein * 50;
    }
  }
  let rule = "red";
  if (phe > 50) {
    rule = "red";
  } else if ((phe <= 50) & (phe > 20)) {
    rule = "yellow";
  } else {
    rule = "green";
  }
  const sql = `(${name}, ${protein}, ${phe}, ${rule}, ${type})`;
  sqlList.push(sql);
}

connection.execute(
  "insert into food (name, protein, phe, rule, type) values ?",
  [sqlList],
  (err, rows) => {
    console.log(rows);
  }
);
