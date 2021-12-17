import fetch from 'node-fetch';
import xpath from 'xpath';
import { DOMParser } from 'xmldom';
import fs from 'fs';

/**
 * 用户从网站中自动爬取数据
 */
const exportFileName = 'file.txt';

const fetchFood = async (pageId) => {
  const res = await fetch('https://www.foodwake.com/food/' + pageId);

  // 获得 html
  const html = await res.text();
  let doc = new DOMParser().parseFromString(html);
  let nameNodes = xpath.select('/html/body/main/article[2]/section[1]/div/div[1]/div[1]/h1', doc);
  let proteinNodes = xpath.select(
    '//*[@id="100GNutrientT"]/div/div[2]/div/table/tbody/tr[2]/td[2]',
    doc
  );
  let pheNodes = xpath.select(
    '//*[@id="100GNutrientT"]/div/div[6]/div/table/tbody/tr[9]/td[2]',
    doc
  );
  const name = nameNodes[0]?.firstChild?.data ? nameNodes[0].firstChild?.data.toString() : '-';
  const protein = proteinNodes[0]?.firstChild?.data
    ? proteinNodes[0].firstChild?.data.toString()
    : '-';
  const phe = pheNodes[0]?.firstChild?.data ? pheNodes[0].firstChild?.data?.toString() : '-';

  // 食品名称 蛋白质含量 能量 脂肪
  return name + '|' + protein + '|' + phe;
};

for (let i = 1316; i < 1785; i++) {
  const result = await fetchFood(i);
  fs.appendFileSync('./' + exportFileName, '\r\n' + result);
}
