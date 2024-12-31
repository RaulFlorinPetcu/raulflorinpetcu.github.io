"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const INVENTAR_1 = __importDefault(require("../tables/INVENTAR"));
const data_source_1 = __importDefault(require("../data_source"));
const PRODUS_1 = __importDefault(require("../tables/PRODUS"));
const puppeteer_1 = __importDefault(require("puppeteer"));
const inventar_repository = data_source_1.default.getRepository(INVENTAR_1.default);
const produs_repository = data_source_1.default.getRepository(PRODUS_1.default);
class PdfController {
    static generate_pdf(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const inventar_id = req.body.inventar_id;
            const inventar = yield inventar_repository.findOne({
                where: {
                    inventar_id: inventar_id
                }
            })
                .catch((err) => {
                res.status(500).send(err);
                return;
            });
            if (!inventar) {
                res.status(500).send("Inventar not found");
                return;
            }
            else {
                const products = yield produs_repository.find({
                    where: {
                        inventar_id: inventar_id
                    }
                })
                    .catch((err) => {
                    res.status(500).send(err);
                    return;
                });
                if (products) {
                    const table_rows = [];
                    let totalTVA = 0;
                    let totalPriceWithoutTVA = 0;
                    let totalPriceWithTVA = 0;
                    products.sort((a, b) => {
                        const nameA = a.name.toUpperCase(); // ignore upper and lowercase
                        const nameB = b.name.toUpperCase(); // ignore upper and lowercase
                        if (nameA < nameB) {
                            return -1;
                        }
                        if (nameA > nameB) {
                            return 1;
                        }
                        // names must be equal
                        return 0;
                    }).forEach((product) => {
                        totalTVA += (product.price * product.quantity) * (product.tva / 100);
                        totalPriceWithoutTVA += product.price * product.quantity;
                        totalPriceWithTVA += (product.price * product.quantity) + ((product.price * product.quantity) * (product.tva / 100));
                        table_rows.push(`
                        <tr>
                            <td>
                                ${product.name}
                            </td>
                            <td>
                                ${product.unit_measure}
                            </td>
                            <td>
                                ${product.quantity}
                            </td>
                            <td>
                                ${product.price}
                            </td>
                            <td>
                                ${product.tva}
                            </td>
                            <td>
                                ${((product.price * product.quantity) * (product.tva / 100)).toFixed(2)}
                            </td>
                            <td>
                                ${(product.price * product.quantity).toFixed(2)}
                            </td>
                            <td>
                                ${((product.price * product.quantity) + ((product.price * product.quantity) * (product.tva / 100))).toFixed(2)}
                            </td>
                        </tr>
                        `);
                    });
                    const html_template = `
                <html>
                    <head>
                        <title>PDF Raport</title>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                            }
                            .document_title {
                                display: inline-flex;
                                align-items: center;
                                justify-items: center;
                                width: 100%;
                                text-align: center;
                            }
                            .title_text {
                                margin: auto;
                                width: fit;
                            }
                            table {
                                width: 100%;
                                border-collapse: collapse !important;
                                margin-top: 20px;
                            }
                            th, td {
                                border: 1px solid #ddd;
                                padding: 8px;
                                text-align: left;
                                font-size: 14px !important;
                            }
                            th {
                                background-color: #f2f2f2;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="document_title">
                            <h1 class="title_text">ILDIRO NABRES SRL</h1>
                        </div>
                        <div class="document_title">
                            <h2 class="title_text">827/514/2020</h2>
                        </div>
                        <div class="document_title">
                            <h2 class="title_text">CUI: RO42718449 - GÂRCINA</h2>
                        </div>
                        <div class="document_title">
                            <h2 class="title_text" style="margin-top: 40px">${inventar.iventar_name}</h2>
                        </div>
                        <table>
                            <thead>
                                <tr>
                                    <th>
                                        Nume produs
                                    </th>
                                    <th>
                                        Unitate Măsură
                                    </th>
                                    <th>
                                        Cantitate
                                    </th>
                                    <th>
                                        Preț (RON)
                                    </th>
                                    <th>
                                        TVA (%)
                                    </th>
                                    <th>
                                        TVA (RON)
                                    </th>
                                    <th>
                                        Valoare RON (Fără TVA)
                                    </th>
                                    <th>
                                        Valoare RON (Plus TVA)
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                ${table_rows.join("")}
                                <tr>
                                    <td colspan="5">
                                        Total
                                    </td>
                                    <td>
                                        ${totalTVA.toFixed(2)}
                                    </td>
                                    <td>
                                        ${totalPriceWithoutTVA.toFixed(2)}
                                    </td>
                                    <td>
                                        ${totalPriceWithTVA.toFixed(2)}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </body>
                </html>
                `;
                    const browser = yield puppeteer_1.default.launch({
                        headless: true,
                        args: [
                            "--disable-setuid-sandbox",
                            "--no-sandbox",
                            "--single-process",
                            "--no-zygote",
                        ],
                        executablePath: process.env.NODE_ENV === "production"
                            ? process.env.PUPPETEER_EXECUTABLE_PATH
                            : puppeteer_1.default.executablePath()
                    });
                    const page = yield browser.newPage();
                    yield page.setContent(html_template);
                    const date = new Date().toLocaleDateString();
                    const time = new Date().toTimeString().slice(0, 8);
                    const unique_identifier = new Date().getTime();
                    // Generate PDF for the report
                    yield page.pdf({
                        path: `/temp/pdf_generated_files/report_${unique_identifier}.pdf`,
                        format: "A4",
                        displayHeaderFooter: true,
                        // headerTemplate: '<div id="header-template" style="font-size:12px !important; color:#808080; padding-left:10px"><span class="date"></span></div>',
                        headerTemplate: `<div id="header-template" style="font-size:12px !important; color:#808080; padding-left:10px">${date} ${time}</div>`,
                        footerTemplate: '<div id="footer-template" style="font-size:16px !important; color:#808080; padding-left:10px"><span class="pageNumber"></span>/<span class="totalPages"></span></div>',
                        margin: {
                            top: '60px', right: '20px', bottom: '60px', left: '20px'
                        }
                    });
                    yield browser.close();
                    console.log(__dirname);
                    res.sendFile(`report_${unique_identifier}.pdf`, { root: "temp/pdf_generated_files/" }, (err) => {
                        if (err) {
                            console.log(err);
                            res.sendStatus(500);
                        }
                        else {
                            // FileManager.delete_file(`temp/pdf_generated_files/report_${unique_identifier}.pdf`)
                        }
                    });
                }
            }
        });
    }
}
exports.default = PdfController;
