const fs = require("fs");
const http = require("http");
const url = require("url");

// Servers

// function to repalce the html
function replaceTemplate(temp, product) {
  let outPut = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  outPut = outPut.replace(/{%IMAGE%}/g, product.image);
  outPut = outPut.replace(/{%PRICE%}/g, product.price);
  outPut = outPut.replace(/{%NUTRIENTS%}/g, product.nutrients);
  outPut = outPut.replace(/{%FROM%}/g, product.from);
  outPut = outPut.replace(/{%QUANTITY%}/g, product.quantity);
  outPut = outPut.replace(/{%DESCRIPTION%}/g, product.description);
  outPut = outPut.replace(/{%ID%}/g, product.id);

  if (!product.organic)
    outPut = outPut.replace(/{%NOT_ORGANIC%}/g, "not_organic");
  return outPut;
}

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template_card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/product.html`,
  "utf-8"
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);
  // overview page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });

    const cardHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join("");
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardHtml);
    res.end(output);
  }
  //   prooduct page
  else if (pathname === "/product") {
    res.writeHead(200, { "Content-type": "text/html" });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
    // res.end("This is product");
  }
  //   API
  else if (pathname === "/api") {
    res.writeHead(200, {
      "Content-type": "application/json",
    });
    res.end(data);
  } else {
    res.writeHead(400, {
      "Content-type": "text/html",
    });
    res.end("<h1>Page not Found</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listning to requests on port number 8000");
});
