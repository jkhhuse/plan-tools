import { createConnection } from 'mysql2/promise';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

/**
 * 用于从文件中读取数据并自动向数据库中插入数据
 */
const generate = async () => {
  const connection = await createConnection({
    host: '100.76.7.167',
    user: 'root',
    password: '123456',
    database: 'plan',
  });

  const file = await fs.readFileSync('file.txt', 'utf8');

  const lines = file.split('\n');

  const sqlList = [];

  // insert into food (uuid, name, protein, phe, rule, type) values (uuid(), "xxx", 3.2, 100.25, "red", "accurate");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].split('|');
    const name = line[0];
    let protein = line[1];
    let phe = line[2];
    let type = 'accurate';
    let pheValue = 0;
    // 存在 phe 值则为精确值
    if (phe.indexOf('-') < 0) {
      type = 'accurate';
    } else {
      type = 'estimate';
    }
    // 如果 phe 不存在，则使用蛋白质 * 50 进行估算
    if (phe.indexOf('-') >= 0 && protein.indexOf('-') < 0) {
      console.log(true);
      pheValue = +(protein * 50).toFixed(2);
    } else {
      pheValue = phe.indexOf('-') >= 0 ? '-' : +phe;
    }
    let rule = 'red';
    if (typeof(pheValue) === "number") {
      if (pheValue > 50) {
        rule = 'red';
      } else if (pheValue <= 50 && pheValue > 20) {
        rule = 'yellow';
      } else if (pheValue <= 20 && pheValue > 0) {
        rule = 'green';
      } else {
        rule = 'unknown';
      }
    } else {
      rule = 'unknown';
    }

    const uuid = await uuidv4().replace(/\-/, '');
    const sql = [uuid, name, protein, pheValue, rule, type];
    console.log(sql);
    sqlList.push(sql);
  }
  const rows = await connection.query(
    `insert into food (uuid, name, protein, phe, rule, type) values ?`,
    [sqlList]
  );

  connection.end();
};

generate();
