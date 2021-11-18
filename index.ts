import http from "http";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import config from "./src/config/config";
import morgan from "morgan";
import mongoose from "mongoose";
import apiRoutes from "./src/routes/api";
import QRCode from "qrcode";
import path from "path";

const app: Application = express();

//MORGAN
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);

//DATABASE
mongoose.connect(
  "mongodb+srv://team.utzoz.azure.mongodb.net/nodejs-project?retryWrites=true&w=majority",
  {
    user: "Thien",
    pass: "UjTtnz1aeUyQnjZc",
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  }
);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Database Connected");
});

// Body parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//CORS
var corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.get("/ping", async (req: Request, res: Response): Promise<Response> => {
  return res.status(200).json({
    message: "Server OK!",
  });
});

//TEMPLATE
//app.use(express.static(path.join(process.cwd(), "./src/views")));
app.set("views", path.join(process.cwd(), "./src/views"));
app.set('view engine', 'ejs');

app.get("/qrcode", async (req, res) => {
  let r = (Math.random() + 1).toString(36).substring(7);
  let qr = await QRCode.toDataURL(r);
  res.render("qrcode", { img: qr });
});

export let qrCode = "";

//getQRCode
app.get("/qrcode-render", (req, res) => {
  return res.status(200).json({
    data: qrCode,
  })
})

//ROUTES
app.use("/api", apiRoutes);

//ERROR HANDLING
app.use((req: Request, res: Response) => {
  const error = new Error("Not found");

  res.status(404).json({
    code: 404,
    message: error.message,
  });
});

try {
  const httpServer = http.createServer(app);

  setInterval(async () => {
    let img = "";
    let r = (Math.random() + 1).toString(36).substring(7);
    console.log(r);
    let qr = await QRCode.toDataURL(r);
    img = `<image src= " ` + qr + `"width="1000px" />`;
    qrCode = img;
  }, 1000 * 30);

  httpServer.listen(config.server.port, () => {
    console.log(
      `Server is running ${config.server.hostname}:${config.server.port}`
    );
  });
} catch (error: any) {
  console.error(`Error occured: ${error.message}`);
}
