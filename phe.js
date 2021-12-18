import fetch from "node-fetch";
import xpath from "xpath";
import { DOMParser } from "xmldom";
import fs from "fs";

/**
 * 用户从网站中自动爬取数据
 */
const title =
  "谷类 薯类 豆类 蔬菜 菌类 藻类 水果 坚果 畜肉 禽肉 乳类 蛋类 河海鲜 茶类 酒类 油类 调味品类 零食饮料";

const titleList = title.split(" ");

const baseUrl = "https://www.foodwake.com/sort/sort-single-nutrition/phe/desc/";

const fetchFood = async (id, file) => {
  // 拼接URL
  const url = baseUrl + (id + 1);

  const res = await fetch(url);

  // 获得 html
  const html = await res.text();
  let doc = new DOMParser().parseFromString(html);

  let tbody = xpath.select(
    "/html/body/main/article[1]/section[2]/div/div[1]/div/table/tbody",
    doc
  );

  const trList = tbody[0].childNodes;

  for (let i = 0; i < trList.length / 2 - 1; i++) {
    const trNode = trList[i * 2 + 1];
    const name = trNode.childNodes[3].childNodes[1].childNodes[0].data;
    const phe = trNode.childNodes[7].childNodes[0].data;
    const value = name + "|" + phe + "\r\n";
    await fs.appendFileSync(file, value);
  }
};

for (let i = 0; i < titleList.length; i++) {
  // 获得文件名
  const title = titleList[i] + ".txt";
  await fetchFood(i, "./file/" + title);
}
